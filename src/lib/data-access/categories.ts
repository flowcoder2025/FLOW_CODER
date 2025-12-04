/**
 * Data Access Layer - Categories
 * 카테고리 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { Category, Prisma } from '@/generated/prisma';
import { unstable_cache } from 'next/cache';

/**
 * 반환 타입 정의
 */
export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: {
        posts: true;
      };
    };
  };
}>;

/**
 * 내부 카테고리 조회 함수 (캐싱 없음)
 */
async function fetchAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        postCount: 'desc',
      },
    });

    return categories || [];
  } catch (error) {
    console.error('[DAL] getAllCategories error:', error);
    // 빌드 시 DB 연결 실패 시 빈 배열 반환
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('[DAL] getAllCategories: 빌드 중 DB 연결 실패, 빈 배열 반환');
      return [];
    }
    throw new Error('카테고리 목록 조회 중 오류가 발생했습니다');
  }
}

/**
 * 모든 카테고리 조회 (5분 캐싱)
 * Layout에서 매 요청마다 호출되므로 캐싱으로 성능 최적화
 */
export const getAllCategories = unstable_cache(
  fetchAllCategories,
  ['all-categories'],
  {
    revalidate: 300, // 5분마다 재검증
    tags: ['categories'],
  }
);

/**
 * 내부 slug로 카테고리 조회 함수 (캐싱 없음)
 */
async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    return category;
  } catch (error) {
    console.error('[DAL] getCategoryBySlug error:', error);
    throw new Error(`카테고리 조회 중 오류가 발생했습니다: ${slug}`);
  }
}

/**
 * slug로 카테고리 조회 (5분 캐싱)
 * 카테고리는 자주 변경되지 않으므로 캐싱으로 성능 최적화
 */
export const getCategoryBySlug = (slug: string) =>
  unstable_cache(
    () => fetchCategoryBySlug(slug),
    [`category-slug-${slug}`],
    {
      revalidate: 300, // 5분마다 재검증
      tags: ['categories', `category-${slug}`],
    }
  )();

/**
 * 카테고리 ID로 조회
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    return category;
  } catch (error) {
    console.error('[DAL] getCategoryById error:', error);
    throw new Error(`카테고리 ID 조회 중 오류가 발생했습니다: ${id}`);
  }
}

/**
 * 카테고리별 게시글 수 포함 조회
 */
export async function getCategoriesWithPostCount(): Promise<CategoryWithCount[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        postCount: 'desc',
      },
    });

    return categories || [];
  } catch (error) {
    console.error('[DAL] getCategoriesWithPostCount error:', error);
    // 빌드 시 DB 연결 실패 시 빈 배열 반환
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('[DAL] getCategoriesWithPostCount: 빌드 중 DB 연결 실패, 빈 배열 반환');
      return [];
    }
    throw new Error('카테고리별 게시글 수 조회 중 오류가 발생했습니다');
  }
}
