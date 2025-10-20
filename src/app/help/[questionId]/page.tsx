'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MessageSquare, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VoteButtons } from '@/components/VoteButtons';
import { AnswerCard } from '@/components/AnswerCard';
import { getPostById, getAnswersByQuestionId } from '@/lib/mock-data';

/**
 * 질문 상세 페이지
 *
 * 동적 라우트: /help/[questionId]
 * Next.js 15: params는 Promise이므로 use() 훅으로 unwrap
 */

interface QuestionDetailPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

export default function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { questionId } = use(params);

  // 질문 게시글 조회
  const question = getPostById(questionId);

  // 존재하지 않거나 QUESTION 타입이 아니면 404
  if (!question || question.postType !== 'QUESTION') {
    notFound();
  }

  // 답변 조회 및 정렬 (채택된 답변이 먼저)
  const allAnswers = getAnswersByQuestionId(questionId);
  const sortedAnswers = [...allAnswers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return 0;
  });

  const acceptedAnswer = allAnswers.find((a) => a.isAccepted);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          홈
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/help" className="hover:text-foreground transition-colors">
          Help me
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{question.title}</span>
      </nav>

      {/* 질문 카드 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* 좌측: 투표 섹션 */}
            <VoteButtons
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              orientation="vertical"
              size="lg"
              voteId={`question_${question.id}`}
            />

            {/* 우측: 콘텐츠 섹션 */}
            <div className="flex-1 min-w-0">
              {/* 상태 배지 */}
              <div className="flex items-center gap-2 mb-3">
                {acceptedAnswer && (
                  <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    ✓ 해결됨
                  </Badge>
                )}
                {!acceptedAnswer && allAnswers.length === 0 && (
                  <Badge variant="secondary" className="text-xs">
                    답변 대기 중
                  </Badge>
                )}
              </div>

              {/* 제목 */}
              <h1 className="text-3xl font-bold mb-4">{question.title}</h1>

              {/* 작성자 & 메타 정보 */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 pb-6 border-b">
                {/* 작성자 */}
                <Link
                  href={`/profile/${question.author.username}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <img
                    src={question.author.avatarUrl}
                    alt={question.author.displayName || question.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {question.author.displayName || question.author.username}
                    </span>
                    {question.author.reputation > 100 && (
                      <span className="text-xs">평판 {question.author.reputation}</span>
                    )}
                  </div>
                </Link>

                <span className="text-muted-foreground/50">•</span>

                {/* 작성 시간 */}
                <time dateTime={question.createdAt}>
                  {new Date(question.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>

                <span className="text-muted-foreground/50">•</span>

                {/* 조회수 */}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.viewCount}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                <p className="whitespace-pre-wrap text-base leading-relaxed">{question.content}</p>
              </div>

              {/* 태그 */}
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs hover:bg-secondary/80 cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 답변 섹션 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            {allAnswers.length}개의 답변
          </h2>
        </div>

        {sortedAnswers.length > 0 ? (
          <div className="space-y-4">
            {sortedAnswers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">아직 답변이 없습니다.</p>
              <p className="text-sm text-muted-foreground">
                이 질문에 대한 답변을 작성해보세요!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 답변 작성 폼 (간단한 버전) */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">답변 작성</h3>
          <textarea
            className="w-full min-h-[150px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="답변을 입력하세요..."
            disabled
          />
          <div className="flex justify-end mt-4">
            <Button disabled>답변 제출 (곧 지원 예정)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
