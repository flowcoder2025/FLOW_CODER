import * as Sentry from "@sentry/nextjs";

/**
 * Sentry 서버 설정
 * Node.js 서버에서 발생하는 에러를 추적합니다.
 */
Sentry.init({
  // Sentry DSN (Sentry 프로젝트 설정에서 가져옴)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경 설정
  environment: process.env.NODE_ENV,

  // 샘플링 비율 설정
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 디버그 모드 (개발 환경에서만)
  debug: process.env.NODE_ENV === 'development',

  // 에러 필터링
  beforeSend(event, hint) {
    // 개발 환경에서는 콘솔에만 출력
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Server Error:', hint.originalException || hint.syntheticException);
      return null;
    }

    // Prisma 에러 정보 향상
    const error = hint.originalException;
    if (error && typeof error === 'object' && 'code' in error) {
      event.tags = {
        ...event.tags,
        error_code: String(error.code),
      };
    }

    return event;
  },

  // 서버 에러 컨텍스트 추가
  initialScope: {
    tags: {
      runtime: 'node',
    },
  },
});
