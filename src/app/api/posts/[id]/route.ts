import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/permissions';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/posts/[id]
 * 게시글 상세 조회
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id },
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
            },
          },
          where: {
            parentId: null, // 최상위 댓글만
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
            { isAccepted: 'desc' }, // 채택된 답변 우선
            { upvotes: 'desc' },
          ],
        },
        images: {
          orderBy: {
            order: 'asc',
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

    if (!post) {
      return notFoundResponse('게시글을 찾을 수 없습니다');
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return successResponse({ post });
  } catch (error) {
    console.error(`GET /api/posts/${(await context.params).id} error:`, error);
    return serverErrorResponse('게시글 조회 중 오류가 발생했습니다', error);
  }
}

/**
 * PATCH /api/posts/[id]
 * 게시글 수정 (editor 권한 필요)
 *
 * Body:
 * - title: string (optional)
 * - content: string (optional)
 * - tags: string[] (optional)
 * - coverImageUrl: string (optional)
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    // 권한 체크 (editor 권한 필요 - owner도 editor 상속으로 가능)
    await requirePermission(session.user.id, 'post', id, 'editor');

    // 요청 본문 파싱
    const body = await request.json();
    const { title, content, tags, coverImageUrl } = body;

    // 수정할 필드만 포함
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;

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
      },
    });

    return successResponse({ post });
  } catch (error: any) {
    console.error(`PATCH /api/posts/${(await context.params).id} error:`, error);

    // 권한 에러 처리
    if (error.message?.includes('Forbidden') || error.message?.includes('권한')) {
      return forbiddenResponse(error.message);
    }

    return serverErrorResponse('게시글 수정 중 오류가 발생했습니다', error);
  }
}

/**
 * DELETE /api/posts/[id]
 * 게시글 삭제 (owner 권한 필요)
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    // 권한 체크 (owner 권한 필요)
    await requirePermission(session.user.id, 'post', id, 'owner');

    // 게시글 정보 조회 (카테고리 postCount 감소용)
    const post = await prisma.post.findUnique({
      where: { id },
      select: { categoryId: true },
    });

    if (!post) {
      return notFoundResponse('게시글을 찾을 수 없습니다');
    }

    // 게시글 삭제 (Cascade로 연관 데이터 자동 삭제)
    await prisma.post.delete({
      where: { id },
    });

    // 카테고리 게시글 수 감소
    await prisma.category.update({
      where: { id: post.categoryId },
      data: {
        postCount: {
          decrement: 1,
        },
      },
    });

    return successResponse({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/posts/${(await context.params).id} error:`, error);

    // 권한 에러 처리
    if (error.message?.includes('Forbidden') || error.message?.includes('권한')) {
      return forbiddenResponse(error.message);
    }

    return serverErrorResponse('게시글 삭제 중 오류가 발생했습니다', error);
  }
}
