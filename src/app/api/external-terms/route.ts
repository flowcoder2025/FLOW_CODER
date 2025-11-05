import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireModerator, requireAdmin } from '@/lib/admin-middleware';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * GET /api/external-terms - 외부 약관 목록 조회
 *
 * Query Parameters:
 * - published: 'true' (일반 사용자용, 발행된 약관만) | undefined (관리자용, 모든 약관)
 *
 * 권한:
 * - published=true: 권한 체크 없음 (공개 API)
 * - published=undefined: requireModerator() (관리자 전용)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';

    // 관리자용 (모든 약관 조회) - 모더레이터 이상 권한 필요
    if (!publishedOnly) {
      try {
        await requireModerator();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return unauthorizedResponse(error.message);
        }
        return forbiddenResponse(error.message);
      }
    }

    const terms = await prisma.externalTerms.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(terms);
  } catch (error) {
    console.error('External terms list error:', error);
    return serverErrorResponse('약관 목록을 불러오는데 실패했습니다', error);
  }
}

/**
 * POST /api/external-terms - 새 외부 약관 생성 (관리자 전용)
 *
 * 권한: requireAdmin()
 */
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    try {
      await requireAdmin();
    } catch (error: any) {
      if (error.message?.includes('Unauthorized')) {
        return unauthorizedResponse(error.message);
      }
      return forbiddenResponse(error.message);
    }

    const body = await request.json();
    const { slug, title, description, content, published } = body;

    // 필수 필드 검증
    if (!slug || !title || !content) {
      return validationErrorResponse('slug, title, content는 필수 항목입니다');
    }

    // slug 중복 확인
    const existing = await prisma.externalTerms.findUnique({
      where: { slug },
    });

    if (existing) {
      return errorResponse('이미 사용 중인 slug입니다', 409, 'DUPLICATE_SLUG');
    }

    // 새 약관 생성
    const newTerms = await prisma.externalTerms.create({
      data: {
        slug,
        title,
        description: description || null,
        content,
        published: published ?? false,
      },
    });

    return successResponse(newTerms, 201);
  } catch (error) {
    console.error('External terms creation error:', error);
    return serverErrorResponse('약관 생성에 실패했습니다', error);
  }
}
