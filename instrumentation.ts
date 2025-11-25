import type { Instrumentation } from 'next';

/**
 * Next.js Instrumentation Hook
 *
 * Next.js 서버가 시작될 때 실행됩니다.
 * Sentry와 같은 모니터링 도구 초기화에 사용됩니다.
 */

export async function register() {
  // Node.js 런타임에서만 서버 Sentry 초기화
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  // Edge 런타임에서는 Edge Sentry 초기화
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

/**
 * Request Error Handler
 *
 * 서버 요청 중 발생하는 에러를 Sentry로 전송합니다.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  // Sentry가 초기화된 경우에만 에러 캡처
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');

    Sentry.captureException(err, {
      contexts: {
        nextjs: {
          request: {
            path: request.path,
            method: request.method,
            headers: request.headers,
          },
          router: {
            kind: context.routerKind,
            path: context.routePath,
            type: context.routeType,
          },
          render: {
            source: context.renderSource,
            revalidate: context.revalidateReason,
          },
        },
      },
    });
  }
};
