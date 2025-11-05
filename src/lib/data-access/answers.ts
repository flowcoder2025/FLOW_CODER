/**
 * Data Access Layer - Answers
 * Q&A 답변 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';

/**
 * 질문 ID로 답변 조회
 */
export async function getAnswersByQuestionId(questionId: string) {
  return await prisma.answer.findMany({
    where: { questionId },
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
      { isAccepted: 'desc' }, // 채택된 답변 우선
      { upvotes: 'desc' },
      { createdAt: 'asc' },
    ],
  });
}

/**
 * 사용자별 답변 조회
 */
export async function getAnswersByUser(userId: string, limit?: number) {
  return await prisma.answer.findMany({
    where: { authorId: userId },
    include: {
      question: {
        select: {
          id: true,
          title: true,
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
 * 답변 ID로 단일 답변 조회
 */
export async function getAnswerById(answerId: string) {
  return await prisma.answer.findUnique({
    where: { id: answerId },
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
      question: {
        select: {
          id: true,
          title: true,
          authorId: true,
        },
      },
    },
  });
}
