import { NextRequest, NextResponse } from 'next/server';
import { requireModerator } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

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
export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        newUsersToday,
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/stats error:', error);

    // 권한 에러 처리
    if (
      error.message?.includes('Unauthorized') ||
      error.message?.includes('Forbidden')
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
