/**
 * 바이브코딩 커뮤니티 플랫폼 - 검색 결과 페이지
 *
 * Phase 3 Week 9 Task 9.1: 클라이언트 사이드 검색
 * 제목, 본문, 태그 검색 및 결과 표시
 *
 * @see docs/TASKS.md Week 9 Task 9.1
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, Suspense } from 'react';
import { usePosts, useCategories } from '@/lib/store';
import { searchAndFilter, highlightKeyword, getSearchSnippet } from '@/lib/search';
import type { PostSortOption, PostFilterOptions } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, TrendingUp, Clock, MessageSquare, Eye } from 'lucide-react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────
// Search Results Page
// ─────────────────────────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get('q') || '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [sortOption, setSortOption] = useState<PostSortOption>('recent');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<'all' | 'day' | 'week' | 'month'>('all');

  const allPosts = usePosts();
  const categories = useCategories();

  // ===== 검색 & 필터링 & 정렬 =====
  const results = useMemo(() => {
    const filters: PostFilterOptions = {
      categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
      period: periodFilter,
    };

    return searchAndFilter(allPosts, keyword, filters, sortOption);
  }, [allPosts, keyword, categoryFilter, periodFilter, sortOption]);

  // ===== 검색 실행 =====
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // URL 업데이트는 생략 (클라이언트 검색이므로)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ===== 검색 헤더 ===== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">검색</h1>

        {/* 검색 입력 */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="제목, 본문, 태그, 작성자 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">검색</Button>
        </form>

        {/* 검색 결과 수 */}
        {keyword && (
          <p className="text-sm text-muted-foreground">
            &quot;{keyword}&quot;에 대한 검색 결과 <strong>{results.length}개</strong>
          </p>
        )}
      </div>

      {/* ===== 필터 & 정렬 ===== */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* 카테고리 필터 */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 기간 필터 */}
        <Select
          value={periodFilter}
          onValueChange={(v) => setPeriodFilter(v as 'all' | 'day' | 'week' | 'month')}
        >
          <SelectTrigger className="w-[150px]">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue placeholder="기간" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 기간</SelectItem>
            <SelectItem value="day">오늘</SelectItem>
            <SelectItem value="week">이번 주</SelectItem>
            <SelectItem value="month">이번 달</SelectItem>
          </SelectContent>
        </Select>

        {/* 정렬 */}
        <Select value={sortOption} onValueChange={(v) => setSortOption(v as PostSortOption)}>
          <SelectTrigger className="w-[150px]">
            <TrendingUp className="h-4 w-4 mr-2" />
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">인기순</SelectItem>
            <SelectItem value="recent">최신순</SelectItem>
            <SelectItem value="comments">댓글순</SelectItem>
            <SelectItem value="views">조회순</SelectItem>
          </SelectContent>
        </Select>

        {/* 필터 초기화 */}
        {(categoryFilter !== 'all' || periodFilter !== 'all' || sortOption !== 'recent') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategoryFilter('all');
              setPeriodFilter('all');
              setSortOption('recent');
            }}
          >
            필터 초기화
          </Button>
        )}
      </div>

      {/* ===== 검색 결과 ===== */}
      {results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-2">
              다른 키워드로 검색해 보세요.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((post) => {
            const category = categories.find((c) => c.id === post.categoryId);
            const snippet = getSearchSnippet(post.content, keyword, 150);

            return (
              <Card key={post.id} className="hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {/* 투표 점수 */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <div className="text-sm font-semibold">
                        {post.upvotes - post.downvotes}
                      </div>
                      <div className="text-xs text-muted-foreground">투표</div>
                    </div>

                    {/* 게시글 정보 */}
                    <div className="flex-1 min-w-0">
                      {/* 카테고리 & 태그 */}
                      <div className="flex items-center gap-2 mb-2">
                        {category && (
                          <Badge variant="outline">
                            {category.icon} {category.name}
                          </Badge>
                        )}
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* 제목 (하이라이트) */}
                      <Link
                        href={`/community/${category?.slug}/${post.id}`}
                        className="hover:underline"
                      >
                        <h3
                          className="text-xl font-semibold mb-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightKeyword(post.title, keyword),
                          }}
                        />
                      </Link>

                      {/* 본문 미리보기 (하이라이트) */}
                      <p
                        className="text-sm text-muted-foreground mb-3 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightKeyword(snippet, keyword),
                        }}
                      />

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.commentCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.viewCount}</span>
                        </div>
                        <span>•</span>
                        <Link
                          href={`/profile/${post.author.username}`}
                          className="hover:underline"
                        >
                          {post.author.displayName || post.author.username}
                        </Link>
                        <span>•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">검색 중...</div>}>
      <SearchContent />
    </Suspense>
  );
}
