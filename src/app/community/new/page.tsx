'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader, type UploadedImage } from '@/components/ImageUploader';
import type { EditorRef } from '@/components/Editor';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  postCount: number;
}

// Dynamic import for Tiptap Editor (heavy dependency)
const Editor = dynamic(() => import('@/components/Editor').then(mod => ({ default: mod.Editor })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center border rounded-md bg-muted/10">에디터 로딩 중...</div>,
});

/**
 * 게시글 작성 페이지
 *
 * 기능:
 * - 카테고리 선택
 * - 제목 입력
 * - 본문 입력 (Tiptap 에디터)
 * - 태그 입력
 * - 이미지 업로드 및 본문 삽입
 * - localStorage에 저장
 */
export default function NewPostPage() {
  const router = useRouter();
  const editorRef = useRef<EditorRef>(null);

  // 폼 상태
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p></p>');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 카테고리 목록 가져오기
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data.categories);
        }
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 이미지를 본문에 삽입
  const handleInsertImageToContent = useCallback((url: string, alt?: string) => {
    if (editorRef.current) {
      editorRef.current.insertImageUrl(url, alt);
    }
  }, []);

  // 에디터 툴바에서 이미지 업로드 시 처리
  const handleEditorImageUpload = useCallback((file: File) => {
    // 최대 이미지 수 확인
    if (images.length >= 10) {
      alert('최대 10개의 이미지만 업로드할 수 있습니다.');
      return;
    }

    // blob URL 생성
    const url = URL.createObjectURL(file);

    // ImageUploader 목록에 추가
    const newImage: UploadedImage = {
      url,
      isFeatured: images.length === 0, // 첫 이미지면 대표
      file,
      insertedToContent: true, // 이미 본문에 삽입됨
    };
    const updatedImages = [...images, newImage];
    setImages(updatedImages);

    // 에디터에 이미지 삽입
    if (editorRef.current) {
      editorRef.current.insertImageUrl(url, file.name);
    }
  }, [images]);

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (title.trim().length < 5) {
      alert('제목은 최소 5자 이상 입력해주세요.');
      return;
    }
    if (content.replace(/<[^>]*>/g, '').trim().length < 10) {
      alert('본문은 최소 10자 이상 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 게시글 먼저 생성
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          postType: 'DISCUSSION',
          categoryId: category,
          tags,
        }),
      });

      const postData = await postResponse.json();

      if (!postResponse.ok) {
        throw new Error(postData.error || '게시글 작성에 실패했습니다.');
      }

      const postId = postData.data.post.id;

      // 2. 이미지가 있으면 업로드 및 DB 저장
      if (images.length > 0) {
        const uploadedImageUrls: Array<{ url: string; isFeatured: boolean; order: number }> = [];

        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (!image.file) continue; // 이미 업로드된 이미지는 스킵

          // 이미지 업로드
          const formData = new FormData();
          formData.append('file', image.file);
          formData.append('postId', postId);

          const uploadResponse = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });

          const uploadData = await uploadResponse.json();

          if (uploadResponse.ok && uploadData.url) {
            uploadedImageUrls.push({
              url: uploadData.url,
              isFeatured: image.isFeatured,
              order: i,
            });
          }
        }

        // 3. PostImage 레코드 생성
        if (uploadedImageUrls.length > 0) {
          await fetch('/api/posts/images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              postId,
              images: uploadedImageUrls,
            }),
          });
        }
      }

      // 성공 - 생성된 게시글의 카테고리로 리다이렉트
      const selectedCategory = categories.find((c) => c.id === category);
      if (selectedCategory) {
        router.push(`/community/${selectedCategory.slug}`);
      } else {
        router.push('/community');
      }
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      alert(error instanceof Error ? error.message : '게시글 저장에 실패했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          커뮤니티로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold">새 게시글 작성</h1>
        <p className="text-muted-foreground mt-2">
          커뮤니티에 공유하고 싶은 내용을 작성해보세요
        </p>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 카테고리 선택 */}
        <div className="space-y-2">
          <Label htmlFor="category">카테고리 *</Label>
          <Select value={category} onValueChange={setCategory} disabled={isLoadingCategories}>
            <SelectTrigger id="category">
              <SelectValue placeholder={isLoadingCategories ? "로딩 중..." : "카테고리를 선택하세요"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 제목 입력 */}
        <div className="space-y-2">
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            type="text"
            placeholder="게시글 제목을 입력하세요 (최소 5자)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground">
            {title.length}/200자
          </p>
        </div>

        {/* 본문 입력 (Tiptap 에디터) */}
        <div className="space-y-2">
          <Label>본문 *</Label>
          <Editor
            ref={editorRef}
            content={content}
            onChange={setContent}
            placeholder="게시글 내용을 입력하세요 (최소 10자)..."
            onImageUpload={handleEditorImageUpload}
          />
        </div>

        {/* 태그 입력 */}
        <div className="space-y-2">
          <Label htmlFor="tags">태그 (선택사항)</Label>
          <Input
            id="tags"
            type="text"
            placeholder="태그를 입력하고 Enter를 누르세요 (최대 5개)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={tags.length >= 5}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive transition-colors"
                    aria-label={`${tag} 태그 제거`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {tags.length}/5개
          </p>
        </div>

        {/* 이미지 업로드 */}
        <ImageUploader
          onChange={setImages}
          maxImages={10}
          onInsertToContent={handleInsertImageToContent}
        />

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '게시글 작성'}
          </Button>
        </div>
      </form>
    </div>
  );
}
