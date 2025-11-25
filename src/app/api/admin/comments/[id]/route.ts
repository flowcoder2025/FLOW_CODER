import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireModerator } from '@/lib/admin-middleware';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH /api/admin/comments/[id]
 * 모더레이터 이상 전용 댓글 복구
 *
 * Body:
 * - restore: boolean (필수) - 삭제된 댓글 복구
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 모더레이터 권한 확인
    await requireModerator();

    const { id } = await context.params;

    // 댓글 존재 확인
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return notFoundResponse('댓글을 찾을 수 없습니다');
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { restore } = body;

    // 복구 요청 처리
    if (restore === true) {
      if (!existingComment.deletedAt) {
        return validationErrorResponse('이미 복구된 댓글입니다');
      }

      // 댓글 복구
      const comment = await prisma.comment.update({
        where: { id },
        data: { deletedAt: null },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
              role: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return successResponse({ comment });
    }

    return validationErrorResponse('restore 필드가 필요합니다');
  } catch (error) {
    console.error(`PATCH /api/admin/comments/${(await context.params).id} error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 권한 에러 처리
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
      return validationErrorResponse(errorMessage);
    }

    return serverErrorResponse('댓글 복구 중 오류가 발생했습니다', error);
  }
}

/**
 * DELETE /api/admin/comments/[id]
 * 모더레이터 이상 전용 댓글 소프트 삭제
 * (실제 삭제가 아닌 deletedAt 타임스탬프 설정)
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 모더레이터 권한 확인
    await requireModerator();

    const { id } = await context.params;

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return notFoundResponse('댓글을 찾을 수 없습니다');
    }

    // 이미 삭제된 댓글인지 확인
    if (comment.deletedAt) {
      return validationErrorResponse('이미 삭제된 댓글입니다');
    }

    // 소프트 삭제 (deletedAt 설정)
    await prisma.comment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return successResponse({ success: true, message: '댓글이 삭제되었습니다' });
  } catch (error) {
    console.error(`DELETE /api/admin/comments/${(await context.params).id} error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 권한 에러 처리
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
      return validationErrorResponse(errorMessage);
    }

    return serverErrorResponse('댓글 삭제 중 오류가 발생했습니다', error);
  }
}
