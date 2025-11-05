/**
 * Data Access Layer - Users
 * 사용자 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';

/**
 * username으로 사용자 조회 (프로필용)
 */
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      image: true,
      bio: true,
      reputation: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          comments: true,
          answers: true,
        },
      },
    },
  });
}

/**
 * 사용자 ID로 조회
 */
export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      image: true,
      bio: true,
      reputation: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * 평판 순위 TOP 사용자 조회
 */
export async function getTopUsersByReputation(limit: number = 10) {
  return await prisma.user.findMany({
    where: {
      reputation: {
        gt: 0,
      },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      image: true,
      reputation: true,
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
    orderBy: {
      reputation: 'desc',
    },
    take: limit,
  });
}

/**
 * 사용자 검색
 */
export async function searchUsers(query: string, limit: number = 20) {
  return await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          displayName: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      image: true,
      reputation: true,
    },
    take: limit,
  });
}
