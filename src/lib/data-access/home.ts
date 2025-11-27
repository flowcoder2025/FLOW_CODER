/**
 * Data Access Layer - Home Page
 * 홈페이지 데이터를 병렬로 가져오고 캐싱
 */

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

/**
 * HTML 태그를 제거하고 텍스트만 추출
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * 시간 차이를 한국어로 표시
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString('ko-KR');
}

/**
 * 기본 썸네일 (서버에서 일관된 값 반환)
 */
const DEFAULT_THUMBNAILS = {
  community: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
  news: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
  project: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
};

/**
 * 홈페이지 데이터 타입
 */
export interface HomePageData {
  featuredPosts: FeaturedPost[];
  newsItems: NewsItem[];
  projects: Project[];
}

export interface FeaturedPost {
  type: 'post';
  id: string;
  categorySlug: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  title: string;
  excerpt: string;
  tags: string[];
  likes: number;
  comments: number;
  timeAgo: string;
  trending: boolean;
  thumbnail: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  date: string;
  trending: boolean;
  thumbnail: string;
}

export interface Project {
  id: string;
  categorySlug: string;
  title: string;
  description: string;
  image: string;
  techs: string[];
  stars: number;
  forks: number;
  featured: boolean;
}

/**
 * 내부 함수: 주목할 만한 포스트 가져오기
 */
async function fetchFeaturedPosts(): Promise<FeaturedPost[]> {
  const posts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
    include: {
      author: {
        select: {
          username: true,
          displayName: true,
          image: true,
          role: true,
        },
      },
      category: {
        select: {
          slug: true,
        },
      },
      images: {
        orderBy: { order: 'asc' },
        select: { url: true },
        take: 1,
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
  });

  return posts.map((post) => {
    const plainText = stripHtml(post.content);
    return {
      type: 'post' as const,
      id: post.id,
      categorySlug: post.category.slug,
      author: {
        name: post.author.displayName || post.author.username || '익명',
        avatar: post.author.image || '/api/placeholder/32/32',
        role: post.author.role || 'USER',
      },
      title: post.title,
      excerpt: plainText.substring(0, 100) + (plainText.length > 100 ? '...' : ''),
      tags: post.tags,
      likes: post.upvotes,
      comments: post._count.comments,
      timeAgo: getTimeAgo(post.createdAt),
      trending: post.upvotes > 50,
      thumbnail: post.images[0]?.url || post.coverImageUrl || DEFAULT_THUMBNAILS.community,
    };
  });
}

/**
 * 내부 함수: 뉴스 가져오기
 */
async function fetchNewsItems(): Promise<NewsItem[]> {
  const posts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      postType: 'NEWS',
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      images: {
        where: { isFeatured: true },
        take: 1,
        orderBy: { order: 'asc' },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.content.substring(0, 100),
    category: post.category.name,
    categorySlug: post.category.slug,
    date: post.createdAt.toLocaleDateString('ko-KR'),
    trending: post.upvotes > 50,
    thumbnail: post.images[0]?.url || DEFAULT_THUMBNAILS.news,
  }));
}

/**
 * 내부 함수: 프로젝트 가져오기
 */
async function fetchProjects(): Promise<Project[]> {
  const posts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      deletedAt: null,
      postType: {
        in: ['DISCUSSION', 'QUESTION', 'SHOWCASE'],
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    include: {
      category: {
        select: { slug: true },
      },
      images: {
        orderBy: { order: 'asc' },
        select: { url: true },
        take: 1,
      },
      _count: {
        select: { votes: true },
      },
    },
  });

  return posts.map((post, index) => {
    const plainText = stripHtml(post.content);
    return {
      id: post.id,
      categorySlug: post.category.slug,
      title: post.title,
      description: plainText.substring(0, 150) + (plainText.length > 150 ? '...' : ''),
      image: post.images[0]?.url || post.coverImageUrl || DEFAULT_THUMBNAILS.project,
      techs: post.tags,
      stars: post.upvotes,
      forks: Math.floor(post.upvotes * 0.2),
      featured: index === 0,
    };
  });
}

/**
 * 내부 함수: 모든 홈페이지 데이터를 병렬로 가져오기
 */
async function fetchHomePageData(): Promise<HomePageData> {
  // 병렬로 모든 데이터 가져오기 (핵심 최적화!)
  const [featuredPosts, newsItems, projects] = await Promise.all([
    fetchFeaturedPosts(),
    fetchNewsItems(),
    fetchProjects(),
  ]);

  return {
    featuredPosts,
    newsItems,
    projects,
  };
}

/**
 * 홈페이지 데이터 가져오기 (3분 캐싱)
 * - 3개의 DB 쿼리를 병렬로 실행
 * - unstable_cache로 3분간 캐싱
 */
export const getHomePageData = unstable_cache(
  fetchHomePageData,
  ['home-page-data'],
  {
    revalidate: 180, // 3분마다 재검증
    tags: ['home', 'posts', 'news'],
  }
);
