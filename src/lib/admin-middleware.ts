import { auth } from '@/lib/auth';
import { check } from '@/lib/permissions';

/**
 * 관리자 권한 확인 미들웨어
 *
 * 세션 확인 + Zanzibar 시스템 레벨 admin 권한 체크
 * - 권한 없으면 에러 throw
 * - Server Component, Server Action, API Route에서 사용
 *
 * @throws Error - 로그인 필요 또는 권한 부족 시
 */
export async function requireAdmin(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized: 로그인이 필요합니다.');
  }

  const hasAdminPermission = await check(
    session.user.id,
    'system',
    'global',
    'admin'
  );

  if (!hasAdminPermission) {
    throw new Error('Forbidden: 관리자 권한이 필요합니다.');
  }

  return session.user.id;
}

/**
 * 모더레이터 권한 확인 미들웨어
 *
 * 세션 확인 + Zanzibar 시스템 레벨 moderator 권한 체크
 * - admin 권한자도 moderator 상속으로 통과
 * - 권한 없으면 에러 throw
 * - Server Component, Server Action, API Route에서 사용
 *
 * @throws Error - 로그인 필요 또는 권한 부족 시
 */
export async function requireModerator(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized: 로그인이 필요합니다.');
  }

  const hasModeratorPermission = await check(
    session.user.id,
    'system',
    'global',
    'moderator'
  );

  if (!hasModeratorPermission) {
    throw new Error('Forbidden: 모더레이터 이상 권한이 필요합니다.');
  }

  return session.user.id;
}

/**
 * 관리자 여부 확인 (권한 에러 throw 없음)
 *
 * UI에서 관리자 메뉴 표시 여부 등을 판단할 때 사용
 *
 * @returns Promise<boolean> - 관리자 권한 여부
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    return await check(
      session.user.id,
      'system',
      'global',
      'admin'
    );
  } catch {
    return false;
  }
}

/**
 * 모더레이터 여부 확인 (권한 에러 throw 없음)
 *
 * UI에서 모더레이터 기능 표시 여부 등을 판단할 때 사용
 *
 * @returns Promise<boolean> - 모더레이터 이상 권한 여부
 */
export async function isModerator(): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    return await check(
      session.user.id,
      'system',
      'global',
      'moderator'
    );
  } catch {
    return false;
  }
}
