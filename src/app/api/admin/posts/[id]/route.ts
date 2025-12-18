import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireModerator } from '@/lib/admin-middleware';
import { triggerWebhooks } from '@/lib/webhooks';
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
 * PATCH /api/admin/posts/[id]
 * 모더레이터 이상 전용 게시글 수정 및 복구
 *
 * Body:
 * - isPinned: boolean (optional) - 카테고리 고정 여부
 * - isFeatured: boolean (optional) - 주목할 만한 프로젝트 지정 여부
 * - title: string (optional)
 * - content: string (optional)
 * - tags: string[] (optional)
 * - coverImageUrl: string (optional)
 * - categoryId: string (optional)
 * - restore: boolean (optional) - 삭제된 게시글 복구
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 모더레이터 권한 확인
    await requireModerator();

    const { id } = await context.params;

    // 게시글 존재 확인
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return notFoundResponse('게시글을 찾을 수 없습니다');
    }

    // 요청 본문 파싱
    const body = await request.json();
    const {
      isPinned,
      isFeatured,
      title,
      content,
      tags,
      coverImageUrl,
      categoryId,
      restore,
    } = body;

    // 수정할 필드만 포함
    const updateData: Record<string, unknown> = {};
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    // 복구 요청 처리
    if (restore === true) {
      updateData.deletedAt = null;
    }

    // 입력 검증
    if (title !== undefined && title.length > 200) {
      return validationErrorResponse('제목은 최대 200자까지 입력 가능합니다.');
    }

    if (content !== undefined && content.length > 50000) {
      return validationErrorResponse('내용은 최대 50,000자까지 입력 가능합니다.');
    }

    if (tags && Array.isArray(tags)) {
      if (tags.length > 5) {
        return validationErrorResponse('태그는 최대 5개까지 추가 가능합니다.');
      }

      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 20) {
          return validationErrorResponse('각 태그는 최대 20자까지 입력 가능합니다.');
        }
      }
    }

    // 카테고리 변경 시 존재 확인
    if (categoryId !== undefined) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return validationErrorResponse('유효하지 않은 categoryId입니다.');
      }
    }

    // 게시글 수정
    const post = await prisma.post.update({
      where: { id },
      data: updateData,
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
            answers: true,
            votes: true,
          },
        },
      },
    });

    // 웹훅 트리거 (비동기, 실패해도 메인 로직에 영향 없음)
    triggerWebhooks('POST_UPDATED', {
      postId: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      categoryId: post.categoryId,
      isPinned: post.isPinned,
      isFeatured: post.isFeatured,
      updatedFields: Object.keys(updateData),
    }).catch((err) => console.error('Webhook trigger failed:', err));

    return successResponse({ post });
  } catch (error) {
    console.error(`PATCH /api/admin/posts/${(await context.params).id} error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 권한 에러 처리
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
      return validationErrorResponse(errorMessage);
    }

    return serverErrorResponse('게시글 수정 중 오류가 발생했습니다', error);
  }
}

/**
 * DELETE /api/admin/posts/[id]
 * 모더레이터 이상 전용 게시글 소프트 삭제
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

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return notFoundResponse('게시글을 찾을 수 없습니다');
    }

    // 이미 삭제된 게시글인지 확인
    if (post.deletedAt) {
      return validationErrorResponse('이미 삭제된 게시글입니다');
    }

    // 소프트 삭제 (deletedAt 설정)
    await prisma.post.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // 웹훅 트리거 (비동기, 실패해도 메인 로직에 영향 없음)
    triggerWebhooks('POST_DELETED', {
      postId: post.id,
      title: post.title,
      authorId: post.authorId,
      categoryId: post.categoryId,
    }).catch((err) => console.error('Webhook trigger failed:', err));

    return successResponse({ success: true, message: '게시글이 삭제되었습니다' });
  } catch (error) {
    console.error(`DELETE /api/admin/posts/${(await context.params).id} error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 권한 에러 처리
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Forbidden')) {
      return validationErrorResponse(errorMessage);
    }

    return serverErrorResponse('게시글 삭제 중 오류가 발생했습니다', error);
  }
}
