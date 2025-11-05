/**
 * Data Access Layer - Users
 * 사용자 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

/**
 * 반환 타입 정의
 */
export type UserWithStats = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    displayName: true;
    image: true;
    bio: true;
    reputation: true;
    role: true;
    createdAt: true;
    _count: {
      select: {
        posts: true;
        comments: true;
        answers: true;
      };
    };
  };
}>;

/**
 * username으로 사용자 조회 (프로필용)
 */
export async function getUserByUsername(
  username: string
): Promise<UserWithStats | null> {
  try {
    const user = await prisma.user.findUnique({
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

    return user;
  } catch (error) {
    console.error('[DAL] getUserByUsername error:', error);
    throw new Error(`사용자 조회 중 오류가 발생했습니다: ${username}`);
  }
}

/**
 * 사용자 ID로 조회
 */
export async function getUserById(userId: string): Promise<UserWithStats | null> {
  try {
    const user = await prisma.user.findUnique({
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
      _count: {
        select: {
          posts: true,
          comments: true,
          answers: true,
        },
      },
    },
  });

    return user;
  } catch (error) {
    console.error('[DAL] getUserById error:', error);
    throw new Error(`사용자 ID 조회 중 오류가 발생했습니다: ${userId}`);
  }
}

/**
 * 평판 순위 TOP 사용자 조회
 */
export async function getTopUsersByReputation(
  limit: number = 10
): Promise<UserWithStats[]> {
  try {
    const users = await prisma.user.findMany({
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
    orderBy: {
      reputation: 'desc',
    },
    take: limit,
  });

    return users || [];
  } catch (error) {
    console.error('[DAL] getTopUsersByReputation error:', error);
    throw new Error('평판 순위 TOP 사용자 조회 중 오류가 발생했습니다');
  }
}

/**
 * 사용자 검색
 */
export async function searchUsers(
  query: string,
  limit: number = 20
): Promise<UserWithStats[]> {
  try {
    const users = await prisma.user.findMany({
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
    take: limit,
  });

    return users || [];
  } catch (error) {
    console.error('[DAL] searchUsers error:', error);
    throw new Error(`사용자 검색 중 오류가 발생했습니다: ${query}`);
  }
}
