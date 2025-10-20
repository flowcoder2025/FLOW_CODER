'use client';

import Link from 'next/link';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CommentWithAuthor } from '@/lib/types';

/**
 * 댓글 아이템 컴포넌트
 *
 * 기능:
 * - 댓글 정보 표시 (작성자, 내용, 시간)
 * - 투표 버튼 (추천/비추천)
 * - 답글 버튼
 * - 재귀적 대댓글 렌더링
 */

export interface CommentItemProps {
  /** 댓글 데이터 */
  comment: CommentWithAuthor;
  /** 대댓글 조회 함수 */
  getReplies: (parentId: string) => CommentWithAuthor[];
  /** 중첩 깊이 (기본값: 0) */
  depth?: number;
  /** 최대 중첩 깊이 (기본값: 5) */
  maxDepth?: number;
}

export function CommentItem({
  comment,
  getReplies,
  depth = 0,
  maxDepth = 5,
}: CommentItemProps) {
  const replies = getReplies(comment.id);
  const score = comment.upvotes - comment.downvotes;

  return (
    <div className={depth > 0 ? 'ml-8 mt-4' : ''}>
      <Card className={depth > 0 ? 'border-l-4 border-l-muted' : ''}>
        <CardContent className="p-4">
          {/* 작성자 & 메타 정보 */}
          <div className="flex items-center gap-3 mb-3">
            <Link
              href={`/profile/${comment.author.username}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={comment.author.avatarUrl}
                alt={comment.author.displayName || comment.author.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-sm">
                {comment.author.displayName || comment.author.username}
              </span>
              {comment.author.reputation > 100 && (
                <span className="text-xs text-muted-foreground">
                  ({comment.author.reputation})
                </span>
              )}
            </Link>

            <span className="text-muted-foreground/50 text-sm">•</span>

            <time
              className="text-sm text-muted-foreground"
              dateTime={comment.createdAt}
            >
              {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          {/* 댓글 내용 */}
          <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>

          {/* 투표 & 답글 버튼 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ArrowUp className="h-3 w-3" />
              </Button>
              <span
                className={`text-sm font-medium ${
                  score > 0
                    ? 'text-primary'
                    : score < 0
                      ? 'text-destructive'
                      : ''
                }`}
              >
                {score}
              </span>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="h-7 text-xs">
              답글
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 대댓글 (재귀) */}
      {replies.length > 0 && depth < maxDepth && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              getReplies={getReplies}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}
