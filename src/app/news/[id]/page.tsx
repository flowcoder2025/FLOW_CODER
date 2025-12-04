import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, MessageSquare, Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/NewsCard';
import { SafeHtml } from '@/components/SafeHtml';
import { getPostById, getNewsPosts } from '@/lib/data-access';
import { prisma } from '@/lib/prisma';
import { getNewsCategory } from '@/lib/news-categories';

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

/** 관련 뉴스 가져오기 (같은 카테고리 우선, 현재 포스트 제외) */
async function getRelatedNews(currentPostId: string, categoryId: string, limit: number = 3) {
  // 같은 카테고리 뉴스 우선
  const sameCategory = await prisma.post.findMany({
    where: {
      id: { not: currentPostId },
      category: {
        route: '/news',
      },
      categoryId: categoryId,
      deletedAt: null, // 삭제되지 않은 게시글만
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          route: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  // 같은 카테고리가 부족하면 다른 카테고리로 채움
  if (sameCategory.length < limit) {
    const otherCategory = await prisma.post.findMany({
      where: {
        id: { not: currentPostId },
        category: {
          route: '/news',
        },
        categoryId: { not: categoryId },
        deletedAt: null, // 삭제되지 않은 게시글만
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            image: true,
            reputation: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
            route: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit - sameCategory.length,
    });

    return [...sameCategory, ...otherCategory];
  }

  return sameCategory;
}

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;

  const news = await getPostById(id);

  // 뉴스 카테고리가 아니거나 존재하지 않으면 404 (삭제된 게시글도 404)
  if (!news || news.category.route !== '/news' || news.deletedAt) {
    notFound();
  }

  // 게시글 이미지 로드
  const newsImages = await prisma.postImage.findMany({
    where: { postId: id },
    orderBy: { order: 'asc' },
  });

  const relatedNews = await getRelatedNews(news.id, news.categoryId);

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
              className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              📰 {getNewsCategory(news.tags)}
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
                src={news.author.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={news.author.displayName || news.author.username || 'User'}
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
              <time dateTime={news.createdAt.toISOString()}>
                {news.createdAt.toLocaleDateString('ko-KR', {
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
              <span>{news._count.comments}</span>
            </div>
          </div>
        </header>

        {/* 구분선 */}
        <hr className="my-8 border-border" />

        {/* 게시글 이미지 */}
        {newsImages.length > 0 && (
          <div className="mb-8 space-y-4">
            {newsImages.map((image, index) => (
              <div key={image.id} className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image.url}
                  alt={image.alt || `이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            ))}
          </div>
        )}

        {/* 본문 콘텐츠 */}
        <SafeHtml
          html={news.content}
          className="prose prose-lg prose-slate dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
            prose-ul:my-4 prose-ul:pl-6 prose-li:my-1
            prose-ol:my-4 prose-ol:pl-6
            prose-img:rounded-lg prose-img:my-6
            prose-figure:my-6
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-table:border-collapse prose-th:border prose-th:p-2 prose-td:border prose-td:p-2"
          skipFirstImage={!!news.coverImageUrl}
        />

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
                <NewsCard
                  key={related.id}
                  news={{
                    ...related,
                    createdAt: related.createdAt.toISOString(),
                    updatedAt: related.updatedAt.toISOString(),
                    coverImageUrl: related.coverImageUrl || undefined,
                    author: {
                      id: related.author.id,
                      username: related.author.username || '',
                      displayName: related.author.displayName || undefined,
                      avatarUrl: related.author.image || undefined,
                      reputation: related.author.reputation,
                    },
                    category: {
                      ...related.category,
                      icon: related.category.icon || undefined,
                      color: related.category.color || undefined,
                    },
                    commentCount: related._count.comments,
                  }}
                />
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
  // 빌드 시점에 DATABASE_URL이 없으면 빈 배열 반환 (동적 렌더링으로 전환)
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
    return [];
  }

  try {
    const newsPosts = await getNewsPosts();
    return newsPosts.map((post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('generateStaticParams error:', error);
    return [];
  }
}
