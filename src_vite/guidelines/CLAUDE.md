# src/guidelines/CLAUDE.md

## 디렉토리 목적 (Directory Purpose)

디자인 시스템 문서화. UI/UX 규칙, 컴포넌트 가이드, 디자인 패턴.

## 현재 파일

- **Guidelines.md**: 템플릿 (비어있음, 작성 필요)

## 문서 작성 규칙

### 파일 명명
`Guidelines.md`, `ComponentName.md`, `DesignTokens.md`, `AccessibilityGuide.md`, `StyleGuide.md`

### 언어 규칙
- **모든 문서**: 한글 작성
- **코드 예제**: 영문 (변수/함수명)
- **주석**: 한글

### 필수 문서화 항목
1. **색상 시스템**: Primary, Secondary, Semantic 색상, 다크/라이트 매핑
2. **타이포그래피**: 폰트, 크기 스케일, 행간, 굵기
3. **간격 시스템**: Tailwind scale, 컴포넌트 간격
4. **컴포넌트 가이드**: Button, Card, Form 요소, Navigation
5. **반응형 규칙**: 브레이크포인트, 모바일/태블릿/데스크톱

### Guidelines.md 구조
```
# 디자인 시스템 가이드라인
## 소개
## 디자인 원칙
## 색상 시스템
## 타이포그래피
## 간격과 레이아웃
## 컴포넌트
## 접근성
## 반응형 디자인
```

## Figma 연동

Figma 링크 포함 필수:
- **Figma 디자인**: [프로젝트 링크](https://www.figma.com/design/...)

## 접근성 문서화

필수 항목: ARIA 속성, 키보드 내비게이션, 스크린 리더, 색상 대비, 포커스 관리

## 금지 사항

- ❌ 코드 구현 세부사항 혼합
- ❌ 영문으로만 작성
- ❌ 예제 없는 추상적 설명
- ❌ Figma와 불일치

## 유지관리

업데이트 필요 시:
- 디자인 시스템 업데이트
- 문서화 규칙 변경
- Figma 주요 변경

**상위**: `../CLAUDE.md` | **루트**: `../../CLAUDE.md` | **관련**: `Guidelines.md`
