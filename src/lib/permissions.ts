/**
 * Zanzibar-style 권한 시스템
 * Google Zanzibar 논문 기반 집중식 권한 부여 시스템
 *
 * 핵심 개념:
 * - Tuple: (namespace:object_id, relation, subject_type:subject_id)
 * - Relation: owner, editor, viewer, moderator, admin
 * - 상속: owner → editor → viewer
 */

import { prisma } from '@/lib/prisma';

// 타입 정의
export type Namespace = 'post' | 'comment' | 'category' | 'system' | 'question' | 'answer';
export type Relation = 'owner' | 'editor' | 'viewer' | 'moderator' | 'admin' | 'member';
export type SubjectType = 'user' | 'group' | 'user_set';

/**
 * Zanzibar Check API: 권한 확인
 *
 * @param userId - 권한을 확인할 사용자 ID
 * @param namespace - 리소스 네임스페이스 (예: 'post')
 * @param objectId - 리소스 ID
 * @param relation - 확인할 관계 (예: 'editor')
 * @returns Promise<boolean> - 권한 유무
 *
 * @example
 * const canEdit = await check('user_123', 'post', 'post_456', 'editor');
 */
export async function check(
  userId: string,
  namespace: Namespace,
  objectId: string,
  relation: Relation
): Promise<boolean> {
  // 1. 직접 권한 확인
  const directPermission = await prisma.relationTuple.findFirst({
    where: {
      namespace,
      objectId,
      relation,
      subjectType: 'user',
      subjectId: userId,
    },
  });

  if (directPermission) return true;

  // 2. 상속 관계 확인 (owner → editor → viewer)
  const inheritanceMap: Record<Relation, Relation[]> = {
    viewer: [],
    editor: ['viewer'],
    owner: ['editor', 'viewer'],
    member: [],
    moderator: ['member'],
    admin: ['moderator', 'member'],
  };

  const parentRelations = Object.entries(inheritanceMap)
    .filter(([_, children]) => children.includes(relation))
    .map(([parent]) => parent as Relation);

  if (parentRelations.length > 0) {
    const inheritedPermission = await prisma.relationTuple.findFirst({
      where: {
        namespace,
        objectId,
        relation: { in: parentRelations },
        subjectType: 'user',
        subjectId: userId,
      },
    });

    if (inheritedPermission) return true;
  }

  // 3. 시스템 레벨 권한 확인 (admin, moderator)
  if (namespace !== 'system') {
    // 시스템 관리자는 모든 권한 보유
    const systemAdmin = await prisma.relationTuple.findFirst({
      where: {
        namespace: 'system',
        objectId: 'global',
        relation: 'admin',
        subjectType: 'user',
        subjectId: userId,
      },
    });

    if (systemAdmin) return true;

    // 모더레이터는 삭제/관리 권한만
    if (relation === 'moderator' || relation === 'admin') {
      const systemModerator = await prisma.relationTuple.findFirst({
        where: {
          namespace: 'system',
          objectId: 'global',
          relation: 'moderator',
          subjectType: 'user',
          subjectId: userId,
        },
      });

      if (systemModerator) return true;
    }
  }

  // 4. 와일드카드 확인 (공개 리소스: subject_id = "*")
  const publicPermission = await prisma.relationTuple.findFirst({
    where: {
      namespace,
      objectId,
      relation,
      subjectType: 'user',
      subjectId: '*',
    },
  });

  return !!publicPermission;
}

/**
 * Zanzibar Write API: 권한 부여
 *
 * @example
 * await grant('post', 'post_123', 'owner', 'user', 'user_456');
 */
export async function grant(
  namespace: Namespace,
  objectId: string,
  relation: Relation,
  subjectType: SubjectType,
  subjectId: string
) {
  try {
    return await prisma.relationTuple.create({
      data: {
        namespace,
        objectId,
        relation,
        subjectType,
        subjectId,
      },
    });
  } catch (error: any) {
    // 이미 존재하는 경우 무시 (unique constraint)
    if (error.code === 'P2002') {
      return null;
    }
    throw error;
  }
}

/**
 * Zanzibar Delete API: 권한 제거
 *
 * @example
 * await revoke('post', 'post_123', 'editor', 'user', 'user_456');
 */
export async function revoke(
  namespace: Namespace,
  objectId: string,
  relation: Relation,
  subjectType: SubjectType,
  subjectId: string
) {
  return await prisma.relationTuple.deleteMany({
    where: {
      namespace,
      objectId,
      relation,
      subjectType,
      subjectId,
    },
  });
}

/**
 * 사용자가 접근 가능한 모든 객체 조회 (List Filtering)
 *
 * @example
 * const postIds = await listAccessible('user_123', 'post', 'viewer');
 */
export async function listAccessible(
  userId: string,
  namespace: Namespace,
  relation: Relation
): Promise<string[]> {
  const tuples = await prisma.relationTuple.findMany({
    where: {
      namespace,
      relation,
      subjectType: 'user',
      subjectId: userId,
    },
    select: {
      objectId: true,
    },
  });

  return tuples.map(t => t.objectId);
}

/**
 * 모든 권한 제거 (리소스 삭제 시 사용)
 *
 * @example
 * await revokeAll('post', 'post_123');
 */
export async function revokeAll(namespace: Namespace, objectId: string) {
  return await prisma.relationTuple.deleteMany({
    where: {
      namespace,
      objectId,
    },
  });
}

// ===== 헬퍼 함수: 특정 리소스 권한 부여 =====

/**
 * 게시글 소유자 권한 자동 부여
 */
export async function grantPostOwnership(postId: string, userId: string) {
  return await grant('post', postId, 'owner', 'user', userId);
}

/**
 * 댓글 소유자 권한 자동 부여
 */
export async function grantCommentOwnership(commentId: string, userId: string) {
  return await grant('comment', commentId, 'owner', 'user', userId);
}

/**
 * 질문 소유자 권한 자동 부여
 */
export async function grantQuestionOwnership(questionId: string, userId: string) {
  return await grant('question', questionId, 'owner', 'user', userId);
}

/**
 * 답변 소유자 권한 자동 부여
 */
export async function grantAnswerOwnership(answerId: string, userId: string) {
  return await grant('answer', answerId, 'owner', 'user', userId);
}

/**
 * 카테고리 모더레이터 권한 부여
 */
export async function grantCategoryModerator(categoryId: string, userId: string) {
  return await grant('category', categoryId, 'moderator', 'user', userId);
}

/**
 * 시스템 관리자 권한 부여
 */
export async function grantSystemAdmin(userId: string) {
  return await grant('system', 'global', 'admin', 'user', userId);
}

/**
 * 시스템 모더레이터 권한 부여
 */
export async function grantSystemModerator(userId: string) {
  return await grant('system', 'global', 'moderator', 'user', userId);
}

// ===== API/미들웨어용 권한 체크 헬퍼 =====

/**
 * 권한 체크 후 에러 throw (미들웨어용)
 *
 * @throws Error - 권한이 없는 경우
 * @example
 * await requirePermission(session?.user?.id, 'post', postId, 'editor');
 */
export async function requirePermission(
  userId: string | undefined,
  namespace: Namespace,
  objectId: string,
  relation: Relation
): Promise<void> {
  if (!userId) {
    throw new Error('Unauthorized: 로그인이 필요합니다.');
  }

  const hasPermission = await check(userId, namespace, objectId, relation);

  if (!hasPermission) {
    throw new Error(
      `Forbidden: ${namespace}:${objectId}에 대한 ${relation} 권한이 없습니다.`
    );
  }
}

/**
 * 여러 권한 중 하나라도 있는지 확인
 *
 * @example
 * const canDelete = await checkAny('user_123', 'post', 'post_456', ['owner', 'moderator']);
 */
export async function checkAny(
  userId: string,
  namespace: Namespace,
  objectId: string,
  relations: Relation[]
): Promise<boolean> {
  for (const relation of relations) {
    if (await check(userId, namespace, objectId, relation)) {
      return true;
    }
  }
  return false;
}

/**
 * 모든 권한을 가지고 있는지 확인
 *
 * @example
 * const hasAll = await checkAll('user_123', 'post', 'post_456', ['viewer', 'editor']);
 */
export async function checkAll(
  userId: string,
  namespace: Namespace,
  objectId: string,
  relations: Relation[]
): Promise<boolean> {
  for (const relation of relations) {
    if (!(await check(userId, namespace, objectId, relation))) {
      return false;
    }
  }
  return true;
}
