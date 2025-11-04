import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';
import {
  grantSystemAdmin,
  grantSystemModerator,
  revoke,
} from '@/lib/permissions';

/**
 * POST /api/admin/users/[id]/role
 * 사용자 역할 변경 + Zanzibar 권한 자동 부여 (관리자 전용)
 *
 * Body:
 * - role: 'USER' | 'MODERATOR' | 'ADMIN'
 *
 * Response:
 * - user: 업데이트된 사용자 정보
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 권한 확인
    await requireAdmin();

    const userId = params.id;

    // 요청 본문 파싱
    const body = await request.json();
    const { role } = body;

    // 역할 검증
    if (!role || !['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be USER, MODERATOR, or ADMIN' },
        { status: 400 }
      );
    }

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 이미 동일한 역할이면 스킵
    if (user.role === role) {
      return NextResponse.json(
        { error: 'User already has this role' },
        { status: 400 }
      );
    }

    // 1. User 모델의 role 필드 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        image: true,
        role: true,
        reputation: true,
        createdAt: true,
      },
    });

    // 2. Zanzibar 권한 자동 부여/제거
    if (role === 'ADMIN') {
      // ADMIN 역할: system.global의 admin 권한 부여
      await grantSystemAdmin(userId);
    } else if (role === 'MODERATOR') {
      // MODERATOR 역할: system.global의 moderator 권한 부여
      // (admin 권한은 제거)
      await grantSystemModerator(userId);
      await revoke('system', 'global', 'admin', 'user', userId);
    } else {
      // USER 역할: 모든 시스템 권한 제거
      await revoke('system', 'global', 'admin', 'user', userId);
      await revoke('system', 'global', 'moderator', 'user', userId);
    }

    return NextResponse.json({
      user: updatedUser,
      message: `Successfully changed ${user.username}'s role to ${role}`,
    });
  } catch (error: any) {
    console.error('POST /api/admin/users/[id]/role error:', error);

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
      { error: 'Failed to change user role' },
      { status: 500 }
    );
  }
}
