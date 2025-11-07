import * as Sentry from "@sentry/nextjs";

/**
 * Sentry 클라이언트 설정
 * 브라우저에서 발생하는 에러를 추적합니다.
 */
Sentry.init({
  // Sentry DSN (Sentry 프로젝트 설정에서 가져옴)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경 설정
  environment: process.env.NODE_ENV,

  // 샘플링 비율 설정
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 성능 모니터링 설정
  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100% 세션 재생 기록
  replaysSessionSampleRate: 0.1, // 일반 세션의 10%만 기록

  // 디버그 모드 (개발 환경에서만)
  debug: process.env.NODE_ENV === 'development',

  // 에러 필터링 (무시할 에러 패턴)
  beforeSend(event, hint) {
    // 개발 환경에서는 콘솔에만 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Error:', hint.originalException || hint.syntheticException);
      return null; // 개발 환경에서는 Sentry로 전송하지 않음
    }

    // 특정 에러 무시
    const error = hint.originalException;
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message);

      // 무시할 에러 패턴
      const ignoredPatterns = [
        /ResizeObserver loop/i,
        /Non-Error promise rejection/i,
        /Loading chunk/i,
        /Network request failed/i,
      ];

      if (ignoredPatterns.some(pattern => pattern.test(message))) {
        return null;
      }
    }

    return event;
  },

  // 통합 기능 설정
  integrations: [
    Sentry.replayIntegration({
      // 민감한 정보 마스킹
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
