'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
 * 질문 작성 페이지 (Help me - Q&A)
 *
 * 기능:
 * - 질문 제목 입력
 * - 질문 본문 입력 (Tiptap 에디터)
 * - 태그 입력
 * - 이미지 첨부
 * - localStorage에 저장
 */
export default function NewQuestionPage() {
  const router = useRouter();

  // 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p></p>');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (tags.length < 5 && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || content === '<p></p>') {
      alert('제목과 본문을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 먼저 질문 게시글 생성
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          postType: 'QUESTION',
          categoryId: 'help', // Help me 카테고리 slug
          tags,
        }),
      });

      const postData = await postResponse.json();

      if (!postData.success) {
        throw new Error(postData.error || '게시글 생성에 실패했습니다.');
      }

      const postId = postData.data.post.id;

      // 2. 이미지가 있다면 업로드
      if (images.length > 0) {
        const uploadedImageUrls: { url: string; isFeatured: boolean; order: number }[] = [];

        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (!image.file) continue; // 파일이 없으면 스킵

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
              order: i,
            });
          }
        }

        // 3. PostImage 레코드 생성
        if (uploadedImageUrls.length > 0) {
          await fetch('/api/posts/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              postId,
              images: uploadedImageUrls,
            }),
          });
        }
      }

      // 성공 시 질문 상세 페이지로 이동
      router.push(`/help/${postId}`);
    } catch (error) {
      console.error('질문 작성 오류:', error);
      alert(error instanceof Error ? error.message : '질문 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Link href="/help">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">질문하기</h1>
        <p className="text-muted-foreground">
          커뮤니티에 궁금한 점을 질문하고 답변을 받아보세요
        </p>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <div>
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            type="text"
            placeholder="질문 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>

        {/* 본문 */}
        <div>
          <Label htmlFor="content">질문 내용 *</Label>
          <div className="mt-1.5">
            <Editor content={content} onChange={setContent} />
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <Label>이미지 첨부 (선택)</Label>
          <div className="mt-1.5">
            <ImageUploader onChange={setImages} maxImages={10} />
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
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '질문 등록 중...' : '질문 등록'}
          </Button>
        </div>
      </form>
    </div>
  );
}
