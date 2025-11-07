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
 * GET /api/admin/posts
 * 모더레이터 이상 전용 게시글 목록 조회
 *
 * Query Parameters:
 * - postType: 게시글 타입 필터 (optional)
 * - isPinned: 핀 상태 필터 (true/false, optional)
 * - category: 카테고리 slug (optional)
 * - sort: recent | popular | pinned (default: recent)
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 항목 수 (default: 20)
 * - search: 제목/내용 검색 (optional)
 * - includeDeleted: 삭제된 게시글 포함 여부 (true/false, default: false)
 */
export async function GET(request: NextRequest) {
  try {
    // 모더레이터 권한 확인
    await requireModerator();

    const { searchParams } = new URL(request.url);
    const postType = searchParams.get('postType');
    const isPinnedParam = searchParams.get('isPinned');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const where: Prisma.PostWhereInput = {};

    if (postType) {
      where.postType = postType as Prisma.PostWhereInput['postType'];
    }

    if (isPinnedParam !== null) {
      where.isPinned = isPinnedParam === 'true';
    }

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 삭제된 게시글 필터링 (기본: 삭제되지 않은 것만)
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    // 정렬 조건 구성
    let orderBy: Prisma.PostOrderByWithRelationInput[];
    switch (sort) {
      case 'pinned':
        orderBy = [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ];
        break;
      case 'popular':
        orderBy = [
          { upvotes: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ];
        break;
      case 'recent':
      default:
        orderBy = [{ createdAt: 'desc' }];
        break;
    }

    // 게시글 조회
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
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
      }),
      prisma.post.count({ where }),
    ]);

    return successResponse({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/posts error:', error);

    // 권한 에러 처리
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return validationErrorResponse(error.message);
    }

    return serverErrorResponse('게시글 목록 조회 중 오류가 발생했습니다', error);
  }
}
