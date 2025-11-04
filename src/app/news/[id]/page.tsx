import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, MessageSquare, Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/NewsCard';
import { mockPosts } from '@/lib/mock-data';
import type { PostWithAuthor } from '@/lib/types';

/**
 * 뉴스 상세 페이지
 *
 * 기능:
 * - 동적 라우팅 ([id])
 * - 커버 이미지 배너 표시
 * - 카테고리, 제목, 메타 정보
 * - Rich Text 본문 렌더링
 * - 관련 뉴스 추천 (같은 카테고리 우선, 최대 3개)
 */

/** NEWS 포스트 ID로 데이터 가져오기 */
function getNewsById(id: string): PostWithAuthor | undefined {
  const post = mockPosts.find((p) => p.id === id && p.postType === 'NEWS');
  return post;
}

/** 관련 뉴스 가져오기 (같은 카테고리 우선, 현재 포스트 제외) */
function getRelatedNews(
  currentPost: PostWithAuthor,
  limit: number = 3
): PostWithAuthor[] {
  // 현재 포스트 제외한 모든 NEWS
  const allNews = mockPosts.filter(
    (p) => p.postType === 'NEWS' && p.id !== currentPost.id
  );

  // 같은 카테고리 뉴스 우선
  const sameCategory = allNews
    .filter((p) => p.categoryId === currentPost.categoryId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // 다른 카테고리 뉴스
  const otherCategory = allNews
    .filter((p) => p.categoryId !== currentPost.categoryId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // 같은 카테고리 먼저, 부족하면 다른 카테고리로 채움
  const related = [...sameCategory, ...otherCategory].slice(0, limit);

  return related;
}

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;

  const news = getNewsById(id);

  // NEWS가 아니거나 존재하지 않으면 404
  if (!news) {
    notFound();
  }

  const relatedNews = getRelatedNews(news);

  return (
    <div className="min-h-screen bg-background">
      {/* 뒤로가기 버튼 */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/news">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Button>
        </Link>
      </div>

      {/* 커버 이미지 배너 */}
      {news.coverImageUrl && (
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-muted">
          <Image
            src={news.coverImageUrl}
            alt={news.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* 그라디언트 오버레이 (향후 텍스트 추가 대비) */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      )}

      {/* 본문 컨테이너 */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 섹션 */}
        <header className="mb-8">
          {/* 카테고리 & 고정 배지 */}
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="secondary"
              className={`text-sm ${
                news.category.color === 'blue'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : news.category.color === 'green'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : news.category.color === 'purple'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : news.category.color === 'orange'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : ''
              }`}
            >
              {news.category.icon} {news.category.name}
            </Badge>
            {news.isPinned && (
              <Badge
                variant="secondary"
                className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              >
                📌 고정
              </Badge>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {news.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* 작성자 */}
            <Link
              href={`/profile/${news.author.username}`}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Image
                src={news.author.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={news.author.displayName || news.author.username}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-medium">
                {news.author.displayName || news.author.username}
              </span>
            </Link>

            <span>•</span>

            {/* 작성일 */}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={news.createdAt}>
                {new Date(news.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <span>•</span>

            {/* 조회수 */}
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{news.viewCount}</span>
            </div>

            <span>•</span>

            {/* 댓글수 */}
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>{news.commentCount}</span>
            </div>
          </div>
        </header>

        {/* 구분선 */}
        <hr className="my-8 border-border" />

        {/* 본문 콘텐츠 */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed">
            {news.content}
          </div>
        </article>

        {/* 태그 */}
        {news.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 관련 뉴스 */}
      {relatedNews.length > 0 && (
        <div className="bg-muted/30 py-12 mt-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-bold mb-6">관련 뉴스</h2>
            <div className="space-y-6">
              {relatedNews.map((related) => (
                <NewsCard key={related.id} news={related} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 정적 생성: 모든 NEWS 포스트 사전 생성 */
export async function generateStaticParams() {
  const newsPosts = mockPosts.filter((p) => p.postType === 'NEWS');
  return newsPosts.map((post) => ({
    id: post.id,
  }));
}
