# 바이브코딩 커뮤니티 플랫폼 구현 Task 목록

**문서 버전**: 1.2
**작성일**: 2025-10-15
**최종 수정**: 2025-10-20
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
**Phase**: 4단계 (기반 → UI 우선 → 기능 완성 → DB 통합 & 배포)
**개발 전략**: UI 우선 개발 (Mock 데이터 → PostgreSQL 통합)
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

## Phase 1: 기반 구축 (3주)

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

### Week 4: Mock 데이터 & 커뮤니티 UI

**참고**: Week 4부터는 Mock 데이터를 사용하여 UI 우선 개발을 진행합니다.

#### Task 4.1: TypeScript 인터페이스 정의
- [x] `lib/types.ts` 생성
- [x] 모든 데이터 모델 인터페이스 정의 (User, Category, Post, Comment, Answer, Vote)
- [x] 타입 안정성 확보

**`lib/types.ts` 예시:**
```typescript
export interface User {
  id: string
  username: string
  email: string
  displayName?: string
  avatarUrl?: string
  reputation: number
  role: 'USER' | 'MODERATOR' | 'ADMIN'
  createdAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  categoryId: string
  upvotes: number
  downvotes: number
  tags: string[]
  createdAt: string
}
// ... (전체 인터페이스는 PRD.md 참고)
```

**산출물:**
- `lib/types.ts`

---

#### Task 4.2: Mock 데이터 생성
- [x] `lib/mock-data.ts` 생성
- [x] Mock users (10명)
- [x] Mock categories (4개: 자유게시판, 팁, 작품 공유, 이벤트)
- [x] Mock posts (50개)
- [x] Mock comments (100개)

**산출물:**
- `lib/mock-data.ts`

---

#### Task 4.3: 커뮤니티 메인 페이지
- [x] `app/community/page.tsx` 생성
- [x] 4개 카테고리 카드 표시
- [x] Mock 데이터로 렌더링
- [x] 각 카테고리 클릭 → `/community/[category]`

**산출물:**
- `app/community/page.tsx`

---

#### Task 4.4: 게시글 목록 페이지 UI
- [x] `app/community/[category]/page.tsx` 생성
- [x] Mock 데이터로 게시글 목록 표시
- [x] 정렬 필터 UI (인기순, 최신순)
- [x] 페이지네이션 UI

**산출물:**
- `app/community/[category]/page.tsx`

---

#### Task 4.5: 게시글 카드 컴포넌트
- [x] `components/PostCard.tsx` 생성
- [x] 투표 버튼 UI
- [x] 제목, 본문 미리보기
- [x] 작성자, 시간, 조회수, 댓글 수 표시
- [x] 태그 표시

**산출물:**
- `components/PostCard.tsx`

---

## Phase 2: UI 우선 구현 (4주)

**참고**: Phase 2에서는 Mock 데이터를 사용하여 모든 페이지 UI를 완성합니다.

### Week 5: 게시글 상세 & 작성 UI

#### Task 5.1: 게시글 상세 페이지 UI
- [x] `app/community/[category]/[postId]/page.tsx` 생성
- [x] Mock 데이터로 게시글 상세 표시
- [x] 투표 버튼 UI
- [x] 댓글 섹션 UI
- [x] 작성자 정보 표시

**산출물:**
- `app/community/[category]/[postId]/page.tsx`

---

#### Task 5.2: Tiptap 에디터 통합
- [x] Tiptap 설치 (`@tiptap/react`, `@tiptap/starter-kit`)
- [x] 에디터 컴포넌트 생성 (`components/Editor.tsx`)
- [x] 기능: 굵게, 기울임, 코드 블록, 링크

**명령어:**
```bash
npm install @tiptap/react @tiptap/starter-kit
```

**산출물:**
- `components/Editor.tsx`

---

#### Task 5.3: 게시글 작성 페이지 UI
- [x] `app/community/new/page.tsx` 생성
- [x] 카테고리 선택 드롭다운
- [x] 제목 입력
- [x] 본문 입력 (Tiptap)
- [x] 태그 입력
- [x] Mock 데이터에 저장 (localStorage)

**산출물:**
- `app/community/new/page.tsx`

---

#### Task 5.4: 댓글 UI 컴포넌트
- [x] `components/CommentList.tsx`
- [x] `components/CommentItem.tsx`
- [x] 댓글 스레드 UI (대댓글 지원)
- [x] 댓글 작성 폼 UI

**산출물:**
- `components/CommentList.tsx`
- `components/CommentItem.tsx`

---

#### Task 5.5: 투표 버튼 UI
- [x] `components/VoteButtons.tsx`
- [x] ⬆ Upvote 버튼
- [x] ⬇ Downvote 버튼
- [x] 클라이언트 상태 관리

**산출물:**
- `components/VoteButtons.tsx`

---

### Week 6: Q&A & 뉴스 UI

#### Task 6.1: Q&A 목록 페이지 UI
- [x] `app/help/page.tsx` 생성
- [x] 질문 카드 컴포넌트 (`components/QuestionCard.tsx`)
- [x] Mock 데이터로 질문 목록 표시
- [x] 필터 UI (답변 없는 질문, 채택된 질문)

**산출물:**
- `app/help/page.tsx`
- `components/QuestionCard.tsx`

---

#### Task 6.2: 질문 상세 페이지 UI
- [x] `app/help/[questionId]/page.tsx` 생성
- [x] 질문 본문 표시
- [x] 답변 목록 UI
- [x] 답변 채택 버튼 UI

**산출물:**
- `app/help/[questionId]/page.tsx`

---

#### Task 6.3: 답변 섹션 UI
- [x] `components/AnswerList.tsx`
- [x] `components/AnswerItem.tsx`
- [x] 답변 작성 폼 UI
- [x] 채택된 답변 강조 표시

**산출물:**
- `components/AnswerList.tsx`
- `components/AnswerItem.tsx`

---

#### Task 6.4: 뉴스 목록 페이지 UI
- [x] `app/news/page.tsx` 생성
- [x] 뉴스 카드 컴포넌트 (`components/NewsCard.tsx`)
- [x] Mock 데이터로 뉴스 목록 표시
- [x] 카테고리 필터 UI

**산출물:**
- `app/news/page.tsx`
- `components/NewsCard.tsx`

---

#### Task 6.5: 뉴스 상세 페이지 UI
- [x] `app/news/[id]/page.tsx` 생성
- [x] 커버 이미지 표시
- [x] 본문 Rich Text 렌더링
- [x] 관련 뉴스 추천 UI

**산출물:**
- `app/news/[id]/page.tsx`

---

### Week 7: 프로필 & 설정 UI

#### Task 7.1: 사용자 프로필 페이지 UI
- [x] `app/profile/[username]/page.tsx` 개선
- [x] 사용자 정보 표시 (아바타, bio, reputation)
- [x] 작성한 게시글 목록
- [x] 작성한 댓글 목록
- [x] Mock 데이터 활용

**산출물:**
- `app/profile/[username]/page.tsx` (개선)
- `components/ProfileTabs.tsx` (새 파일)

---

#### Task 7.2: 프로필 편집 폼 UI
- [x] `app/profile/edit/page.tsx` 생성
- [x] 프로필 이미지 업로드 UI
- [x] displayName, bio 편집 폼
- [x] localStorage에 저장

**산출물:**
- `app/profile/edit/page.tsx`

---

#### Task 7.3: 설정 페이지 UI
- [x] `app/settings/page.tsx` 생성
- [x] 알림 설정 UI
- [x] 다크 모드 설정
- [x] 언어 설정 (향후 확장)

**산출물:**
- `app/settings/page.tsx`

---

#### Task 7.4: 알림 UI (기본)
- [x] `components/NotificationBell.tsx`
- [x] 알림 목록 드롭다운 UI
- [x] Mock 알림 데이터
- [x] 읽음/안 읽음 표시

**산출물:**
- `components/NotificationBell.tsx`

---

#### Task 7.5: 검색 & 필터링 UI 개선
- [x] 전역 검색 바 개선
- [x] 필터 드롭다운 UI
- [x] 정렬 옵션 UI
- [x] 태그 필터 UI

**산출물:**
- `components/SearchBar.tsx` (개선)
- `components/FilterBar.tsx`

---

## Phase 3: 기능 완성 (3주)

**참고**: Phase 3에서는 클라이언트 상태 관리와 localStorage를 활용하여 기능을 구현합니다.

### Week 8: 클라이언트 상태 관리

#### Task 8.1: 상태 관리 설정
- [x] Zustand 또는 React Context 설치
- [x] 전역 상태 스토어 생성 (`lib/store.ts`)
- [x] 사용자 상태, 게시글 상태, 댓글 상태 관리

**명령어:**
```bash
npm install zustand  # 또는 React Context 사용
```

**산출물:**
- `lib/store.ts`

---

#### Task 8.2: 게시글 CRUD (localStorage)
- [x] 게시글 생성 (localStorage에 저장)
- [x] 게시글 수정
- [x] 게시글 삭제
- [x] Mock 데이터와 병합하여 표시

**산출물:**
- `lib/store.ts` (Zustand persist로 localStorage 자동 처리)

---

#### Task 8.3: 댓글 CRUD (localStorage)
- [x] 댓글 작성 (localStorage)
- [x] 대댓글 작성
- [x] 댓글 수정/삭제
- [x] Optimistic UI 업데이트

**산출물:**
- 댓글 관련 상태 관리 로직 (store.ts에 구현)

---

#### Task 8.4: 투표 시스템 (클라이언트 상태)
- [x] Upvote/Downvote 클라이언트 로직
- [x] localStorage에 투표 기록 저장
- [x] 투표 카운트 실시간 업데이트

**산출물:**
- 투표 관련 상태 관리 로직 (store.ts에 구현)

---

#### Task 8.5: 임시 저장 기능
- [x] 게시글 작성 중 자동 저장 (Local Storage)
- [x] 페이지 새로고침 시 복원
- [x] `hooks/useAutoSave.ts` 훅

**산출물:**
- `hooks/useAutoSave.ts`

---

### Week 9: 검색 & 필터링

#### Task 9.1: 클라이언트 사이드 검색
- [x] 검색 결과 페이지 (`app/search/page.tsx`)
- [x] 제목, 본문, 태그 검색 (클라이언트)
- [x] Mock + localStorage 데이터 통합 검색
- [x] 검색어 하이라이트

**산출물:**
- `app/search/page.tsx`
- `lib/search.ts` (검색 로직)

---

#### Task 9.2: 게시글 필터링
- [x] 태그별 필터링
- [x] 카테고리별 필터링
- [x] 정렬 옵션 (인기순, 최신순, 댓글 많은 순)
- [x] URL Query Params 동기화

**산출물:**
- 필터링 로직 (search.ts에 구현)

---

#### Task 9.3: Q&A 필터링
- [x] 답변 없는 질문 필터
- [x] 채택된 질문 필터
- [x] 태그별 필터
- [x] 투표 순 정렬

**산출물:**
- Q&A 필터 로직 (search.ts의 filterQuestions)

---

#### Task 9.4: 검색 성능 최적화
- [x] Debounce 적용
- [x] 검색 결과 캐싱
- [x] 무한 스크롤 또는 페이지네이션

**산출물:**
- `hooks/useDebounce.ts`
- 검색 성능 개선

---

#### Task 9.5: 고급 필터 UI
- [ ] 복합 필터 (태그 + 기간)
- [ ] 필터 저장 기능 (localStorage)
- [ ] 필터 초기화 버튼

**산출물:**
- `components/AdvancedFilter.tsx`

---

### Week 10: 최적화 & 테스트

#### Task 10.1: 컴포넌트 성능 최적화
- [x] React.memo 적용 (PostCard, CommentItem, QuestionCard)
- [x] useMemo, useCallback 최적화
- [x] 불필요한 리렌더링 제거
- [x] React DevTools Profiler 분석

**산출물:**
- 성능 최적화 완료 (PostCard.tsx, CommentItem.tsx, QuestionCard.tsx)

---

#### Task 10.2: 이미지 최적화
- [x] Next.js Image 컴포넌트 적용 (12개 파일)
- [x] Lazy Loading 자동 적용 (Next.js Image 기본 기능)
- [x] 이미지 압축 자동 적용 (Next.js Image 기본 기능)
- [x] Placeholder blur 자동 적용 (Next.js Image 기본 기능)

**산출물:**
- 모든 아바타 이미지 Next.js Image로 교체
- 외부 이미지 도메인 설정 완료 (next.config.ts)
- 기본 아바타 폴백 처리

---

#### Task 10.3: 코드 분할 & 번들 최적화
- [x] Dynamic Import 적용 (Tiptap Editor)
- [x] Route-based Code Splitting (Next.js App Router 자동 적용)
- [x] 번들 분석 (@next/bundle-analyzer 설치 및 설정)
- [x] 불필요한 의존성 제거

**산출물:**
- /community/new 페이지 114KB 감소 (120KB → 5.63KB)
- Tiptap 에디터 동적 로딩 (ssr: false, loading UI)
- 번들 분석기 설정 완료 (ANALYZE=true로 실행 가능)

---

#### Task 10.4: E2E 테스트 (Playwright)
- [x] 주요 사용자 플로우 테스트
  - [x] 게시글 작성/읽기
  - [x] 댓글 작성 폼 확인
  - [x] 투표 버튼 상호작용
  - [x] Q&A 페이지 플로우
  - [x] 뉴스 페이지 플로우
  - [x] 검색 기능
- [x] 테스트 자동화 (package.json scripts)

**산출물:**
- `e2e/community.spec.ts` (15개 테스트 케이스)
- `playwright.config.ts` 설정
- 테스트 스크립트: `npm run test:e2e`

---

#### Task 10.5: 접근성 검증
- [x] Lighthouse a11y 점수 확인
- [x] ARIA 레이블 추가
- [x] 키보드 네비게이션 테스트
- [x] 스크린 리더 호환성

**산출물:**
- a11y 개선 보고서

**완료 내역:**
- ✅ Playwright + Axe-core 기반 자동화된 접근성 테스트 구축
- ✅ `e2e/accessibility.spec.ts` 생성 (11개 테스트 케이스)
- ✅ 접근성 테스트 범위:
  - WCAG 2.1 기준 자동 검사 (홈, 커뮤니티, Q&A, 뉴스 페이지)
  - 키보드 네비게이션 (Tab, Enter 키)
  - 이미지 alt 텍스트 검증
  - 버튼/링크 접근 가능 이름 확인
  - 색상 대비 검사 (자동)
  - 폼 레이블 연결 확인
  - Heading 계층 구조 검증
- ✅ 의존성: @axe-core/playwright 설치 완료

---

## Phase 4: Supabase 통합 & 배포 (2주)

**변경 사항**: PostgreSQL → Supabase + Zanzibar 권한 시스템

### Week 11: Supabase + Zanzibar 통합

#### Task 11.1: Supabase 프로젝트 설정
- [ ] Supabase 프로젝트 생성 (https://supabase.com)
- [ ] PostgreSQL 데이터베이스 URL 확인
- [ ] `.env` 설정 (DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Supabase Client 라이브러리 설치

**명령어:**
```bash
npm install @supabase/supabase-js
```

**`.env` 예시:**
```env
# Supabase PostgreSQL (Prisma용)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Client (선택적 - 실시간 기능용)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

**산출물:**
- Supabase 프로젝트
- `lib/supabase.ts` (선택적)
- 환경 변수 설정 완료

**참고 문서:**
- [Supabase 설정 가이드](./Supabase_Setup_Guide.md)

---

#### Task 11.2: Prisma 스키마 구현 (Zanzibar 포함)
- [ ] `prisma/schema.prisma` 업데이트
- [ ] 기존 모델 유지 (User, Post, Comment, Category 등)
- [ ] Zanzibar 권한 모델 추가 (RelationTuple, RelationDefinition)
- [ ] Prisma Client 재생성
- [ ] 마이그레이션 실행

**Zanzibar 모델 예시:**
```prisma
model RelationTuple {
  id          String   @id @default(cuid())
  namespace   String   // 'post', 'comment', 'category', 'system'
  objectId    String   // 리소스 ID
  relation    String   // 'owner', 'editor', 'viewer', 'moderator'
  subjectType String   // 'user', 'group'
  subjectId   String   // User ID
  createdAt   DateTime @default(now())

  @@unique([namespace, objectId, relation, subjectType, subjectId])
  @@index([namespace, objectId, relation])
  @@index([subjectType, subjectId])
  @@map("relation_tuples")
}

model RelationDefinition {
  id           String  @id @default(cuid())
  namespace    String
  relation     String
  inheritsFrom String? // 상속 관계 (예: 'editor' → 'viewer')
  description  String?

  @@unique([namespace, relation])
  @@map("relation_definitions")
}
```

**명령어:**
```bash
npx prisma generate
npx prisma migrate dev --name add_zanzibar_models
```

**산출물:**
- 업데이트된 `prisma/schema.prisma`
- Prisma migrations
- 생성된 Prisma Client

**참고:**
- [Google Zanzibar 논문](https://research.google/pubs/pub48190/)
- [Zanzibar 권한 모델 설명](./Zanzibar_Permission_System.md)

---

#### Task 11.3: 권한 시스템 구축 (Zanzibar)
- [ ] `lib/permissions.ts` 생성
- [ ] 권한 체크 함수 구현 (`check`, `grant`, `revoke`)
- [ ] 상속 관계 지원 (owner → editor → viewer)
- [ ] 시스템 레벨 권한 (admin, moderator)
- [ ] 리스트 필터링 함수 (`listAccessible`)

**핵심 함수:**
```typescript
// 권한 확인
export async function check(
  userId: string,
  namespace: Namespace,
  objectId: string,
  relation: Relation
): Promise<boolean>

// 권한 부여
export async function grant(
  namespace: Namespace,
  objectId: string,
  relation: Relation,
  subjectType: SubjectType,
  subjectId: string
)

// 권한 제거
export async function revoke(...)

// 접근 가능한 리소스 조회
export async function listAccessible(
  userId: string,
  namespace: Namespace,
  relation: Relation
): Promise<string[]>
```

**산출물:**
- `lib/permissions.ts`
- 권한 시스템 유틸리티

**테스트:**
```bash
# 권한 시스템 테스트
npm run test:permissions
```

---

#### Task 11.4: API Routes 구현 (권한 통합)
- [ ] `app/api/posts/route.ts` (GET, POST + 권한 체크)
- [ ] `app/api/posts/[id]/route.ts` (GET, PATCH, DELETE + 권한 체크)
- [ ] `app/api/posts/[id]/comments/route.ts`
- [ ] `app/api/questions/route.ts`
- [ ] `app/api/answers/route.ts`
- [ ] 모든 API에 `requirePermission` 미들웨어 적용

**권한 적용 예시:**
```typescript
// app/api/posts/[id]/route.ts
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  // 권한 체크 (editor 필요)
  await requirePermission(session?.user?.id, 'post', id, 'editor');

  // 게시글 수정 로직
  const body = await request.json();
  const updatedPost = await prisma.post.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ post: updatedPost });
}
```

**산출물:**
- 완전한 API Routes (권한 통합)
- `app/api/` 디렉토리

---

#### Task 11.5: Supabase RLS 정책 설정 (선택적)
- [ ] Supabase Dashboard에서 RLS 활성화
- [ ] 기본 읽기 정책 (public posts)
- [ ] 수정 정책 (owner + Zanzibar 확인)
- [ ] 삭제 정책 (owner + moderator)

**RLS 정책 예시 (SQL):**
```sql
-- Public posts are viewable by everyone
CREATE POLICY "Public posts are viewable"
ON posts FOR SELECT
USING (true);

-- Users can update their own posts or if authorized
CREATE POLICY "Authorized users can update posts"
ON posts FOR UPDATE
USING (
  auth.uid() = author_id
  OR EXISTS (
    SELECT 1 FROM relation_tuples
    WHERE namespace = 'post'
    AND object_id = posts.id::text
    AND relation IN ('owner', 'editor')
    AND subject_id = auth.uid()::text
  )
);
```

**산출물:**
- Supabase RLS 정책
- 데이터베이스 레벨 보안

**참고:**
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

#### Task 11.6: Admin 페이지 기반 구축 (P0)

**배경**: 이전 세션에서 약관 관리 페이지가 구축되었으나, 전체 Admin 시스템 통합이 누락됨. Zanzibar 권한 시스템 구축 직후 Admin 페이지를 통합하여 권한 관리를 실전에서 검증.

**Task 11.6.1: Admin Layout & 권한 미들웨어**
- [ ] `lib/admin-middleware.ts` 생성
  - `requireAdmin()` - 관리자 전용 권한 체크
  - `requireModerator()` - 모더레이터 이상 권한 체크
  - Zanzibar `check()` 활용
- [ ] `app/admin/layout.tsx` 생성
  - AdminSidebar 포함
  - `requireModerator()` 권한 체크 (Server Component)
  - 사용자 역할 조회 및 Sidebar 전달
- [ ] `components/admin/AdminSidebar.tsx`
  - Dashboard, Users, Content, Terms, News, Settings 메뉴
  - adminOnly 플래그 (관리자 전용 메뉴 필터링)
  - 활성 메뉴 하이라이트

**AdminSidebar 메뉴 구조:**
```tsx
const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: HomeIcon },
  { href: '/admin/users', label: '사용자 관리', icon: UsersIcon, adminOnly: true },
  { href: '/admin/content/posts', label: '게시글 관리', icon: FileTextIcon },
  { href: '/admin/content/comments', label: '댓글 관리', icon: FileTextIcon },
  { href: '/admin/terms', label: '약관 관리', icon: FileCheckIcon },
  { href: '/admin/news', label: '뉴스 관리', icon: NewspaperIcon, adminOnly: true },
  { href: '/admin/settings', label: '설정', icon: SettingsIcon, adminOnly: true },
]
```

**산출물:**
- `lib/admin-middleware.ts`
- `app/admin/layout.tsx`
- `components/admin/AdminSidebar.tsx`

---

**Task 11.6.2: Admin Dashboard**
- [ ] `app/admin/page.tsx` (대시보드)
- [ ] `components/admin/StatsCard.tsx`
  - 총 사용자, 게시글, 댓글, DAU 표시
  - 아이콘 + 숫자 카드 UI
- [ ] `components/admin/RecentActivity.tsx`
  - 최근 게시글/댓글 타임라인
- [ ] `app/api/admin/stats/route.ts`
  - Prisma 병렬 쿼리 (성능 최적화)
  - `requireModerator()` 권한 체크
  - DAU 계산 (최근 24시간 활성 사용자)

**통계 항목:**
- 총 사용자 수
- 총 게시글 수
- 총 댓글 수
- 일일 활성 사용자 (DAU)

**산출물:**
- Admin Dashboard 페이지
- 통계 API Route

---

**Task 11.6.3: 사용자 관리 (역할 변경 + Zanzibar 권한 부여)**
- [ ] `app/admin/users/page.tsx`
  - 사용자 목록 테이블 (shadcn/ui Table)
  - 검색 기능 (username, email)
  - 역할 필터 (USER, MODERATOR, ADMIN)
  - 페이지네이션
- [ ] `components/admin/UserRoleDialog.tsx`
  - 역할 변경 다이얼로그
  - 드롭다운 (USER/MODERATOR/ADMIN)
  - 확인 후 API 호출
- [ ] `app/api/admin/users/route.ts` (GET)
  - 사용자 목록 조회 (검색, 필터, 페이지네이션)
  - `requireAdmin()` 권한 체크
- [ ] `app/api/admin/users/[id]/role/route.ts` (POST)
  - 역할 변경 로직
  - Zanzibar 권한 자동 부여:
    - ADMIN → `grantSystemAdmin(userId)`
    - MODERATOR → `grantSystemModerator(userId)`
    - USER → 기존 권한 제거
  - `requireAdmin()` 권한 체크

**Zanzibar 권한 부여 예시:**
```typescript
// 역할 변경 시 자동 권한 부여
if (role === 'ADMIN') {
  await grantSystemAdmin(userId)
} else if (role === 'MODERATOR') {
  await grantSystemModerator(userId)
} else {
  // USER로 변경 시 기존 시스템 권한 제거
  await revoke('system', 'global', 'admin', 'user', userId)
  await revoke('system', 'global', 'moderator', 'user', userId)
}
```

**산출물:**
- 사용자 관리 페이지
- 역할 변경 API (Zanzibar 통합)

---

**Task 11.6.4: 약관 관리 통합 (기존 페이지 권한 보호)**
- [ ] 기존 약관 API Routes 권한 추가
  - `app/api/admin/terms/route.ts`
    - GET: `requireModerator()`
    - POST: `requireAdmin()`
  - `app/api/admin/terms/[id]/route.ts`
    - GET: `requireModerator()`
    - PATCH: `requireAdmin()`
    - DELETE: `requireAdmin()`
- [ ] 기존 페이지 검증
  - `app/admin/terms/*` 페이지들이 Admin Layout 자동 적용 확인
  - AdminSidebar에서 약관 관리 메뉴 접근 테스트
- [ ] UI 개선 (선택적)
  - shadcn/ui Table 컴포넌트 적용
  - 발행 상태 Badge 추가
  - 검색/필터 기능 추가

**권한 체크 예시:**
```typescript
// app/api/admin/terms/route.ts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  await requireModerator(session?.user?.id)  // 모더레이터 이상
  // ...
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  await requireAdmin(session?.user?.id)  // 관리자 전용
  // ...
}
```

**산출물:**
- 약관 관리 API Routes (권한 보호)
- Admin 시스템 통합 완료

---

### Week 12: 최종 배포

#### Task 12.1: 성능 최적화
- [ ] Lighthouse 점수 측정 (목표: 90+)
- [ ] 코드 분할 확인
- [ ] 이미지 최적화 확인
- [ ] 번들 크기 최적화

**산출물:**
- Lighthouse 리포트

---

#### Task 12.2: SEO 최적화
- [x] 메타 태그 추가 (title, description)
- [x] Open Graph 이미지 설정
- [x] `robots.txt` 생성
- [x] `sitemap.xml` 생성

**산출물:**
- `app/robots.ts`
- `app/sitemap.ts`

**완료 내역:**
- ✅ robots.txt 동적 생성 (크롤러 정책, sitemap 위치)
- ✅ sitemap.xml 동적 생성 (정적 10개 + 동적 100+ 페이지)
- ✅ layout.tsx metadata 확장:
  - Title template (%s | 바이브코딩)
  - Open Graph 완전 구성
  - Twitter Card 지원
  - metadataBase, robots, verification 설정
- ✅ 환경 변수 설정:
  - NEXT_PUBLIC_BASE_URL 추가 (.env)
  - .env.example 생성 (Supabase 설정 포함)
- ✅ SEO 완전 구현 완료

---

#### Task 12.3: 접근성 테스트
- [ ] Lighthouse a11y 점수 확인
- [ ] 키보드 네비게이션 테스트
- [ ] ARIA 레이블 추가

**산출물:**
- a11y 리포트

---

#### Task 12.4: Supabase + Vercel 배포
- [ ] Vercel 계정 연결
- [ ] GitHub 리포지토리 연결
- [ ] Vercel 환경 변수 설정
  - [ ] `DATABASE_URL` (Supabase PostgreSQL)
  - [ ] `DIRECT_URL` (Supabase Direct Connection)
  - [ ] `NEXTAUTH_URL` (프로덕션 URL)
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `GITHUB_ID`, `GITHUB_SECRET`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Prisma 마이그레이션 자동 실행 설정
- [ ] 배포 실행 및 검증

**Vercel 빌드 설정:**
```json
// vercel.json (선택적)
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "env": {
    "DATABASE_URL": "@database_url",
    "DIRECT_URL": "@direct_url"
  }
}
```

**산출물:**
- 프로덕션 URL
- Supabase + Vercel 통합 완료

**참고:**
- [Vercel + Supabase 통합 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Prisma + Vercel 배포](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

#### Task 12.5: 모니터링 & QA
- [ ] Sentry 설치 (에러 트래킹)
- [ ] Vercel Analytics 활성화
- [ ] 최종 버그 수정
- [ ] 모바일 반응형 테스트

**명령어:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**산출물:**
- 모니터링 설정 완료
- QA 통과

---

#### Task 12.6: 콘텐츠 모더레이션 (P1)

**Task 12.6.1: 게시글 관리**
- [ ] `app/admin/content/posts/page.tsx`
  - 모든 게시글 목록 (카테고리 필터, 검색)
  - 삭제/복구 버튼
  - 신고된 게시글 강조 표시
- [ ] `app/api/admin/posts/route.ts` (GET)
  - 모든 게시글 조회 (페이지네이션)
  - `requireModerator()` 권한 체크
- [ ] `app/api/admin/posts/[id]/route.ts` (DELETE, PATCH)
  - 게시글 삭제/복구 (soft delete)
  - `requireModerator()` 권한 체크

**주요 기능:**
- 카테고리별 필터링
- 검색 (제목, 본문)
- 신고 게시글 우선 표시
- Soft delete (deletedAt 필드 활용)

**산출물:**
- 게시글 관리 페이지
- 게시글 관리 API Routes

---

**Task 12.6.2: 댓글 관리**
- [ ] `app/admin/content/comments/page.tsx`
  - 모든 댓글 목록
  - 댓글이 속한 게시글 정보 표시
  - 삭제/복구 버튼
  - 신고된 댓글 처리
- [ ] `app/api/admin/comments/[id]/route.ts` (DELETE, PATCH)
  - 댓글 삭제/복구
  - `requireModerator()` 권한 체크

**주요 기능:**
- 게시글별 댓글 그룹화
- 댓글 컨텍스트 표시 (게시글 제목, 작성자)
- Soft delete

**산출물:**
- 댓글 관리 페이지
- 댓글 관리 API Routes

---

## 우선순위 매트릭스

### P0 (필수, Week 1-7 + Week 11 Admin 기반)
- [x] Next.js 프로젝트 초기화
- [x] 기존 컴포넌트 이전
- [x] 인증 시스템 (NextAuth.js)
- [ ] TypeScript 인터페이스 & Mock 데이터
- [ ] 모든 페이지 UI 구현 (커뮤니티, Q&A, 뉴스, 프로필)
- [ ] 기본 컴포넌트 (PostCard, CommentList, VoteButtons 등)
- [ ] **Admin Layout & 권한 미들웨어 (Task 11.6.1)**
- [ ] **Admin Dashboard (Task 11.6.2)**
- [ ] **사용자 관리 & Zanzibar 권한 부여 (Task 11.6.3)**
- [ ] **약관 관리 통합 (Task 11.6.4)**

### P1 (중요, Week 8-10 + Week 12 콘텐츠 관리)
- [ ] 클라이언트 상태 관리
- [ ] localStorage 기반 CRUD
- [ ] 검색 & 필터링
- [ ] 성능 최적화
- [ ] E2E 테스트
- [ ] **콘텐츠 모더레이션 - 게시글 (Task 12.6.1)**
- [ ] **콘텐츠 모더레이션 - 댓글 (Task 12.6.2)**

### P2 (Supabase 통합, Week 11-12)
- [ ] Supabase 프로젝트 설정
- [ ] Prisma + Zanzibar 스키마 구현
- [ ] 권한 시스템 구축
- [ ] API Routes 구현 (권한 통합)
- [ ] Supabase RLS 정책 (선택적)
- [ ] 배포 & 모니터링

### P3 (향후 고도화)
- [ ] Supabase 실시간 구독 (댓글, 투표 실시간 업데이트)
- [ ] Supabase Storage (이미지 업로드)
- [ ] Supabase Auth 전환 (NextAuth → Supabase Auth)
- [ ] 메시지 시스템 (DM)
- [ ] Zanzibar 권한 캐싱 최적화
- [ ] **Admin 뉴스 관리 (공식 뉴스 작성/발행)**
- [ ] **Admin 카테고리 관리 (카테고리 추가/수정/삭제, 모더레이터 지정)**
- [ ] **Admin 고급 통계 (차트, 리포트, CSV 내보내기)**
- [ ] **신고 시스템 (사용자 신고 접수/처리)**

---

## 의존성 관계도

```
인증 시스템 (Week 3)
    ├─> 모든 로그인 필요 페이지
    ├─> 프로필 페이지 (Week 7)
    ├─> 게시글/댓글 작성 (Week 5-6)
    └─> Admin 페이지 (Week 11)

TypeScript 인터페이스 & Mock 데이터 (Week 4)
    ├─> 모든 페이지 UI (Week 4-7)
    ├─> 클라이언트 상태 관리 (Week 8)
    └─> localStorage 로직 (Week 8)

Tiptap 에디터 (Week 5)
    ├─> 게시글 작성 (Week 5)
    ├─> 댓글 작성 (Week 5)
    ├─> Q&A 작성 (Week 6)
    └─> Admin 뉴스 작성 (P3)

클라이언트 상태 관리 (Week 8)
    ├─> CRUD 기능 (Week 8)
    ├─> 검색 & 필터링 (Week 9)
    └─> Real API 전환 (Week 11)

Supabase + Zanzibar 스키마 (Week 11)
    ├─> 권한 시스템 (Week 11)
    ├─> API Routes with 권한 (Week 11)
    ├─> **Admin 페이지 (Week 11)** ✅
    │   ├─> Admin Layout & 권한 미들웨어 (Task 11.6.1)
    │   ├─> Dashboard 통계 (Task 11.6.2)
    │   ├─> 사용자 관리 & Zanzibar 권한 부여 (Task 11.6.3)
    │   └─> 약관 관리 통합 (Task 11.6.4)
    ├─> Supabase RLS (Week 11, 선택적)
    ├─> **콘텐츠 관리 (Week 12)** ✅
    │   ├─> 게시글 관리 (Task 12.6.1)
    │   └─> 댓글 관리 (Task 12.6.2)
    └─> 배포 (Week 12)
```

---

## 진행 상황 체크리스트

### Phase 1: 기반 구축 (3주)
- [x] Week 1: 프로젝트 초기화 (5개 Task) - 대부분 완료
- [x] Week 2: 기존 컴포넌트 이전 (6개 Task) - 완료
- [x] Week 3: 인증 시스템 (5개 Task) - 대부분 완료
- [ ] Week 4: Mock 데이터 & 커뮤니티 UI (5개 Task)

**완료율**: 16/21 Tasks (76%)

---

### Phase 2: UI 우선 구현 (4주)
- [ ] Week 5: 게시글 상세 & 작성 UI (5개 Task)
- [ ] Week 6: Q&A & 뉴스 UI (5개 Task)
- [ ] Week 7: 프로필 & 설정 UI (5개 Task)

**완료율**: 0/15 Tasks

---

### Phase 3: 기능 완성 (3주)
- [ ] Week 8: 클라이언트 상태 관리 (5개 Task)
- [ ] Week 9: 검색 & 필터링 (5개 Task)
- [ ] Week 10: 최적화 & 테스트 (5개 Task)

**완료율**: 0/15 Tasks

---

### Phase 4: Supabase 통합 & 배포 (2주)
- [ ] Week 11: Supabase + Zanzibar + Admin 기반 (9개 Task)
  - Task 11.1-11.5: Supabase + Zanzibar (5개)
  - **Task 11.6: Admin 페이지 기반 (4개 Sub-Task)** ✅ NEW
- [ ] Week 12: 최종 배포 + 콘텐츠 관리 (7개 Task)
  - Task 12.1-12.5: 배포 (5개)
  - **Task 12.6: 콘텐츠 관리 (2개 Sub-Task)** ✅ NEW

**완료율**: 0/16 Tasks

---

## 전체 진행 상황

**총 Tasks**: 67개 (Admin 추가 후)
**완료**: 16개
**진행률**: 24% (16/67)

---

## 참고 문서

- [PRD.md](./PRD.md) - 제품 요구사항 문서
- [Supabase 설정 가이드](./Supabase_Setup_Guide.md) - Supabase 통합 가이드
- [Zanzibar 권한 시스템](./Zanzibar_Permission_System.md) - 권한 시스템 설명
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
| 1.2 | 2025-10-20 | **UI 우선 개발 전략으로 전면 재구성**<br>- Phase 재구성: 기반(3주) → UI 우선(4주) → 기능 완성(3주) → DB 통합(2주)<br>- Week 4: Prisma Task 제거 → Mock 데이터 & 커뮤니티 UI Task<br>- Week 5-7: 모든 페이지 UI 구현 (Mock 데이터 기반)<br>- Week 8-10: 클라이언트 상태 관리 & 기능 완성<br>- Week 11-12: PostgreSQL 통합 & 배포<br>- 총 Task: 54개 → 61개 (UI 중심으로 재분류) |
| 1.3 | 2025-11-04 | **Supabase + Zanzibar 권한 시스템으로 전환**<br>- Phase 4 제목 변경: "PostgreSQL 통합" → "Supabase 통합"<br>- Week 11 완전 재구성:<br>&nbsp;&nbsp;• Task 11.1: Supabase 프로젝트 설정<br>&nbsp;&nbsp;• Task 11.2: Prisma + Zanzibar 스키마 (Google Zanzibar 패턴)<br>&nbsp;&nbsp;• Task 11.3: 권한 시스템 구축 (check, grant, revoke)<br>&nbsp;&nbsp;• Task 11.4: API Routes with 권한 통합<br>&nbsp;&nbsp;• Task 11.5: Supabase RLS 정책 (선택적)<br>- Week 12 배포 개선: Supabase + Vercel 통합 가이드<br>- P3 고도화: Supabase 실시간, Storage, Auth 전환 추가<br>- 의존성 관계도 업데이트: Zanzibar 권한 시스템 통합 |
| 1.4 | 2025-11-04 | **Admin 페이지 구축 추가**<br>- Week 11 Admin 기반 구축 (Task 11.6, 4개 Sub-Task):<br>&nbsp;&nbsp;• Task 11.6.1: Admin Layout & 권한 미들웨어<br>&nbsp;&nbsp;• Task 11.6.2: Admin Dashboard (통계)<br>&nbsp;&nbsp;• Task 11.6.3: 사용자 관리 (역할 변경 + Zanzibar 권한 부여)<br>&nbsp;&nbsp;• Task 11.6.4: 약관 관리 통합 (기존 페이지 권한 보호)<br>- Week 12 콘텐츠 관리 추가 (Task 12.6, 2개 Sub-Task):<br>&nbsp;&nbsp;• Task 12.6.1: 게시글 관리 (삭제/복구)<br>&nbsp;&nbsp;• Task 12.6.2: 댓글 관리 (삭제/복구)<br>- P0 우선순위: Admin Layout, Dashboard, 사용자 관리, 약관 통합<br>- P1 우선순위: 콘텐츠 모더레이션 (게시글/댓글)<br>- P3 고도화: 뉴스 관리, 카테고리 관리, 고급 통계, 신고 시스템<br>- 의존성 관계도 업데이트: Admin 페이지 통합<br>- 참고 문서 추가: Supabase 설정 가이드, Zanzibar 권한 시스템<br>- 총 Task: 61개 → 67개 (+6개) |

---

**문서 끝**
