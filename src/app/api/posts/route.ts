import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { grantPostOwnership } from '@/lib/permissions';
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * GET /api/posts
 * 게시글 목록 조회
 *
 * Query Parameters:
 * - category: 카테고리 slug (optional)
 * - postType: 게시글 타입 (optional)
 * - sort: popular | recent | comments (default: popular)
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 항목 수 (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const postType = searchParams.get('postType');
    const sort = searchParams.get('sort') || 'popular';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const where: Prisma.PostWhereInput = {};
    if (category) {
      where.category = { slug: category };
    }
    if (postType) {
      where.postType = postType as Prisma.PostWhereInput['postType'];
    }

    // 정렬 조건 구성
    let orderBy: Prisma.PostOrderByWithRelationInput = {};
    switch (sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' };
        break;
      case 'comments':
        // comments 정렬은 _count를 통해 처리
        orderBy = { createdAt: 'desc' }; // 임시로 createdAt 사용
        break;
      case 'popular':
      default:
        orderBy = { upvotes: 'desc' };
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
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return serverErrorResponse('게시글 목록 조회 중 오류가 발생했습니다', error);
  }
}

/**
 * POST /api/posts
 * 새 게시글 생성 (인증 필요)
 *
 * Body:
 * - title: string (필수)
 * - content: string (필수)
 * - postType: PostType (default: DISCUSSION)
 * - categoryId: string (필수)
 * - tags: string[]
 * - coverImageUrl: string (optional)
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { title, content, postType, categoryId, tags, coverImageUrl } = body;

    // 필수 필드 검증
    if (!title || !content || !categoryId) {
      return validationErrorResponse('title, content, categoryId는 필수입니다.');
    }

    // 입력 길이 검증
    if (title.length > 200) {
      return validationErrorResponse('제목은 최대 200자까지 입력 가능합니다.');
    }

    if (content.length > 10000) {
      return validationErrorResponse('내용은 최대 10,000자까지 입력 가능합니다.');
    }

    // tags 검증
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

    // 카테고리 존재 확인
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return validationErrorResponse('유효하지 않은 categoryId입니다.');
    }

    // 트랜잭션: 게시글 생성 + Zanzibar 권한 부여 + postCount 증가
    const post = await prisma.$transaction(async (tx) => {
      // 1. 게시글 생성
      const newPost = await tx.post.create({
        data: {
          title,
          content,
          postType: postType || 'DISCUSSION',
          authorId: session.user.id,
          categoryId,
          tags: tags || [],
          coverImageUrl,
        },
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

      // 2. Zanzibar 권한 부여: 게시글 작성자에게 owner 권한 자동 부여
      await grantPostOwnership(newPost.id, session.user.id);

      // 3. 카테고리 게시글 수 증가
      await tx.category.update({
        where: { id: categoryId },
        data: {
          postCount: {
            increment: 1,
          },
        },
      });

      return newPost;
    });

    return successResponse({ post }, 201);
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return serverErrorResponse('게시글 생성 중 오류가 발생했습니다', error);
  }
}
