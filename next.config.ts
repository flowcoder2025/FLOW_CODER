import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'hybcfzamnhvmkvgkepzo.supabase.co',
      },
    ],
    // SVG 이미지 허용 (아바타 생성 서비스용)
    dangerouslyAllowSVG: true,
    // SVG XSS 공격 방지 (다운로드 강제)
    contentDispositionType: 'attachment',
  },
  // 성능 최적화
  experimental: {
    // PPR (Partial Prerendering) - Next.js canary 버전에서만 사용 가능
    // 추후 안정 버전 출시 시 활성화 예정
    // ppr: 'incremental',
    // 서버 액션 최적화
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // 클라이언트 추적 메타데이터 (Sentry 연동)
    clientTraceMetadata: ['baggage', 'sentry-trace'],
  },
  // 개발 모드 성능 최적화
  reactStrictMode: false, // 개발 시 이중 렌더링 방지
  // 로깅 최소화
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // 컴파일러 최적화
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

// Sentry 설정 옵션
const sentryOptions = {
  // Sentry 소스맵 업로드 여부
  silent: true, // 빌드 로그 간소화
  hideSourceMaps: true, // 프로덕션에서 소스맵 숨김
  disableLogger: true, // Sentry 로거 비활성화
};

// Bundle Analyzer와 Sentry를 함께 적용
export default withSentryConfig(withBundleAnalyzer(nextConfig), sentryOptions);
