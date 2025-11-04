'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PostWithAuthor } from '@/lib/types';

/**
 * Q&A 질문 카드 컴포넌트 (성능 최적화됨)
 *
 * 기능:
 * - 질문 제목, 미리보기, 태그 표시
 * - 투표 버튼 (좌측 수직)
 * - 답변 수, 조회수, 작성자 정보
 * - 채택된 답변 여부 표시
 *
 * 최적화:
 * - React.memo로 불필요한 리렌더링 방지
 * - useMemo로 계산된 값 메모이제이션
 */

export interface QuestionCardProps {
  /** 질문 게시글 데이터 */
  question: PostWithAuthor;
  /** 답변 개수 */
  answerCount: number;
  /** 채택된 답변 존재 여부 */
  hasAccepted: boolean;
}

function QuestionCardComponent({
  question,
  answerCount,
  hasAccepted,
}: QuestionCardProps) {
  // 성능 최적화: 계산된 값 메모이제이션
  const score = useMemo(
    () => question.upvotes - question.downvotes,
    [question.upvotes, question.downvotes]
  );

  const scoreColorClass = useMemo(
    () =>
      score > 0 ? 'text-primary' : score < 0 ? 'text-destructive' : '',
    [score]
  );

  const answerColorClass = useMemo(
    () =>
      hasAccepted
        ? 'text-green-600 dark:text-green-400'
        : answerCount > 0
          ? 'text-muted-foreground'
          : 'text-muted-foreground/50',
    [hasAccepted, answerCount]
  );

  const formattedDate = useMemo(() =>
    new Date(question.createdAt).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    }),
    [question.createdAt]
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* 좌측: 투표 및 통계 */}
          <div className="flex flex-col items-center gap-4 min-w-[80px]">
            {/* 투표 점수 */}
            <div className="flex flex-col items-center">
              <span className={`text-2xl font-bold ${scoreColorClass}`}>
                {score}
              </span>
              <span className="text-xs text-muted-foreground">점수</span>
            </div>

            {/* 답변 수 */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center gap-1 ${answerColorClass}`}>
                {hasAccepted && <Check className="h-4 w-4" />}
                <span className="text-xl font-bold">{answerCount}</span>
              </div>
              <span className="text-xs text-muted-foreground">답변</span>
            </div>

            {/* 조회수 */}
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {question.viewCount}
              </span>
              <span className="text-xs text-muted-foreground">조회</span>
            </div>
          </div>

          {/* 우측: 콘텐츠 */}
          <div className="flex-1 min-w-0">
            {/* 제목 */}
            <Link
              href={`/help/${question.id}`}
              className="block group mb-2"
            >
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {question.title}
              </h3>
            </Link>

            {/* 내용 미리보기 */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {question.content}
            </p>

            {/* 하단: 태그 & 메타 정보 */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* 태그 */}
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs hover:bg-secondary/80 cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 작성자 & 시간 */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
                <Link
                  href={`/profile/${question.author.username}`}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <img
                    src={question.author.avatarUrl}
                    alt={question.author.displayName || question.author.username}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="font-medium">
                    {question.author.displayName || question.author.username}
                  </span>
                </Link>
                <span>•</span>
                <time dateTime={question.createdAt}>
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// React.memo로 래핑하여 props가 변경되지 않으면 리렌더링 방지
export const QuestionCard = memo(QuestionCardComponent);
