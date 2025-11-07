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
    ],
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
