import { prisma } from './prisma';
import { Prisma } from '@/generated/prisma';
import { headers } from 'next/headers';

/**
 * 감사 로그 액션 타입
 */
export const AuditAction = {
  // 인증
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SIGNUP: 'SIGNUP',

  // CRUD 작업
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',

  // 권한
  GRANT_PERMISSION: 'GRANT_PERMISSION',
  REVOKE_PERMISSION: 'REVOKE_PERMISSION',

  // 기타
  VOTE: 'VOTE',
  ACCEPT_ANSWER: 'ACCEPT_ANSWER',
} as const;

/**
 * 감사 로그 엔티티 타입
 */
export const AuditEntityType = {
  USER: 'User',
  POST: 'Post',
  COMMENT: 'Comment',
  ANSWER: 'Answer',
  CATEGORY: 'Category',
  VOTE: 'Vote',
  PERMISSION: 'Permission',
  EXTERNAL_TERMS: 'ExternalTerms',
} as const;

/**
 * 감사 로그 기록 인터페이스
 */
export interface LogAuditParams {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * 감사 로그 기록 함수
 *
 * @param params - 감사 로그 파라미터
 * @returns Promise<AuditLog> - 생성된 감사 로그
 *
 * @example
 * ```typescript
 * await logAudit({
 *   userId: session.user.id,
 *   action: AuditAction.CREATE,
 *   entityType: AuditEntityType.POST,
 *   entityId: post.id,
 *   metadata: { title: post.title, categoryId: post.categoryId }
 * });
 * ```
 */
export async function logAudit(params: LogAuditParams) {
  const {
    userId,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress,
    userAgent,
  } = params;

  try {
    // headers()를 호출하여 IP 주소와 User-Agent 자동 추출
    const headersList = await headers();
    const finalIpAddress =
      ipAddress || headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const finalUserAgent = userAgent || headersList.get('user-agent') || 'unknown';

    return await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId: entityId || null,
        metadata: metadata ?? undefined,
        ipAddress: finalIpAddress,
        userAgent: finalUserAgent,
      },
    });
  } catch (error) {
    // 감사 로그 실패 시 에러 로그 출력 (메인 작업은 실패하지 않도록)
    console.error('[AuditLog] 감사 로그 기록 실패:', error);
    // 프로덕션에서는 Sentry 등으로 전송
    return null;
  }
}

/**
 * 특정 사용자의 감사 로그 조회 (관리자 전용)
 *
 * @param userId - 사용자 ID
 * @param limit - 조회 개수 (기본 100)
 * @returns Promise<AuditLog[]>
 */
export async function getUserAuditLogs(userId: string, limit = 100) {
  return await prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          username: true,
          displayName: true,
          email: true,
        },
      },
    },
  });
}

/**
 * 특정 엔티티의 감사 로그 조회 (관리자 전용)
 *
 * @param entityType - 엔티티 타입 (Post, Comment 등)
 * @param entityId - 엔티티 ID
 * @param limit - 조회 개수 (기본 100)
 * @returns Promise<AuditLog[]>
 */
export async function getEntityAuditLogs(
  entityType: string,
  entityId: string,
  limit = 100
) {
  return await prisma.auditLog.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          username: true,
          displayName: true,
          email: true,
        },
      },
    },
  });
}

/**
 * 최근 감사 로그 조회 (관리자 대시보드용)
 *
 * @param limit - 조회 개수 (기본 50)
 * @returns Promise<AuditLog[]>
 */
export async function getRecentAuditLogs(limit = 50) {
  return await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          username: true,
          displayName: true,
          email: true,
        },
      },
    },
  });
}
