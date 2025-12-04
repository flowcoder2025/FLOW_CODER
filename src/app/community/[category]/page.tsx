import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Clock, MessageSquare, PenSquare, Lightbulb, Palette, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/PostCard';
import { getCategoryBySlug, getPostsByCategory } from '@/lib/data-access';

/**
 * 카테고리별 게시글 목록 페이지 (Server Component)
 *
 * 동적 라우트: /community/[category]
 * URL search params로 정렬, 페이지네이션 처리
 */

// 카테고리 slug에 따른 아이콘 매핑
const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'tips': <Lightbulb className="h-8 w-8" />,
    'showcase': <Palette className="h-8 w-8" />,
    'free-board': <MessageSquare className="h-8 w-8" />,
    'flowcoder-feed': <Code className="h-8 w-8" />,
  };
  return iconMap[slug];
};

type SortOption = 'popular' | 'recent' | 'comments';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    sort?: SortOption;
    page?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const { sort: sortOption = 'popular', page: pageStr = '1' } = await searchParams;
  const currentPage = parseInt(pageStr, 10) || 1;
  const postsPerPage = 20;

  // news 카테고리는 /news 페이지에서 처리 (중복 방지)
  if (categorySlug === 'news') {
    notFound();
  }

  // 카테고리 정보 조회
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  // 게시글 목록 조회
  const allPosts = await getPostsByCategory(categorySlug);

  // 고정 게시글 우선
  const pinnedPosts = allPosts.filter((p) => p.isPinned);
  const regularPosts = allPosts.filter((p) => !p.isPinned);

  // 정렬
  const sortFn = (a: typeof allPosts[number], b: typeof allPosts[number]) => {
    switch (sortOption) {
      case 'popular':
        const aVotes = (a._count?.votes || 0);
        const bVotes = (b._count?.votes || 0);
        return bVotes - aVotes;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'comments':
        return (b._count?.comments || 0) - (a._count?.comments || 0);
      default:
        return 0;
    }
  };

  regularPosts.sort(sortFn);
  const sortedPosts = [...pinnedPosts, ...regularPosts];

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 카테고리 헤더 */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-4xl font-bold mb-2">
          {getCategoryIcon(categorySlug)}
          {category.name}
        </h1>
        <p className="text-muted-foreground mb-4">{category.description}</p>
        <div className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{allPosts.length}개</span>의 게시글
        </div>
      </div>

      {/* 툴바: 정렬 & 새 글 쓰기 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* 정렬 옵션 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">정렬:</span>
          <div className="flex gap-2">
            <Link href={`/community/${categorySlug}?sort=popular&page=1`}>
              <Button variant={sortOption === 'popular' ? 'default' : 'outline'} size="sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                인기순
              </Button>
            </Link>
            <Link href={`/community/${categorySlug}?sort=recent&page=1`}>
              <Button variant={sortOption === 'recent' ? 'default' : 'outline'} size="sm">
                <Clock className="h-4 w-4 mr-1" />
                최신순
              </Button>
            </Link>
            <Link href={`/community/${categorySlug}?sort=comments&page=1`}>
              <Button variant={sortOption === 'comments' ? 'default' : 'outline'} size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                댓글순
              </Button>
            </Link>
          </div>
        </div>

        {/* 새 글 쓰기 버튼 */}
        <Button asChild>
          <Link href="/community/new">
            <PenSquare className="h-4 w-4 mr-2" />
            새 글 쓰기
          </Link>
        </Button>
      </div>

      {/* 게시글 목록 */}
      {currentPosts.length > 0 ? (
        <div className="space-y-4">
          {currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                coverImageUrl: post.coverImageUrl || undefined,
                author: {
                  id: post.author.id,
                  username: post.author.username || '',
                  displayName: post.author.displayName || undefined,
                  avatarUrl: post.author.image || undefined,
                  reputation: post.author.reputation,
                },
                category: {
                  ...post.category,
                  icon: post.category.icon || undefined,
                  color: post.category.color || undefined,
                },
                commentCount: post._count.comments,
                upvotes: 0, // TODO: 실제 투표 데이터 연동
                downvotes: 0,
              }}
              showCategory={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">아직 게시글이 없습니다.</p>
          <Button asChild className="mt-4">
            <Link href="/community/new">첫 번째 글 작성하기</Link>
          </Button>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {currentPage > 1 && (
            <Link href={`/community/${categorySlug}?sort=${sortOption}&page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">이전</Button>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // 첫 페이지, 마지막 페이지, 현재 페이지 주변만 표시
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Link key={page} href={`/community/${categorySlug}?sort=${sortOption}&page=${page}`}>
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                    >
                      {page}
                    </Button>
                  </Link>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
          </div>

          {currentPage < totalPages && (
            <Link href={`/community/${categorySlug}?sort=${sortOption}&page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">다음</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
