'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PostWithAuthor } from '@/lib/types';

/**
 * 뉴스 카드 컴포넌트
 *
 * 기능:
 * - 커버 이미지 표시
 * - 뉴스 제목, 미리보기 표시
 * - 카테고리 배지 (색상별 구분)
 * - 조회수, 댓글수, 작성일 표시
 * - 작성자 정보 (관리자/모더레이터)
 */

export interface NewsCardProps {
  /** 뉴스 게시글 데이터 */
  news: PostWithAuthor;
}

export function NewsCard({ news }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);

  // 날짜 포맷팅 메모이제이션 (하이드레이션 안정성)
  const formattedDate = useMemo(() =>
    new Date(news.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    [news.createdAt]
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-0">
          {/* 좌측: 커버 이미지 */}
          <Link
            href={`/news/${news.id}`}
            className="relative aspect-video md:aspect-[4/3] md:w-72 overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none shrink-0 group"
          >
            {news.coverImageUrl && !imageError ? (
              <Image
                src={news.coverImageUrl}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 288px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-4xl">{news.category.icon || '📰'}</span>
              </div>
            )}
          </Link>

          {/* 우측: 콘텐츠 */}
          <div className="flex-1 p-6">
            {/* 카테고리 배지 */}
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className={`text-xs ${
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
                <Badge variant="secondary" className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                  📌 고정
                </Badge>
              )}
            </div>

            {/* 제목 */}
            <Link href={`/news/${news.id}`} className="block group mb-2">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                {news.title}
              </h3>
            </Link>

            {/* 내용 미리보기 */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {news.content}
            </p>

            {/* 하단: 메타 정보 */}
            <div className="flex items-center justify-between gap-4 flex-wrap text-xs text-muted-foreground">
              {/* 작성자 & 날짜 */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${news.author.username}`}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Image
                    src={news.author.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={news.author.displayName || news.author.username}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="font-medium">
                    {news.author.displayName || news.author.username}
                  </span>
                </Link>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={news.createdAt}>
                    {formattedDate}
                  </time>
                </div>
              </div>

              {/* 통계 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{news.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{news.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
