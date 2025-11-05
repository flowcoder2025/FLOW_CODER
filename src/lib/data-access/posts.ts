/**
 * Data Access Layer - Posts
 * 게시글 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { PostType } from '@/generated/prisma';

/**
 * 카테고리별 게시글 조회
 */
export async function getPostsByCategory(categorySlug: string) {
  return await prisma.post.findMany({
    where: {
      category: { slug: categorySlug },
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

/**
 * 게시글 ID로 단일 게시글 조회
 */
export async function getPostById(postId: string) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
          role: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
        },
      },
      comments: {
        where: {
          parentId: null, // 최상위 댓글만
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      answers: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
              reputation: true,
            },
          },
        },
        orderBy: [
          { isAccepted: 'desc' },
          { upvotes: 'desc' },
        ],
      },
      _count: {
        select: {
          comments: true,
          answers: true,
          votes: true,
        },
      },
    },
  });
}

/**
 * 게시글 타입별 조회 (QUESTION, NEWS, DISCUSSION 등)
 */
export async function getPostsByType(postType: PostType, limit?: number) {
  return await prisma.post.findMany({
    where: { postType },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
          answers: true,
        },
      },
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  });
}

/**
 * 뉴스 게시글 목록 조회
 */
export async function getNewsPosts(limit?: number) {
  return await getPostsByType(PostType.NEWS, limit);
}

/**
 * Q&A 게시글 목록 조회
 */
export async function getQuestionPosts(limit?: number) {
  return await getPostsByType(PostType.QUESTION, limit);
}

/**
 * 최신 게시글 조회 (메인 페이지용)
 */
export async function getRecentPosts(limit: number = 10) {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * 사용자별 게시글 조회
 */
export async function getPostsByUser(userId: string) {
  return await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
