# 바이브코딩 커뮤니티 개선 작업 로드맵

**프로젝트**: 바이브코딩 커뮤니티 플랫폼
**브랜치**: Y1
**작성일**: 2025-11-24
**목표**: 보안 강화, 성능 최적화, 품질 보증 확립

---

## 📋 작업 개요

총 12개 개선 항목을 3개 Phase로 나누어 진행합니다.

- **Phase 1 (P0)**: 보안 및 안정성 강화 (1-2주, 필수)
- **Phase 2 (P1)**: 성능 및 품질 개선 (2-4주, 권장)
- **Phase 3 (P2)**: 최적화 및 확장성 (1-3개월, 선택)

---

## 🔴 Phase 1: 보안 및 안정성 강화 (P0 - 즉시 개선)

**목표**: 프로덕션 배포 전 필수 보안 취약점 해결
**예상 기간**: 1-2주
**담당**: 보안 엔지니어, 백엔드 개발자

### Task 1.1: 비밀번호 해싱 구현 ⚡ 2-3시간

**위치**: `src/lib/auth.ts`, `src/app/api/auth/signup/route.ts`

- [ ] **1.1.1** bcrypt 패키지 설치
  ```bash
  npm install bcrypt @types/bcrypt
  ```

- [ ] **1.1.2** 회원가입 API 수정 (`src/app/api/auth/signup/route.ts`)
  - 비밀번호 해싱 로직 추가
  - 최소 8자, 영문+숫자+특수문자 검증

- [ ] **1.1.3** 로그인 검증 수정 (`src/lib/auth.ts:97-114`)
  - bcrypt.compare()로 비밀번호 검증
  - 평문 비교 제거

- [ ] **1.1.4** 개발 환경 admin 계정 해싱 적용
  - 하드코딩된 "admin123"을 해싱된 값으로 변경

- [ ] **1.1.5** 테스트: 회원가입 → 로그인 플로우 검증

**산출물**: 모든 비밀번호가 bcrypt로 해싱됨

---

### Task 1.2: Rate Limiting 추가 ⚡ 3-4시간

**위치**: `src/lib/rate-limit.ts` (신규), API 라우트 전체

- [ ] **1.2.1** Upstash Redis 설정
  ```bash
  npm install @upstash/ratelimit @upstash/redis
  ```
  - Upstash 계정 생성 및 Redis 인스턴스 생성
  - `.env`에 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 추가

- [ ] **1.2.2** Rate Limit 미들웨어 생성 (`src/lib/rate-limit.ts`)
  - `authRateLimit`: 5회/분 (로그인, 회원가입)
  - `apiRateLimit`: 100회/분 (일반 API)
  - `postRateLimit`: 3회/분 (게시글 작성)

- [ ] **1.2.3** 인증 API에 Rate Limiting 적용
  - `src/app/api/auth/signin/route.ts`
  - `src/app/api/auth/signup/route.ts`

- [ ] **1.2.4** 게시글 작성 API에 Rate Limiting 적용
  - `src/app/api/posts/route.ts` (POST)
  - `src/app/api/comments/route.ts` (POST)

- [ ] **1.2.5** 테스트: 연속 요청 시 429 에러 확인

**산출물**: DDoS 공격 방어, 무차별 대입 공격 차단

---

### Task 1.3: 관리자 권한 체크 완성 ⚡ 1시간

**위치**: `src/app/admin/layout.tsx:35`

- [ ] **1.3.1** TODO 제거 및 Zanzibar check() 호출
  ```typescript
  const isAdmin = await check(session.user.id, 'system', 'global', 'admin');
  if (!isAdmin) {
    redirect('/403');
  }
  ```

- [ ] **1.3.2** 403 페이지 생성 (`src/app/403/page.tsx`)
  - "접근 권한이 없습니다" 메시지
  - 홈으로 돌아가기 버튼

- [ ] **1.3.3** 테스트: 일반 사용자로 `/admin` 접근 시 403 페이지 표시

**산출물**: 관리자 패널 접근 제어 완료

---

### Task 1.4: API 통합 테스트 작성 ⚡ 8-10시간

**위치**: `__tests__/api/` (신규)

- [ ] **1.4.1** Jest 설정
  ```bash
  npm install --save-dev jest @types/jest ts-jest
  npm install --save-dev @testing-library/react @testing-library/jest-dom
  ```
  - `jest.config.js` 생성
  - `tsconfig.json`에 테스트 경로 추가

- [ ] **1.4.2** Posts API 테스트 (`__tests__/api/posts.test.ts`)
  - GET /api/posts (목록 조회)
  - POST /api/posts (인증 필요)
  - PUT /api/posts/[id] (권한 체크)
  - DELETE /api/posts/[id] (소유자만)

- [ ] **1.4.3** Auth API 테스트 (`__tests__/api/auth.test.ts`)
  - POST /api/auth/signup (회원가입)
  - 로그인 플로우 (NextAuth)

- [ ] **1.4.4** Permissions 테스트 (`__tests__/lib/permissions.test.ts`)
  - Zanzibar check() 상속 테스트
  - 시스템 admin 권한 테스트

- [ ] **1.4.5** Comments API 테스트 (`__tests__/api/comments.test.ts`)
  - POST /api/posts/[id]/comments
  - DELETE /api/comments/[id]

- [ ] **1.4.6** Votes API 테스트 (`__tests__/api/votes.test.ts`)
  - POST /api/posts/[id]/vote

- [ ] **1.4.7** CI/CD 통합 (`.github/workflows/test.yml`)
  ```yaml
  - run: npm run test
  - run: npm run test:e2e
  ```

**산출물**: 핵심 API 60% 테스트 커버리지 달성

---

## 🟡 Phase 2: 성능 및 품질 개선 (P1 - 단기 개선)

**목표**: 사용자 경험 향상 및 코드 품질 개선
**예상 기간**: 2-4주
**담당**: 풀스택 개발자, QA 엔지니어

### Task 2.1: Next.js 캐싱 전략 구현 ⚡ 4-5시간

**위치**: `src/lib/data-access/*.ts`

- [ ] **2.1.1** `getPostsByCategory`에 unstable_cache 적용
  ```typescript
  export const getPostsByCategory = unstable_cache(
    async (categorySlug: string) => { /* ... */ },
    ['posts-by-category'],
    { revalidate: 60, tags: ['posts'] }
  );
  ```

- [ ] **2.1.2** `getCategoryBySlug`에 캐싱 적용 (10분 캐시)

- [ ] **2.1.3** `getUserByUsername`에 캐싱 적용 (5분 캐시)

- [ ] **2.1.4** 게시글 작성 시 revalidateTag('posts') 호출

- [ ] **2.1.5** 댓글 작성 시 revalidateTag(['posts', 'comments']) 호출

- [ ] **2.1.6** 성능 측정: Lighthouse 점수 비교 (Before/After)

**산출물**: 페이지 로딩 속도 30-50% 향상

---

### Task 2.2: API 에러 핸들링 통일 ⚡ 3-4시간

**위치**: `src/lib/api-middleware.ts` (신규)

- [ ] **2.2.1** `withErrorHandling` 미들웨어 생성
  - Prisma 에러 핸들링 (P2002: 중복, P2025: 미존재)
  - Zod 검증 에러 핸들링
  - 일반 에러 핸들링

- [ ] **2.2.2** Sentry 에러 로깅 통합
  ```typescript
  import * as Sentry from '@sentry/nextjs';
  Sentry.captureException(error);
  ```

- [ ] **2.2.3** 모든 POST API에 미들웨어 적용 (5개)

- [ ] **2.2.4** 모든 PUT/DELETE API에 미들웨어 적용 (8개)

- [ ] **2.2.5** 에러 응답 형식 통일 확인

**산출물**: 일관된 에러 응답, 디버깅 용이성 향상

---

### Task 2.3: Zod 입력 검증 통일 ⚡ 5-6시간

**위치**: `src/lib/schemas/` (신규)

- [ ] **2.3.1** Post 스키마 생성 (`src/lib/schemas/post.ts`)
  - createPostSchema, updatePostSchema

- [ ] **2.3.2** Comment 스키마 생성 (`src/lib/schemas/comment.ts`)

- [ ] **2.3.3** User 스키마 생성 (`src/lib/schemas/user.ts`)
  - signupSchema, updateProfileSchema

- [ ] **2.3.4** Answer 스키마 생성 (`src/lib/schemas/answer.ts`)

- [ ] **2.3.5** 모든 POST API에 Zod 검증 적용

- [ ] **2.3.6** 검증 실패 시 명확한 에러 메시지 확인

**산출물**: 데이터 무결성 보장, 명확한 에러 메시지

---

### Task 2.4: Reputation 시스템 완성 ⚡ 2-3시간

**위치**: `src/app/api/answers/route.ts:214`, `src/app/api/posts/route.ts`

- [ ] **2.4.1** 답변 작성 시 reputation 보상 (+15)
  ```typescript
  await prisma.$transaction([
    prisma.answer.create({ data: {...} }),
    prisma.user.update({
      where: { id: authorId },
      data: { reputation: { increment: 15 } }
    })
  ]);
  ```

- [ ] **2.4.2** 게시글 작성 시 reputation 보상 (+5)

- [ ] **2.4.3** 댓글 작성 시 reputation 보상 (+2)

- [ ] **2.4.4** 답변 채택 시 reputation 보상 (+25, 채택받은 사용자)

- [ ] **2.4.5** 투표 받을 때 reputation 변화 (+10 upvote, -2 downvote)

- [ ] **2.4.6** TODO 코멘트 제거

**산출물**: 완전한 Reputation 시스템 구현

---

## 🟢 Phase 3: 최적화 및 확장성 (P2 - 장기 개선)

**목표**: 확장 가능한 아키텍처 구축
**예상 기간**: 1-3개월
**담당**: 시니어 개발자, DevOps 엔지니어

### Task 3.1: Full-Text Search 구현 ⚡ 8-12시간

**위치**: `prisma/schema.prisma`, `src/lib/search.ts`

- [ ] **3.1.1** PostgreSQL tsvector 추가
  ```prisma
  model Post {
    searchVector Unsupported("tsvector")?
    @@index([searchVector], type: Gin)
  }
  ```

- [ ] **3.1.2** 마이그레이션 생성 및 실행

- [ ] **3.1.3** 검색 함수 수정 (`src/lib/search.ts`)
  - to_tsquery() 사용
  - 한글 형태소 분석 설정

- [ ] **3.1.4** 검색 결과 랭킹 적용 (ts_rank)

- [ ] **3.1.5** 성능 테스트: 1만 개 게시글 검색 속도 측정

**대안**: Elasticsearch, Typesense, Algolia 도입 검토

**산출물**: 검색 성능 10배 향상

---

### Task 3.2: 동적 Import 최적화 ⚡ 3-4시간

**위치**: 무거운 컴포넌트 (Editor, ImageUploader, Recharts)

- [ ] **3.2.1** Editor 컴포넌트 동적 import
  ```typescript
  const Editor = dynamic(() => import('@/components/Editor'), {
    loading: () => <EditorSkeleton />,
    ssr: false
  });
  ```

- [ ] **3.2.2** ImageUploader 동적 import

- [ ] **3.2.3** Recharts (PerformanceChart) 동적 import

- [ ] **3.2.4** 번들 크기 분석
  ```bash
  ANALYZE=true npm run build
  ```

- [ ] **3.2.5** Skeleton 컴포넌트 생성 (로딩 UI)

- [ ] **3.2.6** Lighthouse 점수 측정 (Before/After)

**산출물**: 초기 로딩 속도 10-20% 향상, 번들 크기 감소

---

### Task 3.3: Audit Trail 시스템 ⚡ 6-8시간

**위치**: `prisma/schema.prisma`, Prisma middleware

- [ ] **3.3.1** AuditLog 모델 추가
  ```prisma
  model AuditLog {
    id         String   @id @default(cuid())
    userId     String?
    action     String   // CREATE, UPDATE, DELETE
    entityType String   // Post, Comment, User
    entityId   String
    changes    Json
    createdAt  DateTime @default(now())

    @@index([entityType, entityId])
    @@index([userId])
  }
  ```

- [ ] **3.3.2** Prisma middleware 생성 (`src/lib/prisma-audit.ts`)
  - 자동 감사 로그 기록

- [ ] **3.3.3** 관리자 감사 로그 페이지 (`src/app/admin/audit-logs/page.tsx`)
  - 필터링 (날짜, 사용자, 액션)
  - 페이지네이션

- [ ] **3.3.4** 민감 정보 제외 (비밀번호 등)

**산출물**: 규정 준수, 보안 감사, 디버깅 용이성

---

### Task 3.4: 컴포넌트 테스트 작성 ⚡ 10-12시간

**위치**: `__tests__/components/` (신규)

- [ ] **3.4.1** PostCard 테스트
  - 게시글 정보 표시 확인
  - 투표 버튼 클릭 테스트

- [ ] **3.4.2** CommentItem 테스트
  - 댓글 렌더링 확인
  - 삭제 버튼 권한 체크

- [ ] **3.4.3** VoteButtons 테스트
  - upvote/downvote 토글
  - 인증 필요 확인

- [ ] **3.4.4** Editor 테스트 (TipTap)
  - 텍스트 입력 확인
  - 포맷팅 버튼 테스트

- [ ] **3.4.5** NotificationBell 테스트
  - 알림 목록 표시
  - 읽음 처리

- [ ] **3.4.6** Header 테스트
  - 네비게이션 링크 확인
  - 로그인/로그아웃 버튼

- [ ] **3.4.7** SearchBar 테스트
  - 검색 입력 확인
  - 검색 결과 페이지 이동

- [ ] **3.4.8** FilterBar 테스트
  - 카테고리 필터링
  - 정렬 옵션 변경

- [ ] **3.4.9** MarkdownRenderer 테스트
  - 마크다운 파싱 확인
  - XSS 방어 확인

- [ ] **3.4.10** 테스트 커버리지 80% 달성 확인

**산출물**: UI 안정성, 회귀 테스트 자동화

---

## 📊 진행 상황 추적

### Phase 1 진행률: 0% (0/4 완료)
- [ ] Task 1.1: 비밀번호 해싱 구현
- [ ] Task 1.2: Rate Limiting 추가
- [ ] Task 1.3: 관리자 권한 체크 완성
- [ ] Task 1.4: API 통합 테스트 작성

### Phase 2 진행률: 0% (0/4 완료)
- [ ] Task 2.1: Next.js 캐싱 전략 구현
- [ ] Task 2.2: API 에러 핸들링 통일
- [ ] Task 2.3: Zod 입력 검증 통일
- [ ] Task 2.4: Reputation 시스템 완성

### Phase 3 진행률: 0% (0/4 완료)
- [ ] Task 3.1: Full-Text Search 구현
- [ ] Task 3.2: 동적 Import 최적화
- [ ] Task 3.3: Audit Trail 시스템
- [ ] Task 3.4: 컴포넌트 테스트 작성

---

## 🎯 성공 지표 (KPI)

### 보안 지표
- [ ] 비밀번호 해싱 100% 적용
- [ ] Rate Limiting API 커버리지 100%
- [ ] 권한 체크 통과율 100%
- [ ] OAuth 설정 검증 통과

### 성능 지표
- [ ] 페이지 로딩 속도 30-50% 향상 (캐싱)
- [ ] 번들 크기 20% 감소 (동적 import)
- [ ] Lighthouse 점수 90+ 달성
- [ ] Time to Interactive (TTI) < 3초

### 품질 지표
- [ ] 테스트 커버리지 60% 이상 (API 중심)
- [ ] 프로덕션 에러율 < 0.1%
- [ ] TypeScript 엄격 모드 100% 준수
- [ ] TODO 코멘트 0개

---

## 📝 작업 규칙

### 체크리스트 규칙
- [ ] 미완료 항목
- [x] 완료 항목
- [~] 진행 중 항목 (선택 사항)
- [-] 스킵 항목 (선택 사항)

### 커밋 규칙
```bash
# Task 단위 커밋
git commit -m "feat(auth): 비밀번호 해싱 구현 (Task 1.1)"

# Sub-task 단위 커밋
git commit -m "feat(auth): bcrypt 패키지 설치 및 설정 (Task 1.1.1)"

# 문서 업데이트
git commit -m "docs: TASK.md Task 1.1 완료 체크"
```

### 브랜치 전략
- `main`: 프로덕션 배포 브랜치
- `Y1`: 개선 작업 브랜치 (현재)
- `Y1-task-1.1`: 개별 Task 브랜치 (선택 사항)

---

## 🚀 빠른 시작 가이드

### Week 1: Phase 1 집중 (보안 강화)
```bash
# Day 1-2
- Task 1.1: 비밀번호 해싱
- Task 1.2: Rate Limiting

# Day 3
- Task 1.3: 관리자 권한 체크

# Day 4-5
- Task 1.4: API 통합 테스트
```

### Week 2: Phase 2 시작 (성능 개선)
```bash
# Day 1-2
- Task 2.1: Next.js 캐싱

# Day 3
- Task 2.2: API 에러 핸들링

# Day 4-5
- Task 2.3: Zod 검증
- Task 2.4: Reputation 시스템
```

### Week 3-4: Phase 2 완료 및 Phase 3 선택적 진행
```bash
# 우선순위에 따라 선택적 구현
- Task 3.1: Full-Text Search (검색 중요 시)
- Task 3.2: 동적 Import (속도 중요 시)
- Task 3.4: 컴포넌트 테스트 (안정성 중요 시)
```

---

## 📚 참고 문서

- [프로젝트 분석 보고서](./docs/ANALYSIS_REPORT.md)
- [PRD](./docs/PRD.md)
- [데이터베이스 아키텍처](./docs/Database_Architecture.md)
- [Supabase 설정 가이드](./docs/Supabase_Setup_Guide.md)

---

**마지막 업데이트**: 2025-11-24
**작성자**: Claude Code
**버전**: 1.0.0
