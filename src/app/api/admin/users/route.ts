import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/users
 * 사용자 목록 조회 (관리자 전용)
 *
 * Query Parameters:
 * - search: 검색어 (username, email)
 * - role: 역할 필터 (USER, MODERATOR, ADMIN)
 * - page: 페이지 번호 (default: 1)
 * - limit: 페이지당 항목 수 (default: 20)
 *
 * Response:
 * - users: 사용자 목록
 * - pagination: 페이지네이션 정보
 */
export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 검색 및 필터 조건
    const where: any = {};

    // 검색어 필터
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 역할 필터
    if (role && ['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }

    // 사용자 목록 및 총 개수 조회
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          image: true,
          role: true,
          reputation: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/users error:', error);

    // 권한 에러 처리
    if (
      error.message?.includes('Unauthorized') ||
      error.message?.includes('Forbidden')
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
