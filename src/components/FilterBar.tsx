'use client';

import { Filter, SortAsc, Tag, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PostSortOption, PostType, PostFilterOptions } from '@/lib/types';

/**
 * 필터 바 컴포넌트
 *
 * 기능:
 * - 카테고리 필터
 * - 정렬 옵션 (인기순, 최신순, 댓글순, 조회수순)
 * - 게시글 타입 필터
 * - 태그 필터 (다중 선택)
 */

interface FilterBarProps {
  /** 현재 필터 옵션 */
  filters: PostFilterOptions;
  /** 현재 정렬 옵션 */
  sortBy: PostSortOption;
  /** 선택된 태그 목록 */
  selectedTags: string[];
  /** 필터 변경 콜백 */
  onFilterChange: (filters: PostFilterOptions) => void;
  /** 정렬 변경 콜백 */
  onSortChange: (sort: PostSortOption) => void;
  /** 태그 추가 콜백 */
  onTagAdd?: (tag: string) => void;
  /** 태그 제거 콜백 */
  onTagRemove: (tag: string) => void;
  /** 모든 필터 초기화 콜백 */
  onReset: () => void;
}

// 정렬 옵션 레이블 매핑
const SORT_LABELS: Record<PostSortOption, string> = {
  popular: '인기순',
  recent: '최신순',
  comments: '댓글순',
  views: '조회수순',
};

// 게시글 타입 레이블 매핑
const POST_TYPE_LABELS: Record<PostType, string> = {
  DISCUSSION: '토론',
  QUESTION: '질문',
  SHOWCASE: '작품 공유',
  NEWS: '뉴스',
};

export function FilterBar({
  filters,
  sortBy,
  selectedTags,
  onFilterChange,
  onSortChange,
  onTagRemove,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.categoryId ||
    filters.postType ||
    selectedTags.length > 0 ||
    sortBy !== 'recent';

  return (
    <div className="space-y-4">
      {/* 필터 & 정렬 컨트롤 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 카테고리 필터 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filters.categoryId || 'all'}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                categoryId: value === 'all' ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              <SelectItem value="cat_general">자유게시판</SelectItem>
              <SelectItem value="cat_tips">팁 & 강좌</SelectItem>
              <SelectItem value="cat_showcase">작품 공유</SelectItem>
              <SelectItem value="cat_event">이벤트</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 게시글 타입 필터 */}
        <Select
          value={filters.postType || 'all'}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              postType: value === 'all' ? undefined : (value as PostType),
            })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="타입" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 타입</SelectItem>
            <SelectItem value="DISCUSSION">{POST_TYPE_LABELS.DISCUSSION}</SelectItem>
            <SelectItem value="QUESTION">{POST_TYPE_LABELS.QUESTION}</SelectItem>
            <SelectItem value="SHOWCASE">{POST_TYPE_LABELS.SHOWCASE}</SelectItem>
            <SelectItem value="NEWS">{POST_TYPE_LABELS.NEWS}</SelectItem>
          </SelectContent>
        </Select>

        {/* 정렬 옵션 */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as PostSortOption)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{SORT_LABELS.popular}</SelectItem>
              <SelectItem value="recent">{SORT_LABELS.recent}</SelectItem>
              <SelectItem value="comments">{SORT_LABELS.comments}</SelectItem>
              <SelectItem value="views">{SORT_LABELS.views}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            초기화
          </Button>
        )}
      </div>

      {/* 선택된 태그 표시 */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">태그:</span>
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="ml-1 hover:text-destructive transition-colors"
                aria-label={`${tag} 태그 제거`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
