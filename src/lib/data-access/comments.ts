/**
 * Data Access Layer - Comments
 * 댓글 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';

/**
 * 게시글 ID로 댓글 조회 (최상위 댓글만, 대댓글 포함)
 */
export async function getCommentsByPostId(postId: string) {
  return await prisma.comment.findMany({
    where: {
      postId,
      parentId: null, // 최상위 댓글만
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
      replies: {
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
          replies: {
            // 2단계 대댓글까지 지원
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
            orderBy: {
              createdAt: 'asc',
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
  });
}

/**
 * 사용자별 댓글 조회
 */
export async function getCommentsByUser(userId: string, limit?: number) {
  return await prisma.comment.findMany({
    where: { authorId: userId },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          category: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}
