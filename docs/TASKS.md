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
- [ ] `components/CommentList.tsx`
- [ ] `components/CommentItem.tsx`
- [ ] 댓글 스레드 UI (대댓글 지원)
- [ ] 댓글 작성 폼 UI

**산출물:**
- `components/CommentList.tsx`
- `components/CommentItem.tsx`

---

#### Task 5.5: 투표 버튼 UI
- [ ] `components/VoteButtons.tsx`
- [ ] ⬆ Upvote 버튼
- [ ] ⬇ Downvote 버튼
- [ ] 클라이언트 상태 관리

**산출물:**
- `components/VoteButtons.tsx`

---

### Week 6: Q&A & 뉴스 UI

#### Task 6.1: Q&A 목록 페이지 UI
- [ ] `app/help/page.tsx` 생성
- [ ] 질문 카드 컴포넌트 (`components/QuestionCard.tsx`)
- [ ] Mock 데이터로 질문 목록 표시
- [ ] 필터 UI (답변 없는 질문, 채택된 질문)

**산출물:**
- `app/help/page.tsx`
- `components/QuestionCard.tsx`

---

#### Task 6.2: 질문 상세 페이지 UI
- [ ] `app/help/[questionId]/page.tsx` 생성
- [ ] 질문 본문 표시
- [ ] 답변 목록 UI
- [ ] 답변 채택 버튼 UI

**산출물:**
- `app/help/[questionId]/page.tsx`

---

#### Task 6.3: 답변 섹션 UI
- [ ] `components/AnswerList.tsx`
- [ ] `components/AnswerItem.tsx`
- [ ] 답변 작성 폼 UI
- [ ] 채택된 답변 강조 표시

**산출물:**
- `components/AnswerList.tsx`
- `components/AnswerItem.tsx`

---

#### Task 6.4: 뉴스 목록 페이지 UI
- [ ] `app/news/page.tsx` 생성
- [ ] 뉴스 카드 컴포넌트 (`components/NewsCard.tsx`)
- [ ] Mock 데이터로 뉴스 목록 표시
- [ ] 카테고리 필터 UI

**산출물:**
- `app/news/page.tsx`
- `components/NewsCard.tsx`

---

#### Task 6.5: 뉴스 상세 페이지 UI
- [ ] `app/news/[id]/page.tsx` 생성
- [ ] 커버 이미지 표시
- [ ] 본문 Rich Text 렌더링
- [ ] 관련 뉴스 추천 UI

**산출물:**
- `app/news/[id]/page.tsx`

---

### Week 7: 프로필 & 설정 UI

#### Task 7.1: 사용자 프로필 페이지 UI
- [ ] `app/profile/[username]/page.tsx` 개선
- [ ] 사용자 정보 표시 (아바타, bio, reputation)
- [ ] 작성한 게시글 목록
- [ ] 작성한 댓글 목록
- [ ] Mock 데이터 활용

**산출물:**
- `app/profile/[username]/page.tsx` (개선)

---

#### Task 7.2: 프로필 편집 폼 UI
- [ ] `app/profile/edit/page.tsx` 생성
- [ ] 프로필 이미지 업로드 UI
- [ ] displayName, bio 편집 폼
- [ ] localStorage에 저장

**산출물:**
- `app/profile/edit/page.tsx`

---

#### Task 7.3: 설정 페이지 UI
- [ ] `app/settings/page.tsx` 생성
- [ ] 알림 설정 UI
- [ ] 다크 모드 설정
- [ ] 언어 설정 (향후 확장)

**산출물:**
- `app/settings/page.tsx`

---

#### Task 7.4: 알림 UI (기본)
- [ ] `components/NotificationBell.tsx`
- [ ] 알림 목록 드롭다운 UI
- [ ] Mock 알림 데이터
- [ ] 읽음/안 읽음 표시

**산출물:**
- `components/NotificationBell.tsx`

---

#### Task 7.5: 검색 & 필터링 UI 개선
- [ ] 전역 검색 바 개선
- [ ] 필터 드롭다운 UI
- [ ] 정렬 옵션 UI
- [ ] 태그 필터 UI

**산출물:**
- `components/SearchBar.tsx` (개선)
- `components/FilterBar.tsx`

---

## Phase 3: 기능 완성 (3주)

**참고**: Phase 3에서는 클라이언트 상태 관리와 localStorage를 활용하여 기능을 구현합니다.

### Week 8: 클라이언트 상태 관리

#### Task 8.1: 상태 관리 설정
- [ ] Zustand 또는 React Context 설치
- [ ] 전역 상태 스토어 생성 (`lib/store.ts`)
- [ ] 사용자 상태, 게시글 상태, 댓글 상태 관리

**명령어:**
```bash
npm install zustand  # 또는 React Context 사용
```

**산출물:**
- `lib/store.ts`

---

#### Task 8.2: 게시글 CRUD (localStorage)
- [ ] 게시글 생성 (localStorage에 저장)
- [ ] 게시글 수정
- [ ] 게시글 삭제
- [ ] Mock 데이터와 병합하여 표시

**산출물:**
- `lib/localStorage.ts` (유틸리티 함수)

---

#### Task 8.3: 댓글 CRUD (localStorage)
- [ ] 댓글 작성 (localStorage)
- [ ] 대댓글 작성
- [ ] 댓글 수정/삭제
- [ ] Optimistic UI 업데이트

**산출물:**
- 댓글 관련 상태 관리 로직

---

#### Task 8.4: 투표 시스템 (클라이언트 상태)
- [ ] Upvote/Downvote 클라이언트 로직
- [ ] localStorage에 투표 기록 저장
- [ ] 투표 카운트 실시간 업데이트

**산출물:**
- 투표 관련 상태 관리 로직

---

#### Task 8.5: 임시 저장 기능
- [ ] 게시글 작성 중 자동 저장 (Local Storage)
- [ ] 페이지 새로고침 시 복원
- [ ] `hooks/useAutoSave.ts` 훅

**산출물:**
- `hooks/useAutoSave.ts`

---

### Week 9: 검색 & 필터링

#### Task 9.1: 클라이언트 사이드 검색
- [ ] 검색 결과 페이지 (`app/search/page.tsx`)
- [ ] 제목, 본문, 태그 검색 (클라이언트)
- [ ] Mock + localStorage 데이터 통합 검색
- [ ] 검색어 하이라이트

**산출물:**
- `app/search/page.tsx`
- `lib/search.ts` (검색 로직)

---

#### Task 9.2: 게시글 필터링
- [ ] 태그별 필터링
- [ ] 카테고리별 필터링
- [ ] 정렬 옵션 (인기순, 최신순, 댓글 많은 순)
- [ ] URL Query Params 동기화

**산출물:**
- 필터링 로직 개선

---

#### Task 9.3: Q&A 필터링
- [ ] 답변 없는 질문 필터
- [ ] 채택된 질문 필터
- [ ] 태그별 필터
- [ ] 투표 순 정렬

**산출물:**
- Q&A 필터 로직

---

#### Task 9.4: 검색 성능 최적화
- [ ] Debounce 적용
- [ ] 검색 결과 캐싱
- [ ] 무한 스크롤 또는 페이지네이션

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
- [ ] React.memo 적용 (PostCard, CommentItem 등)
- [ ] useMemo, useCallback 최적화
- [ ] 불필요한 리렌더링 제거
- [ ] React DevTools Profiler 분석

**산출물:**
- 성능 최적화 보고서

---

#### Task 10.2: 이미지 최적화
- [ ] Next.js Image 컴포넌트 적용 확인
- [ ] Lazy Loading 적용
- [ ] 이미지 압축
- [ ] Placeholder blur 이미지

**산출물:**
- 이미지 최적화 완료

---

#### Task 10.3: 코드 분할 & 번들 최적화
- [ ] Dynamic Import 적용
- [ ] Route-based Code Splitting
- [ ] 번들 분석 (webpack-bundle-analyzer)
- [ ] 불필요한 의존성 제거

**산출물:**
- 번들 크기 최적화

---

#### Task 10.4: E2E 테스트 (Playwright)
- [ ] 주요 사용자 플로우 테스트
  - [ ] 회원가입/로그인
  - [ ] 게시글 작성/읽기
  - [ ] 댓글 작성
  - [ ] 투표
- [ ] 테스트 자동화

**산출물:**
- `e2e/` 테스트 스크립트

---

#### Task 10.5: 접근성 검증
- [ ] Lighthouse a11y 점수 확인
- [ ] ARIA 레이블 추가
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 호환성

**산출물:**
- a11y 개선 보고서

---

## Phase 4: 데이터베이스 통합 & 배포 (2주)

### Week 11: PostgreSQL 통합

#### Task 11.1: PostgreSQL 스키마 구현
- [ ] `database/schema.sql` 생성
- [ ] CREATE TABLE 문 작성 (Users, Posts, Comments, Categories, Answers, Votes)
- [ ] 인덱스 생성
- [ ] FOREIGN KEY 제약조건 설정

**산출물:**
- `database/schema.sql`

---

#### Task 11.2: pg 라이브러리 설정
- [ ] `pg` 패키지 설치
- [ ] `lib/db.ts` 데이터베이스 연결 파일 생성
- [ ] 커넥션 풀 설정
- [ ] `.env`에 DATABASE_URL 추가

**명령어:**
```bash
npm install pg @types/pg
```

**산출물:**
- `lib/db.ts`

---

#### Task 11.3: API Routes 구현 (CRUD)
- [ ] `app/api/posts/route.ts` (GET, POST)
- [ ] `app/api/posts/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] `app/api/posts/[id]/comments/route.ts`
- [ ] Prepared Statements 사용 (SQL injection 방지)

**산출물:**
- API Routes

---

#### Task 11.4: Mock API → Real API 전환
- [ ] 클라이언트 코드 수정 (fetch API 엔드포인트 변경)
- [ ] localStorage → PostgreSQL 데이터 마이그레이션
- [ ] 기존 Mock 데이터 삭제 또는 백업

**산출물:**
- API 통합 완료

---

#### Task 11.5: 데이터 마이그레이션
- [ ] Mock 데이터 → PostgreSQL 이동
- [ ] 카테고리 데이터 삽입
- [ ] 테스트 사용자 생성
- [ ] 데이터 검증

**산출물:**
- 데이터 마이그레이션 완료

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
- [ ] 메타 태그 추가 (title, description)
- [ ] Open Graph 이미지 설정
- [ ] `robots.txt` 생성
- [ ] `sitemap.xml` 생성

**산출물:**
- `app/robots.ts`
- `app/sitemap.ts`

---

#### Task 12.3: 접근성 테스트
- [ ] Lighthouse a11y 점수 확인
- [ ] 키보드 네비게이션 테스트
- [ ] ARIA 레이블 추가

**산출물:**
- a11y 리포트

---

#### Task 12.4: Vercel 배포
- [ ] Vercel 계정 연결
- [ ] GitHub 리포지토리 연결
- [ ] 환경 변수 설정 (DATABASE_URL, NEXTAUTH_SECRET 등)
- [ ] 배포 실행

**산출물:**
- 프로덕션 URL

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

## 우선순위 매트릭스

### P0 (필수, Week 1-7)
- [x] Next.js 프로젝트 초기화
- [x] 기존 컴포넌트 이전
- [x] 인증 시스템 (NextAuth.js)
- [ ] TypeScript 인터페이스 & Mock 데이터
- [ ] 모든 페이지 UI 구현 (커뮤니티, Q&A, 뉴스, 프로필)
- [ ] 기본 컴포넌트 (PostCard, CommentList, VoteButtons 등)

### P1 (중요, Week 8-10)
- [ ] 클라이언트 상태 관리
- [ ] localStorage 기반 CRUD
- [ ] 검색 & 필터링
- [ ] 성능 최적화
- [ ] E2E 테스트

### P2 (DB 통합, Week 11-12)
- [ ] PostgreSQL 스키마 구현
- [ ] API Routes 구현
- [ ] Mock → Real API 전환
- [ ] 배포 & 모니터링

### P3 (향후 고도화)
- [ ] 실시간 알림 (WebSocket)
- [ ] 관리자 대시보드
- [ ] 이미지 업로드 (Cloudinary)
- [ ] 메시지 시스템 (DM)
- [ ] ORM 도입 검토 (Prisma/Drizzle)

---

## 의존성 관계도

```
인증 시스템 (Week 3)
    ├─> 모든 로그인 필요 페이지
    ├─> 프로필 페이지 (Week 7)
    └─> 게시글/댓글 작성 (Week 5-6)

TypeScript 인터페이스 & Mock 데이터 (Week 4)
    ├─> 모든 페이지 UI (Week 4-7)
    ├─> 클라이언트 상태 관리 (Week 8)
    └─> localStorage 로직 (Week 8)

Tiptap 에디터 (Week 5)
    ├─> 게시글 작성 (Week 5)
    ├─> 댓글 작성 (Week 5)
    └─> Q&A 작성 (Week 6)

클라이언트 상태 관리 (Week 8)
    ├─> CRUD 기능 (Week 8)
    ├─> 검색 & 필터링 (Week 9)
    └─> Real API 전환 (Week 11)

PostgreSQL 스키마 (Week 11)
    ├─> API Routes (Week 11)
    ├─> Mock → Real 전환 (Week 11)
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

### Phase 4: 데이터베이스 통합 & 배포 (2주)
- [ ] Week 11: PostgreSQL 통합 (5개 Task)
- [ ] Week 12: 최종 배포 (5개 Task)

**완료율**: 0/10 Tasks

---

## 전체 진행 상황

**총 Tasks**: 61개 (재구성 후)
**완료**: 16개
**진행률**: 26%

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
| 1.2 | 2025-10-20 | **UI 우선 개발 전략으로 전면 재구성**<br>- Phase 재구성: 기반(3주) → UI 우선(4주) → 기능 완성(3주) → DB 통합(2주)<br>- Week 4: Prisma Task 제거 → Mock 데이터 & 커뮤니티 UI Task<br>- Week 5-7: 모든 페이지 UI 구현 (Mock 데이터 기반)<br>- Week 8-10: 클라이언트 상태 관리 & 기능 완성<br>- Week 11-12: PostgreSQL 통합 & 배포<br>- 총 Task: 54개 → 61개 (UI 중심으로 재분류) |

---

**문서 끝**
