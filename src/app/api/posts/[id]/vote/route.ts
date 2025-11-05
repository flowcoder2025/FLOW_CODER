import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { VoteType, Prisma } from '@/generated/prisma';
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return unauthorizedResponse();
  }

  const { id: postId } = await params;
  if (!postId) {
    return validationErrorResponse('postId가 필요합니다.');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationErrorResponse('유효한 JSON 본문이 필요합니다.');
  }

  if (!body || typeof body !== 'object') {
    return validationErrorResponse('유효하지 않은 요청 본문입니다.');
  }

  const voteTypeRaw = (body as { voteType?: string }).voteType;

  if (!voteTypeRaw) {
    return validationErrorResponse('voteType 필드는 필수입니다.');
  }

  const normalizedVoteType =
    voteTypeRaw === 'DOWN' || voteTypeRaw === 'down'
      ? VoteType.DOWN
      : voteTypeRaw === 'UP' || voteTypeRaw === 'up'
      ? VoteType.UP
      : null;

  if (!normalizedVoteType) {
    return validationErrorResponse("voteType은 'UP' 또는 'DOWN' 이어야 합니다.");
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return notFoundResponse('게시글을 찾을 수 없습니다.');
    }

    const userId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        select: {
          id: true,
          voteType: true,
        },
      });

      let upvoteDelta = 0;
      let downvoteDelta = 0;
      let nextVoteState: VoteType | null = normalizedVoteType;

      if (!existingVote) {
        await tx.vote.create({
          data: {
            userId,
            postId,
            voteType: normalizedVoteType,
          },
        });

        if (normalizedVoteType === VoteType.UP) {
          upvoteDelta = 1;
        } else {
          downvoteDelta = 1;
        }
      } else if (existingVote.voteType === normalizedVoteType) {
        await tx.vote.delete({
          where: { id: existingVote.id },
        });

        nextVoteState = null;

        if (normalizedVoteType === VoteType.UP) {
          upvoteDelta = -1;
        } else {
          downvoteDelta = -1;
        }
      } else {
        await tx.vote.update({
          where: { id: existingVote.id },
          data: {
            voteType: normalizedVoteType,
          },
        });

        if (normalizedVoteType === VoteType.UP) {
          upvoteDelta = 1;
          downvoteDelta = -1;
        } else {
          upvoteDelta = -1;
          downvoteDelta = 1;
        }
      }

      const postUpdateData: Prisma.PostUpdateInput = {};

      if (upvoteDelta !== 0) {
        postUpdateData.upvotes = { increment: upvoteDelta };
      }

      if (downvoteDelta !== 0) {
        postUpdateData.downvotes = { increment: downvoteDelta };
      }

      if (Object.keys(postUpdateData).length > 0) {
        await tx.post.update({
          where: { id: postId },
          data: postUpdateData,
        });
      }

      const voteCounts = await tx.post.findUnique({
        where: { id: postId },
        select: {
          upvotes: true,
          downvotes: true,
        },
      });

      if (!voteCounts) {
        throw new Error('투표 정보 집계 중 문제가 발생했습니다.');
      }

      return {
        upvotes: voteCounts.upvotes,
        downvotes: voteCounts.downvotes,
        userVote: nextVoteState,
      };
    });

    return successResponse({
      upvotes: result.upvotes,
      downvotes: result.downvotes,
      userVote: result.userVote,
    });
  } catch (error) {
    console.error('POST /api/posts/[id]/vote error:', error);
    return serverErrorResponse('투표 처리 중 오류가 발생했습니다', error);
  }
}
