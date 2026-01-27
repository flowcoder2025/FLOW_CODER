import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Eye, ArrowRight, Rss } from 'lucide-react';
import { VoteButtons } from '@/components/VoteButtons';
import type { BlogFeedPost } from '@/lib/data-access';

/**
 * HTML 태그를 제거하고 텍스트만 추출
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

interface BlogFeedSectionProps {
  posts: BlogFeedPost[];
}

/**
 * 블로그 피드 섹션 (서버 컴포넌트)
 *
 * flowcoder-feed 카테고리의 게시글 목록을 표시합니다.
 * PostCard 스타일을 기반으로 하되, 블로그 피드에 최적화된 레이아웃을 사용합니다.
 */
export function BlogFeedSection({ posts }: BlogFeedSectionProps) {
  if (posts.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 text-xs font-semibold border-0 shadow-md pointer-events-none">
              <Rss className="w-3 h-3 mr-1" />
              FlowCoder 피드
            </Badge>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                아직 피드 게시글이 없습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 text-xs font-semibold border-0 shadow-md pointer-events-none">
            <Rss className="w-3 h-3 mr-1" />
            FlowCoder 피드
          </Badge>
          <Link href="/community/flowcoder-feed">
            <Button variant="ghost" size="sm" className="gap-1">
              더 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {posts.map((post) => (
            <BlogFeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 블로그 피드 카드 컴포넌트
 */
function BlogFeedCard({ post }: { post: BlogFeedPost }) {
  const postUrl = `/community/${post.categorySlug}/${post.id}`;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 본문 미리보기 (100자 제한)
  const excerpt = (() => {
    const plain = stripHtml(post.content);
    return plain.length > 100 ? plain.substring(0, 100) + '...' : plain;
  })();

  return (
    <article>
      <Card className="hover:shadow-md transition-shadow py-0">
        <CardContent className="p-2.5 md:p-4">
          <div className="flex flex-col md:flex-row md:items-start md:gap-4">
            {/* 좌측: 투표 섹션 (데스크톱만) */}
            <div className="hidden md:block flex-shrink-0">
              <VoteButtons
                targetType="post"
                targetId={post.id}
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                size="sm"
              />
            </div>

            {/* 콘텐츠 섹션 */}
            <div className="flex-1 min-w-0">
              {/* 카테고리 & 고정 배지 */}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.category.icon} {post.category.name}
                </Badge>
                {post.isPinned && (
                  <Badge variant="secondary" className="text-xs">
                    📌 고정
                  </Badge>
                )}
              </div>

              {/* 제목 & 썸네일 영역 */}
              <Link href={postUrl} className="block group">
                <div className="flex gap-3">
                  {/* 제목 + 본문 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 text-base md:text-lg mt-1 mx-1 mb-2.5">
                      {post.title}
                    </h3>
                    {/* 본문 미리보기 */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mx-1 mb-3">
                      {excerpt}
                    </p>
                  </div>

                  {/* 썸네일 (우측 상단) */}
                  {post.coverImageUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        width={80}
                        height={80}
                        className="rounded-md object-cover w-16 h-16 md:w-20 md:h-20"
                      />
                    </div>
                  )}
                </div>
              </Link>

              {/* 태그 (최대 3개) */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* 메타 정보 (간소화) */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {/* 작성자 */}
                <Link
                  href={`/profile/${post.author.username}`}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Image
                    src={
                      post.author.avatarUrl ||
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                    }
                    alt={post.author.displayName || post.author.username}
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                  <span className="font-medium truncate max-w-[80px]">
                    {post.author.displayName || post.author.username}
                  </span>
                </Link>

                <span className="text-muted-foreground/40">•</span>

                {/* 댓글 수 */}
                <div className="flex items-center gap-0.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{post.commentCount}</span>
                </div>

                <span className="text-muted-foreground/40">•</span>

                {/* 조회수 */}
                <div className="flex items-center gap-0.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.viewCount}</span>
                </div>

                <span className="text-muted-foreground/40">•</span>

                {/* 작성 시간 */}
                <time dateTime={post.createdAt} className="hidden sm:inline">
                  {formattedDate}
                </time>
                <time dateTime={post.createdAt} className="sm:hidden">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* 모바일: 투표 버튼 (하단) */}
              <div className="md:hidden mt-2 pt-1.5 border-t flex items-center gap-3">
                <VoteButtons
                  targetType="post"
                  targetId={post.id}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  orientation="horizontal"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
