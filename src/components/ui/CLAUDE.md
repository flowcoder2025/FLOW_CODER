# src/components/ui/CLAUDE.md

## 디렉토리 목적 (Directory Purpose)

shadcn/ui 기반 재사용 가능한 UI 컴포넌트 라이브러리. Radix UI 프리미티브 + Tailwind CSS 스타일링.

## 핵심 규칙 (Core Rules)

### 파일 명명
- 형식: `kebab-case.tsx` (button.tsx, dropdown-menu.tsx)
- Export: PascalCase (Button, DropdownMenu)

### 필수 패턴
- `className` prop 지원
- `React.forwardRef` 사용
- `cn()` 유틸리티로 className 병합
- `cva` (class-variance-authority)로 variants 정의
- Radix UI primitives 기반

### 금지 사항
- ❌ Radix UI 없이 복잡한 접근성 컴포넌트 직접 구현
- ❌ Tailwind 대신 인라인 스타일
- ❌ `className` prop 오버라이드 불가능하게 만들기
- ❌ PascalCase 파일명 (kebab-case 사용)

## 컴포넌트 추가

새 UI 컴포넌트:
1. shadcn/ui CLI 확인: `npx shadcn@latest add [component]`
2. 커스텀 시: Radix UI primitive 사용, 위 패턴 준수

## 유지관리

업데이트 필요 시:
- 새 컴포넌트 패턴 도입
- shadcn/ui 버전 업그레이드
- Radix UI 사용 방식 변경

**상위**: `../CLAUDE.md` | **루트**: `../../CLAUDE.md`
