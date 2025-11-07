import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireModerator } from '@/lib/admin-middleware';
import {
  successResponse,
  serverErrorResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { Prisma } from '@/generated/prisma';

/**
 * GET /api/admin/comments
 * 모더레이터 이상 전용 댓글 목록 조회
 *
 * Query Parameters:
 * - postId: 특정 게시글의 댓글만 필터링 (optional)
 * - search: 댓글 내용 검색 (optional)
 * - sort: recent | oldest (default: recent)
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 항목 수 (default: 20)
 * - includeDeleted: 삭제된 댓글 포함 여부 (true/false, default: false)
 */
export async function GET(request: NextRequest) {
  try {
    // 모더레이터 권한 확인
    await requireModerator();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const where: Prisma.CommentWhereInput = {};

    if (postId) {
      where.postId = postId;
    }

    if (search) {
      where.content = { contains: search, mode: 'insensitive' };
    }

    // 삭제된 댓글 필터링 (기본: 삭제되지 않은 것만)
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    // 정렬 조건 구성
    const orderBy: Prisma.CommentOrderByWithRelationInput =
      sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    // 댓글 조회
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
              postType: true,
            },
          },
          parent: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  username: true,
                  displayName: true,
                },
              },
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return successResponse({
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/comments error:', error);

    // 권한 에러 처리
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return validationErrorResponse(error.message);
    }

    return serverErrorResponse('댓글 목록 조회 중 오류가 발생했습니다', error);
  }
}
