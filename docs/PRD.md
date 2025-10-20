# 바이브코딩 커뮤니티 플랫폼 PRD (Product Requirements Document)

**문서 버전**: 1.2
**작성일**: 2025-10-15
**최종 수정**: 2025-10-20
**프로젝트명**: Vibe Coding Community Platform

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [Vite → Next.js 마이그레이션](#3-vite--nextjs-마이그레이션)
4. [페이지 아키텍처](#4-페이지-아키텍처)
5. [기능 명세](#5-기능-명세)
6. [데이터 모델](#6-데이터-모델)
7. [API 설계](#7-api-설계)
8. [UI/UX 가이드라인](#8-uiux-가이드라인)
9. [보안 & 인증](#9-보안--인증)
10. [성능 최적화](#10-성능-최적화)
11. [개발 로드맵](#11-개발-로드맵)

---

## 1. 프로젝트 개요

### 1.1 비전

바이브코딩에 대한 궁금증을 해소하고 개발자들이 정보와 팁을 자유롭게 공유하는 활발한 커뮤니티 플랫폼을 구축한다.

### 1.2 목표

- 바이브코딩 사용자 간 지식 공유 및 협업 활성화
- 레딧 스타일의 직관적이고 참여하기 쉬운 커뮤니티 경험 제공
- Q&A 시스템을 통한 즉각적인 문제 해결 지원
- 바이브코딩 생태계 관련 최신 정보 전달

### 1.3 대상 사용자

- **초급 개발자**: 바이브코딩 입문자, 학습 중인 사용자
- **중급 개발자**: 프로젝트 경험 공유, 팁 제공
- **고급 개발자**: 멘토링, 코드 리뷰, 심화 토론
- **관리자**: 콘텐츠 관리, 커뮤니티 운영

### 1.4 성공 지표 (KPI)

- 월간 활성 사용자(MAU) 목표: 1,000명 (6개월 내)
- 일평균 게시글: 20개 이상
- 질문 평균 응답 시간: 24시간 이내

---

## 2. 기술 스택

### 2.1 Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 14+ (App Router) | React 프레임워크, SSR/SSG |
| **React** | 18+ | UI 라이브러리 |
| **TypeScript** | 5+ | 타입 안정성 |
| **Tailwind CSS** | v4 | 스타일링 |
| **shadcn/ui** | Latest | UI 컴포넌트 시스템 |
| **Radix UI** | Latest | 접근성 높은 UI primitives |
| **lucide-react** | Latest | 아이콘 시스템 |
| **React Hook Form** | 7+ | 폼 관리 |
| **Zod** | Latest | 스키마 검증 |

### 2.2 Backend

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js API Routes** | 14+ | 백엔드 API |
| **PostgreSQL** | 15+ | 관계형 데이터베이스 |
| **pg** | 8+ | PostgreSQL Node.js 클라이언트 |
| **NextAuth.js** | v5 (Auth.js) | 인증 시스템 |

**데이터베이스 전략:**
- **Phase 1-3 (Week 1-10)**: Mock 데이터 사용 (TypeScript 인터페이스 기반)
- **Phase 4 (Week 11-12)**: PostgreSQL 직접 연결 (pg 라이브러리 사용)
- **고도화 단계**: ORM 도입 재검토 (Prisma 또는 Drizzle)

### 2.3 상태 관리 & 데이터 Fetching

| 기술 | 용도 |
|------|------|
| **React Server Components** | 서버 사이드 렌더링 |
| **TanStack Query (React Query)** | 클라이언트 데이터 fetching |
| **Zustand** | 클라이언트 전역 상태 (필요시) |

### 2.4 리치 텍스트 에디터

| 기술 | 용도 |
|------|------|
| **Tiptap** | 게시글 작성 WYSIWYG 에디터 |

### 2.5 이미지 & 파일 처리

| 기술 | 용도 |
|------|------|
| **Next.js Image Optimization** | 이미지 자동 최적화 |
| **Cloudinary** 또는 **AWS S3** | 이미지 업로드 & 저장 |

### 2.6 검색

| 기술 | 용도 |
|------|------|
| **PostgreSQL Full-Text Search** | 기본 검색 기능 |
| **Algolia** (추후 확장) | 고급 검색 & 필터링 |

### 2.7 배포 & 인프라

| 기술 | 용도 |
|------|------|
| **Vercel** (추천) | 호스팅 & CI/CD |
| **Supabase** 또는 **Railway** | PostgreSQL 호스팅 |

---

## 3. Vite → Next.js 마이그레이션

### 3.1 마이그레이션 이유

현재 프로젝트는 **Vite + React**로 구현되어 있으나, 커뮤니티 플랫폼의 특성상 다음 요구사항을 충족하기 위해 **Next.js**로 마이그레이션이 필요합니다:

#### 필수 요구사항

1. **SEO 최적화**
   - 커뮤니티 게시글, 프로젝트 소개, Q&A는 검색엔진 노출 필수
   - Server-Side Rendering (SSR) 지원 필요

2. **동적 라우팅**
   - `/community/[category]`, `/posts/[id]`, `/projects/[id]` 등 동적 경로
   - 파일 기반 라우팅으로 직관적인 구조

3. **API 통합**
   - Next.js API Routes로 백엔드 로직 구현
   - 별도 백엔드 서버 없이 Full-Stack 개발 가능

4. **성능 최적화**
   - Static Site Generation (SSG) → 정적 페이지 사전 생성
   - Incremental Static Regeneration (ISR) → 주기적 재생성
   - Image Optimization → 자동 이미지 최적화

5. **개발 생산성**
   - Server Components → 클라이언트 번들 크기 감소
   - App Router → 레이아웃, 로딩 상태 관리 간소화

### 3.2 마이그레이션 전략

#### Phase 1: 프로젝트 초기화 (1주)

```bash
# Next.js 14 프로젝트 생성
npx create-next-app@latest vibe-coding-community --typescript --tailwind --app

# 기존 의존성 설치
npm install @radix-ui/react-* lucide-react class-variance-authority clsx tailwind-merge
```

**작업 항목:**
- Next.js 14 App Router 프로젝트 생성
- Tailwind CSS v4 설정
- TypeScript 설정 (`tsconfig.json`)
- shadcn/ui CLI 설치 및 초기 컴포넌트 추가

#### Phase 2: 기존 컴포넌트 이전 (2주)

**재사용 가능 컴포넌트:**
- `src/components/ui/` → `components/ui/` (45+ shadcn/ui 컴포넌트)
- `src/components/Header.tsx` → `components/Header.tsx`
- `src/components/Footer.tsx` → `components/Footer.tsx`
- `src/components/Hero.tsx` → `components/Hero.tsx` (홈페이지용)
- `src/index.css` → `app/globals.css` (Tailwind + CSS 변수)

**수정 필요 사항:**
- `<a href="#section">` → Next.js `<Link href="/section">`
- 이미지 태그 → Next.js `<Image />` 컴포넌트
- Client Components (`"use client"`) 지시자 추가 (상태 사용 시)

#### Phase 3: 라우팅 구조 구현 (1주)

App Router 디렉토리 구조:

```
app/
├── layout.tsx              # 루트 레이아웃 (Header, Footer)
├── page.tsx                # 홈페이지 (/)
├── community/
│   ├── layout.tsx          # 커뮤니티 레이아웃
│   ├── page.tsx            # 커뮤니티 메인 (/community)
│   └── [category]/
│       ├── page.tsx        # 카테고리별 게시글 목록
│       └── [postId]/
│           └── page.tsx    # 게시글 상세
├── help/
│   ├── page.tsx            # 질문 목록 (/help)
│   └── [questionId]/
│       └── page.tsx        # 질문 상세
├── news/
│   ├── page.tsx            # 뉴스 목록 (/news)
│   └── [id]/
│       └── page.tsx        # 뉴스 상세
└── api/                    # API Routes
    ├── auth/[...nextauth]/route.ts
    ├── posts/route.ts
    ├── comments/route.ts
    └── ...
```

#### Phase 4: 데이터베이스 통합 (2주)

**참고**: Phase 1-3에서는 Mock 데이터로 UI를 먼저 구현하고, Phase 4에서 PostgreSQL을 연결합니다.

1. **PostgreSQL 설정**
   ```bash
   npm install pg
   ```

2. **데이터베이스 스키마 구현** (`database/schema.sql`)
   - CREATE TABLE 문 실행
   - 인덱스 생성

3. **데이터베이스 연결 설정** (`lib/db.ts`)
   - pg 라이브러리 설정
   - 커넥션 풀 관리

4. **API Routes 구현**
   - CRUD 엔드포인트
   - Prepared Statements 사용 (SQL injection 방지)
   - Mock API → Real API 전환

#### Phase 5: 기능 구현 (4주)

- 커뮤니티 페이지 (게시글 CRUD, 댓글, 투표)
- 프로젝트 쇼케이스 (등록, 수정, 삭제)
- Q&A 게시판 (질문, 답변, 채택)
- 뉴스 페이지 (관리자 전용)
- 검색 & 필터링
- 프로필 페이지

### 3.3 마이그레이션 체크리스트

- [ ] Next.js 14 프로젝트 초기화
- [ ] Tailwind CSS 설정 이전
- [ ] shadcn/ui 컴포넌트 재설치
- [ ] 기존 UI 컴포넌트 이전
- [ ] `<a>` → `<Link>` 변환
- [ ] 이미지 → `<Image />` 변환
- [ ] Client Components 분리
- [ ] App Router 구조 생성
- [ ] Prisma 설정
- [ ] NextAuth.js 설정
- [ ] API Routes 구현
- [ ] 환경 변수 설정 (`.env`)

---

## 4. 페이지 아키텍처

### 4.1 사이트맵

```
/ (홈페이지)
├── /community (커뮤니티)
│   ├── /community/general (자유게시판)
│   ├── /community/tips (팁 & 노하우)
│   ├── /community/showcase (작품 공유)
│   ├── /community/events (이벤트 & 공지)
│   └── /community/[category]/[postId] (게시글 상세)
├── /help (Help me - Q&A)
│   └── /help/[questionId] (질문 상세)
├── /news (바이브코딩 뉴스)
│   └── /news/[id] (뉴스 상세)
├── /profile/[username] (사용자 프로필)
├── /settings (설정)
├── /auth/signin (로그인)
└── /auth/signup (회원가입)
```

### 4.2 라우팅 구조

#### 레이아웃 계층 (Nested Layouts)

```tsx
// app/layout.tsx (루트 레이아웃)
- Header (전역 네비게이션)
- {children}
- Footer

// app/community/layout.tsx (커뮤니티 레이아웃)
- Category Navigation (카테고리 탭)
- {children}

// app/community/[category]/layout.tsx (카테고리 레이아웃)
- Filters (필터, 정렬)
- {children}
```

#### 동적 라우트 예시

| 경로 | 파일 | 설명 |
|------|------|------|
| `/community/general` | `app/community/[category]/page.tsx` | 카테고리별 게시글 목록 |
| `/community/tips/123` | `app/community/[category]/[postId]/page.tsx` | 게시글 상세 |
| `/help/456` | `app/help/[questionId]/page.tsx` | 질문 상세 |

### 4.3 네비게이션 구조 (Header)

#### 기존 네비게이션 (변경 전)
- 홈, 기술, 프로젝트, 커뮤니티

#### 새 네비게이션 (변경 후)
- **홈** (`/`)
- **커뮤니티** (`/community`)
  - 드롭다운: 자유게시판, 팁, 작품 공유, 이벤트
- **Help me** (`/help`)
- **뉴스** (`/news`)
- **프로필** (로그인 시, `/profile/[username]`)

---

## 5. 기능 명세

### 5.1 홈페이지 (`/`)

**목적**: 방문자에게 바이브코딩 소개 및 주요 콘텐츠 미리보기 제공

#### 섹션 구성 (기존 유지 + 개선)

1. **Hero 섹션**
   - 메인 헤드라인: "바이브코딩과 함께 성장하세요"
   - 서브 텍스트: 커뮤니티 소개
   - CTA 버튼: "커뮤니티 들어가기", "프로젝트 보기"

2. **Tech Stack 섹션**
   - 바이브코딩 주요 기술 스택 소개
   - 아이콘 + 설명

3. **Community Preview**
   - 최근 인기 게시글 3개
   - 제목, 작성자, 투표 수, 댓글 수
   - "커뮤니티 가기" 버튼 → `/community`

4. **Latest News**
   - 최신 뉴스 3개 타임라인
   - 제목, 날짜, 카테고리 태그

### 5.2 커뮤니티 (`/community`)

**목적**: 레딧 스타일의 토론 및 정보 공유 공간

#### 5.2.1 카테고리 구조

| 카테고리 | Slug | 설명 | 아이콘 |
|----------|------|------|--------|
| 자유게시판 | `general` | 제한 없는 자유 토론 | 💬 |
| 팁 & 노하우 | `tips` | 개발 팁, 트릭 공유 | 💡 |
| 작품 공유 | `showcase` | 프로젝트 시연 및 피드백 | 🎨 |
| 이벤트 & 공지 | `events` | 공식 이벤트, 공지사항 | 📢 |

#### 5.2.2 게시글 목록 (`/community/[category]`)

**레이아웃**: 레딧 스타일 카드 리스트

**게시글 카드 정보:**
- 투표 시스템 (Upvote/Downvote) - 좌측
- 제목 (클릭 시 상세 페이지)
- 본문 미리보기 (첫 200자)
- 작성자 (username, 아바타)
- 작성 시간 (상대 시간, "2시간 전")
- 댓글 수 (아이콘 + 숫자)
- 조회수
- 태그 (최대 5개)

**기능:**
- [ ] 정렬: 인기순(투표), 최신순, 댓글 많은 순
- [ ] 필터: 태그별, 기간별 (오늘, 이번 주, 이번 달, 전체)
- [ ] 검색: 제목, 본문 검색
- [ ] 무한 스크롤 또는 페이지네이션

**권한:**
- 게스트: 읽기 전용
- 로그인 사용자: 게시글 작성, 투표, 댓글

#### 5.2.3 게시글 상세 (`/community/[category]/[postId]`)

**레이아웃:**

```
┌─────────────────────────────────────┐
│ [투표] 제목                          │
│        작성자 • 시간 • 조회수        │
├─────────────────────────────────────┤
│ 본문 (Rich Text)                    │
│ - 텍스트 서식 (굵게, 기울임)         │
│ - 코드 블록 (Syntax Highlighting)   │
│ - 이미지 삽입                        │
│ - 링크                              │
├─────────────────────────────────────┤
│ 태그 태그 태그                       │
├─────────────────────────────────────┤
│ 댓글 섹션 (스레드 형식)              │
│ ├─ 댓글 1                           │
│ │  └─ 대댓글 1-1                    │
│ │     └─ 대댓글 1-1-1               │
│ ├─ 댓글 2                           │
└─────────────────────────────────────┘
```

**기능:**
- [ ] 투표 (Upvote/Downvote)
- [ ] 즐겨찾기 (Bookmark)
- [ ] 공유 (URL 복사)
- [ ] 신고 (부적절한 콘텐츠)
- [ ] 수정/삭제 (작성자 본인만)
- [ ] 댓글 작성
- [ ] 댓글 스레드 (최대 깊이 5)
- [ ] 댓글 투표
- [ ] 댓글 정렬 (인기순, 최신순)

#### 5.2.4 게시글 작성 (`/community/new`)

**에디터**: Tiptap WYSIWYG

**필수 입력:**
- 카테고리 선택
- 제목 (최소 10자)
- 본문 (최소 20자)

**선택 입력:**
- 태그 (최대 5개, 자동완성)
- 이미지 업로드 (최대 5MB, jpg/png/gif)

**기능:**
- [ ] 실시간 마크다운 미리보기
- [ ] 코드 블록 (언어 선택 가능)
- [ ] 이미지 드래그 앤 드롭
- [ ] 임시 저장 (Local Storage)
- [ ] 게시/취소

### 5.3 Help me - Q&A (`/help`)

**목적**: 질문-답변 게시판 (Stack Overflow 스타일)

#### 5.3.1 질문 목록

**질문 카드:**
- 투표 수 (좌측)
- 답변 수 (초록색 배지, 채택된 답변 있으면 ✅)
- 제목
- 본문 미리보기
- 태그 (기술 관련)
- 작성자, 작성 시간

**기능:**
- [ ] 정렬: 답변 없는 질문, 최신순, 투표 많은 순
- [ ] 필터: 태그별, 채택된 질문/미채택
- [ ] 검색

#### 5.3.2 질문 상세 (`/help/[questionId]`)

**레이아웃:**

```
┌──────────────────────────────────────┐
│ [투표] 질문 제목                      │
│        작성자 • 시간                  │
├──────────────────────────────────────┤
│ 질문 본문 (코드 포함 가능)            │
├──────────────────────────────────────┤
│ 태그 태그 태그                        │
├──────────────────────────────────────┤
│ 답변 (3)                              │
├──────────────────────────────────────┤
│ [투표] ✅ 채택된 답변 (상단)          │
│        답변 내용                      │
│        작성자 • 시간                  │
├──────────────────────────────────────┤
│ [투표] 답변 2                         │
│        답변 내용                      │
├──────────────────────────────────────┤
│ 답변 작성 폼                          │
└──────────────────────────────────────┘
```

**기능:**
- [ ] 투표 (질문, 답변 모두 가능)
- [ ] 답변 채택 (질문 작성자만, 1개만)
- [ ] 댓글 (질문, 답변 모두 가능)
- [ ] 코드 블록 지원
- [ ] 수정/삭제

#### 5.3.3 질문 작성 (`/help/new`)

**필수 입력:**
- 제목 (최소 15자, "어떻게", "왜" 등 질문형)
- 본문 (최소 50자)
- 태그 (최소 1개, 최대 5개)

**에디터 기능:**
- 코드 블록 (언어 선택)
- 이미지 업로드
- 링크

### 5.4 바이브코딩 뉴스 (`/news`)

**목적**: 공식 뉴스, 업데이트, 튜토리얼 전달

#### 5.4.1 뉴스 목록

**레이아웃**: 타임라인 형식 (Medium 스타일)

**뉴스 카드:**
- 썸네일 이미지 (작은 아이콘)
- 제목
- 요약 (50자)
- 카테고리 배지 (업데이트, 이벤트, 튜토리얼, 공지)
- 작성 날짜

**카테고리:**
- 🚀 업데이트 (기능 출시, 버그 수정)
- 🎉 이벤트 (커뮤니티 이벤트)
- 📚 튜토리얼 (공식 가이드)
- 📢 공지 (중요 공지사항)

**기능:**
- [ ] 필터: 카테고리별
- [ ] 정렬: 최신순 (기본), 인기순
- [ ] 검색

#### 5.4.2 뉴스 상세 (`/news/[id]`)

**레이아웃**: 블로그 포스트 형식

**구성:**
- 큰 커버 이미지
- 제목
- 작성자 (관리자), 작성 날짜
- 본문 (Rich Text)
- 관련 링크
- 댓글 (선택)

**기능:**
- [ ] 좋아요
- [ ] 공유
- [ ] 북마크
- [ ] 관련 뉴스 추천 (하단)

#### 5.4.3 뉴스 작성 (관리자 전용, `/news/new`)

**권한**: 관리자만 접근 가능

**필수 입력:**
- 제목
- 본문
- 카테고리
- 커버 이미지

---

## 6. 데이터 모델

### 6.1 TypeScript 인터페이스 (Phase 1-3)

**Phase 1-3에서는 Mock 데이터를 사용하여 UI 우선 개발을 진행합니다.**

```typescript
// lib/types.ts

export interface User {
  id: string
  username: string
  email: string
  password?: string  // OAuth 사용자는 null
  displayName?: string
  avatarUrl?: string
  bio?: string
  reputation: number
  role: 'USER' | 'MODERATOR' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string        // "자유게시판"
  slug: string        // "general"
  description?: string
  icon?: string
  color?: string
  postCount: number
  createdAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  postType: 'DISCUSSION' | 'QUESTION' | 'SHOWCASE' | 'NEWS'
  authorId: string
  categoryId: string
  upvotes: number
  downvotes: number
  viewCount: number
  isPinned: boolean
  isLocked: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  postId: string
  parentId?: string  // 대댓글용
  upvotes: number
  downvotes: number
  createdAt: string
  updatedAt: string
}

export interface Answer {
  id: string
  content: string
  questionId: string  // Post의 id
  authorId: string
  isAccepted: boolean
  upvotes: number
  createdAt: string
  updatedAt: string
}

export interface Vote {
  id: string
  userId: string
  postId?: string
  voteType: 'UP' | 'DOWN'
  createdAt: string
}
```

### 6.2 PostgreSQL 스키마 (Phase 4)

**Phase 4 (Week 11-12)에서 PostgreSQL 데이터베이스를 구축합니다.**

```sql
-- database/schema.sql

-- ─────────────────────────────────────
-- User (사용자)
-- ─────────────────────────────────────
CREATE TYPE user_role AS ENUM ('USER', 'MODERATOR', 'ADMIN');

CREATE TABLE users (
  id VARCHAR(30) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),  -- OAuth 사용자는 NULL
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  reputation INTEGER DEFAULT 0,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ─────────────────────────────────────
-- Category (카테고리)
-- ─────────────────────────────────────
CREATE TABLE categories (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(20),
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────
-- Post (게시글)
-- ─────────────────────────────────────
CREATE TYPE post_type AS ENUM ('DISCUSSION', 'QUESTION', 'SHOWCASE', 'NEWS');

CREATE TABLE posts (
  id VARCHAR(30) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  post_type post_type DEFAULT 'DISCUSSION',
  author_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(30) NOT NULL REFERENCES categories(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- ─────────────────────────────────────
-- Comment (댓글)
-- ─────────────────────────────────────
CREATE TABLE comments (
  id VARCHAR(30) PRIMARY KEY,
  content TEXT NOT NULL,
  author_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id VARCHAR(30) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id VARCHAR(30) REFERENCES comments(id) ON DELETE CASCADE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- ─────────────────────────────────────
-- Answer (답변 - Help me 전용)
-- ─────────────────────────────────────
CREATE TABLE answers (
  id VARCHAR(30) PRIMARY KEY,
  content TEXT NOT NULL,
  question_id VARCHAR(30) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_accepted BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_answers_author ON answers(author_id);

-- ─────────────────────────────────────
-- Vote (투표)
-- ─────────────────────────────────────
CREATE TYPE vote_type AS ENUM ('UP', 'DOWN');

CREATE TABLE votes (
  id VARCHAR(30) PRIMARY KEY,
  user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id VARCHAR(30) REFERENCES posts(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_post ON votes(post_id);
```

### 6.3 데이터베이스 관계 다이어그램

```
User (1) ─── (N) Post
User (1) ─── (N) Comment
User (1) ─── (N) Answer
User (1) ─── (N) Vote

Category (1) ─── (N) Post

Post (1) ─── (N) Comment
Post (1) ─── (N) Vote

Comment (1) ─── (N) Comment (self-referencing)
```

---

## 7. API 설계

### 7.1 API Routes 구조

```
app/api/
├── auth/
│   └── [...nextauth]/route.ts  # NextAuth.js
├── posts/
│   ├── route.ts                # GET (목록), POST (생성)
│   └── [id]/
│       ├── route.ts            # GET (상세), PATCH (수정), DELETE (삭제)
│       ├── vote/route.ts       # POST (투표)
│       └── comments/route.ts   # GET (댓글 목록), POST (댓글 작성)
├── questions/
│   ├── route.ts                # GET, POST
│   └── [id]/
│       ├── route.ts            # GET, PATCH, DELETE
│       └── answers/
│           ├── route.ts        # GET, POST
│           └── [answerId]/
│               ├── route.ts    # PATCH, DELETE
│               └── accept/route.ts  # POST (채택)
├── news/
│   ├── route.ts                # GET, POST (관리자)
│   └── [id]/route.ts           # GET, PATCH (관리자), DELETE (관리자)
├── users/
│   ├── [username]/route.ts     # GET (프로필)
│   └── me/route.ts             # GET (내 정보), PATCH (수정)
└── search/route.ts             # GET (전체 검색)
```

### 7.2 주요 API 엔드포인트

#### 7.2.1 게시글 API

**GET `/api/posts`** - 게시글 목록 조회

Query Params:
- `category`: 카테고리 slug (optional)
- `sort`: `popular` | `recent` | `comments` (default: `popular`)
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 20)

Response:
```json
{
  "posts": [
    {
      "id": "clxxx",
      "title": "제목",
      "content": "본문 미리보기...",
      "author": {
        "username": "user1",
        "avatarUrl": "..."
      },
      "category": {
        "name": "자유게시판",
        "slug": "general"
      },
      "upvotes": 42,
      "downvotes": 3,
      "commentCount": 15,
      "viewCount": 123,
      "tags": ["react", "nextjs"],
      "createdAt": "2025-10-15T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

**POST `/api/posts`** - 게시글 작성

Authorization: Required (JWT Token)

Request Body:
```json
{
  "title": "제목",
  "content": "본문 (Rich Text JSON)",
  "categoryId": "clxxx",
  "tags": ["react", "nextjs"],
  "postType": "DISCUSSION"
}
```

Response:
```json
{
  "id": "clxxx",
  "title": "제목",
  "slug": "제목-clxxx",
  "createdAt": "2025-10-15T12:00:00Z"
}
```

**GET `/api/posts/[id]`** - 게시글 상세 조회

Response:
```json
{
  "id": "clxxx",
  "title": "제목",
  "content": "본문 전체",
  "author": { ... },
  "category": { ... },
  "upvotes": 42,
  "downvotes": 3,
  "viewCount": 124,
  "tags": ["react"],
  "comments": [ ... ],
  "createdAt": "2025-10-15T12:00:00Z",
  "updatedAt": "2025-10-15T13:00:00Z"
}
```

**POST `/api/posts/[id]/vote`** - 투표

Authorization: Required

Request Body:
```json
{
  "voteType": "UP" | "DOWN"
}
```

Response:
```json
{
  "upvotes": 43,
  "downvotes": 3,
  "userVote": "UP"
}
```

#### 7.2.2 질문/답변 API

**POST `/api/questions/[id]/answers`** - 답변 작성

Authorization: Required

Request Body:
```json
{
  "content": "답변 내용"
}
```

**POST `/api/questions/[id]/answers/[answerId]/accept`** - 답변 채택

Authorization: Required (질문 작성자만)

Response:
```json
{
  "success": true,
  "answerId": "clxxx"
}
```

### 7.3 인증 & 권한

#### 인증 방식
- NextAuth.js v5 (Auth.js)
- JWT 토큰 기반
- Session 저장: Database (Prisma Adapter)

#### 권한 레벨
- **Guest**: 읽기 전용
- **User**: 게시글 작성, 댓글, 투표
- **Moderator**: 게시글 수정/삭제 (타인 글 포함)
- **Admin**: 모든 권한 + 뉴스 작성

---

## 8. UI/UX 가이드라인

### 8.1 디자인 시스템

**기반**: shadcn/ui + Radix UI + Tailwind CSS

**테마 색상**: 기존 프로젝트 유지

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... */
}
```

### 8.2 컴포넌트 재사용

기존 shadcn/ui 컴포넌트 최대한 활용:

- `Button`: 기본 버튼
- `Card`: 게시글 카드, 프로젝트 카드
- `Badge`: 태그, 카테고리 배지
- `Avatar`: 사용자 아바타
- `Tabs`: 카테고리 탭
- `Dialog`: 모달 (로그인, 게시글 작성)
- `Dropdown Menu`: 사용자 메뉴
- `Input`, `Textarea`: 폼
- `Select`: 드롭다운
- `Separator`: 구분선
- `Tooltip`: 툴팁
- `ScrollArea`: 스크롤 영역

### 8.3 반응형 디자인

**브레이크포인트**: Tailwind 기본

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**레이아웃 패턴**:
- 모바일: 1열
- 태블릿 (md): 2열
- 데스크탑 (lg): 3열

### 8.4 접근성 (a11y)

- 시맨틱 HTML (`<header>`, `<nav>`, `<main>`, `<article>`)
- ARIA 레이블
- 키보드 네비게이션 지원
- 포커스 스타일 명확하게
- 색상 대비 WCAG AA 준수

### 8.5 다크 모드

- `next-themes` 사용 (기존 프로젝트에 포함)
- 토글 버튼 위치: Header 우측
- CSS 변수 기반 테마 전환

---

## 9. 보안 & 인증

### 9.1 NextAuth.js 설정

**OAuth Providers**:
- GitHub
- Google

**Local 인증**:
- 이메일 + 비밀번호
- bcrypt 해싱

**설정 파일**: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      // 이메일/비밀번호 로그인
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 9.2 권한 체크

**Middleware**: `middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN"
      }
      if (req.nextUrl.pathname.startsWith("/community/new")) {
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

### 9.3 XSS & CSRF 방어

- Rich Text 에디터: HTML Sanitization (DOMPurify)
- CSRF Token: NextAuth.js 기본 제공
- Content Security Policy (CSP) 설정

---

## 10. 성능 최적화

### 10.1 렌더링 전략

| 페이지 | 전략 | 이유 |
|--------|------|------|
| 홈페이지 (`/`) | **SSG** | 정적 콘텐츠, SEO 중요 |
| 커뮤니티 목록 | **SSR** | 실시간 업데이트 필요 |
| 게시글 상세 | **ISR** (revalidate: 60) | SEO + 주기적 업데이트 |
| Q&A 목록 | **SSR** | 실시간 |
| 질문 상세 | **ISR** (revalidate: 60) | SEO + 주기적 업데이트 |
| 뉴스 목록 | **SSG** + **ISR** (revalidate: 3600) | 1시간마다 재생성 |
| 뉴스 상세 | **SSG** + **ISR** | SEO 중요 |

### 10.2 데이터 Fetching

**React Query 설정**:

```typescript
// lib/react-query.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      cacheTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false,
    },
  },
})
```

**Pagination**:
- 무한 스크롤: React Query `useInfiniteQuery`
- 전통적 페이지네이션: 선택지 제공

### 10.3 이미지 최적화

- Next.js `<Image />` 컴포넌트 사용
- 자동 WebP 변환
- 반응형 이미지 (srcset)
- Lazy Loading

### 10.4 캐싱 전략

**Browser Cache**:
- 정적 에셋: 1년 (immutable)
- API 응답: React Query 캐시 (5분)

**Server Cache**:
- Redis (추후 도입 고려)
- Prisma Query 캐시

### 10.5 번들 최적화

- Tree Shaking
- Code Splitting (동적 import)
- 폰트 최적화 (`next/font`)

---

## 11. 개발 로드맵

### Phase 1: 기반 구축 (3주)

**Week 1: 프로젝트 초기화**
- [x] Next.js 14 프로젝트 생성
- [x] Tailwind CSS + shadcn/ui 설정
- [x] TypeScript 설정
- [ ] TypeScript 인터페이스 정의 (`lib/types.ts`)
- [ ] Mock 데이터 생성 (`lib/mock-data.ts`)
- [ ] Git 리포지토리 설정

**Week 2: 기존 컴포넌트 이전**
- [x] UI 컴포넌트 이전 (45개)
- [x] Header, Footer 이전 및 수정
- [x] 레이아웃 시스템 구축 (`app/layout.tsx`)
- [x] 홈페이지 이전 (`app/page.tsx`)
- [x] 다크 모드 통합

**Week 3: 인증 시스템**
- [x] NextAuth.js 설정 (GitHub, Google OAuth)
- [x] 로그인/회원가입 페이지
- [ ] 세션 관리 (클라이언트 상태)
- [x] 프로필 페이지 (Mock 데이터)

### Phase 2: UI 우선 구현 (4주)

**참고**: Phase 2에서는 Mock 데이터를 사용하여 모든 페이지 UI를 완성합니다.

**Week 4: 커뮤니티 레이아웃**
- [ ] 커뮤니티 메인 페이지 (`/community`)
- [ ] 카테고리 네비게이션 UI
- [ ] 게시글 목록 페이지 (`/community/[category]`)
- [ ] 게시글 카드 컴포넌트
- [ ] Mock 데이터로 렌더링 테스트

**Week 5: 게시글 상세 & 작성 UI**
- [ ] 게시글 상세 페이지 UI
- [ ] Tiptap 에디터 통합
- [ ] 게시글 작성 페이지 UI
- [ ] 댓글 UI 컴포넌트
- [ ] 투표 버튼 UI

**Week 6: Q&A & 뉴스 UI**
- [ ] Q&A 목록 페이지 (`/help`)
- [ ] 질문 상세 페이지 UI
- [ ] 답변 섹션 UI
- [ ] 뉴스 목록 페이지 (`/news`)
- [ ] 뉴스 상세 페이지 UI

**Week 7: 프로필 & 설정 UI**
- [ ] 사용자 프로필 페이지
- [ ] 프로필 편집 폼
- [ ] 설정 페이지
- [ ] 알림 UI (기본)

### Phase 3: 기능 완성 (3주)

**참고**: Phase 3에서는 클라이언트 상태 관리와 localStorage를 활용하여 기능을 구현합니다.

**Week 8: 클라이언트 상태 관리**
- [ ] React Context/Zustand 설정
- [ ] 게시글 CRUD (localStorage)
- [ ] 댓글 CRUD (localStorage)
- [ ] 투표 시스템 (클라이언트 상태)

**Week 9: 검색 & 필터링**
- [ ] 클라이언트 사이드 검색 기능
- [ ] 게시글 필터링 (태그, 정렬)
- [ ] 검색 결과 페이지
- [ ] Q&A 필터링

**Week 10: 최적화 & 테스트**
- [ ] 컴포넌트 성능 최적화
- [ ] React.memo, useMemo 적용
- [ ] 이미지 최적화
- [ ] E2E 테스트 (Playwright)

### Phase 4: 데이터베이스 통합 & 배포 (2주)

**Week 11: PostgreSQL 통합**
- [ ] PostgreSQL 스키마 구현 (`database/schema.sql`)
- [ ] pg 라이브러리 설정 (`lib/db.ts`)
- [ ] API Routes 구현 (CRUD)
- [ ] Mock API → Real API 전환
- [ ] 데이터 마이그레이션

**Week 12: 최종 배포**
- [ ] 성능 최적화 (Lighthouse 90+)
- [ ] SEO 메타 태그
- [ ] 접근성 테스트 (a11y)
- [ ] Vercel 배포
- [ ] 도메인 연결
- [ ] 모니터링 설정 (Sentry)

### 우선순위

**P0 (필수)**:
- 인증 시스템
- 커뮤니티 게시글 CRUD
- 댓글 기능
- 투표 시스템

**P1 (중요)**:
- Q&A 시스템
- 검색 기능
- 뉴스 페이지

**P2 (나중에)**:
- 실시간 알림
- 관리자 대시보드
- 고급 검색 (Algolia)
- 메시지 시스템

---

## 12. 환경 변수

### 12.1 `.env` 파일 구조

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vibe_coding"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-here"

# OAuth Providers
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"

# Image Upload
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# (Optional) Search
ALGOLIA_APP_ID="your-app-id"
ALGOLIA_API_KEY="your-api-key"
```

---

## 13. 참고 문서

### 13.1 기술 문서

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Tiptap Editor](https://tiptap.dev/)

### 13.2 디자인 참고

- Reddit (커뮤니티 레이아웃)
- Stack Overflow (Q&A 디자인)
- Medium (뉴스 레이아웃)
- GitHub Discussions (토론 스레드)

---

## 14. 변경 이력

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| 1.0 | 2025-10-15 | 초기 PRD 작성 |
| 1.1 | 2025-10-16 | 프로젝트 페이지 기능 제거, 전체 개발 기간 13주→12주로 조정 |
| 1.2 | 2025-10-20 | **DB 전략 변경**: Prisma 제거, UI 우선 개발 전략 수립<br>- Backend 스택: Prisma → PostgreSQL + pg 직접 사용<br>- 데이터 모델: TypeScript 인터페이스 + PostgreSQL DDL<br>- 개발 로드맵: Phase 재구성 (UI 우선, DB는 Week 11-12에 통합) |

---

## 15. 승인 & 검토

**작성자**: Claude (AI Assistant)
**검토자**: [프로젝트 리드]
**승인자**: [프로덕트 오너]
**승인 날짜**: [TBD]

---

**문서 끝**
