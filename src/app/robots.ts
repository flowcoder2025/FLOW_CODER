import { MetadataRoute } from 'next';

/**
 * robots.txt 생성
 *
 * 모든 크롤러에 대해 사이트 전체 접근 허용
 * Google, Naver(Yeti), Bing 등 주요 검색엔진 지원
 * sitemap.xml 위치 제공
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flow-coder.com';

  return {
    rules: [
      {
        // 기본 규칙: 모든 크롤러
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes는 크롤링 제외
          '/admin/',         // 관리자 페이지 제외
          '/profile/edit',   // 프로필 수정 페이지 제외
          '/settings',       // 설정 페이지 제외
        ],
      },
      {
        // Google 검색봇
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        // Google 이미지봇
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        // 네이버 검색봇 (Yeti)
        userAgent: 'Yeti',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        // 네이버 블로그봇
        userAgent: 'Naverbot',
        allow: '/',
      },
      {
        // Bing 검색봇
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
