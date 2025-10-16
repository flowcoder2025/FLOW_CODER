# src/styles/CLAUDE.md

## 디렉토리 목적 (Directory Purpose)

프로젝트 전역 스타일 및 Tailwind CSS 확장. 메인 스타일은 `../index.css`.

## 스타일링 시스템

### Tailwind CSS v4.1.3
- 주요 스타일: `src/index.css`
- CSS Layers: properties, theme, base, utilities
- 테마: CSS 변수 기반 (라이트/다크 모드)

### 색상 시스템
- Semantic: `var(--background)`, `var(--foreground)`, `var(--primary)`, `var(--secondary)`
- Component: `var(--card)`, `var(--popover)`, `var(--muted)`, `var(--accent)`
- State: `var(--destructive)`, `var(--ring)`, `var(--border)`
- OKLCH color space 사용

## 파일 추가 규칙

### 추가해야 하는 경우
- ✅ 전역 스타일 확장
- ✅ 서드파티 라이브러리 스타일 오버라이드
- ✅ 애니메이션 키프레임 모음
- ✅ 프린트 스타일

### 추가하지 말아야 하는 경우
- ❌ 컴포넌트 스타일 (Tailwind className 사용)
- ❌ Tailwind 테마 변경 (`index.css`에서)
- ❌ CSS 모듈 (프로젝트 미사용)

### 파일 명명
`globals.css`, `animations.css`, `print.css`, `vendor-override.css`

## 반응형 브레이크포인트

```
sm:  >= 40rem
md:  >= 48rem
lg:  >= 64rem
xl:  >= 80rem
2xl: >= 96rem
```

## 다크 모드

HTML에 `.dark` 클래스 토글. CSS 변수 자동 전환.

## 금지 사항

- ❌ `!important` 남용
- ❌ 인라인 스타일로 테마 색상 하드코딩
- ❌ 글로벌 선택자 남용
- ❌ CSS-in-JS 라이브러리 추가

## 유지관리

업데이트 필요 시:
- 새 전역 스타일 패턴 도입
- Tailwind 설정 변경
- 테마 시스템 확장
- CSS 파일 추가

**메인 스타일**: `../index.css` | **루트**: `../CLAUDE.md`
