import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireModerator, requireAdmin } from '@/lib/admin-middleware';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/external-terms/[id] - 단일 외부 약관 조회 (관리자 전용)
 *
 * 권한: requireModerator() (모더레이터 이상)
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 모더레이터 이상 권한 확인
    try {
      await requireModerator();
    } catch (error: any) {
      if (error.message?.includes('Unauthorized')) {
        return unauthorizedResponse(error.message);
      }
      return forbiddenResponse(error.message);
    }

    const { id } = await context.params;

    const terms = await prisma.externalTerms.findUnique({
      where: { id },
    });

    if (!terms) {
      return notFoundResponse('약관을 찾을 수 없습니다');
    }

    return successResponse(terms);
  } catch (error) {
    console.error('External terms fetch error:', error);
    return serverErrorResponse('약관을 불러오는데 실패했습니다', error);
  }
}

/**
 * PUT /api/external-terms/[id] - 외부 약관 수정 (관리자 전용)
 *
 * 권한: requireAdmin()
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;
    const body = await request.json();
    const { slug, title, description, content, published } = body;

    // 약관 존재 확인
    const existing = await prisma.externalTerms.findUnique({
      where: { id },
    });

    if (!existing) {
      return notFoundResponse('약관을 찾을 수 없습니다');
    }

    // slug 변경 시 중복 확인
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.externalTerms.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return errorResponse('이미 사용 중인 slug입니다', 409, 'DUPLICATE_SLUG');
      }
    }

    // 약관 수정
    const updatedTerms = await prisma.externalTerms.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
      },
    });

    return successResponse(updatedTerms);
  } catch (error) {
    console.error('External terms update error:', error);
    return serverErrorResponse('약관 수정에 실패했습니다', error);
  }
}

/**
 * DELETE /api/external-terms/[id] - 외부 약관 삭제 (관리자 전용)
 *
 * 권한: requireAdmin()
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;

    // 약관 존재 확인
    const existing = await prisma.externalTerms.findUnique({
      where: { id },
    });

    if (!existing) {
      return notFoundResponse('약관을 찾을 수 없습니다');
    }

    // 약관 삭제
    await prisma.externalTerms.delete({
      where: { id },
    });

    return successResponse({ message: '약관이 삭제되었습니다' });
  } catch (error) {
    console.error('External terms deletion error:', error);
    return serverErrorResponse('약관 삭제에 실패했습니다', error);
  }
}
