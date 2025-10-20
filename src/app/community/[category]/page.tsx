'use client';

import { use, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Clock, MessageSquare, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostCard } from '@/components/PostCard';
import { getCategoryBySlug, getPostsByCategory } from '@/lib/mock-data';
import type { PostWithAuthor } from '@/lib/types';

/**
 * 카테고리별 게시글 목록 페이지
 *
 * 동적 라우트: /community/[category]
 * Next.js 15: params는 Promise이므로 use() 훅으로 unwrap
 */

type SortOption = 'popular' | 'recent' | 'comments';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = use(params);

  // 카테고리 정보 조회
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  // 게시글 목록 조회
  const allPosts = getPostsByCategory(category.id);

  // 정렬 상태
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;

  // 정렬된 게시글 목록
  const sortedPosts = useMemo(() => {
    const posts = [...allPosts];

    // 고정 게시글 우선
    const pinnedPosts = posts.filter((p) => p.isPinned);
    const regularPosts = posts.filter((p) => !p.isPinned);

    // 정렬
    const sortFn = (a: PostWithAuthor, b: PostWithAuthor) => {
      switch (sortOption) {
        case 'popular':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'comments':
          return b.commentCount - a.commentCount;
        default:
          return 0;
      }
    };

    regularPosts.sort(sortFn);

    return [...pinnedPosts, ...regularPosts];
  }, [allPosts, sortOption]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 카테고리 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">{category.icon}</span>
          <div>
            <h1 className="text-4xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground mt-1">{category.description}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{allPosts.length}개</span>의 게시글
        </div>
      </div>

      {/* 툴바: 정렬 & 새 글 쓰기 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* 정렬 옵션 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">정렬:</span>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>인기순</span>
                </div>
              </SelectItem>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>최신순</span>
                </div>
              </SelectItem>
              <SelectItem value="comments">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>댓글 많은 순</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
        <div className="space-y-4">
          {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} showCategory={false} />
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // 첫 페이지, 마지막 페이지, 현재 페이지 주변만 표시
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
