import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-middleware';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH /api/admin/webhooks/outbound/[id]
 * 관리자 전용 웹훅 구독 활성화/비활성화
 *
 * Body:
 * - isActive: boolean (필수)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return validationErrorResponse('isActive 필드가 필요합니다 (true 또는 false).');
    }

    const subscription = await prisma.webhookSubscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return notFoundResponse('웹훅 구독을 찾을 수 없습니다');
    }

    const updated = await prisma.webhookSubscription.update({
      where: { id },
      data: {
        isActive,
        // 활성화 시 failureCount 리셋
        ...(isActive && { failureCount: 0 }),
      },
    });

    return successResponse({ subscription: updated });
  } catch (error) {
    console.error(`PATCH /api/admin/webhooks/outbound/${(await context.params).id} error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
      return validationErrorResponse(errorMessage);
    }

    return serverErrorResponse('웹훅 업데이트 중 오류가 발생했습니다', error);
  }
}

/**
 * DELETE /api/admin/webhooks/outbound/[id]
 * 관리자 전용 웹훅 구독 삭제
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const subscription = await prisma.webhookSubscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return notFoundResponse('웹훅 구독을 찾을 수 없습니다');
    }

    await prisma.webhookSubscription.delete({
      where: { id },
    });

    return successResponse({ success: true, message: '웹훅이 삭제되었습니다' });
  } catch (error) {
    console.error(`DELETE /api/admin/webhooks/outbound/${(await context.params).id} error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
      return validationErrorResponse(errorMessage);
    }

    return serverErrorResponse('웹훅 삭제 중 오류가 발생했습니다', error);
  }
}
