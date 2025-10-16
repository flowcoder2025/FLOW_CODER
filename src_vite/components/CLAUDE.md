# src/components/CLAUDE.md

## 디렉토리 목적 (Directory Purpose)

프로젝트의 모든 React 컴포넌트. 페이지 섹션 + UI 라이브러리 + Figma 통합.

## 디렉토리 구조

```
src/components/
├── ui/              # shadcn/ui 재사용 UI (45+ components)
├── figma/           # Figma export 컴포넌트
├── Header.tsx       # 페이지 헤더
├── Hero.tsx         # 히어로 섹션
├── TechStack.tsx    # 기술 스택 섹션
├── Projects.tsx     # 프로젝트 섹션
├── Community.tsx    # 커뮤니티 섹션
└── Footer.tsx       # 페이지 푸터
```

## 컴포넌트 분류

### 1. 페이지 섹션 (루트 레벨)
- 위치: `src/components/`
- 명명: `PascalCase.tsx`
- Export: Named export
- 특징: App.tsx에서 사용, 비즈니스 로직 포함

### 2. UI 라이브러리 (`ui/`)
- 위치: `src/components/ui/`
- 명명: `kebab-case.tsx`
- 상세: `./ui/CLAUDE.md`

### 3. Figma 통합 (`figma/`)
- 위치: `src/components/figma/`
- 명명: `PascalCase.tsx`
- 상세: `./figma/CLAUDE.md`

## 핵심 규칙

### 명명 규칙
- 페이지 섹션: `PascalCase.tsx`
- UI: `kebab-case.tsx`
- Figma: `PascalCase.tsx`

### TypeScript
```tsx
interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
}
```

### 스타일링
- Tailwind className 사용
- 테마 변수 사용: `var(--primary)`
- ❌ 인라인 스타일로 색상 하드코딩

### 반응형
- 모바일 우선: `flex-col md:flex-row`
- 브레이크포인트: `sm:`, `md:`, `lg:`

## 금지 사항

- ❌ UI 컴포넌트를 루트 레벨에 배치
- ❌ Figma 컴포넌트를 `ui/`에 배치
- ❌ 한글 변수명/함수명
- ❌ 하드코딩된 색상

## 컴포넌트 추가

### 페이지 섹션
1. `src/components/NewSection.tsx` 생성
2. Named export 사용
3. `App.tsx`에 추가
4. Semantic HTML

### UI 컴포넌트
1. shadcn/ui CLI 확인
2. 없으면 `ui/` 하위에 생성
3. `ui/CLAUDE.md` 패턴 준수

### Figma 컴포넌트
1. Figma 전용 확인
2. `figma/` 하위에 생성
3. `figma/CLAUDE.md` 패턴 준수

## 유지관리

업데이트 필요 시:
- 새 컴포넌트 패턴 도입
- 컴포넌트 구조 변경
- 새 하위 디렉토리 추가

**하위**: `./ui/CLAUDE.md`, `./figma/CLAUDE.md`
**상위**: `../CLAUDE.md` | **루트**: `../../CLAUDE.md`
