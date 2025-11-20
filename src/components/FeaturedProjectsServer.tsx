import { prisma } from '@/lib/prisma';
import { FeaturedProjectsClient } from './FeaturedProjectsClient';

/**
 * FeaturedProjects Server Component
 *
 * DB에서 isPinned=true인 SHOWCASE 타입 게시물을 조회하여
 * Client Component로 전달
 */
export async function FeaturedProjectsServer() {
  // isPinned=true이고 SHOWCASE 타입인 게시물 조회 (최신순, 최대 3개)
  const posts = await prisma.post.findMany({
    where: {
      isPinned: true,
      postType: 'SHOWCASE',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    include: {
      images: {
        where: {
          isFeatured: true,
        },
        select: {
          url: true,
        },
        take: 1,
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  // 프로젝트 데이터 변환
  const projects = posts.map((post, index) => ({
    id: post.id,
    title: post.title,
    description: post.content.substring(0, 150),
    image: post.images[0]?.url || post.coverImageUrl || getDefaultProjectThumbnail(),
    techs: post.tags,
    stars: post.upvotes,
    forks: Math.floor(post.upvotes * 0.2), // 임시로 upvotes의 20%를 fork로 계산
    featured: index === 0, // 첫 번째 프로젝트를 featured로 설정
  }));

  return <FeaturedProjectsClient projects={projects} />;
}

/**
 * 기본 프로젝트 썸네일 이미지 랜덤 선택
 */
function getDefaultProjectThumbnail(): string {
  const defaults = [
    'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    'https://images.unsplash.com/photo-1582005450386-52b25f82d9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    'https://images.unsplash.com/photo-1628017974725-18928e8e8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
