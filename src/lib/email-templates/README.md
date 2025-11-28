# FlowCoder 이메일 템플릿

커뮤니티 사용자에게 발송하는 HTML 이메일 템플릿 모음입니다.

## 템플릿 목록

| 파일명 | 용도 | 사용 예시 |
|--------|------|----------|
| `notification.html` | 알림용 | 댓글 알림, 좋아요 알림, 시스템 공지 |
| `newsletter.html` | 뉴스레터 (다중 콘텐츠) | 주간 뉴스레터, 인기 게시글 모음 |
| `newsletter-simple.html` | 뉴스레터 (단일 콘텐츠) | 블로그 포스트, 단일 공지사항 |

## 공통 특징

- **다크 모드 지원**: `prefers-color-scheme: dark` 미디어 쿼리 적용
- **반응형 디자인**: 모바일/데스크톱 최적화 (breakpoint: 1000px)
- **이메일 클라이언트 호환**: Gmail, Outlook, Apple Mail, Yahoo Mail 등 지원
- **MSO 호환**: Outlook 전용 조건부 코드 포함
- **브랜드 일관성**: FlowCoder 디자인 시스템 색상 및 스타일 적용

## 색상 시스템

### 라이트 모드
| 용도 | 색상 코드 |
|------|----------|
| 배경 | `#ffffff` |
| 이메일 래퍼 배경 | `#f5f5f5` |
| 텍스트 (주) | `#1a1a1a` |
| 텍스트 (보조) | `#525252` |
| 텍스트 (음소거) | `#737373` |
| 테두리 | `#e5e5e5` |
| 버튼 배경 | `#1a1a1a` |
| 버튼 텍스트 | `#ffffff` |

### 다크 모드
| 용도 | 색상 코드 |
|------|----------|
| 배경 | `#262626` |
| 이메일 래퍼 배경 | `#1a1a1a` |
| 텍스트 (주) | `#fafafa` |
| 텍스트 (보조) | `#a3a3a3` |
| 텍스트 (음소거) | `#737373` |
| 테두리 | `#333333` |

---

## 1. notification.html (알림용)

단일 메시지 전달을 위한 간결한 알림 템플릿입니다.

### 용도
- 댓글/답글 알림
- 좋아요/팔로우 알림
- 비밀번호 재설정
- 이메일 인증
- 시스템 공지

### 변수 목록

#### 필수 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{LOGO_URL}}` | 로고 이미지 URL | `https://flowcoder.com/logo.png` |
| `{{NOTIFICATION_TITLE}}` | 알림 제목 | `새로운 댓글이 달렸습니다` |
| `{{NOTIFICATION_MESSAGE}}` | 알림 본문 내용 | `홍길동님이 회원님의 게시글에 댓글을 남겼습니다.` |
| `{{CTA_URL}}` | 버튼 링크 URL | `https://flowcoder.com/post/123` |
| `{{CTA_TEXT}}` | 버튼 텍스트 | `댓글 확인하기` |

#### 선택 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{DETAIL_LABEL}}` | 상세 정보 라벨 | `댓글 내용` |
| `{{DETAIL_CONTENT}}` | 상세 정보 내용 | `"정말 유용한 글이네요! 감사합니다."` |

#### 푸터 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{GITHUB_URL}}` | GitHub 링크 | `https://github.com/flowcoder` |
| `{{TWITTER_URL}}` | Twitter 링크 | `https://twitter.com/flowcoder` |
| `{{LINKEDIN_URL}}` | LinkedIn 링크 | `https://linkedin.com/company/flowcoder` |
| `{{SETTINGS_URL}}` | 알림 설정 페이지 | `https://flowcoder.com/settings/notifications` |
| `{{UNSUBSCRIBE_URL}}` | 수신 거부 링크 | `https://flowcoder.com/unsubscribe?token=xxx` |

---

## 2. newsletter.html (뉴스레터 - 다중 콘텐츠)

여러 콘텐츠를 포함하는 종합 뉴스레터 템플릿입니다.

### 용도
- 주간/월간 뉴스레터
- 인기 게시글 모음
- 커뮤니티 하이라이트
- 종합 업데이트 공지

### 섹션 구성
1. 헤더 (로고 + 날짜)
2. 히어로 (뉴스레터 제목/부제)
3. Featured Article (메인 게시글)
4. Recent Articles (인기 게시글 3개)
5. Tips Section (개발 팁)
6. Community Stats (커뮤니티 통계)
7. CTA Banner (커뮤니티 참여 유도)
8. 푸터

### 변수 목록

#### 헤더/히어로 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{LOGO_URL}}` | 로고 이미지 URL | `https://flowcoder.com/logo.png` |
| `{{NEWSLETTER_DATE}}` | 뉴스레터 발행일 | `2025년 1월 15일` |
| `{{NEWSLETTER_TITLE}}` | 뉴스레터 제목 | `이번 주 FlowCoder 하이라이트` |
| `{{NEWSLETTER_SUBTITLE}}` | 뉴스레터 부제 | `개발자 커뮤니티의 최신 소식을 전해드립니다.` |

#### Featured Article 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{FEATURED_IMAGE}}` | 메인 게시글 이미지 | `https://...` |
| `{{FEATURED_CATEGORY}}` | 카테고리 뱃지 | `Vibe Coding` |
| `{{FEATURED_TITLE}}` | 게시글 제목 | `React 19의 새로운 기능 살펴보기` |
| `{{FEATURED_EXCERPT}}` | 게시글 요약 | `React 19에서 추가된 주요 기능들을...` |
| `{{FEATURED_URL}}` | 게시글 링크 | `https://flowcoder.com/post/456` |

#### Article 1~3 변수 (반복)
| 변수명 | 설명 |
|--------|------|
| `{{ARTICLE_N_IMAGE}}` | 썸네일 이미지 (80x80) |
| `{{ARTICLE_N_TITLE}}` | 게시글 제목 |
| `{{ARTICLE_N_EXCERPT}}` | 게시글 요약 (1-2줄) |
| `{{ARTICLE_N_URL}}` | 게시글 링크 |
| `{{ARTICLE_N_AUTHOR}}` | 작성자 이름 |
| `{{ARTICLE_N_DATE}}` | 작성일 |

> `N`을 `1`, `2`, `3`으로 대체하여 사용

#### Tips 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{TIP_TITLE}}` | 팁 제목 | `TypeScript 5.0 팁` |
| `{{TIP_CONTENT}}` | 팁 내용 | `const 타입 파라미터를 사용하면...` |

#### Stats 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{STAT_NEW_MEMBERS}}` | 신규 멤버 수 | `128` |
| `{{STAT_NEW_POSTS}}` | 새 게시글 수 | `45` |
| `{{STAT_COMMENTS}}` | 댓글 수 | `312` |

#### 푸터 변수
| 변수명 | 설명 |
|--------|------|
| `{{COMMUNITY_URL}}` | 커뮤니티 메인 링크 |
| `{{GITHUB_URL}}` | GitHub 링크 |
| `{{TWITTER_URL}}` | Twitter 링크 |
| `{{LINKEDIN_URL}}` | LinkedIn 링크 |
| `{{DISCORD_URL}}` | Discord 링크 |
| `{{SETTINGS_URL}}` | 구독 설정 페이지 |
| `{{UNSUBSCRIBE_URL}}` | 구독 취소 링크 |
| `{{BROWSER_URL}}` | 브라우저에서 보기 링크 |

---

## 3. newsletter-simple.html (뉴스레터 - 단일 콘텐츠)

단일 블로그 포스트나 공지사항 전달을 위한 심플한 템플릿입니다.

### 용도
- 새 블로그 포스트 알림
- 단일 공지사항
- 특별 이벤트 안내
- 중요 업데이트 공지

### 섹션 구성
1. 헤더 (로고)
2. 콘텐츠 (카테고리 + 제목 + 작성자 + 이미지 + 요약)
3. CTA 버튼
4. 푸터

### 변수 목록

#### 콘텐츠 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{LOGO_URL}}` | 로고 이미지 URL | `https://flowcoder.com/logo.png` |
| `{{SITE_URL}}` | 사이트 메인 URL | `https://flowcoder.com` |
| `{{CONTENT_CATEGORY}}` | 카테고리 뱃지 | `개발 팁` |
| `{{CONTENT_TITLE}}` | 콘텐츠 제목 | `효율적인 Git 브랜치 전략` |
| `{{CONTENT_IMAGE}}` | 대표 이미지 URL | `https://...` |
| `{{CONTENT_EXCERPT}}` | 콘텐츠 요약 | `팀 프로젝트에서 효과적인 Git 브랜치 전략을...` |
| `{{CONTENT_URL}}` | 전체 글 링크 | `https://flowcoder.com/blog/git-strategy` |
| `{{CONTENT_DATE}}` | 발행일 | `2025년 1월 15일` |
| `{{CONTENT_READ_TIME}}` | 읽기 시간 | `5분 읽기` |

#### 작성자 변수
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `{{AUTHOR_NAME}}` | 작성자 이름 | `김개발` |
| `{{AUTHOR_IMAGE}}` | 작성자 프로필 이미지 | `https://...` |

#### 푸터 변수
| 변수명 | 설명 |
|--------|------|
| `{{GITHUB_URL}}` | GitHub 링크 |
| `{{TWITTER_URL}}` | Twitter 링크 |
| `{{LINKEDIN_URL}}` | LinkedIn 링크 |
| `{{SETTINGS_URL}}` | 구독 설정 페이지 |
| `{{UNSUBSCRIBE_URL}}` | 구독 취소 링크 |

---

## 사용 방법

### 1. 템플릿 로드
```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

const templatePath = join(process.cwd(), 'src/lib/email-templates/notification.html');
const template = readFileSync(templatePath, 'utf-8');
```

### 2. 변수 치환
```typescript
function renderTemplate(template: string, variables: Record<string, string>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return rendered;
}

const html = renderTemplate(template, {
  LOGO_URL: 'https://flowcoder.com/logo.png',
  NOTIFICATION_TITLE: '새로운 댓글이 달렸습니다',
  NOTIFICATION_MESSAGE: '홍길동님이 회원님의 게시글에 댓글을 남겼습니다.',
  CTA_URL: 'https://flowcoder.com/post/123',
  CTA_TEXT: '댓글 확인하기',
  // ... 기타 변수
});
```

### 3. 이메일 발송
```typescript
import { sendEmail } from '@/lib/email'; // 이메일 서비스 모듈

await sendEmail({
  to: 'user@example.com',
  subject: '새로운 댓글이 달렸습니다',
  html: html,
});
```

---

## 테스트 및 미리보기

### 로컬 테스트
1. HTML 파일을 브라우저에서 직접 열기
2. 변수를 실제 값으로 임시 치환하여 확인

### 이메일 클라이언트 테스트 도구
- [Litmus](https://litmus.com/) - 다양한 이메일 클라이언트 미리보기
- [Email on Acid](https://www.emailonacid.com/) - 호환성 테스트
- [Mailtrap](https://mailtrap.io/) - 개발 환경 이메일 테스트

### 다크 모드 테스트
- macOS: 시스템 환경설정 > 디스플레이 > 다크 모드
- Chrome DevTools: Rendering > Emulate CSS media feature `prefers-color-scheme`

---

## 주의사항

1. **이미지 호스팅**: 이메일 내 이미지는 반드시 외부 URL로 호스팅해야 합니다 (Base64 인라인 아이콘 제외)
2. **테스트 필수**: 실제 발송 전 다양한 이메일 클라이언트에서 테스트하세요
3. **수신 거부 링크**: 법적 요구사항으로 반드시 수신 거부 링크를 포함해야 합니다
4. **개인정보**: 이메일 내용에 민감한 개인정보를 포함하지 마세요
5. **링크 추적**: 필요시 UTM 파라미터를 추가하여 클릭 추적 가능

---

## 파일 구조

```
src/lib/email-templates/
├── README.md              # 이 문서
├── notification.html      # 알림용 템플릿
├── newsletter.html        # 뉴스레터 (다중 콘텐츠)
└── newsletter-simple.html # 뉴스레터 (단일 콘텐츠)
```

## 관련 문서

- [FlowCoder 디자인 시스템](/src/app/globals.css)
- [이메일 발송 모듈](/src/lib/email.ts) (구현 필요)
