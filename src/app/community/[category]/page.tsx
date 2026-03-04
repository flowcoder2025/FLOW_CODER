import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Clock, MessageSquare, PenSquare, Lightbulb, Palette, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/PostCard';
import { getCategoryBySlug, getPostsByCategory } from '@/lib/data-access';
import type { Metadata } from 'next';

/**
 * 카테고리별 게시글 목록 페이지 (Server Component)
 *
 * 동적 라우트: /community/[category]
 * URL search params로 정렬, 페이지네이션 처리
 * ISR: 60초마다 재검증
 */
export const revalidate = 60;

/**
 * 카테고리별 동적 메타데이터 생성
 */
const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'tips': {
    title: '바이브 코딩 팁',
    description: 'AI 코딩 도구 활용 팁과 노하우를 공유합니다. Cursor, Claude, Windsurf 등 최신 도구의 실전 팁을 확인하세요.',
  },
  'showcase': {
    title: '프로젝트 쇼케이스',
    description: 'FlowCoder 커뮤니티 멤버들의 바이브 코딩 프로젝트를 구경하세요. 영감을 얻고 피드백을 나눠보세요.',
  },
  'free-board': {
    title: '자유게시판',
    description: 'AI 코딩, 개발 관련 자유로운 이야기를 나누는 공간입니다. 질문, 토론, 잡담 모두 환영합니다.',
  },
  'flowcoder-feed': {
    title: 'FlowCoder 피드',
    description: 'FlowCoder 팀의 공식 소식과 업데이트를 확인하세요. 새로운 기능, 이벤트, 공지사항을 전달합니다.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flow-coder.com';

  const meta = CATEGORY_META[categorySlug];
  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      openGraph: {
        title: `${meta.title} | FlowCoder`,
        description: meta.description,
        url: `${baseUrl}/community/${categorySlug}`,
        siteName: 'FlowCoder',
        type: 'website',
        locale: 'ko_KR',
      },
      alternates: {
        canonical: `${baseUrl}/community/${categorySlug}`,
      },
    };
  }

  // DB에서 카테고리 정보 조회 (알려지지 않은 카테고리)
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    return { title: '카테고리를 찾을 수 없습니다' };
  }

  return {
    title: category.name,
    description: category.description || `FlowCoder ${category.name} 카테고리 게시글 목록`,
    openGraph: {
      title: `${category.name} | FlowCoder`,
      description: category.description || `FlowCoder ${category.name} 카테고리`,
      url: `${baseUrl}/community/${categorySlug}`,
      siteName: 'FlowCoder',
      type: 'website',
      locale: 'ko_KR',
    },
    alternates: {
      canonical: `${baseUrl}/community/${categorySlug}`,
    },
  };
}

/**
 * 빌드 시 주요 카테고리 페이지 사전 생성 (SSG)
 * Cold start 및 첫 요청 지연 방지
 */
export async function generateStaticParams() {
  // 주요 카테고리 slug 목록 (DB 조회 없이 하드코딩으로 빌드 안정성 확보)
  const categorySlugs = ['tips', 'showcase', 'free-board', 'flowcoder-feed'];

  return categorySlugs.map((category) => ({
    category,
  }));
}

// 카테고리 slug에 따른 아이콘 매핑
const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'tips': <Lightbulb className="h-6 w-6 md:h-7 md:w-7" />,
    'showcase': <Palette className="h-6 w-6 md:h-7 md:w-7" />,
    'free-board': <MessageSquare className="h-6 w-6 md:h-7 md:w-7" />,
    'flowcoder-feed': <Code className="h-6 w-6 md:h-7 md:w-7" />,
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
        <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-2">
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
        <div className="space-y-2 md:space-y-4">
          {currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                // unstable_cache로 인해 Date가 문자열로 직렬화될 수 있음
                createdAt: typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.toISOString(),
                updatedAt: typeof post.updatedAt === 'string' ? post.updatedAt : post.updatedAt.toISOString(),
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
