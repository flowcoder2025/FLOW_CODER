import { getAllCategories } from '@/lib/data-access/categories';
import {
  successResponse,
  serverErrorResponse,
} from '@/lib/api-response';

// Route Segment Config - 5분마다 재검증
export const revalidate = 300;

/**
 * GET /api/categories
 * 카테고리 목록 조회
 *
 * 캐싱: 5분 CDN 캐싱 + 1분 stale-while-revalidate
 */
export async function GET() {
  try {
    const categories = await getAllCategories();
    return successResponse(
      { categories },
      200,
      {
        sMaxAge: 300,              // CDN 5분 캐싱
        maxAge: 60,                // 브라우저 1분 캐싱
        staleWhileRevalidate: 60,  // 재검증 중 1분간 stale 응답 허용
      }
    );
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return serverErrorResponse('카테고리 목록 조회 중 오류가 발생했습니다', error);
  }
}
