import { MetadataRoute } from 'next';
import {
  getAllCategories,
  getRecentPosts,
  getTopUsersByReputation,
} from '@/lib/data-access';

/**
 * sitemap.xml 생성
 *
 * 정적 페이지와 동적 페이지 URL을 모두 포함
 * 크롤러가 사이트 구조를 이해하도록 changeFrequency와 priority 설정
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flow-coder.com';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms/platform`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/community`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 빌드 시점에 DATABASE_URL이 없으면 정적 페이지만 반환
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
    return staticPages;
  }

  // DB에서 데이터 조회
  let categories, allPosts, topUsers;
  try {
    categories = await getAllCategories();
    allPosts = await getRecentPosts(1000); // 최근 1000개 게시글
    topUsers = await getTopUsersByReputation(100); // 상위 100명 사용자
  } catch (error) {
    console.error('sitemap generation error:', error);
    // DB 연결 실패 시 정적 페이지만 반환
    return staticPages;
  }

  // 커뮤니티 카테고리 페이지
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.route === '/community') // 커뮤니티 카테고리만
    .map((category) => ({
      url: `${baseUrl}/community/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }));

  // 게시글 페이지 (커뮤니티 카테고리)
  const postPages: MetadataRoute.Sitemap = allPosts
    .filter((post) => post.category.route === '/community')
    .map((post) => ({
      url: `${baseUrl}/community/${post.category.slug}/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  // 사용자 프로필 페이지 (TOP 100 사용자)
  const profilePages: MetadataRoute.Sitemap = topUsers
    .filter((user) => user.username) // username이 있는 사용자만
    .map((user) => ({
      url: `${baseUrl}/profile/${user.username}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

  return [
    ...staticPages,
    ...categoryPages,
    ...postPages,
    ...profilePages,
  ];
}
