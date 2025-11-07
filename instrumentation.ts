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
