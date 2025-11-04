import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/posts/[id]/comments
 * 게시글 댓글 목록 조회
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // 게시글 존재 확인
    const postExists = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 댓글 조회 (최상위 댓글만, 대댓글 포함)
    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
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

    return NextResponse.json({ comments });
  } catch (error) {
    console.error(`GET /api/posts/${(await context.params).id}/comments error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts/[id]/comments
 * 댓글 작성 (인증 필요)
 *
 * Body:
 * - content: string (필수)
 * - parentId: string (optional - 대댓글인 경우)
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: 로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true, isLocked: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 댓글 잠금 확인
    if (post.isLocked) {
      return NextResponse.json(
        { error: 'Forbidden: 이 게시글은 댓글이 잠겨있습니다.' },
        { status: 403 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { content, parentId } = body;

    // 필수 필드 검증
    if (!content) {
      return NextResponse.json(
        { error: 'Bad Request: content는 필수입니다.' },
        { status: 400 }
      );
    }

    // 부모 댓글 존재 확인 (대댓글인 경우)
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Bad Request: 유효하지 않은 parentId입니다.' },
          { status: 400 }
        );
      }

      if (parentComment.postId !== id) {
        return NextResponse.json(
          { error: 'Bad Request: parentId가 이 게시글의 댓글이 아닙니다.' },
          { status: 400 }
        );
      }
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        postId: id,
        parentId: parentId || null,
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
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/posts/${(await context.params).id}/comments error:`, error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
