import { MetadataRoute } from 'next';

/**
 * robots.txt 생성
 *
 * 모든 크롤러에 대해 사이트 전체 접근 허용
 * sitemap.xml 위치 제공
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vibecoding.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes는 크롤링 제외
          '/admin/',         // 관리자 페이지 제외
          '/profile/edit',   // 프로필 수정 페이지 제외
          '/settings',       // 설정 페이지 제외
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
