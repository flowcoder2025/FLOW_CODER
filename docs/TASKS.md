# 바이브코딩 커뮤니티 플랫폼 구현 Task 목록

**문서 버전**: 1.1
**작성일**: 2025-10-15
**기준 문서**: [PRD.md](./PRD.md)
**프로젝트**: Vibe Coding Community Platform

---

## 📋 목차

1. [Task 개요](#1-task-개요)
2. [Phase 1: 기반 구축](#phase-1-기반-구축-4주)
3. [Phase 2: 커뮤니티 기능](#phase-2-커뮤니티-기능-4주)
4. [Phase 3: 프로젝트 & Q&A](#phase-3-프로젝트--qa-3주)
5. [Phase 4: 고도화 & 배포](#phase-4-고도화--배포-2주)
6. [우선순위 매트릭스](#우선순위-매트릭스)
7. [의존성 관계도](#의존성-관계도)
8. [진행 상황 체크리스트](#진행-상황-체크리스트)

---

## 1. Task 개요

### 1.1 전체 개요

현재 **Vite + React** 기반 데모 페이지를 **Next.js 14 App Router** 기반 커뮤니티 플랫폼으로 전환합니다.

**기존 데모 페이지 구성:**
- ✅ Header (네비게이션)
- ✅ Hero (히어로 섹션)
- ✅ TechStack (기술 스택 소개)
- ✅ Projects (프로젝트 섹션)
- ✅ Community (커뮤니티 섹션)
- ✅ Footer (푸터)
- ✅ shadcn/ui 컴포넌트 라이브러리 (45+ 컴포넌트)

**새로운 페이지 구조:**
- 🏠 **홈페이지**: 기존 섹션 유지 + 개선
- 💬 **커뮤니티**: 레딧 스타일 (자유게시판, 팁, 작품 공유, 이벤트)
- ❓ **Help me**: Q&A 게시판
- 📰 **뉴스**: 공식 업데이트 & 튜토리얼

### 1.2 작업 범위

**총 기간**: 12주 (3개월)
**Phase**: 4단계 (기반 → 커뮤니티 → Q&A/뉴스 → 고도화)
**우선순위**: P0 (필수) → P1 (중요) → P2 (향후)

### 1.3 기술 스택 전환

| 현재 (Vite) | 전환 후 (Next.js) |
|-------------|-------------------|
| Vite 6.3.5 | Next.js 14+ (App Router) |
| React 18.3.1 | React 18+ (Server Components) |
| Vite Dev Server | Next.js Dev Server |
| Client-Side Routing | File-based Routing |
| - | API Routes (백엔드) |
| - | SSR/SSG/ISR |

---

## Phase 1: 기반 구축 (4주)

### Week 1: 프로젝트 초기화

#### Task 1.1: Next.js 프로젝트 생성
- [x] Next.js 14 프로젝트 생성 (`create-next-app`)
- [x] App Router 구조 확인
- [x] TypeScript 설정 (`tsconfig.json`)
- [x] `.gitignore` 설정

**명령어:**
```bash
npx create-next-app@latest vibe-coding-community \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"
```

**산출물:**
- `package.json`
- `tsconfig.json`
- `app/` 디렉토리 구조
- `tailwind.config.ts`

---

#### Task 1.2: Tailwind CSS 설정
- [x] Tailwind CSS v4 설치 확인
- [x] 기존 `src/index.css`에서 CSS 변수 이전
- [x] `app/globals.css` 생성 및 테마 변수 설정
- [x] 다크 모드 설정 (`:root`, `.dark`)

**CSS 변수 예시:**
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    /* ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

**산출물:**
- `app/globals.css`
- 테마 변수 정의 완료

---

#### Task 1.3: shadcn/ui 설치
- [x] shadcn/ui CLI 설치
- [x] `components.json` 설정
- [x] 기본 컴포넌트 추가 (Button, Card, Badge, Avatar 등)

**명령어:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge avatar input textarea
```

**산출물:**
- `components/ui/` 디렉토리
- 45+ shadcn/ui 컴포넌트

---

#### Task 1.4: Prisma 설정
- [x] Prisma 설치 (`prisma`, `@prisma/client`)
- [x] `prisma/schema.prisma` 초기화
- [x] PostgreSQL 연결 설정 (`.env`)
- [x] Prisma Client 생성

**명령어:**
```bash
npm install prisma @prisma/client
npx prisma init
```

**`.env` 예시:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vibe_coding"
```

**산출물:**
- `prisma/schema.prisma`
- `.env` 파일

---

#### Task 1.5: Git 리포지토리 설정
- [x] Git 초기화
- [x] `.gitignore` 확인 (`node_modules`, `.env`, `.next` 포함)
- [x] 첫 번째 커밋

**명령어:**
```bash
git init
git add .
git commit -m "Initial commit: Next.js 14 프로젝트 초기화"
```

---

### Week 2: 기존 컴포넌트 이전

#### Task 2.1: UI 컴포넌트 이전
- [x] 기존 `src/components/ui/` → `components/ui/` 복사
- [x] shadcn/ui와 중복 확인 및 통합
- [x] Import 경로 수정 (`@/components/ui/...`)

**체크리스트:**
- [x] `button.tsx`
- [x] `card.tsx`
- [x] `badge.tsx`
- [x] `avatar.tsx`
- [x] `input.tsx`
- [x] `textarea.tsx`
- [x] (45+ 컴포넌트 전체)

---

#### Task 2.2: Header 컴포넌트 이전
- [x] `src/components/Header.tsx` → `components/Header.tsx`
- [x] `<a href="#...">` → Next.js `<Link href="...">` 변환
- [x] 네비게이션 메뉴 업데이트 (홈, 커뮤니티, 프로젝트, Help me, 뉴스)
- [x] 모바일 메뉴 토글 유지
- [x] Client Component 지시자 추가 (`"use client"`)

**변경 전:**
```tsx
<a href="#community">커뮤니티</a>
```

**변경 후:**
```tsx
<Link href="/community">커뮤니티</Link>
```

**산출물:**
- `components/Header.tsx`

---

#### Task 2.3: Footer 컴포넌트 이전
- [x] `src/components/Footer.tsx` → `components/Footer.tsx`
- [x] 링크를 Next.js `<Link>`로 변환
- [x] 외부 링크는 `<a target="_blank" rel="noopener noreferrer">` 유지

**산출물:**
- `components/Footer.tsx`

---

#### Task 2.4: 루트 레이아웃 구축
- [x] `app/layout.tsx` 생성
- [x] Header, Footer 포함
- [x] HTML lang 설정 (`lang="ko"`)
- [x] 메타데이터 설정 (title, description, OG 이미지)
- [x] 폰트 최적화 (`next/font`)

**`app/layout.tsx` 예시:**
```tsx
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '바이브코딩 커뮤니티',
  description: '바이브코딩 사용자들을 위한 커뮤니티 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

**산출물:**
- `app/layout.tsx`

---

#### Task 2.5: 홈페이지 이전
- [x] `app/page.tsx` 생성
- [x] Hero 섹션 이전 (`src/components/Hero.tsx` → `components/Hero.tsx`)
- [x] TechStack 섹션 이전
- [x] Projects 섹션 이전 (Featured Projects로 수정)
- [x] Community Preview 섹션 추가
- [x] Latest News 섹션 추가

**`app/page.tsx` 구조:**
```tsx
import { Hero } from '@/components/Hero'
import { TechStack } from '@/components/TechStack'
import { FeaturedProjects } from '@/components/FeaturedProjects'
import { CommunityPreview } from '@/components/CommunityPreview'
import { LatestNews } from '@/components/LatestNews'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechStack />
      <FeaturedProjects />
      <CommunityPreview />
      <LatestNews />
    </>
  )
}
```

**산출물:**
- `app/page.tsx`
- `components/Hero.tsx`
- `components/TechStack.tsx`
- `components/FeaturedProjects.tsx` (새로 생성)
- `components/CommunityPreview.tsx` (새로 생성)
- `components/LatestNews.tsx` (새로 생성)

---

#### Task 2.6: 다크 모드 통합
- [x] `next-themes` 설치
- [x] `ThemeProvider` 설정
- [x] Header에 다크 모드 토글 버튼 추가

**명령어:**
```bash
npm install next-themes
```

**`components/ThemeProvider.tsx`:**
```tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```

**산출물:**
- `components/ThemeProvider.tsx`
- Header에 토글 버튼 추가

---

### Week 3: 인증 시스템

#### Task 3.1: NextAuth.js 설치 및 설정
- [x] NextAuth.js v5 (Auth.js) 설치
- [x] `app/api/auth/[...nextauth]/route.ts` 생성
- [x] `authOptions` 설정 (session strategy: JWT)

**명령어:**
```bash
npm install next-auth@beta @auth/prisma-adapter
```

**`.env` 추가:**
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-here"
```

**산출물:**
- `app/api/auth/[...nextauth]/route.ts`
- `lib/auth.ts` (authOptions)

---

#### Task 3.2: OAuth 통합 (GitHub)
- [x] GitHub OAuth App 생성 (https://github.com/settings/developers)
- [x] `.env`에 `GITHUB_ID`, `GITHUB_SECRET` 추가
- [x] `GithubProvider` 설정

**`.env` 추가:**
```env
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

**산출물:**
- GitHub OAuth 연동 완료

---

#### Task 3.3: OAuth 통합 (Google)
- [x] Google Cloud Console에서 OAuth 2.0 클라이언트 생성
- [x] `.env`에 `GOOGLE_ID`, `GOOGLE_SECRET` 추가
- [x] `GoogleProvider` 설정

**산출물:**
- Google OAuth 연동 완료

---

#### Task 3.4: 로그인/회원가입 페이지
- [x] `app/auth/signin/page.tsx` 생성
- [x] OAuth 버튼 (GitHub, Google)
- [ ] 이메일/비밀번호 로그인 폼 (CredentialsProvider)
- [x] 회원가입 링크 → `app/auth/signup/page.tsx`

**산출물:**
- `app/auth/signin/page.tsx`
- `app/auth/signup/page.tsx`

---

#### Task 3.5: 세션 관리 & 프로필 페이지
- [x] `useSession()` 훅 사용
- [x] Header에 사용자 프로필 표시 (로그인 시)
- [x] `app/profile/[id]/page.tsx` 생성
- [x] 사용자 정보 표시 (username, bio, 작성 게시글 수)

**산출물:**
- `app/profile/[username]/page.tsx`

---

### Week 4: 데이터 모델 & API 기초

#### Task 4.1: Prisma 스키마 정의
- [ ] `prisma/schema.prisma`에 모델 정의
  - [ ] User
  - [ ] Category
  - [ ] Post
  - [ ] Comment
  - [ ] Project
  - [ ] Answer
  - [ ] Vote
- [ ] 관계 설정 (1:N, self-referencing)

**Prisma 스키마 예시:**
```prisma
model User {
  id          String   @id @default(cuid())
  username    String   @unique
  email       String   @unique
  displayName String?
  avatarUrl   String?
  reputation  Int      @default(0)
  role        Role     @default(USER)

  posts       Post[]
  comments    Comment[]
  projects    Project[]
  votes       Vote[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  USER
  MODERATOR
  ADMIN
}

model Post {
  id         String   @id @default(cuid())
  title      String
  content    String   @db.Text
  authorId   String
  author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  upvotes    Int      @default(0)
  downvotes  Int      @default(0)
  tags       String[]
  comments   Comment[]
  votes      Vote[]

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// ... (전체 스키마는 PRD.md 참고)
```

**산출물:**
- `prisma/schema.prisma`

---

#### Task 4.2: 마이그레이션 실행
- [ ] `npx prisma migrate dev --name init`
- [ ] 데이터베이스 테이블 생성 확인
- [ ] Prisma Client 생성 (`npx prisma generate`)

**산출물:**
- `prisma/migrations/` 디렉토리

---

#### Task 4.3: Prisma Client 설정
- [ ] `lib/prisma.ts` 생성 (싱글톤 패턴)

**`lib/prisma.ts` 예시:**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**산출물:**
- `lib/prisma.ts`

---

#### Task 4.4: 기본 API Routes 구조 생성
- [ ] `app/api/posts/route.ts` (GET, POST)
- [ ] `app/api/posts/[id]/route.ts` (GET, PATCH, DELETE)

**`app/api/posts/route.ts` 예시:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const posts = await prisma.post.findMany({
    include: { author: true, category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ posts })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await prisma.post.create({
    data: body,
  })
  return NextResponse.json({ post }, { status: 201 })
}
```

**산출물:**
- `app/api/posts/route.ts`
- `app/api/posts/[id]/route.ts`

---

#### Task 4.5: 인증 미들웨어 설정
- [ ] `middleware.ts` 생성
- [ ] 보호된 경로 설정 (`/community/new`, `/projects/new` 등)

**`middleware.ts` 예시:**
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN"
      }
      if (req.nextUrl.pathname.includes("/new")) {
        return !!token
      }
      return true
    },
  },
})

export const config = {
  matcher: ["/community/new", "/projects/new", "/help/new", "/admin/:path*"],
}
```

**산출물:**
- `middleware.ts`

---

## Phase 2: 커뮤니티 기능 (4주)

### Week 5: 커뮤니티 목록

#### Task 5.1: 카테고리 시드 데이터 생성
- [ ] `prisma/seed.ts` 생성
- [ ] 4개 카테고리 삽입 (자유게시판, 팁, 작품 공유, 이벤트)

**`prisma/seed.ts` 예시:**
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.category.createMany({
    data: [
      { name: '자유게시판', slug: 'general', icon: '💬' },
      { name: '팁 & 노하우', slug: 'tips', icon: '💡' },
      { name: '작품 공유', slug: 'showcase', icon: '🎨' },
      { name: '이벤트 & 공지', slug: 'events', icon: '📢' },
    ],
  })
}

main()
```

**명령어:**
```bash
npx prisma db seed
```

**산출물:**
- `prisma/seed.ts`

---

#### Task 5.2: 커뮤니티 메인 페이지
- [ ] `app/community/page.tsx` 생성
- [ ] 4개 카테고리 카드 표시
- [ ] 각 카테고리 클릭 시 → `/community/[category]`

**산출물:**
- `app/community/page.tsx`

---

#### Task 5.3: 게시글 목록 페이지
- [ ] `app/community/[category]/page.tsx` 생성
- [ ] 게시글 목록 조회 (SSR)
- [ ] 게시글 카드 컴포넌트 (`components/PostCard.tsx`)
- [ ] 정렬 필터 (인기순, 최신순, 댓글 많은 순)
- [ ] 페이지네이션 또는 무한 스크롤

**PostCard 구조:**
```
┌─────────────────────────────────┐
│ [⬆ 42]  제목                    │
│ [⬇ 3 ]  본문 미리보기...        │
│          @username • 2시간 전    │
│          💬 15  👁 123  #react   │
└─────────────────────────────────┘
```

**산출물:**
- `app/community/[category]/page.tsx`
- `components/PostCard.tsx`

---

#### Task 5.4: 필터링 & 검색
- [ ] URL Query Params로 필터 관리 (`?sort=popular&tag=react`)
- [ ] 태그 필터링
- [ ] 검색 기능 (제목, 본문 검색)

**산출물:**
- 검색 바 컴포넌트 (`components/SearchBar.tsx`)

---

### Week 6: 게시글 상세 & 작성

#### Task 6.1: 게시글 상세 페이지
- [ ] `app/community/[category]/[postId]/page.tsx` 생성
- [ ] 게시글 조회 (ISR, revalidate: 60)
- [ ] 투표 버튼 (Upvote/Downvote)
- [ ] 댓글 섹션 표시

**산출물:**
- `app/community/[category]/[postId]/page.tsx`

---

#### Task 6.2: Tiptap 에디터 통합
- [ ] Tiptap 설치 (`@tiptap/react`, `@tiptap/starter-kit`)
- [ ] 에디터 컴포넌트 생성 (`components/Editor.tsx`)
- [ ] 기능: 굵게, 기울임, 코드 블록, 링크, 이미지 업로드

**명령어:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
```

**산출물:**
- `components/Editor.tsx`

---

#### Task 6.3: 게시글 작성 페이지
- [ ] `app/community/new/page.tsx` 생성
- [ ] 카테고리 선택 드롭다운
- [ ] 제목 입력 (`Input`)
- [ ] 본문 입력 (Tiptap 에디터)
- [ ] 태그 입력 (자동완성)
- [ ] 이미지 업로드 (Cloudinary)
- [ ] 제출 → POST `/api/posts`

**산출물:**
- `app/community/new/page.tsx`

---

#### Task 6.4: 이미지 업로드 (Cloudinary)
- [ ] Cloudinary 계정 생성
- [ ] `.env`에 `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` 추가
- [ ] `lib/cloudinary.ts` 업로드 유틸리티 함수
- [ ] 에디터에 이미지 업로드 버튼 추가

**산출물:**
- `lib/cloudinary.ts`

---

#### Task 6.5: 임시 저장 (Local Storage)
- [ ] 게시글 작성 중 Local Storage에 자동 저장
- [ ] 페이지 새로고침 시 복원

**산출물:**
- `hooks/useAutoSave.ts`

---

### Week 7: 댓글 & 투표

#### Task 7.1: 댓글 CRUD API
- [ ] `app/api/posts/[id]/comments/route.ts` (GET, POST)
- [ ] `app/api/comments/[id]/route.ts` (PATCH, DELETE)

**산출물:**
- API Routes

---

#### Task 7.2: 댓글 UI 컴포넌트
- [ ] `components/CommentList.tsx`
- [ ] `components/CommentItem.tsx`
- [ ] 댓글 스레드 (대댓글 지원, 최대 깊이 5)

**산출물:**
- `components/CommentList.tsx`
- `components/CommentItem.tsx`

---

#### Task 7.3: 댓글 작성 폼
- [ ] `components/CommentForm.tsx`
- [ ] Textarea 입력
- [ ] 제출 → POST `/api/posts/[id]/comments`
- [ ] Optimistic UI 업데이트

**산출물:**
- `components/CommentForm.tsx`

---

#### Task 7.4: 투표 시스템 API
- [ ] `app/api/posts/[id]/vote/route.ts` (POST)
- [ ] Vote 모델 조회 및 업데이트
- [ ] Upvote/Downvote 토글

**산출물:**
- `app/api/posts/[id]/vote/route.ts`

---

#### Task 7.5: 투표 UI (Optimistic Updates)
- [ ] `components/VoteButtons.tsx`
- [ ] ⬆ Upvote 버튼
- [ ] ⬇ Downvote 버튼
- [ ] React Query Optimistic Updates

**산출물:**
- `components/VoteButtons.tsx`

---

### Week 8: 검색 & 알림

#### Task 8.1: 검색 API
- [ ] `app/api/search/route.ts`
- [ ] PostgreSQL Full-Text Search 사용
- [ ] 제목, 본문, 태그 검색

**산출물:**
- `app/api/search/route.ts`

---

#### Task 8.2: 검색 결과 페이지
- [ ] `app/search/page.tsx`
- [ ] 검색어 Query Param (`?q=react`)
- [ ] 게시글, 프로젝트, 질문 통합 검색

**산출물:**
- `app/search/page.tsx`

---

#### Task 8.3: 기본 알림 시스템
- [ ] `app/api/notifications/route.ts`
- [ ] Notification 모델 (Prisma)
- [ ] 댓글 알림, 답변 채택 알림

**산출물:**
- Notification 모델
- API Routes

---

## Phase 3: Q&A & 뉴스 (2주)

### Week 9: Help me (Q&A)

#### Task 9.1: 질문 목록 페이지
- [ ] `app/help/page.tsx`
- [ ] 질문 카드 (투표 수, 답변 수, 채택 여부 표시)
- [ ] 필터: 답변 없는 질문, 채택된 질문
- [ ] 정렬: 최신순, 투표 많은 순

**산출물:**
- `app/help/page.tsx`
- `components/QuestionCard.tsx`

---

#### Task 9.2: 질문 상세 페이지
- [ ] `app/help/[questionId]/page.tsx`
- [ ] 질문 본문 (코드 블록 지원)
- [ ] 답변 목록 (채택된 답변 상단)
- [ ] 답변 투표

**산출물:**
- `app/help/[questionId]/page.tsx`

---

#### Task 9.3: 답변 시스템 API
- [ ] `app/api/questions/[id]/answers/route.ts` (GET, POST)
- [ ] `app/api/questions/[id]/answers/[answerId]/accept/route.ts` (POST)

**산출물:**
- API Routes

---

#### Task 9.4: 답변 채택 기능
- [ ] 질문 작성자만 채택 가능 (권한 체크)
- [ ] 채택 버튼 (`components/AcceptAnswerButton.tsx`)
- [ ] 채택 시 작성자 reputation +10

**산출물:**
- `components/AcceptAnswerButton.tsx`

---

#### Task 9.5: 질문 작성 페이지
- [ ] `app/help/new/page.tsx`
- [ ] 제목 (최소 15자, 질문형)
- [ ] 본문 (코드 블록 지원)
- [ ] 태그 (최소 1개, 최대 5개)

**산출물:**
- `app/help/new/page.tsx`

---

### Week 10: 뉴스

#### Task 10.1: 뉴스 목록 페이지
- [ ] `app/news/page.tsx`
- [ ] 타임라인 형식
- [ ] 카테고리 필터 (업데이트, 이벤트, 튜토리얼, 공지)
- [ ] 정렬: 최신순, 인기순

**산출물:**
- `app/news/page.tsx`
- `components/NewsCard.tsx`

---

#### Task 10.2: 뉴스 상세 페이지
- [ ] `app/news/[id]/page.tsx`
- [ ] 커버 이미지
- [ ] 본문 (Rich Text)
- [ ] 관련 뉴스 추천

**산출물:**
- `app/news/[id]/page.tsx`

---

#### Task 10.3: 뉴스 작성 (관리자 전용)
- [ ] `app/news/new/page.tsx`
- [ ] 관리자만 접근 가능 (middleware)
- [ ] 제목, 본문, 카테고리, 커버 이미지

**산출물:**
- `app/news/new/page.tsx`

---

## Phase 4: 고도화 & 배포 (2주)

### Week 11: 최적화

#### Task 11.1: 성능 최적화
- [ ] Lighthouse 점수 측정 (목표: 90+)
- [ ] Image Optimization (Next.js `<Image />` 확인)
- [ ] 코드 스플리팅 (Dynamic Import)
- [ ] 폰트 최적화 (`next/font`)

**산출물:**
- Lighthouse 리포트

---

#### Task 11.2: SEO 최적화
- [ ] 메타 태그 추가 (title, description, keywords)
- [ ] Open Graph 이미지 설정
- [ ] Structured Data (JSON-LD)
- [ ] `robots.txt` 생성
- [ ] `sitemap.xml` 생성

**산출물:**
- `app/robots.ts`
- `app/sitemap.ts`

---

#### Task 11.3: 접근성 (a11y) 테스트
- [ ] Axe DevTools 검사
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 테스트
- [ ] ARIA 레이블 추가

**산출물:**
- a11y 리포트

---

### Week 12: QA & 배포

#### Task 12.1: 버그 수정
- [ ] 버그 리스트 작성
- [ ] 우선순위별 수정

**산출물:**
- 버그 트래킹 문서

---

#### Task 12.2: 모바일 반응형 테스트
- [ ] iPhone, Android 테스트
- [ ] 태블릿 테스트
- [ ] 다양한 화면 크기 확인

**산출물:**
- 테스트 리포트

---

#### Task 12.3: Vercel 배포
- [ ] Vercel 계정 연결
- [ ] GitHub 리포지토리 연결
- [ ] 환경 변수 설정 (`.env` → Vercel Environment Variables)
- [ ] 배포 실행

**배포 URL:**
- https://vibe-coding-community.vercel.app

**산출물:**
- 프로덕션 URL

---

#### Task 12.4: 도메인 연결
- [ ] 도메인 구매 (예: vibecoding.com)
- [ ] Vercel에 커스텀 도메인 연결
- [ ] SSL 인증서 자동 설정 확인

**산출물:**
- 커스텀 도메인 연결 완료

---

#### Task 12.5: 모니터링 설정
- [ ] Sentry 설치 (에러 트래킹)
- [ ] Vercel Analytics 활성화
- [ ] Google Analytics 연동 (선택)

**명령어:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**산출물:**
- Sentry 대시보드
- Vercel Analytics

---

## 우선순위 매트릭스

### P0 (필수, 0-6주)
- [x] Next.js 프로젝트 초기화
- [x] 기존 컴포넌트 이전
- [x] 인증 시스템 (NextAuth.js)
- [x] Prisma 스키마 정의
- [ ] 커뮤니티 게시글 CRUD
- [ ] 댓글 기능
- [ ] 투표 시스템

### P1 (중요, 7-10주)
- [ ] Q&A 시스템 (Help me)
- [ ] 답변 채택 기능
- [ ] 검색 기능
- [ ] 뉴스 페이지

### P2 (향후, 11주+)
- [ ] 실시간 알림 (WebSocket)
- [ ] 관리자 대시보드
- [ ] 고급 검색 (Algolia)
- [ ] 메시지 시스템 (DM)
- [ ] 프로필 커스터마이징

---

## 의존성 관계도

```
인증 시스템 (Week 3)
    ├─> 게시글 작성 (Week 6)
    ├─> 댓글 작성 (Week 7)
    ├─> 투표 (Week 7)
    └─> 질문 작성 (Week 9)

Prisma 스키마 (Week 4)
    ├─> 모든 API Routes
    ├─> 게시글 목록 (Week 5)
    ├─> 게시글 상세 (Week 6)
    └─> 질문 목록 (Week 9)

Tiptap 에디터 (Week 6)
    ├─> 게시글 작성 (Week 6)
    ├─> 질문 작성 (Week 9)
    └─> 뉴스 작성 (Week 10)

이미지 업로드 (Week 6)
    ├─> 게시글 이미지 (Week 6)
    └─> 뉴스 커버 이미지 (Week 10)
```

---

## 진행 상황 체크리스트

### Phase 1: 기반 구축 (4주)
- [ ] Week 1: 프로젝트 초기화 (5개 Task)
- [ ] Week 2: 기존 컴포넌트 이전 (6개 Task)
- [ ] Week 3: 인증 시스템 (5개 Task)
- [ ] Week 4: 데이터 모델 & API 기초 (5개 Task)

**완료율**: 0/21 Tasks

---

### Phase 2: 커뮤니티 기능 (4주)
- [ ] Week 5: 커뮤니티 목록 (4개 Task)
- [ ] Week 6: 게시글 상세 & 작성 (5개 Task)
- [ ] Week 7: 댓글 & 투표 (5개 Task)
- [ ] Week 8: 검색 & 알림 (3개 Task)

**완료율**: 0/17 Tasks

---

### Phase 3: Q&A & 뉴스 (2주)
- [ ] Week 9: Help me (Q&A) (5개 Task)
- [ ] Week 10: 뉴스 (3개 Task)

**완료율**: 0/8 Tasks

---

### Phase 4: 고도화 & 배포 (2주)
- [ ] Week 11: 최적화 (3개 Task)
- [ ] Week 12: QA & 배포 (5개 Task)

**완료율**: 0/8 Tasks

---

## 전체 진행 상황

**총 Tasks**: 54개
**완료**: 0개
**진행률**: 0%

---

## 참고 문서

- [PRD.md](./PRD.md) - 제품 요구사항 문서
- [루트 CLAUDE.md](../CLAUDE.md) - 프로젝트 전역 규칙
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

---

## 변경 이력

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| 1.0 | 2025-10-15 | 초기 Task 문서 작성 |
| 1.1 | 2025-10-16 | 프로젝트 쇼케이스 Task 제거, 전체 Task 58→54개로 조정, 기간 13주→12주로 단축 |

---

**문서 끝**
