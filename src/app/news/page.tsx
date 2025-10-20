'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NewsCard } from '@/components/NewsCard';
import { mockPosts, mockCategories } from '@/lib/mock-data';

/**
 * 뉴스 목록 페이지
 *
 * 기능:
 * - NEWS 타입 게시글 목록 표시
 * - 카테고리별 필터링
 * - 날짜 내림차순 정렬
 */

export default function NewsPage() {
  // NEWS 카테고리만 필터링
  const newsCategories = mockCategories.filter((cat) =>
    cat.id.startsWith('news_')
  );

  // NEWS 타입 게시글만 필터링하고 날짜 내림차순 정렬
  const allNews = mockPosts
    .filter((post) => post.postType === 'NEWS')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // 선택된 카테고리 상태 관리 ('all' 또는 카테고리 ID)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 카테고리로 필터링된 뉴스
  const filteredNews =
    selectedCategory === 'all'
      ? allNews
      : allNews.filter((news) => news.categoryId === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">뉴스 & 공지</h1>
        <p className="text-muted-foreground">
          바이브코딩의 최신 소식과 공지사항을 확인하세요
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2"
            onClick={() => setSelectedCategory('all')}
          >
            📰 전체 ({allNews.length})
          </Badge>
          {newsCategories.map((category) => {
            const count = allNews.filter(
              (news) => news.categoryId === category.id
            ).length;
            return (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? 'default' : 'outline'
                }
                className={`cursor-pointer hover:bg-primary/90 transition-colors px-4 py-2 ${
                  selectedCategory === category.id
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
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.name} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* 뉴스 목록 */}
      {filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
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
