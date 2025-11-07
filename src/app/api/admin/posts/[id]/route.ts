import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-middleware';
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
 * 관리자 전용 게시글 수정
 *
 * Body:
 * - isPinned: boolean (optional) - 홈 화면 고정 여부
 * - title: string (optional)
 * - content: string (optional)
 * - tags: string[] (optional)
 * - coverImageUrl: string (optional)
 * - postType: PostType (optional)
 * - categoryId: string (optional)
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 관리자 권한 확인
    await requireAdmin();

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
      title,
      content,
      tags,
      coverImageUrl,
      postType,
      categoryId,
    } = body;

    // 수정할 필드만 포함
    const updateData: any = {};
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    if (postType !== undefined) updateData.postType = postType;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    // 입력 검증
    if (title !== undefined && title.length > 200) {
      return validationErrorResponse('제목은 최대 200자까지 입력 가능합니다.');
    }

    if (content !== undefined && content.length > 10000) {
      return validationErrorResponse('내용은 최대 10,000자까지 입력 가능합니다.');
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

    return successResponse({ post });
  } catch (error: any) {
    console.error(`PATCH /api/admin/posts/${(await context.params).id} error:`, error);

    // 권한 에러 처리
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return validationErrorResponse(error.message);
    }

    return serverErrorResponse('게시글 수정 중 오류가 발생했습니다', error);
  }
}

/**
 * DELETE /api/admin/posts/[id]
 * 관리자 전용 게시글 삭제
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 관리자 권한 확인
    await requireAdmin();

    const { id } = await context.params;

    // 게시글 정보 조회 (카테고리 postCount 감소용)
    const post = await prisma.post.findUnique({
      where: { id },
      select: { categoryId: true },
    });

    if (!post) {
      return notFoundResponse('게시글을 찾을 수 없습니다');
    }

    // 게시글 삭제 (Cascade로 연관 데이터 자동 삭제)
    await prisma.$transaction([
      prisma.post.delete({
        where: { id },
      }),
      prisma.category.update({
        where: { id: post.categoryId },
        data: {
          postCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return successResponse({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/admin/posts/${(await context.params).id} error:`, error);

    // 권한 에러 처리
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return validationErrorResponse(error.message);
    }

    return serverErrorResponse('게시글 삭제 중 오류가 발생했습니다', error);
  }
}
