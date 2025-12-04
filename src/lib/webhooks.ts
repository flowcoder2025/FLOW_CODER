import { prisma } from './prisma';
import crypto from 'crypto';

export type WebhookEvent = 'POST_CREATED' | 'POST_UPDATED' | 'POST_DELETED';
export type WebhookType = 'GENERIC' | 'DISCORD' | 'SLACK';

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

// Discord 웹훅 페이로드 형식
interface DiscordWebhookPayload {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    footer?: {
      text: string;
    };
    timestamp?: string;
  }>;
}

// Slack 웹훅 페이로드 형식
interface SlackWebhookPayload {
  text?: string;
  blocks?: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

/**
 * 이벤트 타입에 따른 색상 (Discord embed용)
 */
function getEventColor(event: WebhookEvent): number {
  switch (event) {
    case 'POST_CREATED':
      return 0x22c55e; // green
    case 'POST_UPDATED':
      return 0x3b82f6; // blue
    case 'POST_DELETED':
      return 0xef4444; // red
    default:
      return 0x6b7280; // gray
  }
}

/**
 * 이벤트 타입에 따른 한글 레이블
 */
function getEventLabel(event: WebhookEvent): string {
  switch (event) {
    case 'POST_CREATED':
      return '새 게시글 작성';
    case 'POST_UPDATED':
      return '게시글 수정';
    case 'POST_DELETED':
      return '게시글 삭제';
    default:
      return event;
  }
}

/**
 * Discord 웹훅 페이로드로 변환
 */
function toDiscordPayload(payload: WebhookPayload): DiscordWebhookPayload {
  const { event, timestamp, data } = payload;

  return {
    embeds: [
      {
        title: `📢 ${getEventLabel(event)}`,
        description: data.title ? `**${data.title}**` : undefined,
        color: getEventColor(event),
        fields: [
          ...(data.content
            ? [
                {
                  name: '내용 미리보기',
                  value: data.content.length > 200
                    ? data.content.substring(0, 200) + '...'
                    : data.content,
                  inline: false,
                },
              ]
            : []),
          {
            name: '게시글 ID',
            value: `\`${data.postId}\``,
            inline: true,
          },
        ],
        footer: {
          text: 'Flow Coder Webhook',
        },
        timestamp,
      },
    ],
  };
}

/**
 * Slack 웹훅 페이로드로 변환
 */
function toSlackPayload(payload: WebhookPayload): SlackWebhookPayload {
  const { event, data } = payload;

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📢 ${getEventLabel(event)}`,
        },
      },
      ...(data.title
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${data.title}*`,
              },
            },
          ]
        : []),
      ...(data.content
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  data.content.length > 200
                    ? data.content.substring(0, 200) + '...'
                    : data.content,
              },
            },
          ]
        : []),
      {
        type: 'context',
        fields: [
          {
            type: 'mrkdwn',
            text: `*게시글 ID:* \`${data.postId}\``,
          },
        ],
      },
    ],
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
 * 웹훅 타입에 따라 페이로드 변환
 */
function transformPayload(
  payload: WebhookPayload,
  type: WebhookType
): DiscordWebhookPayload | SlackWebhookPayload | WebhookPayload {
  switch (type) {
    case 'DISCORD':
      return toDiscordPayload(payload);
    case 'SLACK':
      return toSlackPayload(payload);
    default:
      return payload;
  }
}

/**
 * 단일 웹훅 전송
 */
async function sendWebhookRequest(
  url: string,
  payload: WebhookPayload,
  secret: string,
  type: WebhookType = 'GENERIC'
): Promise<boolean> {
  try {
    // 타입에 따라 페이로드 변환
    const transformedPayload = transformPayload(payload, type);
    const payloadString = JSON.stringify(transformedPayload);

    // Discord/Slack은 서명이 필요 없음
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Generic 타입만 서명 헤더 추가
    if (type === 'GENERIC') {
      const signature = generateSignature(payloadString, secret);
      headers['X-Webhook-Signature'] = signature;
      headers['X-Webhook-Event'] = payload.event;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: payloadString,
      signal: AbortSignal.timeout(10000), // 10초 타임아웃
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`Webhook failed: ${url} returned ${response.status}`, errorText);
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

    // 모든 웹훅 병렬 전송 (타입에 맞게 페이로드 변환)
    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        sendWebhookRequest(sub.url, payload, sub.secret, sub.type as WebhookType)
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
