/**
 * Data Access Layer - Categories
 * 카테고리 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { Category, CategoryType, Prisma } from '@/generated/prisma';

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
 */
export async function getAllCategories(categoryType?: CategoryType): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: categoryType ? { categoryType } : undefined,
      orderBy: {
        postCount: 'desc',
      },
    });

    return categories || [];
  } catch (error) {
    console.error('[DAL] getAllCategories error:', error);
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
    throw new Error('카테고리별 게시글 수 조회 중 오류가 발생했습니다');
  }
}
