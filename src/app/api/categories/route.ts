import { getAllCategories } from '@/lib/data-access/categories';
import {
  successResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * GET /api/categories
 * 카테고리 목록 조회
 */
export async function GET() {
  try {
    const categories = await getAllCategories();
    return successResponse({ categories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return serverErrorResponse('카테고리 목록 조회 중 오류가 발생했습니다', error);
  }
}
