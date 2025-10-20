'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoteButtons } from '@/components/VoteButtons';
import type { AnswerWithAuthor } from '@/lib/types';

/**
 * Q&A 답변 카드 컴포넌트
 *
 * 기능:
 * - 답변 내용 표시
 * - 채택된 답변 표시
 * - 투표 버튼 (수평, sm 크기)
 * - 작성자 정보
 */

export interface AnswerCardProps {
  /** 답변 데이터 */
  answer: AnswerWithAuthor;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <Card className={answer.isAccepted ? 'border-green-500 dark:border-green-600' : ''}>
      <CardContent className="p-6">
        {/* 채택 배지 */}
        {answer.isAccepted && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              채택된 답변
            </Badge>
          </div>
        )}

        {/* 답변 내용 */}
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
          <p className="whitespace-pre-wrap text-base leading-relaxed">{answer.content}</p>
        </div>

        {/* 하단: 투표 & 작성자 정보 */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t">
          {/* 투표 버튼 */}
          <VoteButtons
            upvotes={answer.upvotes}
            downvotes={0} // Answer 타입에는 downvotes 없음
            orientation="horizontal"
            size="sm"
            voteId={`answer_${answer.id}`}
          />

          {/* 작성자 & 시간 */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link
              href={`/profile/${answer.author.username}`}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <img
                src={answer.author.avatarUrl}
                alt={answer.author.displayName || answer.author.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {answer.author.displayName || answer.author.username}
                </span>
                {answer.author.reputation > 100 && (
                  <span className="text-xs">평판 {answer.author.reputation}</span>
                )}
              </div>
            </Link>

            <span>•</span>

            <time dateTime={answer.createdAt}>
              {new Date(answer.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
