'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CommentItem } from '@/components/CommentItem';
import type { CommentWithAuthor } from '@/lib/types';

/**
 * 댓글 리스트 컴포넌트
 *
 * 기능:
 * - 최상위 댓글 목록 렌더링
 * - 빈 댓글 상태 처리
 * - 대댓글 조회 함수 전달
 */

export interface CommentListProps {
  /** 전체 댓글 목록 */
  comments: CommentWithAuthor[];
  /** 댓글 총 개수 */
  commentCount: number;
}

export function CommentList({ comments, commentCount }: CommentListProps) {
  // 최상위 댓글만 필터링
  const topLevelComments = comments.filter((c) => !c.parentId);

  // 대댓글 찾기 헬퍼
  const getReplies = (parentId: string): CommentWithAuthor[] => {
    return comments.filter((c) => c.parentId === parentId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">댓글 {commentCount}개</h2>

      {comments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              getReplies={getReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
}
