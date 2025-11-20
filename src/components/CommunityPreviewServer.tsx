import { prisma } from '@/lib/prisma';
import { CommunityPreviewClient } from './CommunityPreviewClient';

/**
 * HTML 태그를 제거하고 텍스트만 추출
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * CommunityPreview Server Component
 *
 * DB에서 isFeatured=true인 "주목할 만한 프로젝트" 게시물을 조회하여
 * Client Component로 전달
 */
export async function CommunityPreviewServer() {
  // isFeatured=true인 게시물 조회 (최신순, 최대 6개)
  const posts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      deletedAt: null, // 삭제되지 않은 게시글만
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6, // 캐러셀에 더 많은 컨텐츠 표시
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
        orderBy: {
          order: 'asc', // order 순으로 정렬하여 첫 번째 이미지 가져오기
        },
        select: {
          url: true,
        },
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

  // 클라이언트 컴포넌트에 필요한 형식으로 변환
  const featuredPosts = posts.map((post) => {
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
      trending: post.upvotes > 50, // 추천 50개 이상이면 trending
      thumbnail: post.images[0]?.url || post.coverImageUrl || getDefaultThumbnail(),
    };
  });

  // 광고 카드 추가
  const adCard = {
    type: 'ad' as const,
    title: 'FlowCoder와 함께 성장하세요',
    description: '비개발자들을 위한 커뮤니티',
    action: '지금 참여하기',
    gradient: 'from-blue-500 to-purple-600',
  };

  const items = [...featuredPosts, adCard];

  return <CommunityPreviewClient items={items} />;
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
 * 기본 썸네일 이미지 랜덤 선택
 */
function getDefaultThumbnail(): string {
  const defaults = [
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
