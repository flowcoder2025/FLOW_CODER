import Link from 'next/link';
import { ArrowUp, ArrowDown, MessageSquare, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PostWithAuthor } from '@/lib/types';

/**
 * 게시글 카드 컴포넌트
 *
 * 레딧 스타일의 게시글 카드 UI
 * - 좌측: 투표 시스템
 * - 우측: 콘텐츠 (제목, 본문, 메타 정보)
 */

interface PostCardProps {
  post: PostWithAuthor;
  /** 카테고리 배지 표시 여부 (기본: true) */
  showCategory?: boolean;
  /** 카드 변형 스타일 */
  variant?: 'default' | 'compact';
}

export function PostCard({ post, showCategory = true, variant = 'default' }: PostCardProps) {
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
  } = post;

  const score = upvotes - downvotes;
  const postUrl = `/community/${category.slug}/${id}`;

  return (
    <article>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className={variant === 'compact' ? 'p-4' : 'p-6'}>
          <div className="flex items-start gap-4">
            {/* 좌측: 투표 섹션 */}
            <div className="flex flex-col items-center gap-1 min-w-[40px]">
              <button
                className="p-1 rounded hover:bg-accent transition-colors"
                aria-label="추천"
                type="button"
              >
                <ArrowUp className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </button>
              <span className={`text-lg font-bold ${score > 0 ? 'text-primary' : score < 0 ? 'text-destructive' : ''}`}>
                {score}
              </span>
              <button
                className="p-1 rounded hover:bg-accent transition-colors"
                aria-label="비추천"
                type="button"
              >
                <ArrowDown className="h-5 w-5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>

            {/* 우측: 콘텐츠 섹션 */}
            <div className="flex-1 min-w-0">
              {/* 카테고리 & 고정 배지 */}
              {(showCategory || isPinned) && (
                <div className="flex items-center gap-2 mb-2">
                  {showCategory && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
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

              {/* 제목 (클릭 시 상세 페이지) */}
              <Link href={postUrl} className="block group">
                <h3 className={`font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2 ${
                  variant === 'compact' ? 'text-base' : 'text-lg'
                }`}>
                  {title}
                </h3>
              </Link>

              {/* 본문 미리보기 */}
              {variant === 'default' && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {content}
                </p>
              )}

              {/* 태그 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.slice(0, 5).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs hover:bg-secondary/80 cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 메타 정보 */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {/* 작성자 */}
                <Link
                  href={`/profile/${author.username}`}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <img
                    src={author.avatarUrl}
                    alt={author.displayName || author.username}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="font-medium">
                    {author.displayName || author.username}
                  </span>
                  {author.reputation > 100 && (
                    <span className="text-xs text-muted-foreground">
                      ({author.reputation})
                    </span>
                  )}
                </Link>

                <span className="text-muted-foreground/50">•</span>

                {/* 댓글 수 */}
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{commentCount}</span>
                </div>

                <span className="text-muted-foreground/50">•</span>

                {/* 조회수 */}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{viewCount}</span>
                </div>

                <span className="text-muted-foreground/50">•</span>

                {/* 작성 시간 */}
                <time dateTime={createdAt}>
                  {new Date(createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
