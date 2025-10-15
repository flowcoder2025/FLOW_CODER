# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 정책 (Language Policy)

**중요**: 이 프로젝트는 **한글 문서화, 영문 코드** 정책을 따릅니다.

### 한글 사용 (Korean Usage)
다음 항목은 **반드시 한글**로 작성합니다:
- ✅ 모든 CLAUDE.md 파일 내용
- ✅ 사용자 대면 텍스트 (UI 콘텐츠, 버튼 레이블 등)
- ✅ 코드 주석 (사용자 설명 목적)
- ✅ Git 커밋 메시지
- ✅ 문서화 (README, 가이드라인)
- ✅ 에러 메시지 (사용자 표시용)

### 영문 사용 (English Usage)
다음 항목은 **반드시 영문**으로 작성합니다:
- ✅ 변수명 (camelCase)
- ✅ 함수명 (camelCase, PascalCase for components)
- ✅ 파일명 (PascalCase for components, kebab-case for utilities)
- ✅ 타입/인터페이스명 (PascalCase)
- ✅ 클래스명, CSS 클래스명
- ✅ npm 패키지명
- ✅ Import/export 구문

### 예제 (Examples)
```tsx
// ✅ 올바름: 영문 함수/변수명, 한글 주석
function getUserData() { /* 사용자 데이터 가져옴 */ }

// ❌ 금지: 한글 함수/변수명
function 사용자데이터() { const 이름 = "값"; }
```

## Project Overview

This is a **Vibe Coding Website** built with React + TypeScript + Vite. It's a single-page application (SPA) showcasing a coding community platform with sections for hero content, tech stack, projects, and community features. The design is based on a Figma project: https://www.figma.com/design/clJjaO1m0ekKmJ5dtQyk5B/Vibe-Coding-Website

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 3000 by default)
npm run dev

# Build for production (outputs to build/ directory)
npm run build
```

Note: The development server is configured to automatically open in the browser at http://localhost:3000.

## Architecture

### Tech Stack
- **Build Tool**: Vite 6.3.5 with React SWC plugin for fast compilation
- **Framework**: React 18.3.1 with TypeScript
- **UI Library**: Extensive shadcn/ui component system based on Radix UI primitives
- **Styling**: Tailwind CSS v4.1.3 with custom CSS variables for theming
- **Icons**: lucide-react for consistent iconography

### 전체 디렉토리 구조 (Complete Directory Structure)

```
/
├── CLAUDE.md                       # 📘 프로젝트 전역 규칙 (이 파일)
├── package.json                    # 프로젝트 의존성 및 스크립트
├── vite.config.ts                  # Vite 빌드 설정
├── index.html                      # HTML 진입점
├── src/                            # 소스 코드 루트
│   ├── CLAUDE.md                   # 📘 소스 코드 구조 가이드
│   ├── main.tsx                    # React 애플리케이션 진입점
│   ├── App.tsx                     # 메인 앱 컴포넌트 (페이지 레이아웃)
│   ├── index.css                   # Tailwind CSS + 테마 변수
│   ├── Attributions.md             # 이미지/리소스 어트리뷰션
│   ├── components/                 # React 컴포넌트
│   │   ├── CLAUDE.md               # 📘 컴포넌트 작성 규칙
│   │   ├── Header.tsx              # 페이지 헤더 (네비게이션)
│   │   ├── Hero.tsx                # 히어로 섹션
│   │   ├── TechStack.tsx           # 기술 스택 섹션
│   │   ├── Projects.tsx            # 프로젝트 포트폴리오 섹션
│   │   ├── Community.tsx           # 커뮤니티 섹션
│   │   ├── Footer.tsx              # 페이지 푸터
│   │   ├── ui/                     # shadcn/ui 컴포넌트 라이브러리
│   │   │   ├── CLAUDE.md           # 📘 UI 컴포넌트 규칙
│   │   │   ├── button.tsx          # Button 컴포넌트
│   │   │   ├── card.tsx            # Card 컴포넌트
│   │   │   ├── utils.ts            # className 병합 유틸리티
│   │   │   └── ...                 # 45+ shadcn/ui 컴포넌트
│   │   └── figma/                  # Figma 통합 컴포넌트
│   │       ├── CLAUDE.md           # 📘 Figma 컴포넌트 규칙
│   │       └── ImageWithFallback.tsx  # 이미지 폴백 컴포넌트
│   ├── styles/                     # 추가 전역 스타일
│   │   ├── CLAUDE.md               # 📘 스타일링 가이드
│   │   └── globals.css             # 전역 스타일 확장
│   └── guidelines/                 # 디자인 시스템 문서
│       ├── CLAUDE.md               # 📘 디자인 문서화 규칙
│       └── Guidelines.md           # 디자인 가이드라인 (템플릿)
├── docs/                           # 프로젝트 문서
│   ├── CLAUDE.md                   # 📘 문서 관리 가이드
│   ├── PRD.md                      # 제품 요구사항 문서
│   └── TASKS.md                    # 구현 Task 목록 (13주 로드맵)
├── node_modules/                   # npm 패키지 (git 제외)
└── build/                          # 빌드 산출물 (git 제외)
```

### CLAUDE.md 문서 계층 구조

프로젝트는 **계층적 CLAUDE.md 시스템**을 사용하여 규칙을 관리합니다:

```
루트 CLAUDE.md (이 파일)
    ├── 프로젝트 전역 규칙
    ├── 언어 정책
    ├── 개발 명령어
    └── 전체 아키텍처

└── src/CLAUDE.md
        ├── 소스 코드 구조
        ├── 코어 파일 설명
        └── 언어 사용 규칙

        ├── src/components/CLAUDE.md
        │       ├── 컴포넌트 분류
        │       ├── 명명 규칙
        │       └── 작성 패턴
        │
        │       ├── src/components/ui/CLAUDE.md
        │       │       └── shadcn/ui 규칙
        │       │
        │       └── src/components/figma/CLAUDE.md
        │               └── Figma 통합 규칙
        │
        ├── src/styles/CLAUDE.md
        │       └── 스타일링 가이드
        │
        └── src/guidelines/CLAUDE.md
                └── 디자인 문서화 규칙
```

**Single Source of Truth 원칙**:
- 각 규칙은 하나의 CLAUDE.md에만 정의
- 하위 문서는 상위 문서를 참조
- 중복 정보 없음

### 핵심 패턴 (Key Patterns)

- **컴포넌트 구성**: Header → Hero → TechStack → Projects → Community → Footer (semantic HTML5)
- **UI 시스템**: `src/components/ui/` - shadcn/ui + Radix UI + Tailwind, `@/` alias → `./src`
- **스타일링**: CSS 변수 (`:root`, `.dark`), Tailwind utilities, OKLCH color space
- **상태 관리**: React hooks (로컬 상태만)
- **이미지 처리**: `ImageWithFallback` - Unsplash via Figma URLs

## Important Configuration Details

### Vite Configuration (vite.config.ts)
- **Build output**: `build/` directory (not the default `dist/`)
- **Path aliases**: Extensive version-specific aliases for all dependencies (required for Figma export compatibility)
- **Import alias**: `@/` resolves to `./src`
- **Dev server**: Port 3000, auto-opens browser
- **Target**: ES Next for modern browser support

### Package.json Nuances
- No test scripts defined (add if implementing tests)
- No linting scripts (add ESLint/Prettier if code quality tooling needed)
- Production dependencies include form handling (react-hook-form), data visualization (recharts), and extensive Radix UI primitives

### TypeScript Configuration
- Uses `.ts` and `.tsx` extensions
- Configured via Vite's React SWC plugin (fast compilation)

## 개발 패턴 (Development Patterns)

### 새 섹션 추가
`src/components/[Name].tsx` → `App.tsx`에 추가 → semantic HTML (`<section>`) → container pattern 사용

### 반응형 디자인
모바일 우선 (`sm:`, `md:`, `lg:`) | `flex-col md:flex-row` | `grid md:grid-cols-2` | `container mx-auto px-4`

### 테마 시스템
`:root`/`.dark` 에 CSS 변수 정의 | `var(--background)`, `var(--primary)` 등 사용 | ❌ 색상 하드코딩 금지

## Task 기반 개발 워크플로우 🔴

특별한 요구사항이 없으면 `docs/TASKS.md` 기준으로 순차 개발 (P0 → P1 → P2)

### 강제 규칙 (각 Task 완료 시 필수)

1. **체크박스 업데이트**: `docs/TASKS.md`의 `[ ]` → `[x]` 표시
2. **E2E 테스트**: Playwright MCP로 UI 검증 (백엔드만 수정 시 스킵 가능)
3. **검증 후 Commit**:
   ```bash
   npx tsc --noEmit    # 타입 체크
   npm run build       # 빌드 테스트
   git commit          # 커밋 (🚨 push 금지)
   ```

**체크리스트**: ✅ Task 구현 → ✅ 체크박스 [x] → ✅ E2E 테스트 → ✅ 타입/빌드 → ✅ Commit (push 제외)

## Figma Export Considerations

This project was exported from Figma, which means:
- Extensive version-specific dependency aliases in vite.config.ts (do not remove)
- Image URLs point to Unsplash via Figma's CDN
- Component structure and naming may reflect Figma layer names
- `src/Attributions.md` contains image attribution requirements
- `src/guidelines/Guidelines.md` is a template (currently empty but available for design system rules)

## 기능 추가 (Adding Features)

### 의존성 추가 전
shadcn/ui 확인 (45+ 컴포넌트) → Radix UI primitives 활용 → 기존 의존성 우선

### UI 라이브러리 확장
`src/components/ui/` 위치 | shadcn/ui 패턴 준수 | `className` prop 수용 | `cn()` 유틸리티 사용

### 다국어화
현재 한국어 콘텐츠 | 다국어 지원 시 react-i18next 고려

## CLAUDE.md 유지관리 (Maintenance Guide)

**단일 진실 공급원 (Single Source of Truth)**: 각 규칙은 하나의 CLAUDE.md에만 정의, 중복 없음

### 업데이트 트리거
- **새 파일**: 해당 디렉토리 CLAUDE.md 업데이트
- **새 디렉토리**: CLAUDE.md 생성 + 상위 문서 업데이트 + 루트 디렉토리 구조 업데이트
- **패턴 변경**: 해당 CLAUDE.md + 영향받는 하위 문서 업데이트
- **파일 삭제**: CLAUDE.md에서 관련 정보 제거

### 새 디렉토리 CLAUDE.md 템플릿
```markdown
# [경로]/CLAUDE.md
## 디렉토리 목적
## 명명 규칙
## 금지 사항
## 유지관리
**상위**: `../CLAUDE.md` | **루트**: `../../CLAUDE.md`
```

## Git Repository

Remote: https://github.com/flowcoder2025/FLOW_CODER.git
Branch: main
