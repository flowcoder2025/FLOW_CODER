import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-middleware';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

type WebhookType = 'GENERIC' | 'DISCORD' | 'SLACK';

/**
 * Discord 테스트 페이로드 생성
 */
function createDiscordPayload() {
  return {
    embeds: [
      {
        title: '🧪 웹훅 연결 테스트',
        description: 'Flow Coder에서 Discord 웹훅 연결을 테스트합니다.',
        color: 0x5865f2, // Discord 브랜드 색상
        fields: [
          {
            name: '상태',
            value: '✅ 연결 성공',
            inline: true,
          },
          {
            name: '시간',
            value: new Date().toLocaleString('ko-KR'),
            inline: true,
          },
        ],
        footer: {
          text: 'Flow Coder Webhook Test',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Slack 테스트 페이로드 생성
 */
function createSlackPayload() {
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🧪 웹훅 연결 테스트',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Flow Coder에서 Slack 웹훅 연결을 테스트합니다.',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: '*상태:*\n✅ 연결 성공',
          },
          {
            type: 'mrkdwn',
            text: `*시간:*\n${new Date().toLocaleString('ko-KR')}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Flow Coder Webhook Test',
          },
        ],
      },
    ],
  };
}

/**
 * 일반 테스트 페이로드 생성
 */
function createGenericPayload() {
  return {
    event: 'WEBHOOK_TEST',
    timestamp: new Date().toISOString(),
    data: {
      message: '웹훅 연결 테스트입니다.',
      source: 'Flow_Coder Admin',
    },
  };
}

/**
 * POST /api/admin/webhooks/test
 * 웹훅 연결 테스트
 *
 * 지정된 URL에 테스트 페이로드를 전송하여 연결 상태를 확인합니다.
 *
 * Body:
 * - url: string (필수) - 테스트할 웹훅 URL
 * - type: 'GENERIC' | 'DISCORD' | 'SLACK' (선택, 기본: GENERIC)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { url, type = 'GENERIC' } = body as { url: string; type?: WebhookType };

    if (!url) {
      return validationErrorResponse('url은 필수입니다.');
    }

    // URL 형식 검증
    try {
      new URL(url);
    } catch {
      return validationErrorResponse('유효한 URL을 입력해주세요.');
    }

    // 타입 검증
    const validTypes: WebhookType[] = ['GENERIC', 'DISCORD', 'SLACK'];
    if (!validTypes.includes(type)) {
      return validationErrorResponse(
        `유효하지 않은 타입: ${type}. 가능한 값: ${validTypes.join(', ')}`
      );
    }

    // 타입에 따른 페이로드 생성
    let testPayload;
    switch (type) {
      case 'DISCORD':
        testPayload = createDiscordPayload();
        break;
      case 'SLACK':
        testPayload = createSlackPayload();
        break;
      default:
        testPayload = createGenericPayload();
    }

    // 테스트 요청 전송
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Generic 타입만 추가 헤더
    if (type === 'GENERIC') {
      headers['X-Webhook-Event'] = 'WEBHOOK_TEST';
      headers['X-Webhook-Test'] = 'true';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(10000), // 10초 타임아웃
    });

    if (response.ok) {
      return successResponse({
        success: true,
        statusCode: response.status,
        message: `${type} 웹훅 연결 테스트 성공`,
        type,
      });
    } else {
      const errorText = await response.text().catch(() => '');
      return successResponse({
        success: false,
        statusCode: response.status,
        message: `HTTP ${response.status}: ${response.statusText}`,
        detail: errorText.substring(0, 200),
        type,
      });
    }
  } catch (error) {
    console.error('POST /api/admin/webhooks/test error:', error);

    // 타임아웃 에러
    if (error instanceof Error && error.name === 'TimeoutError') {
      return successResponse({
        success: false,
        message: '연결 시간 초과 (10초)',
      });
    }

    // 네트워크 에러
    if (error instanceof Error && error.message.includes('fetch')) {
      return successResponse({
        success: false,
        message: '네트워크 오류: 서버에 연결할 수 없습니다',
      });
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
      return validationErrorResponse(errorMessage);
    }

    return serverErrorResponse('웹훅 테스트 중 오류가 발생했습니다', error);
  }
}
