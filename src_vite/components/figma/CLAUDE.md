# src/components/figma/CLAUDE.md

## 디렉토리 목적 (Directory Purpose)

Figma 디자인 export 컴포넌트 및 Figma 통합 유틸리티.

## 현재 컴포넌트

- **ImageWithFallback**: Figma 이미지 URL 오류 처리 및 폴백

## 핵심 규칙

### 파일 명명
- 형식: `PascalCase.tsx`
- UI 컴포넌트와 구분되는 명확한 이름

### Figma vs 일반 컴포넌트
- **Figma**: Figma 이미지 처리, 플러그인 연동, API 통합
- **UI**: 재사용 가능한 범용 UI (`../ui/`)
- **페이지**: 비즈니스 로직 포함 섹션 (`../`)

### 금지 사항
- ❌ 일반 React 컴포넌트를 이 디렉토리에 배치
- ❌ Figma와 무관한 유틸리티 추가
- ❌ 오류 처리 없이 외부 리소스 사용

## 이미지 어트리뷰션

Figma 이미지는 `../../Attributions.md`에 기록 필수.

## 유지관리

업데이트 필요 시:
- 새 Figma 전용 컴포넌트 추가
- Figma 통합 패턴 변경
- 이미지 처리 방식 업데이트

**상위**: `../CLAUDE.md` | **루트**: `../../CLAUDE.md` | **관련**: `../../Attributions.md`
