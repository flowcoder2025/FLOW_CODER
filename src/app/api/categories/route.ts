import { NextRequest } from 'next/server';
import { getAllCategories } from '@/lib/data-access/categories';
import { CategoryType } from '@/generated/prisma';
import {
  successResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * GET /api/categories
 * 카테고리 목록 조회
 * Query params:
 *  - categoryType: 'COMMUNITY' | 'NEWS' (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryTypeParam = searchParams.get('categoryType');

    let categoryType: CategoryType | undefined;
    if (categoryTypeParam === 'COMMUNITY' || categoryTypeParam === 'NEWS') {
      categoryType = categoryTypeParam as CategoryType;
    }

    const categories = await getAllCategories(categoryType);
    return successResponse({ categories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return serverErrorResponse('카테고리 목록 조회 중 오류가 발생했습니다', error);
  }
}
