'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
  categorySlug: string;
}

/**
 * 게시글 삭제 버튼 컴포넌트
 *
 * Client Component로 분리하여 onClick 핸들러 사용
 */
export function DeletePostButton({ postId, postTitle, categorySlug }: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`"${postTitle}" 게시글을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '게시글 삭제에 실패했습니다.');
      }

      alert('게시글이 삭제되었습니다.');
      router.push(`/community/${categorySlug}`);
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      alert(error instanceof Error ? error.message : '게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      삭제
    </Button>
  );
}
