import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenSquare, Users, Lightbulb, Palette, MessageSquare, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/lib/data-access/categories';
import {
  getRecentPostsPaginated,
  type PostWithAuthor as DalPost,
} from '@/lib/data-access/posts';
import type { PostWithAuthor as PostCardData } from '@/lib/types';
import { PostCard } from '@/components/PostCard';

// 60초마다 재검증 (캐싱 활성화)
export const revalidate = 60;

/**
 * 커뮤니티 메인 페이지 (Server Component)
 *
 * 기능:
 * - 카테고리 카드 표시 (DB 연동)
 * - 최근 게시글 목록 표시 (DB 연동)
 */

// 카테고리 slug에 따른 아이콘 매핑
const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'tips': <Lightbulb className="h-8 w-8" />,
    'showcase': <Palette className="h-8 w-8" />,
    'free-board': <MessageSquare className="h-8 w-8" />,
    'vibe-coding': <Code className="h-8 w-8" />,
  };
  return iconMap[slug];
};

function mapPostToCardData(post: DalPost): PostCardData {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    categoryId: post.categoryId,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    viewCount: post.viewCount,
    isPinned: post.isPinned,
    isLocked: post.isLocked,
    tags: post.tags,
    coverImageUrl: post.coverImageUrl ?? undefined,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: {
      id: post.author.id,
      username: post.author.username || 'unknown',
      displayName: post.author.displayName ?? undefined,
      avatarUrl: post.author.image ?? undefined,
      reputation: post.author.reputation ?? 0,
    },
    category: {
      id: post.category.id,
      name: post.category.name,
      slug: post.category.slug,
      icon: post.category.icon ?? undefined,
      color: post.category.color ?? undefined,
    },
    commentCount: post._count?.comments ?? 0,
  };
}

interface CommunityPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const { page: pageStr = '1' } = await searchParams;
  const requestedPage = Number(pageStr) || 1;
  const postsPerPage = 20;

  const [categories, postsResult] = await Promise.all([
    getAllCategories(),
    getRecentPostsPaginated(requestedPage, postsPerPage),
  ]);

  const posts: PostCardData[] = postsResult.posts.map(mapPostToCardData);
  const pagination = postsResult.pagination;
  const currentPage = pagination.page;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-bold mb-2">
            <Users className="h-8 w-8" />
            커뮤니티
          </h1>
          <p className="text-muted-foreground">
            바이브코딩 사용자들과 자유롭게 소통하고 지식을 공유하세요
          </p>
        </div>
        <Button asChild>
          <Link href="/community/new">
            <PenSquare className="h-4 w-4 mr-2" />
            새 글 쓰기
          </Link>
        </Button>
      </div>

      {/* 카테고리 그리드 (news는 /news 페이지 사용) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {categories
          .filter((category) => category.slug !== 'news')
          .map((category) => {
          return (
            <Link
              key={category.id}
              href={`/community/${category.slug}`}
              className="block transition-transform hover:scale-105"
            >
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category.slug)}
                      <CardTitle className="text-xl m-0">{category.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">{category.postCount}개 글</Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    카테고리를 클릭하여 게시글을 확인하세요
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 최근 게시글 섹션 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">최근 게시글</h2>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4 mb-8">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!
              </p>
              <Button asChild className="mt-4">
                <Link href="/community/new">첫 번째 글 작성하기</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} showCategory />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {currentPage > 1 && (
            <Link href={`/community?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm">이전</Button>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Link key={page} href={`/community?page=${page}`}>
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                    >
                      {page}
                    </Button>
                  </Link>
                );
              }

              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }

              return null;
            })}
          </div>

          {currentPage < pagination.totalPages && (
            <Link href={`/community?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm">다음</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
