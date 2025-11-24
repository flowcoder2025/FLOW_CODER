import Link from 'next/link';
import { PlusCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/QuestionCard';
import { getQuestionPosts } from '@/lib/data-access';

/**
 * Help me - Q&A 목록 페이지 (Server Component)
 *
 * 기능:
 * - 질문 목록 표시
 * - 필터링: 전체 / 미답변 / 채택됨 (URL search params)
 * - 질문하기 버튼
 *
 * 라우트: /help
 */

type FilterType = 'all' | 'unanswered' | 'accepted';

interface HelpPageProps {
  searchParams: Promise<{
    filter?: FilterType;
  }>;
}

export default async function HelpPage({ searchParams }: HelpPageProps) {
  const { filter = 'all' } = await searchParams;

  // 모든 질문 가져오기 (QUESTION 타입 게시글)
  const allQuestions = await getQuestionPosts();

  // 필터링된 질문 목록
  const filteredQuestions = allQuestions.filter((question) => {
    const answerCount = question._count.answers;
    const hasAccepted = question.answers?.some((a) => a.isAccepted) || false;

    if (filter === 'unanswered') {
      return answerCount === 0;
    } else if (filter === 'accepted') {
      return hasAccepted;
    }
    return true; // 'all'
  });

  // 카운트 계산
  const unansweredCount = allQuestions.filter((q) => q._count.answers === 0)
    .length;
  const acceptedCount = allQuestions.filter(
    (q) => q.answers?.some((a) => a.isAccepted)
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold mb-2">
            <HelpCircle className="h-8 w-8" />
            Help me
          </h1>
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

      {/* 필터 탭 (Link 기반) */}
      <div className="mb-6">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <Link
            href="/help"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              filter === 'all' || !filter
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            전체 ({allQuestions.length})
          </Link>
          <Link
            href="/help?filter=unanswered"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              filter === 'unanswered'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            미답변 ({unansweredCount})
          </Link>
          <Link
            href="/help?filter=accepted"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              filter === 'accepted'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            채택됨 ({acceptedCount})
          </Link>
        </div>
      </div>

      {/* 질문 목록 */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={{
                ...question,
                createdAt: question.createdAt.toISOString(),
                updatedAt: question.updatedAt.toISOString(),
                coverImageUrl: question.coverImageUrl || undefined,
                author: {
                  id: question.author.id,
                  username: question.author.username || '',
                  displayName: question.author.displayName || undefined,
                  avatarUrl: question.author.image || undefined,
                  reputation: question.author.reputation,
                },
                category: {
                  ...question.category,
                  icon: question.category.icon || undefined,
                  color: question.category.color || undefined,
                },
                commentCount: question._count.comments,
              }}
              answerCount={question._count.answers}
              hasAccepted={question.answers?.some((a) => a.isAccepted) || false}
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
