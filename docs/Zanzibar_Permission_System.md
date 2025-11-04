# Zanzibar 권한 시스템 가이드

**작성일**: 2025-11-04
**대상**: 바이브코딩 커뮤니티 플랫폼 개발팀
**목적**: Google Zanzibar 권한 시스템 이해 및 실전 적용 가이드

---

## 1. Google Zanzibar란?

### 1.1 개요

**Google Zanzibar**는 구글이 2019년 논문으로 공개한 **글로벌 분산 권한 부여 시스템**입니다.

- **출처**: [Google Research - Zanzibar Paper (2019)](https://research.google/pubs/pub48190/)
- **사용처**: YouTube, Google Drive, Google Photos, Google Cloud, Gmail 등
- **특징**:
  - 초당 수백만 건의 권한 체크 처리
  - 전 세계 데이터센터에 분산 배포
  - 밀리초 단위 지연 시간
  - 일관성 있는 권한 관리

### 1.2 왜 Zanzibar인가?

**전통적인 RBAC (Role-Based Access Control)의 한계**:
```
문제 1: 역할 폭발 (Role Explosion)
- 사용자 역할: Admin, Moderator, User
- 하지만... "Post 123의 작성자"는 어떻게 표현?
- 결과: 무한히 증가하는 역할 정의

문제 2: 복잡한 관계 표현 불가
- "그룹 A의 멤버는 문서 X를 볼 수 있다"
- "문서 X의 소유자가 속한 폴더의 관리자"
- RBAC로는 표현 불가능

문제 3: 확장성 문제
- 역할과 권한이 늘어날수록 관리 복잡도 기하급수적 증가
```

**Zanzibar의 해결책: ReBAC (Relationship-Based Access Control)**:
```
핵심 아이디어:
"권한은 '관계(Relation)'로 정의된다"

예시:
- user:alice는 post:123의 owner이다
- user:bob는 category:free의 moderator이다
- user:charlie는 folder:abc의 viewer이고,
  folder:abc의 parent는 folder:xyz이므로,
  user:charlie는 folder:xyz의 viewer이기도 하다 (상속)
```

---

## 2. Zanzibar 핵심 개념

### 2.1 Relation Tuple (관계 튜플)

**정의**: `(namespace:object_id, relation, subject_type:subject_id)` 형태의 3요소 구조

**구성 요소**:
```yaml
namespace:
  의미: "리소스 종류"
  예시: "post", "comment", "category", "system"

object_id:
  의미: "구체적인 리소스 ID"
  예시: "post_123", "category_free", "global"

relation:
  의미: "관계 종류"
  예시: "owner", "editor", "viewer", "moderator", "admin"

subject_type:
  의미: "주체 종류"
  예시: "user", "group", "user_set"

subject_id:
  의미: "구체적인 주체 ID"
  예시: "user_alice", "group_admins", "*" (공개)
```

**실전 예시**:
```
튜플: (post:123, owner, user:alice)
해석: "사용자 alice는 게시글 123의 소유자이다"

튜플: (category:free, moderator, user:bob)
해석: "사용자 bob는 자유게시판 카테고리의 모더레이터이다"

튜플: (system:global, admin, user:admin_user)
해석: "사용자 admin_user는 시스템 전체의 관리자이다"

튜플: (post:456, viewer, user:*)
해석: "모든 사용자(*는 와일드카드)는 게시글 456을 볼 수 있다"
```

### 2.2 Relation (관계) 종류

**바이브코딩 플랫폼의 관계 정의**:

| Relation | 의미 | 적용 대상 | 권한 |
|----------|------|-----------|------|
| `owner` | 소유자 | Post, Comment, Question, Answer | 생성/읽기/수정/삭제 |
| `editor` | 편집자 | Post, Question | 읽기/수정 |
| `viewer` | 열람자 | Post, Category | 읽기 |
| `moderator` | 모더레이터 | Category, System | 관리/삭제 |
| `admin` | 관리자 | System | 모든 권한 |
| `member` | 멤버 | Category, Group | 기본 접근 |

### 2.3 Permission Inheritance (권한 상속)

**상속 체계**:
```
owner (소유자)
  ↓ 상속
editor (편집자)
  ↓ 상속
viewer (열람자)

admin (시스템 관리자)
  ↓ 상속
moderator (모더레이터)
  ↓ 상속
member (멤버)
```

**실전 예시**:
```typescript
// alice는 post:123의 owner
튜플: (post:123, owner, user:alice)

// owner는 editor 권한도 보유 (상속)
check(alice, 'post', '123', 'editor')  // ✅ true

// owner는 viewer 권한도 보유 (상속)
check(alice, 'post', '123', 'viewer')  // ✅ true
```

**구현 코드** (lib/permissions.ts):
```typescript
const inheritanceMap: Record<Relation, Relation[]> = {
  viewer: [],                      // viewer는 상속 없음
  editor: ['viewer'],              // editor는 viewer 권한 상속
  owner: ['editor', 'viewer'],     // owner는 editor + viewer 권한 상속
  member: [],
  moderator: ['member'],
  admin: ['moderator', 'member'],
};
```

---

## 3. Zanzibar API (3대 연산)

### 3.1 Check API: 권한 확인

**목적**: "사용자 X가 리소스 Y에 대해 Z 권한을 가지고 있는가?"

**함수 시그니처**:
```typescript
async function check(
  userId: string,
  namespace: Namespace,
  objectId: string,
  relation: Relation
): Promise<boolean>
```

**예시**:
```typescript
// alice가 post:123을 수정(editor)할 수 있는가?
const canEdit = await check('alice', 'post', '123', 'editor');

if (canEdit) {
  // 게시글 수정 로직
} else {
  throw new Error('Forbidden: 수정 권한이 없습니다.');
}
```

**Check API의 4단계 로직**:

```typescript
// 1단계: 직접 권한 확인
const directPermission = await prisma.relationTuple.findFirst({
  where: {
    namespace: 'post',
    objectId: '123',
    relation: 'editor',
    subjectType: 'user',
    subjectId: 'alice',
  },
});
if (directPermission) return true;  // (post:123, editor, user:alice) 튜플 존재

// 2단계: 상속 권한 확인
// alice가 owner라면, editor 권한도 보유 (상속)
const inheritedPermission = await prisma.relationTuple.findFirst({
  where: {
    namespace: 'post',
    objectId: '123',
    relation: { in: ['owner'] },  // owner는 editor를 상속
    subjectType: 'user',
    subjectId: 'alice',
  },
});
if (inheritedPermission) return true;

// 3단계: 시스템 레벨 권한 확인
// alice가 시스템 관리자라면, 모든 게시글에 대한 권한 보유
const systemAdmin = await prisma.relationTuple.findFirst({
  where: {
    namespace: 'system',
    objectId: 'global',
    relation: 'admin',
    subjectId: 'alice',
  },
});
if (systemAdmin) return true;

// 4단계: 와일드카드(공개) 확인
// (post:123, viewer, user:*) → 모든 사용자가 볼 수 있음
const publicPermission = await prisma.relationTuple.findFirst({
  where: {
    namespace: 'post',
    objectId: '123',
    relation: 'viewer',
    subjectId: '*',
  },
});
return !!publicPermission;
```

### 3.2 Write API: 권한 부여

**목적**: "사용자 X에게 리소스 Y에 대한 Z 권한을 부여한다"

**함수 시그니처**:
```typescript
async function grant(
  namespace: Namespace,
  objectId: string,
  relation: Relation,
  subjectType: SubjectType,
  subjectId: string
): Promise<RelationTuple | null>
```

**예시**:
```typescript
// 게시글 생성 시: alice에게 post:123의 owner 권한 부여
await grant('post', '123', 'owner', 'user', 'alice');

// 협업 시: bob에게 post:123의 editor 권한 부여
await grant('post', '123', 'editor', 'user', 'bob');

// 공개 게시글 설정: 모든 사용자에게 viewer 권한
await grant('post', '123', 'viewer', 'user', '*');
```

**실전 사용 (API Route)**:
```typescript
// POST /api/posts - 게시글 생성
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, categoryId } = await request.json();

  // 1. 게시글 생성
  const post = await prisma.post.create({
    data: { title, content, categoryId, authorId: session.user.id },
  });

  // 2. 작성자에게 owner 권한 자동 부여 (Zanzibar)
  await grantPostOwnership(post.id, session.user.id);

  return NextResponse.json(post);
}
```

### 3.3 Delete API: 권한 제거

**목적**: "사용자 X로부터 리소스 Y에 대한 Z 권한을 제거한다"

**함수 시그니처**:
```typescript
async function revoke(
  namespace: Namespace,
  objectId: string,
  relation: Relation,
  subjectType: SubjectType,
  subjectId: string
): Promise<void>
```

**예시**:
```typescript
// bob의 editor 권한 제거
await revoke('post', '123', 'editor', 'user', 'bob');

// 리소스 삭제 시: 모든 권한 제거
await revokeAll('post', '123');
```

**실전 사용 (게시글 삭제)**:
```typescript
// DELETE /api/posts/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. 권한 체크: owner 또는 moderator만 삭제 가능
  const canDelete = await checkAny(
    session.user.id,
    'post',
    params.id,
    ['owner', 'moderator']
  );

  if (!canDelete) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. 게시글 삭제
  await prisma.post.delete({ where: { id: params.id } });

  // 3. Zanzibar 권한 튜플 모두 제거
  await revokeAll('post', params.id);

  return NextResponse.json({ success: true });
}
```

---

## 4. 실전 시나리오

### 시나리오 1: 게시글 생성 및 권한 부여

**요구사항**: 사용자가 게시글을 작성하면, 자동으로 owner 권한을 부여하고, 모든 사용자가 읽을 수 있게 설정

```typescript
// POST /api/posts
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, categoryId, isPublic } = await request.json();

  // 1. 게시글 생성
  const post = await prisma.post.create({
    data: {
      title,
      content,
      categoryId,
      authorId: userId,
    },
  });

  // 2. Zanzibar 권한 부여
  // - 작성자에게 owner 권한
  await grant('post', post.id, 'owner', 'user', userId);

  // - 공개 게시글이면 모든 사용자에게 viewer 권한
  if (isPublic) {
    await grant('post', post.id, 'viewer', 'user', '*');
  }

  return NextResponse.json(post, { status: 201 });
}
```

**생성되는 튜플**:
```
튜플 1: (post:새게시글ID, owner, user:작성자ID)
튜플 2: (post:새게시글ID, viewer, user:*)  // isPublic=true 일 때
```

### 시나리오 2: 게시글 수정 권한 체크

**요구사항**: owner와 editor만 게시글을 수정할 수 있음

```typescript
// PATCH /api/posts/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Zanzibar Check: editor 권한 확인 (owner는 editor를 상속하므로 통과)
  const canEdit = await check(userId, 'post', params.id, 'editor');

  if (!canEdit) {
    return NextResponse.json(
      { error: 'Forbidden: 수정 권한이 없습니다.' },
      { status: 403 }
    );
  }

  const { title, content } = await request.json();

  const updatedPost = await prisma.post.update({
    where: { id: params.id },
    data: { title, content },
  });

  return NextResponse.json(updatedPost);
}
```

**권한 체크 흐름**:
```
1. check(alice, 'post', '123', 'editor')
2. 직접 권한 확인: (post:123, editor, user:alice) → 없음
3. 상속 권한 확인: (post:123, owner, user:alice) → 있음!
4. owner는 editor를 상속 → return true ✅
```

### 시나리오 3: 카테고리 모더레이터 권한

**요구사항**:
- 카테고리 모더레이터는 해당 카테고리의 모든 게시글을 삭제할 수 있음
- 시스템 관리자는 모든 카테고리의 게시글을 삭제 가능

```typescript
// DELETE /api/posts/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. 게시글 조회
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { categoryId: true },
  });

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 2. 권한 체크: 여러 조건 중 하나라도 만족하면 삭제 가능
  const isOwner = await check(userId, 'post', params.id, 'owner');
  const isCategoryModerator = await check(
    userId,
    'category',
    post.categoryId,
    'moderator'
  );
  const isSystemAdmin = await check(userId, 'system', 'global', 'admin');

  if (!isOwner && !isCategoryModerator && !isSystemAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. 삭제 수행
  await prisma.post.delete({ where: { id: params.id } });
  await revokeAll('post', params.id);

  return NextResponse.json({ success: true });
}
```

**권한 체크 시나리오**:

```
사용자 alice (일반 사용자):
- isOwner: false
- isCategoryModerator: false
- isSystemAdmin: false
→ ❌ 삭제 불가

사용자 bob (게시글 작성자):
- isOwner: true ✅
→ ✅ 삭제 가능

사용자 charlie (자유게시판 모더레이터):
- isOwner: false
- isCategoryModerator: true ✅ (category:free, moderator, user:charlie)
→ ✅ 삭제 가능

사용자 admin (시스템 관리자):
- isSystemAdmin: true ✅ (system:global, admin, user:admin)
→ ✅ 모든 게시글 삭제 가능
```

### 시나리오 4: 협업 권한 부여

**요구사항**: 게시글 작성자가 다른 사용자를 공동 편집자로 초대

```typescript
// POST /api/posts/[id]/collaborators
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. owner만 협업자를 추가할 수 있음
  const isOwner = await check(userId, 'post', params.id, 'owner');

  if (!isOwner) {
    return NextResponse.json(
      { error: 'Forbidden: owner만 협업자를 초대할 수 있습니다.' },
      { status: 403 }
    );
  }

  const { collaboratorId, role } = await request.json();

  // 2. 협업자에게 권한 부여
  if (role === 'editor') {
    await grant('post', params.id, 'editor', 'user', collaboratorId);
  } else if (role === 'viewer') {
    await grant('post', params.id, 'viewer', 'user', collaboratorId);
  }

  return NextResponse.json({
    message: '협업자가 추가되었습니다.',
    postId: params.id,
    collaboratorId,
    role,
  });
}
```

**생성되는 튜플**:
```
튜플: (post:123, editor, user:협업자ID)
```

---

## 5. 고급 패턴

### 5.1 와일드카드 (Wildcard) 권한

**목적**: 모든 사용자에게 권한 부여 (공개 리소스)

```typescript
// 공개 게시글: 모든 사용자가 볼 수 있음
await grant('post', '123', 'viewer', 'user', '*');

// 체크 시
check('anyone', 'post', '123', 'viewer');  // ✅ true (와일드카드 매칭)
```

**주의사항**:
- `*`는 `subjectId`에만 사용 가능
- 남용 시 보안 문제 발생 가능
- 공개 게시글, 공개 카테고리 등 명확한 경우만 사용

### 5.2 시스템 레벨 권한

**목적**: 전역 권한 관리 (관리자, 모더레이터)

```typescript
// 시스템 관리자 권한 부여
await grant('system', 'global', 'admin', 'user', 'admin_user_id');

// 시스템 모더레이터 권한 부여
await grant('system', 'global', 'moderator', 'user', 'moderator_user_id');

// 권한 체크 시 자동으로 시스템 레벨 권한 확인됨
check('admin_user_id', 'post', 'any_post_id', 'owner');  // ✅ true (admin은 모든 권한 보유)
```

**상속 구조**:
```
system:global admin
  → 모든 namespace의 모든 relation 권한 보유

system:global moderator
  → 모든 namespace의 moderator, editor, viewer 권한 보유
```

### 5.3 여러 권한 체크 (Bulk Permission Check)

**checkAny**: 여러 권한 중 하나라도 있으면 통과

```typescript
// owner 또는 moderator 권한 확인
const canDelete = await checkAny(
  userId,
  'post',
  postId,
  ['owner', 'moderator']
);

if (canDelete) {
  // 삭제 로직
}
```

**checkAll**: 모든 권한을 보유해야 통과

```typescript
// editor이면서 동시에 특정 그룹 멤버인지 확인
const canPublish = await checkAll(
  userId,
  'post',
  postId,
  ['editor', 'publisher']
);
```

### 5.4 접근 가능한 리소스 목록 조회

**목적**: 사용자가 접근 가능한 모든 게시글 ID 조회

```typescript
// alice가 editor 권한을 가진 모든 게시글 조회
const editablePostIds = await listAccessible(
  'alice',
  'post',
  'editor'
);

// Prisma로 실제 게시글 조회
const posts = await prisma.post.findMany({
  where: {
    id: { in: editablePostIds },
  },
});
```

**활용 사례**:
- 대시보드: "내가 관리하는 게시글 목록"
- 권한 필터링: "내가 수정 가능한 문서만 표시"

---

## 6. 성능 최적화

### 6.1 인덱스 전략

**Prisma 스키마의 인덱스 설정**:
```prisma
model RelationTuple {
  // ...

  // 인덱스 1: 권한 체크 최적화 (namespace, objectId, relation)
  @@index([namespace, objectId, relation])

  // 인덱스 2: 사용자 권한 조회 최적화 (subjectType, subjectId)
  @@index([subjectType, subjectId])

  // 인덱스 3: 리스트 필터링 최적화 (namespace, relation, subjectId)
  @@index([namespace, relation, subjectId])
}
```

**인덱스 활용 쿼리**:
```sql
-- 인덱스 1 사용: 특정 리소스의 권한 체크
SELECT * FROM relation_tuples
WHERE namespace = 'post'
  AND objectId = '123'
  AND relation = 'editor';

-- 인덱스 2 사용: 특정 사용자의 모든 권한 조회
SELECT * FROM relation_tuples
WHERE subjectType = 'user'
  AND subjectId = 'alice';

-- 인덱스 3 사용: 특정 권한을 가진 모든 리소스 조회
SELECT * FROM relation_tuples
WHERE namespace = 'post'
  AND relation = 'editor'
  AND subjectId = 'alice';
```

### 6.2 캐싱 전략

**권한 체크 결과 캐싱** (Redis 예시):
```typescript
import { Redis } from 'ioredis';

const redis = new Redis();

export async function checkWithCache(
  userId: string,
  namespace: Namespace,
  objectId: string,
  relation: Relation
): Promise<boolean> {
  // 캐시 키 생성
  const cacheKey = `perm:${namespace}:${objectId}:${relation}:${userId}`;

  // 1. 캐시 확인
  const cached = await redis.get(cacheKey);
  if (cached !== null) {
    return cached === '1';
  }

  // 2. DB 조회
  const result = await check(userId, namespace, objectId, relation);

  // 3. 캐시 저장 (TTL: 5분)
  await redis.setex(cacheKey, 300, result ? '1' : '0');

  return result;
}
```

**캐시 무효화**:
```typescript
// 권한 부여 시 캐시 삭제
export async function grantWithCacheInvalidation(...args) {
  await grant(...args);

  // 캐시 무효화 로직
  const pattern = `perm:${namespace}:${objectId}:*:*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

### 6.3 배치 권한 체크

**N+1 문제 방지**:
```typescript
// ❌ 나쁜 예: 루프 안에서 개별 체크
const posts = await prisma.post.findMany();
for (const post of posts) {
  const canEdit = await check(userId, 'post', post.id, 'editor');
  post.editable = canEdit;
}

// ✅ 좋은 예: 배치 조회
const posts = await prisma.post.findMany();
const postIds = posts.map(p => p.id);

const editablePostIds = await prisma.relationTuple.findMany({
  where: {
    namespace: 'post',
    objectId: { in: postIds },
    relation: 'editor',
    subjectId: userId,
  },
  select: { objectId: true },
});

const editableSet = new Set(editablePostIds.map(t => t.objectId));

for (const post of posts) {
  post.editable = editableSet.has(post.id);
}
```

---

## 7. RBAC vs Zanzibar (ReBAC) 비교

| 비교 항목 | RBAC | Zanzibar (ReBAC) |
|-----------|------|-------------------|
| **권한 모델** | 역할 기반 | 관계 기반 |
| **확장성** | 역할 폭발 문제 | 선형 확장 |
| **복잡한 관계** | 표현 어려움 | 자연스럽게 표현 |
| **상속** | 역할 계층 구조 | 관계 상속 + 시스템 레벨 |
| **동적 권한** | 어려움 | 쉬움 (튜플 추가/삭제) |
| **성능** | O(1) 조회 | O(log n) 조회 (인덱스 최적화 시) |
| **학습 곡선** | 낮음 | 중간~높음 |
| **적용 사례** | 간단한 시스템 | 복잡한 협업 플랫폼 |

**RBAC 예시**:
```typescript
// 역할 정의
enum Role {
  ADMIN,
  MODERATOR,
  USER,
}

// 권한 체크
if (user.role === Role.ADMIN || user.role === Role.MODERATOR) {
  // 삭제 가능
}

// ⚠️ 문제: "Post 123의 작성자"는 어떻게 표현?
// → 불가능, 또는 무한히 증가하는 역할 정의 필요
```

**Zanzibar 예시**:
```typescript
// 튜플 정의
(post:123, owner, user:alice)
(category:free, moderator, user:bob)

// 권한 체크
const canDelete = await checkAny(userId, 'post', '123', ['owner', 'moderator']);

// ✅ 해결: 리소스마다 동적으로 권한 정의 가능
```

---

## 8. 모범 사례 (Best Practices)

### 8.1 권한 부여 시점

**자동 권한 부여**:
```typescript
// ✅ 리소스 생성 시 자동으로 owner 권한 부여
const post = await prisma.post.create({ data: { ... } });
await grantPostOwnership(post.id, userId);
```

**수동 권한 부여**:
```typescript
// ✅ 협업자 초대 등 명시적 권한 부여
await grant('post', postId, 'editor', 'user', collaboratorId);
```

### 8.2 권한 체크 위치

**API Route (Backend)**:
```typescript
// ✅ 필수: 서버 측에서 권한 체크
export async function PATCH(request: Request) {
  const userId = await getUserFromSession();
  const canEdit = await check(userId, 'post', postId, 'editor');

  if (!canEdit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 수정 로직
}
```

**Frontend (Optional)**:
```tsx
// ✅ 선택: UI 렌더링 최적화용
const { data: canEdit } = useSWR(
  `/api/posts/${postId}/permissions?relation=editor`,
  fetcher
);

{canEdit && <EditButton onClick={handleEdit} />}
```

**⚠️ 중요**: Frontend 체크는 UX 개선용일 뿐, 보안은 Backend 체크에 의존!

### 8.3 에러 처리

**명확한 에러 메시지**:
```typescript
try {
  await requirePermission(userId, 'post', postId, 'editor');
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  } else if (error.message.includes('Forbidden')) {
    return NextResponse.json(
      { error: '게시글 수정 권한이 없습니다.' },
      { status: 403 }
    );
  }
  throw error;
}
```

### 8.4 리소스 삭제 시 권한 정리

**권한 튜플 제거**:
```typescript
// ✅ 리소스 삭제 시 관련된 모든 권한 튜플 제거
await prisma.post.delete({ where: { id: postId } });
await revokeAll('post', postId);  // 튜플 정리
```

**이유**:
- 데이터 일관성 유지
- 고아 튜플(orphan tuples) 방지
- 스토리지 최적화

---

## 9. 보안 고려사항

### 9.1 와일드카드 남용 금지

```typescript
// ❌ 위험: 모든 사용자에게 owner 권한 부여
await grant('post', '123', 'owner', 'user', '*');

// ✅ 안전: viewer 권한만 공개
await grant('post', '123', 'viewer', 'user', '*');
```

### 9.2 시스템 관리자 권한 최소화

```typescript
// ✅ 시스템 관리자는 최소한으로 지정
await grantSystemAdmin('trusted_admin_id');

// ❌ 일반 사용자에게 admin 권한 부여 금지
```

### 9.3 권한 체크 우회 방지

```typescript
// ❌ 위험: 권한 체크 없이 직접 DB 수정
await prisma.post.update({ where: { id: postId }, data: { ... } });

// ✅ 안전: 항상 권한 체크 먼저
await requirePermission(userId, 'post', postId, 'editor');
await prisma.post.update({ where: { id: postId }, data: { ... } });
```

### 9.4 프론트엔드 체크의 한계

```typescript
// ❌ 취약: 프론트엔드 체크만 의존
if (canEdit) {
  await fetch(`/api/posts/${postId}`, { method: 'PATCH', ... });
}

// ✅ 안전: 백엔드에서 재검증
// API Route에서 반드시 권한 체크 수행
```

---

## 10. 디버깅 및 모니터링

### 10.1 권한 튜플 조회

**특정 리소스의 모든 권한 조회**:
```typescript
const tuples = await prisma.relationTuple.findMany({
  where: {
    namespace: 'post',
    objectId: '123',
  },
});

console.log('Post 123 권한:', tuples);
// [
//   { relation: 'owner', subjectId: 'alice' },
//   { relation: 'editor', subjectId: 'bob' },
//   { relation: 'viewer', subjectId: '*' },
// ]
```

**특정 사용자의 모든 권한 조회**:
```typescript
const tuples = await prisma.relationTuple.findMany({
  where: {
    subjectType: 'user',
    subjectId: 'alice',
  },
});

console.log('Alice 권한:', tuples);
// [
//   { namespace: 'post', objectId: '123', relation: 'owner' },
//   { namespace: 'category', objectId: 'free', relation: 'moderator' },
// ]
```

### 10.2 권한 체크 로깅

```typescript
export async function checkWithLog(
  userId: string,
  namespace: Namespace,
  objectId: string,
  relation: Relation
): Promise<boolean> {
  const startTime = Date.now();
  const result = await check(userId, namespace, objectId, relation);
  const duration = Date.now() - startTime;

  console.log(`[Permission Check] ${userId} ${namespace}:${objectId} ${relation} → ${result} (${duration}ms)`);

  return result;
}
```

---

## 11. 참고 자료

### 11.1 공식 논문 및 문서

- **Google Zanzibar 논문 (2019)**: https://research.google/pubs/pub48190/
- **Supabase 공식 문서**: https://supabase.com/docs
- **Prisma 공식 문서**: https://www.prisma.io/docs

### 11.2 관련 프로젝트

- **SpiceDB**: Zanzibar 오픈소스 구현 (Go) - https://authzed.com/spicedb
- **Ory Keto**: 클라우드 네이티브 권한 서버 - https://www.ory.sh/keto/
- **OpenFGA**: Auth0의 Zanzibar 구현 - https://openfga.dev/

### 11.3 추가 학습 자료

- **ReBAC 개념 설명**: https://en.wikipedia.org/wiki/Relationship-based_access_control
- **Google Zanzibar 해설 (YouTube)**: 검색어 "Google Zanzibar explained"
- **Prisma + Supabase 통합 가이드**: https://www.prisma.io/docs/guides/database/supabase

---

## 12. 요약 (Summary)

### 핵심 개념
✅ **Zanzibar = Relationship-Based Access Control (ReBAC)**
✅ **Relation Tuple = (namespace:objectId, relation, subjectType:subjectId)**
✅ **3대 API: Check (확인), Write (부여), Delete (제거)**
✅ **Permission Inheritance: owner → editor → viewer**
✅ **System-Level Permissions: admin → moderator**

### 구현 체크리스트
- [x] Prisma 스키마에 RelationTuple 모델 추가
- [x] lib/permissions.ts에 check, grant, revoke 함수 구현
- [x] 상속 로직 구현 (inheritanceMap)
- [x] 시스템 레벨 권한 체크 추가
- [x] API Route에서 requirePermission() 사용
- [x] 리소스 생성 시 자동 권한 부여 (grantPostOwnership 등)
- [x] 리소스 삭제 시 권한 정리 (revokeAll)

### 다음 단계
1. **Week 11 Task 11.1-11.5** 순차 진행 (docs/TASKS.md 참고)
2. **Supabase 프로젝트 생성** (Supabase_Setup_Guide.md 참고)
3. **Prisma 마이그레이션 실행**: `npx prisma migrate dev --name add_zanzibar`
4. **API Route에 권한 체크 통합**
5. **E2E 테스트 작성** (권한 시나리오 검증)

---

**문서 끝**
