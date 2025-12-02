import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NewsCard } from '@/components/NewsCard';
import { getNewsPosts, getAllCategories } from '@/lib/data-access';
import { Newspaper } from 'lucide-react';

// ISR: 3분마다 재검증
export const revalidate = 180;

/**
 * 뉴스 목록 페이지 (Server Component)
 *
 * 기능:
 * - NEWS 타입 게시글 목록 표시
 * - 카테고리별 필터링 (URL search params 사용)
 * - 날짜 내림차순 정렬
 * - 3분 캐싱으로 성능 최적화
 */

interface NewsPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category: selectedCategory } = await searchParams;

  // 병렬로 데이터 가져오기 (성능 최적화)
  const [allCategories, allNews] = await Promise.all([
    getAllCategories(),
    getNewsPosts(),
  ]);

  // NEWS 카테고리만 필터링
  const newsCategories = allCategories.filter((cat) =>
    cat.slug.startsWith('news-')
  );

  // 카테고리로 필터링된 뉴스
  const filteredNews =
    !selectedCategory || selectedCategory === 'all'
      ? allNews
      : allNews.filter((news) => news.category.slug === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-4xl font-bold mb-2">
          <Newspaper className="h-8 w-8" />
          뉴스
        </h1>
        <p className="text-muted-foreground">
          바이브코딩의 최신 소식을 확인하세요
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/news">
            <Badge
              variant={
                !selectedCategory || selectedCategory === 'all'
                  ? 'default'
                  : 'outline'
              }
              className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2"
            >
              전체 ({allNews.length})
            </Badge>
          </Link>
          {newsCategories.map((category) => {
            const count = allNews.filter(
              (news) => news.category.slug === category.slug
            ).length;
            return (
              <Link
                key={category.id}
                href={`/news?category=${category.slug}`}
              >
                <Badge
                  variant={
                    selectedCategory === category.slug ? 'default' : 'outline'
                  }
                  className={`cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2 ${
                    selectedCategory === category.slug
                      ? ''
                      : category.color === 'blue'
                        ? 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        : category.color === 'green'
                          ? 'hover:bg-green-100 dark:hover:bg-green-900/30'
                          : category.color === 'purple'
                            ? 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
                            : category.color === 'orange'
                              ? 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
                              : ''
                  }`}
                >
                  {category.name} ({count})
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 뉴스 목록 */}
      {filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              news={{
                ...news,
                // unstable_cache로 인해 Date 객체가 문자열로 직렬화될 수 있음
                createdAt: news.createdAt instanceof Date
                  ? news.createdAt.toISOString()
                  : String(news.createdAt),
                updatedAt: news.updatedAt instanceof Date
                  ? news.updatedAt.toISOString()
                  : String(news.updatedAt),
                coverImageUrl: (news as unknown as { images?: { url: string }[] }).images?.[0]?.url || news.coverImageUrl || undefined,
                author: {
                  id: news.author.id,
                  username: news.author.username || '',
                  displayName: news.author.displayName || undefined,
                  avatarUrl: news.author.image || undefined,
                  reputation: news.author.reputation,
                },
                category: {
                  ...news.category,
                  icon: news.category.icon || undefined,
                  color: news.category.color || undefined,
                },
                commentCount: news._count.comments,
              }}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-2">
              해당 카테고리의 뉴스가 아직 없습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              곧 새로운 소식을 전해드리겠습니다!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
