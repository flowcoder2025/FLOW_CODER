import Link from 'next/link';
import Image from 'next/image';
import { memo, useMemo } from 'react';
import { MessageSquare, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoteButtons } from '@/components/VoteButtons';
import type { PostWithAuthor } from '@/lib/types';

/**
 * HTML 태그를 제거하고 텍스트만 추출
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * 게시글 카드 컴포넌트 (성능 최적화됨)
 *
 * 모바일 최적화된 레이아웃:
 * - 모바일: 투표 버튼 하단, 제목 전체 너비
 * - 데스크톱: 투표 버튼 좌측, 썸네일 우측
 *
 * 최적화:
 * - React.memo로 불필요한 리렌더링 방지
 * - useMemo로 계산된 값 메모이제이션
 */

interface PostCardProps {
  post: PostWithAuthor;
  /** 카테고리 배지 표시 여부 (기본: true) */
  showCategory?: boolean;
  /** 카드 변형 스타일 */
  variant?: 'default' | 'compact';
}

function PostCardComponent({ post, showCategory = true, variant = 'default' }: PostCardProps) {
  const {
    id,
    title,
    content,
    author,
    category,
    upvotes,
    downvotes,
    viewCount,
    commentCount,
    tags,
    isPinned,
    createdAt,
    coverImageUrl,
  } = post;

  // 성능 최적화: 계산된 값 메모이제이션
  const postUrl = useMemo(() => `/community/${category.slug}/${id}`, [category.slug, id]);
  const formattedDate = useMemo(() =>
    new Date(createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    [createdAt]
  );

  // 본문 미리보기 (100자 제한)
  const excerpt = useMemo(() => {
    const plain = stripHtml(content);
    return plain.length > 100 ? plain.substring(0, 100) + '...' : plain;
  }, [content]);

  return (
    <article>
      <Card className="hover:shadow-md transition-shadow py-0">
        <CardContent className={variant === 'compact' ? 'p-2' : 'p-2.5 md:p-4'}>
          <div className="flex flex-col md:flex-row md:items-start md:gap-4">
            {/* 좌측: 투표 섹션 (데스크톱만) */}
            <div className="hidden md:block flex-shrink-0">
              <VoteButtons
                targetType="post"
                targetId={id}
                upvotes={upvotes}
                downvotes={downvotes}
                size="sm"
              />
            </div>

            {/* 콘텐츠 섹션 */}
            <div className="flex-1 min-w-0">
              {/* 카테고리 & 고정 배지 */}
              {(showCategory || isPinned) && (
                <div className="flex items-center gap-2 mb-2">
                  {showCategory && (
                    <Badge variant="outline" className="text-xs">
                      {category.icon} {category.name}
                    </Badge>
                  )}
                  {isPinned && (
                    <Badge variant="secondary" className="text-xs">
                      📌 고정
                    </Badge>
                  )}
                </div>
              )}

              {/* 제목 & 썸네일 영역 */}
              <Link href={postUrl} className="block group">
                <div className="flex gap-3">
                  {/* 제목 + 본문 */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold group-hover:text-primary transition-colors line-clamp-2 ${
                      variant === 'compact' ? 'text-base mb-1' : 'text-base md:text-lg mt-1 mx-1 mb-2.5'
                    }`}>
                      {title}
                    </h3>
                    {/* 본문 미리보기 */}
                    {variant === 'default' && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mx-1 mb-3">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  {/* 썸네일 (우측 상단) */}
                  {coverImageUrl && variant === 'default' && (
                    <div className="flex-shrink-0">
                      <Image
                        src={coverImageUrl}
                        alt={title}
                        width={80}
                        height={80}
                        className="rounded-md object-cover w-16 h-16 md:w-20 md:h-20"
                      />
                    </div>
                  )}
                </div>
              </Link>

              {/* 태그 (최대 3개) */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* 메타 정보 (간소화) */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {/* 작성자 */}
                <Link
                  href={`/profile/${author.username}`}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Image
                    src={author.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={author.displayName || author.username}
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                  <span className="font-medium truncate max-w-[80px]">
                    {author.displayName || author.username}
                  </span>
                </Link>

                <span className="text-muted-foreground/40">•</span>

                {/* 댓글 수 */}
                <div className="flex items-center gap-0.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{commentCount}</span>
                </div>

                <span className="text-muted-foreground/40">•</span>

                {/* 조회수 */}
                <div className="flex items-center gap-0.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{viewCount}</span>
                </div>

                <span className="text-muted-foreground/40">•</span>

                {/* 작성 시간 */}
                <time dateTime={createdAt} className="hidden sm:inline">
                  {formattedDate}
                </time>
                <time dateTime={createdAt} className="sm:hidden">
                  {new Date(createdAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* 모바일: 투표 버튼 (하단) */}
              <div className="md:hidden mt-2 pt-1.5 border-t flex items-center gap-3">
                <VoteButtons
                  targetType="post"
                  targetId={id}
                  upvotes={upvotes}
                  downvotes={downvotes}
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

// React.memo로 래핑하여 props가 변경되지 않으면 리렌더링 방지
export const PostCard = memo(PostCardComponent);
