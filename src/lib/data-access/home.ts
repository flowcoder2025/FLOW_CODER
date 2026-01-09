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
 * 인기도 점수 계산 (조회수 + 좋아요*3 + 댓글*2)
 * 최신 게시글에 가중치 부여 (7일 이내 1.5배, 3일 이내 2배)
 */
function calculateEngagementScore(
  viewCount: number,
  upvotes: number,
  commentsCount: number,
  createdAt: Date
): number {
  const baseScore = viewCount + (upvotes * 3) + (commentsCount * 2);

  const now = new Date();
  const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

  // 시간 가중치: 최신일수록 높은 점수
  let timeMultiplier = 1;
  if (daysSinceCreated <= 1) timeMultiplier = 3;      // 1일 이내: 3배
  else if (daysSinceCreated <= 3) timeMultiplier = 2; // 3일 이내: 2배
  else if (daysSinceCreated <= 7) timeMultiplier = 1.5; // 7일 이내: 1.5배

  return baseScore * timeMultiplier;
}

/**
 * 내부 함수: 오늘의 토픽 (인기글 + 최신글)
 * - 조회수, 좋아요, 댓글 기반 인기도 점수 계산
 * - 최신 게시글 가중치 적용
 * - adminOnly 카테고리 제외
 */
async function fetchFeaturedPosts(): Promise<FeaturedPost[]> {
  // 더 많은 게시글을 가져와서 앱 레벨에서 정렬
  const posts = await prisma.post.findMany({
    where: {
      deletedAt: null,
      category: {
        adminOnly: false, // 관리자 전용 카테고리 제외
      },
    },
    orderBy: [
      { isFeatured: 'desc' }, // featured 게시글 우선
      { createdAt: 'desc' },
    ],
    take: 30, // 충분한 후보군
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

  // 인기도 점수 기반 정렬
  const scoredPosts = posts.map((post) => ({
    post,
    score: calculateEngagementScore(
      post.viewCount,
      post.upvotes,
      post._count.comments,
      post.createdAt
    ),
  }));

  // 점수 내림차순 정렬 후 상위 8개 선택
  scoredPosts.sort((a, b) => b.score - a.score);
  const topPosts = scoredPosts.slice(0, 8);

  return topPosts.map(({ post }) => {
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
      trending: post.viewCount > 100 || post.upvotes > 10, // 조회수 100 또는 좋아요 10 이상
      thumbnail: post.images[0]?.url || post.coverImageUrl || DEFAULT_THUMBNAILS.community,
    };
  });
}

/**
 * 내부 함수: FlowCoder Feed 가져오기
 */
async function fetchNewsItems(): Promise<NewsItem[]> {
  const posts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      category: { slug: 'flowcoder-feed' },
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
 * 내부 함수: 주목할만한 프로젝트 가져오기
 * - showcase 카테고리에서 인기순으로 조회
 * - 조회수, 좋아요, 댓글 기반 정렬
 */
async function fetchProjects(): Promise<Project[]> {
  const posts = await prisma.post.findMany({
    where: {
      deletedAt: null,
      category: {
        slug: 'showcase', // 작품공유 카테고리
      },
    },
    orderBy: [
      { isFeatured: 'desc' }, // featured 우선
      { createdAt: 'desc' },
    ],
    take: 15, // 후보군
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
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  // 인기도 점수 기반 정렬 (프로젝트는 시간 가중치 없이)
  const scoredPosts = posts.map((post) => ({
    post,
    score: post.viewCount + (post.upvotes * 2) + (post._count.comments * 1),
  }));

  // 점수 내림차순 정렬 후 상위 3개 선택
  scoredPosts.sort((a, b) => b.score - a.score);
  const topPosts = scoredPosts.slice(0, 3);

  return topPosts.map(({ post }, index) => {
    const plainText = stripHtml(post.content);
    return {
      id: post.id,
      categorySlug: post.category.slug,
      title: post.title,
      description: plainText.substring(0, 150) + (plainText.length > 150 ? '...' : ''),
      image: post.images[0]?.url || post.coverImageUrl || DEFAULT_THUMBNAILS.project,
      techs: post.tags,
      stars: post.upvotes,
      forks: post.viewCount, // viewCount를 forks 대신 표시
      featured: index === 0 || post.isFeatured,
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
