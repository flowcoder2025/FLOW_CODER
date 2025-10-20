/**
 * 바이브코딩 커뮤니티 플랫폼 - Mock 데이터
 *
 * Phase 1-3: UI 개발용 Mock 데이터
 * Phase 4: PostgreSQL로 마이그레이션
 *
 * @see src/lib/types.ts (타입 정의)
 * @see docs/TASKS.md Week 4 Task 4.2
 */

import type {
  User,
  Category,
  Post,
  PostWithAuthor,
  Comment,
  CommentWithAuthor,
} from './types';

// ─────────────────────────────────────────────────────────────────
// 유틸리티 함수
// ─────────────────────────────────────────────────────────────────

/**
 * 랜덤 날짜 생성 (최근 30일 내)
 */
function randomDate(daysAgo: number = 30): string {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const random = new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  );
  return random.toISOString();
}

/**
 * 랜덤 정수 생성
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 배열에서 랜덤 요소 선택
 */
function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 배열에서 랜덤 요소들 선택 (중복 없음)
 */
function randomPickMultiple<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

// ─────────────────────────────────────────────────────────────────
// Mock Users (10명)
// ─────────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  {
    id: 'mock_user_1',
    username: 'admin',
    email: 'admin@vibecoding.com',
    displayName: '관리자',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    bio: '바이브코딩 커뮤니티 관리자입니다.',
    reputation: 1000,
    role: 'ADMIN',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'mock_user_2',
    username: 'moderator1',
    email: 'mod1@vibecoding.com',
    displayName: '모더레이터',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mod1',
    bio: '커뮤니티 운영을 돕고 있습니다.',
    reputation: 500,
    role: 'MODERATOR',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'mock_user_3',
    username: 'moderator2',
    email: 'mod2@vibecoding.com',
    displayName: '헬퍼',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mod2',
    reputation: 450,
    role: 'MODERATOR',
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
  },
  {
    id: 'mock_user_4',
    username: 'developer_kim',
    email: 'kim@example.com',
    displayName: '김개발',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kim',
    bio: 'React와 Next.js를 사랑하는 프론트엔드 개발자입니다.',
    reputation: 250,
    role: 'USER',
    createdAt: randomDate(90),
    updatedAt: randomDate(10),
  },
  {
    id: 'mock_user_5',
    username: 'coder_lee',
    email: 'lee@example.com',
    displayName: '이코더',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lee',
    bio: 'TypeScript 열정러입니다!',
    reputation: 180,
    role: 'USER',
    createdAt: randomDate(60),
    updatedAt: randomDate(5),
  },
  {
    id: 'mock_user_6',
    username: 'frontend_park',
    email: 'park@example.com',
    displayName: '박프론트',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=park',
    reputation: 120,
    role: 'USER',
    createdAt: randomDate(45),
    updatedAt: randomDate(3),
  },
  {
    id: 'mock_user_7',
    username: 'backend_choi',
    email: 'choi@example.com',
    displayName: '최백엔드',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=choi',
    bio: 'Node.js와 PostgreSQL을 다룹니다.',
    reputation: 90,
    role: 'USER',
    createdAt: randomDate(30),
    updatedAt: randomDate(2),
  },
  {
    id: 'mock_user_8',
    username: 'newbie_jung',
    email: 'jung@example.com',
    displayName: '정뉴비',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jung',
    bio: '바이브코딩으로 코딩 입문했습니다!',
    reputation: 30,
    role: 'USER',
    createdAt: randomDate(15),
    updatedAt: randomDate(1),
  },
  {
    id: 'mock_user_9',
    username: 'designer_kang',
    email: 'kang@example.com',
    displayName: '강디자이너',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kang',
    reputation: 60,
    role: 'USER',
    createdAt: randomDate(20),
    updatedAt: randomDate(1),
  },
  {
    id: 'mock_user_10',
    username: 'student_yoon',
    email: 'yoon@example.com',
    displayName: '윤학생',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yoon',
    bio: '컴퓨터공학 전공 학생입니다.',
    reputation: 15,
    role: 'USER',
    createdAt: randomDate(10),
    updatedAt: randomDate(1),
  },
];

// ─────────────────────────────────────────────────────────────────
// Mock Categories (4개)
// ─────────────────────────────────────────────────────────────────

export const mockCategories: Category[] = [
  {
    id: 'mock_category_1',
    name: '자유게시판',
    slug: 'general',
    description: '바이브코딩에 대한 자유로운 토론과 대화를 나누는 공간입니다.',
    icon: '💬',
    color: 'blue',
    postCount: 0, // 나중에 계산
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'mock_category_2',
    name: '팁 & 노하우',
    slug: 'tips',
    description: '유용한 개발 팁과 노하우를 공유하는 공간입니다.',
    icon: '💡',
    color: 'yellow',
    postCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'mock_category_3',
    name: '작품 공유',
    slug: 'showcase',
    description: '여러분이 만든 프로젝트와 작품을 자랑하고 피드백을 받는 공간입니다.',
    icon: '🎨',
    color: 'purple',
    postCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'mock_category_4',
    name: '이벤트 & 공지',
    slug: 'events',
    description: '커뮤니티 이벤트와 공식 공지사항을 확인하는 공간입니다.',
    icon: '📢',
    color: 'red',
    postCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// ─────────────────────────────────────────────────────────────────
// Mock Posts (50개)
// ─────────────────────────────────────────────────────────────────

const postTitles = [
  // DISCUSSION (자유게시판, 일반 토론)
  '바이브코딩으로 첫 프로젝트를 완성했어요!',
  'Next.js 14 App Router 사용해보신 분 계신가요?',
  'TypeScript 꼭 써야 할까요?',
  '프론트엔드 로드맵 질문드립니다',
  '코딩 공부 어떻게 시작하셨나요?',
  'React vs Vue 어떤 게 나을까요?',
  '개발자 취업 준비 팁 공유합니다',
  '바이브코딩 커뮤니티 너무 좋아요!',
  'Tailwind CSS 생산성이 정말 좋네요',
  '프로젝트 아이디어 어디서 얻으시나요?',
  // QUESTION (Help me)
  'useState Hook 사용법 질문입니다',
  'Next.js 이미지 최적화 에러 해결 방법',
  'TypeScript 제네릭 이해가 안 됩니다',
  'API Routes에서 CORS 에러가 나요',
  'CSS Grid vs Flexbox 언제 쓰나요?',
  'React Query 사용법 알려주세요',
  'Git 브랜치 전략 추천해주세요',
  'PostgreSQL 연결이 안 됩니다',
  'Vercel 배포 에러 해결 방법',
  '컴포넌트 리렌더링 최적화 질문',
  // SHOWCASE (작품 공유)
  '포트폴리오 사이트 만들었어요!',
  'Todo 앱 첫 프로젝트 피드백 부탁드립니다',
  '날씨 앱 만들었습니다 (API 연동)',
  '개인 블로그 완성했어요',
  'E-commerce 클론 프로젝트',
  'React 게임 만들어봤어요',
  '실시간 채팅 앱 데모',
  '바이브코딩으로 만든 계산기',
  // NEWS (관리자 전용)
  '[공지] 바이브코딩 커뮤니티 오픈!',
  '[이벤트] 첫 프로젝트 공유 이벤트',
];

const postContents = [
  '안녕하세요! 바이브코딩으로 코딩을 시작한 지 한 달 만에 첫 프로젝트를 완성했습니다.\n\n처음엔 막막했는데, 커뮤니티 분들의 도움으로 하나씩 해결해 나갈 수 있었어요.\n\n정말 감사합니다! 다음 프로젝트도 기대됩니다 😊',
  'Next.js 14의 App Router를 사용해보고 있는데요, Pages Router와 많이 다르네요.\n\n특히 Server Components와 Client Components 구분이 처음엔 어려웠어요.\n\n사용해보신 분들 경험 공유해주시면 감사하겠습니다!',
  'JavaScript만으로도 개발이 가능한데, TypeScript를 꼭 배워야 할까요?\n\n장단점을 알고 싶습니다. 여러분의 의견을 듣고 싶어요!',
  '프론트엔드 개발자가 되고 싶은데, 어떤 순서로 공부하는 게 좋을까요?\n\nHTML/CSS → JavaScript → React 순서로 생각하고 있는데, 다른 분들은 어떻게 공부하셨나요?',
  'TypeScript의 제네릭(Generic) 개념이 이해가 안 됩니다.\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n```\n\n이 코드가 왜 필요한지, 어떻게 동작하는지 설명해주실 수 있나요?',
  '포트폴리오 사이트를 Next.js와 Tailwind CSS로 만들었습니다!\n\n반응형 디자인과 다크 모드도 구현했어요.\n\n피드백 부탁드립니다: https://example.com',
  '안녕하세요, 바이브코딩 커뮤니티가 정식으로 오픈되었습니다! 🎉\n\n이곳에서 자유롭게 질문하고, 프로젝트를 공유하고, 함께 성장해요.\n\n커뮤니티 가이드라인을 확인해주세요.',
];

const allTags = [
  'react',
  'nextjs',
  'typescript',
  'javascript',
  'css',
  'tailwind',
  'nodejs',
  'postgresql',
  'api',
  'vercel',
  '초보',
  '질문',
  '피드백',
  '공유',
];

// 게시글 생성 헬퍼 함수
function createMockPost(
  id: string,
  index: number,
  categoryId: string,
  authorId: string,
  postType: Post['postType']
): Post {
  const title = postTitles[index % postTitles.length];
  const content = postContents[index % postContents.length];
  const tags = randomPickMultiple(allTags, randomInt(1, 3));
  const createdAt = randomDate(30);

  return {
    id,
    title,
    content,
    postType,
    authorId,
    categoryId,
    upvotes: randomInt(0, 50),
    downvotes: randomInt(0, 10),
    viewCount: randomInt(10, 500),
    isPinned: index < 2, // 첫 2개만 고정
    isLocked: false,
    tags,
    createdAt,
    updatedAt: createdAt,
  };
}

// Mock Posts 생성
const rawMockPosts: Post[] = [];
let postIndex = 0;

// DISCUSSION posts (30개)
for (let i = 0; i < 30; i++) {
  const categoryId = randomPick([
    'mock_category_1',
    'mock_category_2',
    'mock_category_3',
  ]);
  const authorId = randomPick(mockUsers.map((u) => u.id));
  rawMockPosts.push(
    createMockPost(
      `mock_post_${postIndex + 1}`,
      postIndex,
      categoryId,
      authorId,
      'DISCUSSION'
    )
  );
  postIndex++;
}

// QUESTION posts (10개)
for (let i = 0; i < 10; i++) {
  const authorId = randomPick(mockUsers.map((u) => u.id));
  rawMockPosts.push(
    createMockPost(
      `mock_post_${postIndex + 1}`,
      postIndex,
      'mock_category_1',
      authorId,
      'QUESTION'
    )
  );
  postIndex++;
}

// SHOWCASE posts (8개)
for (let i = 0; i < 8; i++) {
  const authorId = randomPick(mockUsers.map((u) => u.id));
  rawMockPosts.push(
    createMockPost(
      `mock_post_${postIndex + 1}`,
      postIndex,
      'mock_category_3',
      authorId,
      'SHOWCASE'
    )
  );
  postIndex++;
}

// NEWS posts (2개, admin만)
for (let i = 0; i < 2; i++) {
  rawMockPosts.push(
    createMockPost(
      `mock_post_${postIndex + 1}`,
      postIndex,
      'mock_category_4',
      'mock_user_1', // admin
      'NEWS'
    )
  );
  postIndex++;
}

// PostWithAuthor로 변환
export const mockPosts: PostWithAuthor[] = rawMockPosts.map((post) => {
  const author = mockUsers.find((u) => u.id === post.authorId)!;
  const category = mockCategories.find((c) => c.id === post.categoryId)!;

  return {
    ...post,
    author: {
      id: author.id,
      username: author.username,
      displayName: author.displayName,
      avatarUrl: author.avatarUrl,
      reputation: author.reputation,
    },
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      color: category.color,
    },
    commentCount: randomInt(0, 20),
  };
});

// 카테고리별 게시글 수 업데이트
mockCategories.forEach((category) => {
  category.postCount = mockPosts.filter(
    (p) => p.categoryId === category.id
  ).length;
});

// ─────────────────────────────────────────────────────────────────
// Mock Comments (100개)
// ─────────────────────────────────────────────────────────────────

const commentTexts = [
  '좋은 정보 감사합니다!',
  '저도 같은 문제를 겪고 있었는데 도움이 되었어요.',
  '멋진 프로젝트네요! 👍',
  '이 방법으로 해결했습니다. 감사합니다!',
  '궁금한 점이 있는데요, 추가 설명 부탁드립니다.',
  '정말 유용한 팁이네요.',
  '저도 비슷한 경험이 있습니다.',
  '프로젝트 잘 봤습니다. 피드백 드릴게요.',
  '감사합니다! 많은 도움이 되었어요.',
  '이런 방법도 있군요. 몰랐습니다!',
];

const rawMockComments: Comment[] = [];
let commentIndex = 0;

// 각 게시글에 댓글 추가 (평균 2개)
mockPosts.forEach((post) => {
  const commentCount = randomInt(0, 5);

  for (let i = 0; i < commentCount; i++) {
    const authorId = randomPick(mockUsers.map((u) => u.id));
    const createdAt = randomDate(20);

    const comment: Comment = {
      id: `mock_comment_${commentIndex + 1}`,
      content: randomPick(commentTexts),
      authorId,
      postId: post.id,
      upvotes: randomInt(0, 10),
      downvotes: randomInt(0, 3),
      createdAt,
      updatedAt: createdAt,
    };

    rawMockComments.push(comment);
    commentIndex++;

    // 30% 확률로 대댓글 추가
    if (Math.random() < 0.3) {
      const replyAuthorId = randomPick(mockUsers.map((u) => u.id));
      const replyCreatedAt = randomDate(15);

      rawMockComments.push({
        id: `mock_comment_${commentIndex + 1}`,
        content: randomPick(commentTexts),
        authorId: replyAuthorId,
        postId: post.id,
        parentId: comment.id,
        upvotes: randomInt(0, 5),
        downvotes: randomInt(0, 2),
        createdAt: replyCreatedAt,
        updatedAt: replyCreatedAt,
      });
      commentIndex++;
    }
  }
});

// CommentWithAuthor로 변환
export const mockComments: CommentWithAuthor[] = rawMockComments.map(
  (comment) => {
    const author = mockUsers.find((u) => u.id === comment.authorId)!;

    return {
      ...comment,
      author: {
        id: author.id,
        username: author.username,
        displayName: author.displayName,
        avatarUrl: author.avatarUrl,
        reputation: author.reputation,
      },
    };
  }
);

// ─────────────────────────────────────────────────────────────────
// 유틸리티 함수 (데이터 조회)
// ─────────────────────────────────────────────────────────────────

/**
 * ID로 사용자 조회
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

/**
 * slug로 카테고리 조회
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find((c) => c.slug === slug);
}

/**
 * ID로 게시글 조회
 */
export function getPostById(id: string): PostWithAuthor | undefined {
  return mockPosts.find((p) => p.id === id);
}

/**
 * 게시글의 댓글 조회 (스레드 구조)
 */
export function getCommentsByPostId(postId: string): CommentWithAuthor[] {
  const comments = mockComments.filter((c) => c.postId === postId);

  // 최상위 댓글만 추출
  const topLevelComments = comments.filter((c) => !c.parentId);

  // 대댓글을 replies 필드에 추가
  function attachReplies(comment: CommentWithAuthor): CommentWithAuthor {
    const replies = comments
      .filter((c) => c.parentId === comment.id)
      .map(attachReplies);

    return {
      ...comment,
      replies: replies.length > 0 ? replies : undefined,
    };
  }

  return topLevelComments.map(attachReplies);
}

/**
 * 카테고리별 게시글 조회
 */
export function getPostsByCategory(categoryId: string): PostWithAuthor[] {
  return mockPosts.filter((p) => p.categoryId === categoryId);
}

/**
 * 인기 게시글 조회 (상위 N개)
 */
export function getPopularPosts(limit: number = 10): PostWithAuthor[] {
  return [...mockPosts]
    .sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
    .slice(0, limit);
}

/**
 * 최신 게시글 조회 (상위 N개)
 */
export function getRecentPosts(limit: number = 10): PostWithAuthor[] {
  return [...mockPosts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}
