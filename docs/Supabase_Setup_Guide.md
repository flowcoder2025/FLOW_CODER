# Supabase 설정 가이드

**작성일**: 2025-11-04
**대상**: 바이브코딩 커뮤니티 플랫폼
**기술 스택**: Next.js 15 + Prisma + Supabase PostgreSQL + Zanzibar 권한 시스템

---

## 1. Supabase 프로젝트 생성

### 1.1 계정 생성 및 프로젝트 초기화

1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. "New Project" 클릭
5. 프로젝트 정보 입력:
   - **Name**: vibe-coding-community
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수)
   - **Region**: Northeast Asia (ap-northeast-1) - 서울 리전
   - **Pricing Plan**: Free (개발용) 또는 Pro (프로덕션)

6. "Create new project" 클릭
7. 프로젝트 생성 완료 (약 2분 소요)

### 1.2 데이터베이스 연결 정보 확인

1. 프로젝트 대시보드 → "Settings" → "Database"
2. **Connection String** 섹션에서 다음 정보 복사:

**Connection pooling (권장):**
```
Session mode:
postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**Direct connection:**
```
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

3. **API Settings** 확인:
   - Project URL: `https://xxx.supabase.co`
   - API Key (anon, public): `eyJ...` (공개 키)

---

## 2. 환경 변수 설정

### 2.1 `.env` 파일 생성

프로젝트 루트에 `.env` 파일 생성:

```env
# ===== Supabase PostgreSQL =====
# Prisma 사용 (Connection Pooling)
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"

# Direct Connection (마이그레이션용)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"

# ===== Supabase Client (선택적 - 실시간 기능용) =====
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# ===== NextAuth (기존 유지) =====
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# OAuth Providers
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"
GOOGLE_ID="your-google-oauth-id"
GOOGLE_SECRET="your-google-oauth-secret"
```

### 2.2 `.env.example` 업데이트

```env
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
```

---

## 3. Prisma 설정

### 3.1 Prisma 스키마 업데이트

`prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // 마이그레이션용 Direct URL
}

// ... 모델 정의
```

### 3.2 Prisma 마이그레이션 실행

```bash
# Prisma Client 생성
npx prisma generate

# 마이그레이션 생성 및 적용
npx prisma migrate dev --name init

# Supabase Studio에서 테이블 확인
# https://app.supabase.com → Table Editor
```

### 3.3 Prisma Studio로 데이터 확인

```bash
npx prisma studio
# http://localhost:5555 에서 확인
```

---

## 4. Supabase Client 설정 (선택적)

실시간 기능, Storage, Auth를 사용할 경우:

### 4.1 Supabase 라이브러리 설치

```bash
npm install @supabase/supabase-js
```

### 4.2 `lib/supabase.ts` 생성

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.3 실시간 구독 예시

```typescript
// 게시글 실시간 업데이트 구독
const channel = supabase
  .channel('posts-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'Post' },
    (payload) => {
      console.log('Change received!', payload);
      // UI 업데이트 로직
    }
  )
  .subscribe();
```

---

## 5. Supabase Row Level Security (RLS) 설정

### 5.1 RLS 활성화

Supabase Dashboard → Authentication → Policies

### 5.2 기본 정책 예시

```sql
-- Public posts are viewable by everyone
CREATE POLICY "Public posts are viewable"
ON "Post" FOR SELECT
USING (true);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON "Post" FOR UPDATE
USING (auth.uid()::text = "authorId");

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
ON "Post" FOR DELETE
USING (auth.uid()::text = "authorId");

-- Users can insert their own posts
CREATE POLICY "Users can insert posts"
ON "Post" FOR INSERT
WITH CHECK (auth.uid()::text = "authorId");
```

### 5.3 Zanzibar 권한과 RLS 통합

```sql
-- Authorized users can update posts
CREATE POLICY "Authorized users can update posts"
ON "Post" FOR UPDATE
USING (
  auth.uid()::text = "authorId"
  OR EXISTS (
    SELECT 1 FROM "relation_tuples"
    WHERE namespace = 'post'
    AND "objectId" = "Post".id
    AND relation IN ('owner', 'editor')
    AND "subjectId" = auth.uid()::text
  )
);
```

**참고**: RLS는 선택적입니다. Application 레벨 권한 체크(`lib/permissions.ts`)만으로도 충분합니다.

---

## 6. 배포 설정 (Vercel)

### 6.1 Vercel 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables:

| 변수명 | 값 | 환경 |
|--------|------|------|
| `DATABASE_URL` | Connection pooling URL | Production, Preview, Development |
| `DIRECT_URL` | Direct connection URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Production, Preview, Development |
| `NEXTAUTH_URL` | Production URL | Production |
| `NEXTAUTH_SECRET` | Random secret | Production, Preview, Development |

### 6.2 빌드 명령어 설정

Vercel Dashboard → Settings → Build & Development Settings:

**Build Command:**
```bash
npx prisma generate && npx prisma migrate deploy && next build
```

**Install Command:**
```bash
npm install
```

### 6.3 `vercel.json` (선택적)

```json
{
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && next build",
  "framework": "nextjs",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database_url",
    "DIRECT_URL": "@direct_url",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  }
}
```

---

## 7. 데이터베이스 백업 및 복구

### 7.1 자동 백업 (Supabase Pro 이상)

Supabase Dashboard → Database → Backups

- Daily backups (7일 보관)
- Point-in-time recovery (PITR)

### 7.2 수동 백업

```bash
# pg_dump로 백업
pg_dump "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" > backup.sql

# 복구
psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" < backup.sql
```

---

## 8. 모니터링 및 로그

### 8.1 Supabase Dashboard

- **Logs**: Database 쿼리 로그
- **Reports**: 성능 및 사용량 리포트
- **API**: API 호출 통계

### 8.2 Prisma 쿼리 로깅

```typescript
// lib/prisma.ts
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],  // 쿼리 로깅
});
```

---

## 9. 성능 최적화

### 9.1 Connection Pooling

- **PgBouncer** 사용 (Supabase 기본 제공)
- `?pgbouncer=true` 파라미터 추가

### 9.2 인덱스 최적화

```sql
-- 자주 조회되는 컬럼에 인덱스 추가
CREATE INDEX idx_post_category ON "Post"("categoryId");
CREATE INDEX idx_post_author ON "Post"("authorId");
CREATE INDEX idx_comment_post ON "Comment"("postId");

-- Zanzibar 권한 튜플 인덱스 (Prisma에서 자동 생성)
CREATE INDEX idx_relation_check ON "relation_tuples"(namespace, "objectId", relation);
CREATE INDEX idx_subject_lookup ON "relation_tuples"("subjectType", "subjectId");
```

### 9.3 쿼리 최적화

```typescript
// N+1 문제 방지: include 사용
const posts = await prisma.post.findMany({
  include: {
    author: { select: { id: true, username: true, image: true } },
    category: true,
    _count: { select: { comments: true, votes: true } },
  },
});
```

---

## 10. 트러블슈팅

### 10.1 연결 오류

**문제**: `Can't reach database server at db.xxx.supabase.co:5432`

**해결:**
1. DATABASE_URL 확인
2. Supabase 프로젝트가 Paused 상태인지 확인 (무료 플랜은 7일 비활성 시 일시정지)
3. IP 화이트리스트 확인 (Settings → Database → Connection Pooling)

### 10.2 마이그레이션 실패

**문제**: `P1001: Can't reach database server`

**해결:**
1. `DIRECT_URL` 사용 (Connection Pooling이 아닌 Direct Connection)
2. Prisma 스키마에 `directUrl = env("DIRECT_URL")` 추가

### 10.3 RLS 정책 충돌

**문제**: 권한이 있는데도 데이터 접근 불가

**해결:**
1. Supabase Dashboard → Authentication → Policies에서 정책 확인
2. RLS 비활성화 후 테스트
3. Application 레벨 권한만 사용하거나, RLS와 일관성 유지

---

## 11. 참고 문서

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma + Supabase 통합 가이드](https://www.prisma.io/docs/guides/database/supabase)
- [Next.js + Supabase 퀵스타트](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Google Zanzibar 논문](https://research.google/pubs/pub48190/)

---

**문서 끝**
