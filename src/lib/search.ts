/**
 * 바이브코딩 커뮤니티 플랫폼 - 클라이언트 검색 로직
 *
 * Phase 3 Week 9: 검색 & 필터링
 * 제목, 본문, 태그 검색 및 정렬 기능
 *
 * @see docs/TASKS.md Week 9 Task 9.1
 */

import type { PostWithAuthor, PostSortOption, PostFilterOptions } from './types';

// ─────────────────────────────────────────────────────────────────
// Search Functions
// ─────────────────────────────────────────────────────────────────

/**
 * 검색어가 텍스트에 포함되어 있는지 확인 (대소문자 무시)
 */
function includesIgnoreCase(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * 게시글 검색
 *
 * @param posts - 검색할 게시글 목록
 * @param keyword - 검색 키워드
 * @returns 검색 결과 (제목, 본문, 태그 매칭)
 *
 * @example
 * ```ts
 * const results = searchPosts(allPosts, 'react hooks');
 * ```
 */
export function searchPosts(posts: PostWithAuthor[], keyword: string): PostWithAuthor[] {
  if (!keyword.trim()) {
    return posts;
  }

  const trimmedKeyword = keyword.trim();

  return posts.filter((post) => {
    // 제목 검색
    if (includesIgnoreCase(post.title, trimmedKeyword)) {
      return true;
    }

    // 본문 검색 (HTML 태그 제거 후)
    const contentText = post.content.replace(/<[^>]*>/g, '');
    if (includesIgnoreCase(contentText, trimmedKeyword)) {
      return true;
    }

    // 태그 검색
    if (post.tags.some((tag) => includesIgnoreCase(tag, trimmedKeyword))) {
      return true;
    }

    // 작성자 이름 검색
    if (
      includesIgnoreCase(post.author.username, trimmedKeyword) ||
      (post.author.displayName && includesIgnoreCase(post.author.displayName, trimmedKeyword))
    ) {
      return true;
    }

    return false;
  });
}

/**
 * 게시글 필터링
 *
 * @param posts - 필터링할 게시글 목록
 * @param filters - 필터 옵션
 * @returns 필터링된 게시글
 *
 * @example
 * ```ts
 * const filtered = filterPosts(posts, {
 *   categoryId: 'general',
 *   tags: ['react', 'typescript'],
 *   period: 'week'
 * });
 * ```
 */
export function filterPosts(
  posts: PostWithAuthor[],
  filters: PostFilterOptions
): PostWithAuthor[] {
  let filtered = [...posts];

  // 카테고리 필터
  if (filters.categoryId) {
    filtered = filtered.filter((post) => post.categoryId === filters.categoryId);
  }

  // 태그 필터 (OR 조건: 하나라도 일치하면 포함)
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((post) =>
      filters.tags!.some((tag) => post.tags.includes(tag))
    );
  }

  // 작성자 필터
  if (filters.authorId) {
    filtered = filtered.filter((post) => post.authorId === filters.authorId);
  }

  // 기간 필터
  if (filters.period && filters.period !== 'all') {
    const now = new Date();
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    }[filters.period];

    filtered = filtered.filter((post) => {
      const postDate = new Date(post.createdAt);
      return now.getTime() - postDate.getTime() <= periodMs;
    });
  }

  return filtered;
}

/**
 * 게시글 정렬
 *
 * @param posts - 정렬할 게시글 목록
 * @param sortOption - 정렬 옵션
 * @returns 정렬된 게시글
 *
 * @example
 * ```ts
 * const sorted = sortPosts(posts, 'popular');
 * ```
 */
export function sortPosts(
  posts: PostWithAuthor[],
  sortOption: PostSortOption
): PostWithAuthor[] {
  const sorted = [...posts];

  switch (sortOption) {
    case 'popular':
      // 인기순 (upvotes - downvotes)
      return sorted.sort((a, b) => {
        const scoreA = a.upvotes - a.downvotes;
        const scoreB = b.upvotes - b.downvotes;
        return scoreB - scoreA;
      });

    case 'recent':
      // 최신순
      return sorted.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    case 'comments':
      // 댓글 많은 순
      return sorted.sort((a, b) => b.commentCount - a.commentCount);

    case 'views':
      // 조회수 많은 순
      return sorted.sort((a, b) => b.viewCount - a.viewCount);

    default:
      return sorted;
  }
}

/**
 * 통합 검색 & 필터링 & 정렬
 *
 * @param posts - 게시글 목록
 * @param keyword - 검색 키워드
 * @param filters - 필터 옵션
 * @param sortOption - 정렬 옵션
 * @returns 최종 결과
 *
 * @example
 * ```ts
 * const results = searchAndFilter(allPosts, 'react', {
 *   categoryId: 'tips',
 *   period: 'week'
 * }, 'popular');
 * ```
 */
export function searchAndFilter(
  posts: PostWithAuthor[],
  keyword: string,
  filters: PostFilterOptions = {},
  sortOption: PostSortOption = 'recent'
): PostWithAuthor[] {
  // 1. 검색
  let results = searchPosts(posts, keyword);

  // 2. 필터링
  results = filterPosts(results, filters);

  // 3. 정렬
  results = sortPosts(results, sortOption);

  return results;
}

// ─────────────────────────────────────────────────────────────────
// Highlight Utilities
// ─────────────────────────────────────────────────────────────────

/**
 * 텍스트 내 검색어 하이라이트 (HTML)
 *
 * @param text - 원본 텍스트
 * @param keyword - 하이라이트할 키워드
 * @returns HTML 문자열 (React dangerouslySetInnerHTML 사용)
 *
 * @example
 * ```tsx
 * <span dangerouslySetInnerHTML={{ __html: highlightKeyword(post.title, keyword) }} />
 * ```
 */
export function highlightKeyword(text: string, keyword: string): string {
  if (!keyword.trim()) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
}

/**
 * 정규표현식 특수문자 이스케이프
 */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 검색 결과 요약 생성 (본문에서 검색어 주변 텍스트 추출)
 *
 * @param content - 본문 (HTML 가능)
 * @param keyword - 검색어
 * @param maxLength - 최대 길이
 * @returns 요약 텍스트
 *
 * @example
 * ```ts
 * const snippet = getSearchSnippet(post.content, 'react hooks', 150);
 * // "...React Hooks를 사용하면 함수형 컴포넌트에서도..."
 * ```
 */
export function getSearchSnippet(
  content: string,
  keyword: string,
  maxLength: number = 200
): string {
  // HTML 태그 제거
  const plainText = content.replace(/<[^>]*>/g, '');

  if (!keyword.trim()) {
    return plainText.slice(0, maxLength) + (plainText.length > maxLength ? '...' : '');
  }

  const lowerContent = plainText.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerContent.indexOf(lowerKeyword);

  if (index === -1) {
    // 검색어가 없으면 처음부터
    return plainText.slice(0, maxLength) + (plainText.length > maxLength ? '...' : '');
  }

  // 검색어 주변 텍스트 추출
  const halfLength = Math.floor(maxLength / 2);
  const start = Math.max(0, index - halfLength);
  const end = Math.min(plainText.length, index + keyword.length + halfLength);

  let snippet = plainText.slice(start, end);

  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < plainText.length) {
    snippet = snippet + '...';
  }

  return snippet;
}

// ─────────────────────────────────────────────────────────────────
// Q&A Specific Filters
// ─────────────────────────────────────────────────────────────────

/**
 * Q&A 질문 필터링
 *
 * @param posts - Q&A 질문 목록 (category.hasAnswers === true)
 * @param filter - 필터 타입
 * @returns 필터링된 질문
 */
export function filterQuestions(
  posts: PostWithAuthor[],
  filter: 'all' | 'unanswered' | 'accepted'
): PostWithAuthor[] {
  // Q&A 카테고리는 category.hasAnswers로 판별
  const questions = posts;

  switch (filter) {
    case 'unanswered':
      // 답변이 없는 질문 (댓글 수 0)
      return questions.filter((q) => q.commentCount === 0);

    case 'accepted':
      // 채택된 답변이 있는 질문
      // 실제 구현에서는 Answer 모델의 isAccepted를 체크해야 함
      // 여기서는 댓글이 5개 이상인 경우로 임시 처리
      return questions.filter((q) => q.commentCount >= 5);

    case 'all':
    default:
      return questions;
  }
}

// ─────────────────────────────────────────────────────────────────
// Tag Utilities
// ─────────────────────────────────────────────────────────────────

/**
 * 모든 게시글에서 태그 추출 및 빈도수 계산
 *
 * @param posts - 게시글 목록
 * @returns 태그와 빈도수 맵
 *
 * @example
 * ```ts
 * const tagCounts = getTagCounts(posts);
 * // { 'react': 15, 'typescript': 12, ... }
 * ```
 */
export function getTagCounts(posts: PostWithAuthor[]): Record<string, number> {
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return tagCounts;
}

/**
 * 인기 태그 목록 반환
 *
 * @param posts - 게시글 목록
 * @param limit - 반환할 태그 수
 * @returns 인기 태그 배열 (빈도수 순)
 */
export function getPopularTags(posts: PostWithAuthor[], limit: number = 10): string[] {
  const tagCounts = getTagCounts(posts);

  return Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, limit)
    .map(([tag]) => tag);
}
