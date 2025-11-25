import { requireModerator } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * GET /api/admin/stats
 * 관리자 대시보드 통계 데이터 조회 (모더레이터 이상 권한 필요)
 *
 * Response:
 * - totalUsers: 총 사용자 수
 * - totalPosts: 총 게시글 수
 * - totalComments: 총 댓글 수
 * - newUsersToday: 오늘의 신규 가입자 (최근 24시간)
 */
export async function GET() {
  try {
    // 모더레이터 이상 권한 확인
    await requireModerator();

    // 24시간 전 시각 계산
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Prisma 병렬 쿼리로 성능 최적화
    const [totalUsers, totalPosts, totalComments, newUsersToday] =
      await Promise.all([
        // 총 사용자 수
        prisma.user.count(),

        // 총 게시글 수
        prisma.post.count(),

        // 총 댓글 수
        prisma.comment.count(),

        // 오늘의 신규 가입자 (최근 24시간 동안 가입한 사용자)
        prisma.user.count({
          where: {
            createdAt: {
              gte: twentyFourHoursAgo,
            },
          },
        }),
      ]);

    return successResponse({
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        newUsersToday,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 권한 에러 처리
    if (errorMessage.includes('Unauthorized')) {
      return unauthorizedResponse(errorMessage);
    }
    if (errorMessage.includes('Forbidden')) {
      return forbiddenResponse(errorMessage);
    }

    return serverErrorResponse('관리자 통계 조회 중 오류가 발생했습니다', error);
  }
}
