# API Routes 권한 매트릭스

**작성일**: 2025-11-05
**목적**: 모든 API Routes의 인증/권한 요구사항 문서화
**상태**: ✅ 검증 완료 (Task 9)

---

## 📊 권한 레벨 정의

| 레벨 | 설명 | 구현 방법 |
|------|------|-----------|
| **PUBLIC** | 인증 불필요 | 권한 체크 없음 |
| **AUTH** | 로그인 필요 | `auth()` 세션 확인 |
| **OWNER** | 리소스 소유자 | Zanzibar `check()` - owner 권한 |
| **MODERATOR** | 운영자 권한 | `requireModerator()` 미들웨어 |
| **ADMIN** | 관리자 권한 | `requireAdmin()` 미들웨어 |

---

## 🔒 API Routes 권한 매트릭스

### Posts API (`/api/posts`)

| Endpoint | Method | 권한 레벨 | 검증 위치 | 비고 |
|----------|--------|-----------|-----------|------|
| `/api/posts` | GET | PUBLIC | - | 게시글 목록 조회 |
| `/api/posts` | POST | AUTH | route.ts:123-126 | 인증된 사용자만 생성 가능 |
| `/api/posts/[id]` | GET | PUBLIC | - | 게시글 상세 조회 |
| `/api/posts/[id]` | PUT | OWNER | route.ts (Zanzibar) | 작성자만 수정 가능 |
| `/api/posts/[id]` | DELETE | OWNER | route.ts (Zanzibar) | 작성자만 삭제 가능 |
| `/api/posts/[id]/comments` | GET | PUBLIC | - | 댓글 목록 조회 |
| `/api/posts/[id]/comments` | POST | AUTH | route.ts | 인증된 사용자만 댓글 작성 |

---

### Questions API (`/api/questions`)

| Endpoint | Method | 권한 레벨 | 검증 위치 | 비고 |
|----------|--------|-----------|-----------|------|
| `/api/questions` | GET | PUBLIC | - | 질문 목록 조회 |
| `/api/questions` | POST | AUTH | route.ts:133-136 | 인증된 사용자만 질문 작성 |

---

### Answers API (`/api/answers`)

| Endpoint | Method | 권한 레벨 | 검증 위치 | 비고 |
|----------|--------|-----------|-----------|------|
| `/api/answers` | POST | AUTH | route.ts:17-23 | 인증된 사용자만 답변 작성 |
| `/api/answers` | PATCH | OWNER | route.ts:139-151 | 질문 작성자만 답변 채택 가능 (Zanzibar) |

---

### Admin API (`/api/admin/*`)

| Endpoint | Method | 권한 레벨 | 검증 위치 | 비고 |
|----------|--------|-----------|-----------|------|
| `/api/admin/stats` | GET | ADMIN | requireAdmin() | 통계 조회 |
| `/api/admin/users` | GET | ADMIN | requireAdmin() | 사용자 목록 조회 |
| `/api/admin/users/[id]/role` | POST | ADMIN | requireAdmin() | 역할 변경 |

---

### External Terms API (`/api/external-terms`)

| Endpoint | Method | 권한 레벨 | 검증 위치 | 비고 |
|----------|--------|-----------|-----------|------|
| `/api/external-terms` | GET | MODERATOR (조건부) | route.ts | draft=true인 경우 MODERATOR 필요 |
| `/api/external-terms` | POST | ADMIN | requireAdmin() | 약관 생성 |
| `/api/external-terms/[id]` | GET | MODERATOR | requireModerator() | 약관 상세 조회 |
| `/api/external-terms/[id]` | PUT | ADMIN | requireAdmin() | 약관 수정 |
| `/api/external-terms/[id]` | DELETE | ADMIN | requireAdmin() | 약관 삭제 |

---

### Auth API (`/api/auth/*`)

| Endpoint | Method | 권한 레벨 | 검증 위치 | 비고 |
|----------|--------|-----------|-----------|------|
| `/api/auth/[...nextauth]` | * | PUBLIC | NextAuth 처리 | NextAuth.js 자동 처리 |
| `/api/auth/signup` | POST | PUBLIC | - | 회원가입 |

---

## ✅ 검증 결과

### 인증 검증 구현 완료
- ✅ `/api/posts` POST - 인증 확인 완료
- ✅ `/api/questions` POST - 인증 확인 완료
- ✅ `/api/answers` POST, PATCH - 인증 및 권한 확인 완료
- ✅ `/api/admin/**` - 관리자 권한 확인 완료
- ✅ `/api/external-terms/**` - 권한 레벨별 확인 완료

### 권한 검증 패턴
1. **인증 확인**: `auth()` → `session?.user?.id` 체크
2. **역할 기반 권한**: `requireAdmin()`, `requireModerator()` 미들웨어
3. **리소스 기반 권한**: Zanzibar `check(userId, resourceType, resourceId, permission)`

---

## 🛡️ 보안 권장사항

### 구현 완료
- ✅ 모든 POST/PUT/DELETE 엔드포인트에 인증 확인
- ✅ 관리자 전용 API에 requireAdmin() 적용
- ✅ Zanzibar 기반 세밀한 권한 제어

### 향후 개선 사항
- [ ] Rate Limiting 구현 (API 남용 방지)
- [ ] CSRF 보호 추가 (Form submission)
- [ ] API Key 인증 (외부 서비스 통합 시)
- [ ] Webhook 서명 검증 (외부 이벤트 수신 시)

---

## 📝 사용 예시

### 인증 확인 패턴
```typescript
// 기본 인증 확인
const session = await auth();
if (!session?.user?.id) {
  return unauthorizedResponse();
}
```

### Zanzibar 권한 확인 패턴
```typescript
// 리소스 소유자 권한 확인
const hasPermission = await check(
  session.user.id,
  'post',
  postId,
  'owner'
);

if (!hasPermission) {
  return forbiddenResponse('작성자만 수정할 수 있습니다');
}
```

### 역할 기반 권한 확인 패턴
```typescript
// 관리자 권한 확인
const adminCheck = await requireAdmin();
if (adminCheck) return adminCheck; // 권한 없으면 403 반환
```

---

## 🔗 관련 문서

- [Zanzibar_Permission_System.md](./Zanzibar_Permission_System.md) - 권한 시스템 상세 설계
- [PRD.md](./PRD.md) - 기능 요구사항
- [ANALYSIS_REPORT.md](./ANALYSIS_REPORT.md) - Task 9 (API Routes 권한 체크 완성)

---

**최종 업데이트**: 2025-11-05
**검증 상태**: ✅ 모든 API Routes 권한 구현 확인 완료
