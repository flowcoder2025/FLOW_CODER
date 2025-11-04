import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { grantPostOwnership } from '@/lib/permissions';

/**
 * GET /api/questions
 * Q&A 질문 목록 조회 (postType: QUESTION)
 *
 * Query Parameters:
 * - sort: recent | popular | unanswered (default: recent)
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 항목 수 (default: 20)
 * - tags: 태그 필터 (comma-separated)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const skip = (page - 1) * limit;

    // 필터 조건: postType은 항상 QUESTION
    const where: any = {
      postType: 'QUESTION',
    };

    // 태그 필터
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    // 정렬 조건 구성
    let orderBy: any = {};
    switch (sort) {
      case 'popular':
        orderBy = { upvotes: 'desc' };
        break;
      case 'unanswered':
        orderBy = { answers: { _count: 'asc' } };
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // 질문 조회
    const [questions, total] = await Promise.all([
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
              reputation: true,
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
              answers: true,
              comments: true,
            },
          },
          answers: {
            where: {
              isAccepted: true,
            },
            take: 1,
            select: {
              id: true,
              isAccepted: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/questions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/questions
 * 새 질문 생성 (인증 필요)
 *
 * Body:
 * - title: string (필수, 최소 15자)
 * - content: string (필수, 최소 50자)
 * - categoryId: string (필수)
 * - tags: string[] (필수, 최소 1개)
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: 로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { title, content, categoryId, tags } = body;

    // 필수 필드 검증
    if (!title || !content || !categoryId || !tags || tags.length === 0) {
      return NextResponse.json(
        { error: 'Bad Request: title, content, categoryId, tags는 필수입니다.' },
        { status: 400 }
      );
    }

    // 질문 형식 검증
    if (title.length < 15) {
      return NextResponse.json(
        { error: 'Bad Request: 제목은 최소 15자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (content.length < 50) {
      return NextResponse.json(
        { error: 'Bad Request: 내용은 최소 50자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 카테고리 존재 확인
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Bad Request: 유효하지 않은 categoryId입니다.' },
        { status: 400 }
      );
    }

    // 질문 생성 (postType: QUESTION 고정)
    const question = await prisma.post.create({
      data: {
        title,
        content,
        postType: 'QUESTION',
        authorId: session.user.id,
        categoryId,
        tags,
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

    // Zanzibar 권한 부여: 질문 작성자에게 owner 권한 자동 부여
    await grantPostOwnership(question.id, session.user.id);

    // 카테고리 게시글 수 증가
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('POST /api/questions error:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
