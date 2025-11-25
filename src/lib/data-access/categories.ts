/**
 * Data Access Layer - Categories
 * 카테고리 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { Category, Prisma } from '@/generated/prisma';

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
 * 모든 카테고리 조회
 * 빌드 시 DB 연결 실패 시 빈 배열 반환 (정적 페이지 생성 지원)
 */
export async function getAllCategories(): Promise<Category[]> {
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
 * slug로 카테고리 조회
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
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
