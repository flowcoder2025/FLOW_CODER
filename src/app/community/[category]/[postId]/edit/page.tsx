'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploader, type UploadedImage } from '@/components/ImageUploader';

// Dynamic import for Tiptap Editor (heavy dependency)
const Editor = dynamic(() => import('@/components/Editor').then(mod => ({ default: mod.Editor })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center border rounded-md bg-muted/10">에디터 로딩 중...</div>,
});

/**
 * 게시글 수정 페이지
 *
 * 기능:
 * - 기존 게시글 데이터 로드
 * - 제목, 본문, 태그 수정
 * - 이미지 추가/삭제
 */
export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const categorySlug = params.category as string;

  // 폼 상태
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p></p>');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기존 게시글 데이터 로드
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();

        if (data.success && data.data) {
          const post = data.data;
          setTitle(post.title);
          setContent(post.content);
          setTags(post.tags || []);

          // 기존 이미지가 있으면 로드
          if (post.images && post.images.length > 0) {
            const existingImages: UploadedImage[] = post.images.map((img: any, index: number) => ({
              url: img.url,
              isFeatured: img.isFeatured,
              alt: img.alt,
              // file이 없으면 이미 업로드된 이미지
            }));
            setImages(existingImages);
          }
        } else {
          alert('게시글을 불러올 수 없습니다.');
          router.back();
        }
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
        router.back();
      } finally {
        setIsLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

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

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
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
      // 1. 게시글 업데이트
      const updateResponse = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
          tags,
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateData.error || '게시글 수정에 실패했습니다.');
      }

      // 2. 새로 추가된 이미지가 있으면 업로드
      const newImages = images.filter(img => img.file);
      if (newImages.length > 0) {
        const uploadedImageUrls: Array<{ url: string; isFeatured: boolean; order: number }> = [];

        for (let i = 0; i < newImages.length; i++) {
          const image = newImages[i];
          if (!image.file) continue;

          // 이미지 업로드
          const formData = new FormData();
          formData.append('file', image.file);
          formData.append('postId', postId);

          const uploadResponse = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          });

          const uploadData = await uploadResponse.json();

          if (uploadData.success && uploadData.url) {
            uploadedImageUrls.push({
              url: uploadData.url,
              isFeatured: image.isFeatured,
              order: images.indexOf(image),
            });
          }
        }

        // 3. PostImage 레코드 생성 (새 이미지만)
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

      // 성공 시 상세 페이지로 이동
      router.push(`/community/${categorySlug}/${postId}`);
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      alert(error instanceof Error ? error.message : '게시글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Link href={`/community/${categorySlug}/${postId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">게시글 수정</h1>
        <p className="text-muted-foreground">
          게시글 내용을 수정하세요
        </p>
      </div>

      {/* 수정 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <div>
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            type="text"
            placeholder="게시글 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>

        {/* 본문 */}
        <div>
          <Label htmlFor="content">본문 *</Label>
          <div className="mt-1.5">
            <Editor content={content} onChange={setContent} />
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <Label>이미지 첨부 (선택)</Label>
          <div className="mt-1.5">
            <ImageUploader
              onChange={setImages}
              initialImages={images}
              maxImages={10}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            최대 10개까지 업로드 가능 (각 파일 최대 5MB). 별표를 클릭하여 대표 이미지를 선택하세요.
          </p>
        </div>

        {/* 태그 */}
        <div>
          <Label htmlFor="tags">태그 (선택, 최대 5개)</Label>
          <div className="flex flex-wrap gap-2 mt-1.5 mb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <Input
            id="tags"
            type="text"
            placeholder={tags.length < 5 ? "태그 입력 후 Enter (예: React, JavaScript)" : "태그는 최대 5개까지 입력 가능합니다"}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={tags.length >= 5}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/community/${categorySlug}/${postId}`)}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </Button>
        </div>
      </form>
    </div>
  );
}
