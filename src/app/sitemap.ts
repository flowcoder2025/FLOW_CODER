import { MetadataRoute } from 'next';
import { mockPosts, mockUsers, mockCategories } from '@/lib/mock-data';

/**
 * sitemap.xml 생성
 *
 * 정적 페이지와 동적 페이지 URL을 모두 포함
 * 크롤러가 사이트 구조를 이해하도록 changeFrequency와 priority 설정
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vibecoding.com';

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
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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

  // 커뮤니티 카테고리 페이지
  const categoryPages: MetadataRoute.Sitemap = mockCategories
    .filter((cat) => !cat.id.startsWith('news_')) // NEWS 카테고리 제외
    .map((category) => ({
      url: `${baseUrl}/community/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }));

  // 게시글 페이지 (DISCUSSION, SHOWCASE 타입)
  const postPages: MetadataRoute.Sitemap = mockPosts
    .filter((post) => post.postType === 'DISCUSSION' || post.postType === 'SHOWCASE')
    .map((post) => ({
      url: `${baseUrl}/community/${post.category.slug}/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  // 질문 페이지 (QUESTION 타입)
  const questionPages: MetadataRoute.Sitemap = mockPosts
    .filter((post) => post.postType === 'QUESTION')
    .map((question) => ({
      url: `${baseUrl}/help/${question.id}`,
      lastModified: new Date(question.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

  // 뉴스 페이지 (NEWS 타입)
  const newsPages: MetadataRoute.Sitemap = mockPosts
    .filter((post) => post.postType === 'NEWS')
    .map((news) => ({
      url: `${baseUrl}/news/${news.id}`,
      lastModified: new Date(news.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  // 사용자 프로필 페이지
  const profilePages: MetadataRoute.Sitemap = mockUsers.map((user) => ({
    url: `${baseUrl}/profile/${user.username}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...postPages,
    ...questionPages,
    ...newsPages,
    ...profilePages,
  ];
}
