import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * PATCH /api/notifications/read-all
 * 모든 알림을 읽음 처리 (인증 필요)
 */
export async function PATCH() {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    // 사용자의 모든 읽지 않은 알림을 읽음 처리
    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return successResponse({
      message: '모든 알림을 읽음 처리했습니다',
      count: result.count,
    });
  } catch (error) {
    console.error('PATCH /api/notifications/read-all error:', error);
    return serverErrorResponse('알림 일괄 읽음 처리 중 오류가 발생했습니다', error);
  }
}
