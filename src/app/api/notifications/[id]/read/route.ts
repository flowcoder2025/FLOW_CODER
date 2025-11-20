import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH /api/notifications/[id]/read
 * 특정 알림을 읽음 처리 (인증 필요)
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    // 알림 존재 확인 및 권한 체크
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return notFoundResponse('알림을 찾을 수 없습니다');
    }

    // 본인의 알림인지 확인
    if (notification.userId !== session.user.id) {
      return unauthorizedResponse('본인의 알림만 수정할 수 있습니다');
    }

    // 이미 읽은 알림이면 바로 성공 응답
    if (notification.read) {
      return successResponse({ notification });
    }

    // 읽음 처리
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            displayName: true,
            image: true,
          },
        },
      },
    });

    return successResponse({ notification: updatedNotification });
  } catch (error) {
    console.error(`PATCH /api/notifications/${(await context.params).id}/read error:`, error);
    return serverErrorResponse('알림 읽음 처리 중 오류가 발생했습니다', error);
  }
}
