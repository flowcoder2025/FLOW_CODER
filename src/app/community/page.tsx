import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { mockCategories, getPostsByCategory, getRecentPosts } from '@/lib/mock-data';

/**
 * 커뮤니티 메인 페이지
 *
 * 4개 카테고리 카드 표시 및 최근 인기 게시글 미리보기
 */
export default function CommunityPage() {
  const recentPosts = getRecentPosts(5);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">커뮤니티</h1>
        <p className="text-muted-foreground">
          바이브코딩 사용자들과 자유롭게 소통하고 지식을 공유하세요
        </p>
      </div>

      {/* 카테고리 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {mockCategories.map((category) => {
          const categoryPosts = getPostsByCategory(category.id);
          const recentPost = categoryPosts[0]; // 가장 최근 게시글

          return (
            <Link
              key={category.id}
              href={`/community/${category.slug}`}
              className="block transition-transform hover:scale-105"
            >
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <Badge variant="secondary">{category.postCount}개 글</Badge>
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPost ? (
                    <div className="text-sm text-muted-foreground">
                      <p className="line-clamp-2 mb-2">최근: {recentPost.title}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <MessageSquare className="h-3 w-3" />
                        <span>{recentPost.commentCount}개 댓글</span>
                        <span>•</span>
                        <span>{recentPost.upvotes}개 추천</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      아직 게시글이 없습니다
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 최근 인기 게시글 섹션 */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">최근 인기 게시글</h2>
        </div>

        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.category.slug}/${post.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* 투표 섹션 */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <span className="text-lg font-bold">
                        {post.upvotes - post.downvotes}
                      </span>
                      <span className="text-xs text-muted-foreground">추천</span>
                    </div>

                    {/* 게시글 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`bg-${post.category.color}-50 text-${post.category.color}-700 border-${post.category.color}-200`}
                        >
                          {post.category.icon} {post.category.name}
                        </Badge>
                        {post.isPinned && (
                          <Badge variant="secondary">📌 고정</Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.content}
                      </p>

                      {/* 태그 */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <img
                            src={post.author.avatarUrl}
                            alt={post.author.displayName || post.author.username}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{post.author.displayName || post.author.username}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.commentCount}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
