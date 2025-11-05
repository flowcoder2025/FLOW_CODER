/**
 * Data Access Layer - Categories
 * 카테고리 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';

/**
 * 모든 카테고리 조회
 */
export async function getAllCategories() {
  return await prisma.category.findMany({
    orderBy: {
      postCount: 'desc',
    },
  });
}

/**
 * slug로 카테고리 조회
 */
export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
  });
}

/**
 * 카테고리 ID로 조회
 */
export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: { id },
  });
}

/**
 * 카테고리별 게시글 수 포함 조회
 */
export async function getCategoriesWithPostCount() {
  return await prisma.category.findMany({
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
}
