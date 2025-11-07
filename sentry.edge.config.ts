import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Edge Runtime 설정
 * Edge Functions에서 발생하는 에러를 추적합니다.
 */
Sentry.init({
  // Sentry DSN (Sentry 프로젝트 설정에서 가져옴)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경 설정
  environment: process.env.NODE_ENV,

  // 샘플링 비율 설정 (Edge는 리소스 제한이 있으므로 낮게 설정)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,

  // 디버그 모드 (개발 환경에서만)
  debug: process.env.NODE_ENV === 'development',

  // Edge Runtime 컨텍스트 추가
  initialScope: {
    tags: {
      runtime: 'edge',
    },
  },
});
