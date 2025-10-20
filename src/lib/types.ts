/**
 * 바이브코딩 커뮤니티 플랫폼 - TypeScript 타입 정의
 *
 * Phase 1-3: Mock 데이터 기반 UI 개발용 인터페이스
 * Phase 4: PostgreSQL 스키마와 1:1 매핑 가능하도록 설계
 *
 * @see docs/PRD.md 섹션 6.1 (데이터 모델)
 */

// ─────────────────────────────────────────────────────────────────
// 기본 타입 정의
// ─────────────────────────────────────────────────────────────────

/** 사용자 권한 레벨 */
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

/** 게시글 타입 */
export type PostType = 'DISCUSSION' | 'QUESTION' | 'SHOWCASE' | 'NEWS';

/** 투표 타입 */
export type VoteType = 'UP' | 'DOWN';

// ─────────────────────────────────────────────────────────────────
// 핵심 엔티티 인터페이스
// ─────────────────────────────────────────────────────────────────

/**
 * 사용자
 *
 * OAuth 사용자의 경우 password는 null/undefined
 */
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  /** 사용자 평판 점수 (활동에 따라 증감) */
  reputation: number;
  role: UserRole;
  createdAt: string; // ISO 8601 format
  updatedAt: string;
}

/**
 * 카테고리
 *
 * 커뮤니티 게시판 분류 (자유게시판, 팁, 작품 공유, 이벤트)
 */
export interface Category {
  id: string;
  /** 카테고리 이름 (예: "자유게시판") */
  name: string;
  /** URL-friendly 식별자 (예: "general") */
  slug: string;
  description?: string;
  /** 이모지 아이콘 (예: "💬") */
  icon?: string;
  /** Tailwind CSS 색상 클래스 (예: "blue") */
  color?: string;
  /** 카테고리 내 게시글 수 */
  postCount: number;
  createdAt: string;
}

/**
 * 게시글
 *
 * 커뮤니티, Q&A, 뉴스 등 모든 콘텐츠의 기본 단위
 */
export interface Post {
  id: string;
  title: string;
  /** Rich Text 콘텐츠 (Tiptap JSON 또는 HTML) */
  content: string;
  postType: PostType;
  authorId: string;
  categoryId: string;
  upvotes: number;
  downvotes: number;
  viewCount: number;
  /** 상단 고정 여부 */
  isPinned: boolean;
  /** 댓글 잠금 여부 */
  isLocked: boolean;
  /** 태그 목록 (최대 5개) */
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 댓글
 *
 * 스레드 형식 지원 (최대 깊이 5)
 */
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  /** 부모 댓글 ID (최상위 댓글은 undefined) */
  parentId?: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 답변 (Help me - Q&A 전용)
 *
 * 질문당 1개만 채택 가능
 */
export interface Answer {
  id: string;
  content: string;
  questionId: string; // Post의 id
  authorId: string;
  /** 채택된 답변 여부 */
  isAccepted: boolean;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 투표
 *
 * 사용자당 게시글당 1회 투표 (변경 가능)
 */
export interface Vote {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  answerId?: string;
  voteType: VoteType;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────
// 관계형 타입 (UI 표시용)
// ─────────────────────────────────────────────────────────────────

/**
 * 작성자 정보 포함 게시글 (목록 표시용)
 */
export interface PostWithAuthor extends Post {
  author: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'reputation'>;
  category: Pick<Category, 'id' | 'name' | 'slug' | 'icon' | 'color'>;
  /** 댓글 수 */
  commentCount: number;
}

/**
 * 게시글 상세 정보 (상세 페이지용)
 */
export interface PostDetail extends PostWithAuthor {
  comments: CommentWithAuthor[];
  /** 현재 사용자의 투표 상태 */
  userVote?: VoteType;
}

/**
 * 작성자 정보 포함 댓글
 */
export interface CommentWithAuthor extends Comment {
  author: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'reputation'>;
  /** 대댓글 목록 (재귀 구조) */
  replies?: CommentWithAuthor[];
}

/**
 * 작성자 정보 포함 답변
 */
export interface AnswerWithAuthor extends Answer {
  author: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl' | 'reputation'>;
}

// ─────────────────────────────────────────────────────────────────
// 페이지네이션 & API 응답 타입
// ─────────────────────────────────────────────────────────────────

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * API 응답 (성공/실패)
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ─────────────────────────────────────────────────────────────────
// Form 입력 타입
// ─────────────────────────────────────────────────────────────────

/**
 * 게시글 작성 입력
 */
export interface CreatePostInput {
  title: string;
  content: string;
  categoryId: string;
  postType: PostType;
  tags: string[];
}

/**
 * 게시글 수정 입력
 */
export interface UpdatePostInput {
  title?: string;
  content?: string;
  tags?: string[];
}

/**
 * 댓글 작성 입력
 */
export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
}

/**
 * 답변 작성 입력
 */
export interface CreateAnswerInput {
  content: string;
  questionId: string;
}

/**
 * 사용자 프로필 수정 입력
 */
export interface UpdateProfileInput {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

// ─────────────────────────────────────────────────────────────────
// 필터 & 정렬 타입
// ─────────────────────────────────────────────────────────────────

/**
 * 게시글 정렬 옵션
 */
export type PostSortOption = 'popular' | 'recent' | 'comments' | 'views';

/**
 * 게시글 필터 옵션
 */
export interface PostFilterOptions {
  categoryId?: string;
  tags?: string[];
  postType?: PostType;
  authorId?: string;
  /** 기간 필터 (일 단위) */
  period?: 'day' | 'week' | 'month' | 'all';
}

/**
 * 검색 쿼리
 */
export interface SearchQuery {
  keyword: string;
  filters?: PostFilterOptions;
  sort?: PostSortOption;
  page?: number;
  limit?: number;
}
