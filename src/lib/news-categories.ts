/**
 * 뉴스 카테고리 상수
 *
 * NEWS 타입 게시글의 카테고리는 tags 배열에 저장되며,
 * 아래 카테고리 중 하나가 반드시 포함되어야 합니다.
 */

export const NEWS_CATEGORIES = [
  '공지',
  'IT 소식',
  '바이브코딩',
  '컬럼',
  '가이드',
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];

/**
 * tags 배열에서 NEWS_CATEGORIES 중 하나를 추출
 */
export function getNewsCategory(tags: string[]): string {
  const category = tags.find((tag) =>
    NEWS_CATEGORIES.includes(tag as NewsCategory)
  );

  return category || '공지'; // 기본값
}
