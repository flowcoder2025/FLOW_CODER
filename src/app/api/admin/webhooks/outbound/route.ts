import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-middleware';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';
import crypto from 'crypto';

/**
 * GET /api/admin/webhooks/outbound
 * 관리자 전용 웹훅 구독 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const subscriptions = await prisma.webhookSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return successResponse({ subscriptions });
  } catch (error: any) {
    console.error('GET /api/admin/webhooks/outbound error:', error);

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return validationErrorResponse(error.message);
    }

    return serverErrorResponse('웹훅 목록 조회 중 오류가 발생했습니다', error);
  }
}

/**
 * POST /api/admin/webhooks/outbound
 * 관리자 전용 새 웹훅 구독 생성
 *
 * Body:
 * - url: string (필수) - 웹훅을 받을 URL
 * - events: WebhookEvent[] (필수) - 구독할 이벤트 목록
 * - description: string (선택)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { url, events, description } = body;

    // 필수 필드 검증
    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return validationErrorResponse('url과 events는 필수입니다.');
    }

    // URL 형식 검증
    try {
      new URL(url);
    } catch {
      return validationErrorResponse('유효한 URL을 입력해주세요.');
    }

    // 이벤트 타입 검증
    const validEvents = ['POST_CREATED', 'POST_UPDATED', 'POST_DELETED'];
    for (const event of events) {
      if (!validEvents.includes(event)) {
        return validationErrorResponse(
          `유효하지 않은 이벤트: ${event}. 가능한 값: ${validEvents.join(', ')}`
        );
      }
    }

    // 시크릿 키 생성 (32바이트 랜덤)
    const secret = crypto.randomBytes(32).toString('hex');

    // 웹훅 구독 생성
    const subscription = await prisma.webhookSubscription.create({
      data: {
        url,
        secret,
        events,
        description,
        isActive: true,
      },
    });

    return successResponse({ subscription }, 201);
  } catch (error: any) {
    console.error('POST /api/admin/webhooks/outbound error:', error);

    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return validationErrorResponse(error.message);
    }

    return serverErrorResponse('웹훅 생성 중 오류가 발생했습니다', error);
  }
}
