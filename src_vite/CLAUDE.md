# src/CLAUDE.md

## 디렉토리 목적 (Directory Purpose)

프로젝트의 모든 소스 코드. React 컴포넌트, 스타일, 진입점, 가이드라인.

## 디렉토리 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ui/             # shadcn/ui (45+ components)
│   ├── figma/          # Figma 통합
│   └── *.tsx           # 페이지 섹션
├── styles/             # 추가 전역 스타일
├── guidelines/         # 디자인 시스템 문서
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx            # 진입점
├── index.css           # Tailwind + 테마
└── Attributions.md     # 리소스 어트리뷰션
```

## 코어 파일

### main.tsx
React 애플리케이션 초기화. **수정 금지** (구조 변경 시에만).

### App.tsx
페이지 레이아웃 조합. 섹션 추가 시 여기 수정.

### index.css
Tailwind CSS + 테마 변수 (라이트/다크). 수정은 `./styles/CLAUDE.md` 참고.

## 언어 사용 규칙

### 한글 사용
- ✅ 사용자 대면 텍스트
- ✅ 코드 주석
- ✅ 문서화
- ✅ Git 커밋 메시지

### 영문 사용
- ✅ 변수명 (camelCase)
- ✅ 함수명 (camelCase/PascalCase)
- ✅ 파일명
- ✅ 타입/인터페이스명

### 예제
```tsx
// ✅ 올바름
function getUserData() {  // 영문 함수명
  const userName = "홍길동";  // 영문 변수, 한글 값
  // 사용자 데이터 가져옴 (한글 주석)
}

// ❌ 금지
function 사용자데이터가져오기() {
  const 사용자이름 = "홍길동";
}
```

## Import 규칙

```tsx
// 1. External
import { useState } from "react";

// 2. Internal (@/ alias)
import { Button } from "@/components/ui/button";

// 3. Relative
import { LocalComponent } from "./LocalComponent";

// 4. Styles
import "./styles.css";
```

## 프로젝트 흐름

```
index.html → main.tsx → App.tsx → 섹션 컴포넌트들
```

## 금지 사항

- ❌ src/ 루트에 여러 유틸리티 분산
- ❌ 한글 변수명/함수명
- ❌ 영문 사용자 메시지
- ❌ main.tsx, App.tsx 구조 무단 변경

## 새 디렉토리 추가

1. 목적 확인 (파일 3개 미만이면 기존 활용)
2. CLAUDE.md 생성 (템플릿은 루트 CLAUDE.md 참고)
3. 상위 CLAUDE.md 업데이트
4. 루트 디렉토리 구조 업데이트

## 유지관리

업데이트 필요 시:
- 새 하위 디렉토리 추가
- 코어 파일 구조 변경
- 진입 흐름 수정
- 전역 규칙 추가/변경

**하위**: `./components/CLAUDE.md`, `./styles/CLAUDE.md`, `./guidelines/CLAUDE.md`
**루트**: `../CLAUDE.md`
