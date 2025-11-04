'use client';

import { useState } from 'react';
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
import { mockCategories } from '@/lib/mock-data';

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
 * - localStorage에 저장
 */
export default function NewPostPage() {
  const router = useRouter();

  // 폼 상태
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p></p>');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // 현재 사용자 (Mock - 실제로는 인증 시스템에서 가져옴)
      const currentUser = {
        id: 'mock_user_1',
        username: 'test_user',
        displayName: '테스트 사용자',
        email: 'test@example.com',
        avatarUrl: 'https://ui-avatars.com/api/?name=Test+User&background=random',
        role: 'user' as const,
        reputation: 100,
        createdAt: new Date().toISOString(),
      };

      // 선택된 카테고리 정보
      const selectedCategory = mockCategories.find((c) => c.id === category);
      if (!selectedCategory) {
        throw new Error('카테고리를 찾을 수 없습니다.');
      }

      // 새 게시글 객체 생성
      const newPost = {
        id: `post_${Date.now()}`,
        title: title.trim(),
        content,
        authorId: currentUser.id,
        author: currentUser,
        categoryId: category,
        category: selectedCategory,
        tags,
        upvotes: 0,
        downvotes: 0,
        viewCount: 0,
        commentCount: 0,
        isPinned: false,
        isLocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // localStorage에 저장
      const storedPosts = localStorage.getItem('community_posts');
      const posts = storedPosts ? JSON.parse(storedPosts) : [];
      posts.unshift(newPost); // 최신 게시글이 앞에 오도록
      localStorage.setItem('community_posts', JSON.stringify(posts));

      // 성공 - 카테고리 페이지로 리다이렉트
      router.push(`/community/${selectedCategory.slug}`);
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      alert('게시글 저장에 실패했습니다. 다시 시도해주세요.');
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
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((cat) => (
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
            content={content}
            onChange={setContent}
            placeholder="게시글 내용을 입력하세요 (최소 10자)..."
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
