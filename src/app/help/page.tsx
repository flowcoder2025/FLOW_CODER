'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionCard } from '@/components/QuestionCard';
import {
  getQuestions,
  getAnswerCount,
  hasAcceptedAnswer,
} from '@/lib/mock-data';

/**
 * Help me - Q&A 목록 페이지
 *
 * 기능:
 * - 질문 목록 표시
 * - 필터링: 전체 / 미답변 / 채택됨
 * - 질문하기 버튼
 *
 * 라우트: /help
 */

type FilterType = 'all' | 'unanswered' | 'accepted';

export default function HelpPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  // 모든 질문 가져오기
  const allQuestions = getQuestions();

  // 필터링된 질문 목록
  const filteredQuestions = allQuestions.filter((question) => {
    const answerCount = getAnswerCount(question.id);
    const hasAccepted = hasAcceptedAnswer(question.id);

    if (filter === 'unanswered') {
      return answerCount === 0;
    } else if (filter === 'accepted') {
      return hasAccepted;
    }
    return true; // 'all'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Help me</h1>
          <p className="text-muted-foreground">
            커뮤니티에 질문하고 답변을 받으세요
          </p>
        </div>
        <Button asChild>
          <Link href="/help/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            질문하기
          </Link>
        </Button>
      </div>

      {/* 필터 탭 */}
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as FilterType)}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">
            전체 ({allQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="unanswered">
            미답변 (
            {allQuestions.filter((q) => getAnswerCount(q.id) === 0).length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            채택됨 (
            {allQuestions.filter((q) => hasAcceptedAnswer(q.id)).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 질문 목록 */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              answerCount={getAnswerCount(question.id)}
              hasAccepted={hasAcceptedAnswer(question.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {filter === 'unanswered'
                ? '미답변 질문이 없습니다'
                : filter === 'accepted'
                  ? '채택된 답변이 있는 질문이 없습니다'
                  : '질문이 없습니다'}
            </p>
            <Button asChild variant="outline">
              <Link href="/help/new">첫 질문 작성하기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
