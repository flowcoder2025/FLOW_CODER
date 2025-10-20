'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { mockCategories, getPostsByCategory, mockPosts } from '@/lib/mock-data';
import type { PostSortOption, PostFilterOptions, PostWithAuthor } from '@/lib/types';

/**
 * 커뮤니티 메인 페이지
 *
 * 기능:
 * - 카테고리 카드 표시
 * - 검색 바 (SearchBar)
 * - 필터 바 (FilterBar): 카테고리, 타입, 정렬, 태그
 * - 필터링된 게시글 목록 표시
 */
export default function CommunityPage() {
  // 검색 & 필터 상태
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<PostFilterOptions>({});
  const [sortBy, setSortBy] = useState<PostSortOption>('recent');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 필터링 & 정렬 로직
  const filteredPosts = useMemo(() => {
    let posts: PostWithAuthor[] = mockPosts;

    // 검색어 필터링
    if (keyword) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword.toLowerCase()) ||
          post.content.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (filters.categoryId) {
      posts = posts.filter((post) => post.categoryId === filters.categoryId);
    }

    // 게시글 타입 필터링
    if (filters.postType) {
      posts = posts.filter((post) => post.postType === filters.postType);
    }

    // 태그 필터링
    if (selectedTags.length > 0) {
      posts = posts.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      );
    }

    // 정렬
    posts.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'comments':
          return b.commentCount - a.commentCount;
        case 'views':
          return b.viewCount - a.viewCount;
        default:
          return 0;
      }
    });

    return posts;
  }, [keyword, filters, selectedTags, sortBy]);

  // 필터 초기화
  const handleReset = () => {
    setKeyword('');
    setFilters({});
    setSortBy('recent');
    setSelectedTags([]);
  };

  // 태그 제거
  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">커뮤니티</h1>
        <p className="text-muted-foreground">
          바이브코딩 사용자들과 자유롭게 소통하고 지식을 공유하세요
        </p>
      </div>

      {/* 카테고리 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {mockCategories.map((category) => {
          const categoryPosts = getPostsByCategory(category.id);
          const recentPost = categoryPosts[0];

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

      {/* 검색 & 필터 섹션 */}
      <div className="space-y-4 mb-8">
        <SearchBar
          onSearch={setKeyword}
          placeholder="게시글 검색..."
          liveSearch
        />
        <FilterBar
          filters={filters}
          sortBy={sortBy}
          selectedTags={selectedTags}
          onFilterChange={setFilters}
          onSortChange={setSortBy}
          onTagRemove={handleTagRemove}
          onReset={handleReset}
        />
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                검색 결과가 없습니다. 다른 검색어나 필터를 시도해보세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
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
                        <Badge variant="outline">
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
                              className="text-xs cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!selectedTags.includes(tag)) {
                                  setSelectedTags((prev) => [...prev, tag]);
                                }
                              }}
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
          ))
        )}
      </div>
    </div>
  );
}
