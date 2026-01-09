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

## 개선 작업 관리 (Improvement Task Management) 🔴

### TASK.md 기반 개발 워크플로우

**위치**: `./TASK.md` (프로젝트 루트)
**목적**: 프로젝트 개선 작업을 Phase 단위로 체계적 관리

#### TASK.md 구조
```
TASK.md
├── Phase 1 (P0): 보안 및 안정성 강화 (즉시 개선)
│   ├── Task 1.1: 비밀번호 해싱 구현
│   ├── Task 1.2: Rate Limiting 추가
│   ├── Task 1.3: 관리자 권한 체크 완성
│   └── Task 1.4: API 통합 테스트 작성
├── Phase 2 (P1): 성능 및 품질 개선 (단기 개선)
│   ├── Task 2.1: Next.js 캐싱 전략 구현
│   ├── Task 2.2: API 에러 핸들링 통일
│   ├── Task 2.3: Zod 입력 검증 통일
│   └── Task 2.4: Reputation 시스템 완성
└── Phase 3 (P2): 최적화 및 확장성 (장기 개선)
    ├── Task 3.1: Full-Text Search 구현
    ├── Task 3.2: 동적 Import 최적화
    ├── Task 3.3: Audit Trail 시스템
    └── Task 3.4: 컴포넌트 테스트 작성
```

#### 작업 우선순위

**🔴 P0 (Phase 1)**: 프로덕션 배포 전 **필수** 보안 취약점 해결
**🟡 P1 (Phase 2)**: 사용자 경험 향상 및 코드 품질 개선 (**권장**)
**🟢 P2 (Phase 3)**: 확장 가능한 아키텍처 구축 (**선택적**)

#### 작업 규칙

**체크리스트 표기법**:
- `[ ]` 미완료 항목
- `[x]` 완료 항목
- `[~]` 진행 중 항목 (선택 사항)
- `[-]` 스킵 항목 (선택 사항)

**커밋 메시지 규칙**:
```bash
# Task 단위 커밋
git commit -m "feat(auth): 비밀번호 해싱 구현 (Task 1.1)"

# Sub-task 단위 커밋
git commit -m "feat(auth): bcrypt 패키지 설치 및 설정 (Task 1.1.1)"

# TASK.md 업데이트
git commit -m "docs: TASK.md Task 1.1 완료 체크"
```

**브랜치 전략**:
- `main`: 프로덕션 배포 브랜치
- `Y1`: 개선 작업 메인 브랜치
- `Y1-task-X.Y`: 개별 Task 브랜치 (선택 사항)

#### 각 Task 완료 시 필수 절차

1. **Sub-task 체크**: TASK.md의 모든 Sub-task `[x]` 표시
2. **코드 검증**:
   ```bash
   npx tsc --noEmit    # 타입 체크
   npm run build       # 빌드 테스트
   npm run test        # 테스트 실행 (Phase 1 이후)
   ```
3. **TASK.md 업데이트**: Task 체크박스 `[x]` 표시
4. **커밋**: Task 단위로 커밋 (🚨 push는 Phase 완료 시)
5. **문서화**: 필요 시 관련 문서 업데이트

**체크리스트**: ✅ Sub-tasks 완료 → ✅ 코드 검증 → ✅ TASK.md 체크 → ✅ Commit → ✅ 문서화

#### Phase 완료 기준

**Phase 1 완료 조건**:
- ✅ 모든 Task 1.X 체크박스 완료
- ✅ API 통합 테스트 60% 커버리지 달성
- ✅ 보안 취약점 0개 (OWASP Top 10 기준)
- ✅ 타입 체크 및 빌드 통과

**Phase 2 완료 조건**:
- ✅ 모든 Task 2.X 체크박스 완료
- ✅ Lighthouse 점수 90+ 달성
- ✅ TODO 코멘트 0개
- ✅ 에러 핸들링 100% 통일

**Phase 3 완료 조건**:
- ✅ 선택한 Task 3.X 완료
- ✅ 테스트 커버리지 80% 달성 (선택 시)
- ✅ 성능 지표 목표 달성

#### 진행 상황 추적

TASK.md 하단의 "📊 진행 상황 추적" 섹션에서 실시간 확인:
- Phase별 진행률 (%)
- 완료/미완료 Task 목록
- KPI 달성 현황

#### 참고 문서

- **TASK.md**: 개선 작업 로드맵 (체크리스트)
- **docs/TASKS.md**: 기존 PRD 기반 구현 로드맵 (13주)
- **docs/PRD.md**: 제품 요구사항 문서
- **docs/ANALYSIS_REPORT.md**: 프로젝트 분석 보고서

---

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
