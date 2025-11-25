import { prisma } from './prisma';
import crypto from 'crypto';

export type WebhookEvent = 'POST_CREATED' | 'POST_UPDATED' | 'POST_DELETED';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: {
    postId: string;
    title?: string;
    content?: string;
    authorId?: string;
    categoryId?: string;
    [key: string]: unknown;
  };
}

/**
 * HMAC 서명 생성
 */
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * 단일 웹훅 전송
 */
async function sendWebhookRequest(
  url: string,
  payload: WebhookPayload,
  secret: string
): Promise<boolean> {
  try {
    const payloadString = JSON.stringify(payload);
    const signature = generateSignature(payloadString, secret);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': payload.event,
      },
      body: payloadString,
      signal: AbortSignal.timeout(10000), // 10초 타임아웃
    });

    if (!response.ok) {
      console.error(`Webhook failed: ${url} returned ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Webhook error for ${url}:`, error);
    return false;
  }
}

/**
 * 이벤트에 대한 모든 활성 웹훅 트리거
 */
export async function triggerWebhooks(
  event: WebhookEvent,
  data: WebhookPayload['data']
): Promise<void> {
  try {
    // 해당 이벤트를 구독하는 활성 웹훅 조회
    const subscriptions = await prisma.webhookSubscription.findMany({
      where: {
        isActive: true,
        events: {
          has: event,
        },
      },
    });

    if (subscriptions.length === 0) {
      return;
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    // 모든 웹훅 병렬 전송
    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        sendWebhookRequest(sub.url, payload, sub.secret)
      )
    );

    // 결과 처리: 실패 카운트 업데이트
    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      const result = results[i];

      if (result.status === 'fulfilled' && result.value === true) {
        // 성공: lastTriggeredAt 업데이트, failureCount 리셋
        await prisma.webhookSubscription.update({
          where: { id: subscription.id },
          data: {
            lastTriggeredAt: new Date(),
            failureCount: 0,
          },
        });
      } else {
        // 실패: failureCount 증가
        await prisma.webhookSubscription.update({
          where: { id: subscription.id },
          data: {
            failureCount: {
              increment: 1,
            },
          },
        });

        // 연속 실패 5회 이상 시 자동 비활성화
        if (subscription.failureCount + 1 >= 5) {
          await prisma.webhookSubscription.update({
            where: { id: subscription.id },
            data: {
              isActive: false,
            },
          });
          console.warn(
            `Webhook ${subscription.id} disabled after 5 consecutive failures`
          );
        }
      }
    }
  } catch (error) {
    console.error('Error triggering webhooks:', error);
    // 웹훅 실패는 메인 로직에 영향을 주지 않도록 로그만 남김
  }
}

/**
 * 웹훅 서명 검증 (외부에서 받은 웹훅 검증용)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
