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
  Answer,
  AnswerWithAuthor,
  Notification,
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

// NEWS posts (8개, admin/moderator) - /news 페이지 전용
const newsData = [
  {
    authorId: 'mock_user_1', // admin
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    title: '[공지] 바이브코딩 커뮤니티 정식 오픈!',
    content: '안녕하세요, 바이브코딩 커뮤니티가 정식으로 오픈되었습니다! 🎉\n\n이곳에서 자유롭게 질문하고, 프로젝트를 공유하고, 함께 성장해요.\n\n커뮤니티 가이드라인을 꼭 확인해주세요.',
  },
  {
    authorId: 'mock_user_1',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    title: '[이벤트] 첫 프로젝트 공유 이벤트',
    content: '여러분의 첫 프로젝트를 공유하고 피드백을 받아보세요!\n\n참여 방법:\n1. 작품 공유 게시판에 프로젝트 업로드\n2. #첫프로젝트 태그 추가\n3. 프로젝트 설명 및 기술 스택 작성\n\n선정된 분들께는 특별한 배지를 드립니다!',
  },
  {
    authorId: 'mock_user_2', // moderator
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    title: '[업데이트] 다크 모드 지원 시작',
    content: '바이브코딩 플랫폼에서 다크 모드를 지원합니다!\n\n우측 상단 테마 토글 버튼으로 간편하게 전환하세요.\n\n개발자 여러분의 눈 건강을 위해 준비했습니다 🌙',
  },
  {
    authorId: 'mock_user_1',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    title: '[릴리즈] v1.0.0 - 커뮤니티 플랫폼 런칭',
    content: '# v1.0.0 릴리즈 노트\n\n## 주요 기능\n- 커뮤니티 게시판 (자유게시판, 팁, 작품 공유)\n- Q&A 시스템 (Help me)\n- 뉴스 & 공지사항\n- 사용자 프로필\n\n## 기술 스택\n- Next.js 15\n- React 19\n- TypeScript\n- Tailwind CSS',
  },
  {
    authorId: 'mock_user_1',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    title: '[공지] 커뮤니티 이용 가이드라인',
    content: '바이브코딩 커뮤니티 가이드라인을 안내드립니다.\n\n## 존중과 배려\n- 모든 질문은 소중합니다\n- 초보자를 환대합니다\n- 다양한 의견을 존중합니다\n\n## 금지 사항\n- 욕설 및 비방\n- 스팸 및 광고\n- 저작권 침해\n\n함께 성장하는 커뮤니티를 만들어요!',
  },
  {
    authorId: 'mock_user_2',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    title: '[이벤트] 주간 코딩 챌린지 시작!',
    content: '매주 새로운 코딩 챌린지를 공개합니다!\n\n참여 방법:\n1. 매주 월요일 챌린지 공개\n2. 금요일까지 솔루션 제출\n3. 주말에 피드백 및 우수작 선정\n\n첫 번째 챌린지는 "Todo 리스트 만들기"입니다!',
  },
  {
    authorId: 'mock_user_1',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    title: '[업데이트] 코드 하이라이팅 기능 개선',
    content: '게시글에서 코드 하이라이팅이 더욱 강화되었습니다!\n\n지원 언어:\n- JavaScript/TypeScript\n- Python\n- Java\n- C/C++\n- Go\n- Rust\n- 그 외 20+ 언어\n\n마크다운 코드 블록에 언어를 지정하면 자동으로 하이라이팅됩니다.',
  },
  {
    authorId: 'mock_user_2',
    coverImage: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=800&q=80',
    title: '[릴리즈] v1.1.0 - 알림 시스템 추가',
    content: '# v1.1.0 릴리즈 노트\n\n## 새 기능\n- 실시간 알림 시스템\n- 댓글 및 답변 알림\n- 좋아요 및 투표 알림\n- 멘션(@) 알림\n\n## 개선 사항\n- 검색 성능 향상\n- 모바일 UI 최적화\n- 로딩 속도 개선',
  },
];

newsData.forEach((news, i) => {
  const post = createMockPost(
    `news_post_${i + 1}`,
    postIndex,
    'mock_category_4', // 이벤트&공지 카테고리 사용
    news.authorId,
    'NEWS'
  );
  post.title = news.title;
  post.content = news.content;
  post.coverImageUrl = news.coverImage;
  post.isPinned = i < 2; // 첫 2개는 고정
  rawMockPosts.push(post);
  postIndex++;
});

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

// ─────────────────────────────────────────────────────────────────
// Mock Answers (Q&A용 답변 데이터)
// ─────────────────────────────────────────────────────────────────

const answerTexts = [
  '이 문제는 useState의 비동기 특성 때문에 발생합니다.\n\n```javascript\nsetState(prev => prev + 1)\n```\n\n이렇게 함수형 업데이트를 사용하면 해결됩니다!',
  'Next.js 공식 문서를 확인해보시면 도움이 될 것 같습니다.\n\nhttps://nextjs.org/docs\n\n저도 같은 문제를 겪었는데 이 방법으로 해결했어요.',
  '제네릭은 재사용 가능한 컴포넌트를 만들 때 유용합니다.\n\n타입을 파라미터처럼 전달해서 다양한 타입에 대응할 수 있습니다.',
  'CORS 에러는 서버 설정 문제입니다.\n\nNext.js API Routes에서 헤더를 추가해주세요:\n\n```javascript\nres.setHeader("Access-Control-Allow-Origin", "*")\n```',
  'Grid는 2차원 레이아웃, Flexbox는 1차원 레이아웃에 적합합니다.\n\n복잡한 레이아웃은 Grid를, 간단한 정렬은 Flexbox를 추천합니다.',
  'React Query 사용법은 공식 문서가 잘 되어 있습니다.\n\n```javascript\nconst { data, isLoading } = useQuery("key", fetchFunction)\n```\n\n이렇게 시작하면 됩니다!',
  'Git Flow 브랜치 전략을 추천드립니다.\n\nmain, develop, feature/* 구조로 관리하면 좋습니다.',
  'PostgreSQL 연결 문제는 환경변수를 확인해보세요.\n\nDATABASE_URL이 제대로 설정되었는지 확인이 필요합니다.',
  'Vercel 배포 시 환경변수를 추가하셨나요?\n\nSettings > Environment Variables에서 설정해야 합니다.',
  'useMemo와 useCallback을 사용하면 리렌더링을 최적화할 수 있습니다.\n\n하지만 모든 곳에 사용하는 것보다 성능 문제가 있을 때 적용하는 게 좋습니다.',
];

// QUESTION 게시글 (mock_post_31 ~ mock_post_40)
const questionPostIds = Array.from({ length: 10 }, (_, i) => `mock_post_${31 + i}`);

const rawMockAnswers: Answer[] = [];
let answerIndex = 0;

// 각 질문에 답변 추가 (0~3개)
questionPostIds.forEach((questionId) => {
  const answerCount = randomInt(0, 3);

  for (let i = 0; i < answerCount; i++) {
    const authorId = randomPick(mockUsers.map((u) => u.id));
    const createdAt = randomDate(15);

    const answer: Answer = {
      id: `mock_answer_${answerIndex + 1}`,
      content: randomPick(answerTexts),
      questionId,
      authorId,
      // 첫 번째 답변을 50% 확률로 채택
      isAccepted: i === 0 && Math.random() < 0.5,
      upvotes: randomInt(0, 20),
      createdAt,
      updatedAt: createdAt,
    };

    rawMockAnswers.push(answer);
    answerIndex++;
  }
});

// AnswerWithAuthor로 변환
export const mockAnswers: AnswerWithAuthor[] = rawMockAnswers.map((answer) => {
  const author = mockUsers.find((u) => u.id === answer.authorId)!;

  return {
    ...answer,
    author: {
      id: author.id,
      username: author.username,
      displayName: author.displayName,
      avatarUrl: author.avatarUrl,
      reputation: author.reputation,
    },
  };
});

// ─────────────────────────────────────────────────────────────────
// Q&A 유틸리티 함수
// ─────────────────────────────────────────────────────────────────

/**
 * 질문(QUESTION 타입) 게시글 조회
 */
export function getQuestions(): PostWithAuthor[] {
  return mockPosts.filter((p) => p.postType === 'QUESTION');
}

/**
 * 특정 질문의 답변 조회
 */
export function getAnswersByQuestionId(questionId: string): AnswerWithAuthor[] {
  return mockAnswers.filter((a) => a.questionId === questionId);
}

/**
 * 질문의 답변 개수 조회
 */
export function getAnswerCount(questionId: string): number {
  return mockAnswers.filter((a) => a.questionId === questionId).length;
}

/**
 * 질문이 채택된 답변을 가지고 있는지 확인
 */
export function hasAcceptedAnswer(questionId: string): boolean {
  return mockAnswers.some((a) => a.questionId === questionId && a.isAccepted);
}

// ─────────────────────────────────────────────────────────────────
// 알림 데이터 (Task 7.4)
// ─────────────────────────────────────────────────────────────────

/**
 * Mock 알림 데이터
 */
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'COMMENT',
    title: '새로운 댓글',
    message: 'user1님이 "React 18 새로운 기능" 게시글에 댓글을 남겼습니다.',
    read: false,
    createdAt: randomDate(0), // 오늘
    link: '/community/general/post_1',
    actor: {
      username: 'user1',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    },
  },
  {
    id: 'notif_2',
    type: 'ANSWER',
    title: '새로운 답변',
    message: 'moderator1님이 "TypeScript 타입 에러 해결법" 질문에 답변했습니다.',
    read: false,
    createdAt: randomDate(1), // 1일 전
    link: '/help/question_1',
    actor: {
      username: 'moderator1',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator1',
    },
  },
  {
    id: 'notif_3',
    type: 'LIKE',
    title: '좋아요',
    message: 'user2님이 회원님의 댓글을 좋아합니다.',
    read: true,
    createdAt: randomDate(2), // 2일 전
    link: '/community/tips/post_2',
    actor: {
      username: 'user2',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    },
  },
  {
    id: 'notif_4',
    type: 'MENTION',
    title: '멘션',
    message: 'user3님이 댓글에서 회원님을 언급했습니다.',
    read: true,
    createdAt: randomDate(3), // 3일 전
    link: '/community/showcase/post_3',
    actor: {
      username: 'user3',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    },
  },
  {
    id: 'notif_5',
    type: 'SYSTEM',
    title: '시스템 알림',
    message: '새로운 업데이트가 있습니다. 확인해보세요!',
    read: true,
    createdAt: randomDate(7), // 7일 전
    link: '/news/news_post_1',
  },
];

/**
 * 사용자의 모든 알림 조회
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUserNotifications(userId: string): Notification[] {
  // Mock: 모든 알림 반환 (실제로는 userId로 필터링)
  return mockNotifications;
}

/**
 * 읽지 않은 알림 개수 조회
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getUnreadNotificationCount(userId: string): number {
  return mockNotifications.filter((n) => !n.read).length;
}
