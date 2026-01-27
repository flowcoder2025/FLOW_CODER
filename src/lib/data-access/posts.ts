/**
 * Data Access Layer - Posts
 * 게시글 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { Prisma, VoteType } from '@/generated/prisma';
import { unstable_cache } from 'next/cache';

/**
 * 반환 타입 정의
 */
export type PostWithAuthor = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        username: true;
        displayName: true;
        image: true;
        reputation: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
        icon: true;
        color: true;
        route: true;
        hasAnswers: true;
      };
    };
    _count: {
      select: {
        comments: true;
        votes: true;
      };
    };
  };
}>;

export type PostWithAnswers = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        username: true;
        displayName: true;
        image: true;
        reputation: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
        icon: true;
        color: true;
        route: true;
        hasAnswers: true;
      };
    };
    answers: {
      select: {
        id: true;
        isAccepted: true;
      };
    };
    _count: {
      select: {
        comments: true;
        votes: true;
        answers: true;
      };
    };
  };
}>;

export type PostWithDetails = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        username: true;
        displayName: true;
        image: true;
        reputation: true;
        role: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
        icon: true;
        color: true;
        route: true;
        hasAnswers: true;
      };
    };
    comments: {
      where: {
        parentId: null;
      };
      include: {
        author: {
          select: {
            id: true;
            username: true;
            displayName: true;
            image: true;
            reputation: true;
          };
        };
        replies: {
          include: {
            author: {
              select: {
                id: true;
                username: true;
                displayName: true;
                image: true;
                reputation: true;
              };
            };
          };
        };
      };
    };
    answers: {
      include: {
        author: {
          select: {
            id: true;
            username: true;
            displayName: true;
            image: true;
            reputation: true;
          };
        };
      };
    };
    _count: {
      select: {
        comments: true;
        answers: true;
        votes: true;
      };
    };
  };
}>;

export interface PaginatedPostsResult {
  posts: PostWithAuthor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VoteSummary {
  upvotes: number;
  downvotes: number;
}

/**
 * 내부 카테고리별 게시글 조회 함수 (캐싱 없음)
 */
async function fetchPostsByCategory(categorySlug: string): Promise<PostWithAuthor[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        category: { slug: categorySlug },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            image: true,
            reputation: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
            route: true,
            hasAnswers: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return posts || [];
  } catch (error) {
    console.error('[DAL] getPostsByCategory error:', error);
    throw new Error(`카테고리별 게시글 조회 중 오류가 발생했습니다: ${categorySlug}`);
  }
}

/**
 * 카테고리별 게시글 조회 (1분 캐싱)
 * 게시글은 자주 변경될 수 있으므로 짧은 캐싱 적용
 */
export const getPostsByCategory = (categorySlug: string) =>
  unstable_cache(
    () => fetchPostsByCategory(categorySlug),
    [`posts-category-${categorySlug}`],
    {
      revalidate: 60, // 1분마다 재검증
      tags: ['posts', `posts-category-${categorySlug}`],
    }
  )();

/**
 * 내부 함수: 게시글 ID로 단일 게시글 조회 (캐싱 없음)
 */
async function fetchPostById(
  postId: string
): Promise<PostWithDetails | null> {
  try {
    const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
          role: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          route: true,
          hasAnswers: true,
        },
      },
      comments: {
        where: {
          parentId: null, // 최상위 댓글만
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
              reputation: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  image: true,
                  reputation: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      answers: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
              reputation: true,
            },
          },
        },
        orderBy: [
          { isAccepted: 'desc' },
          { upvotes: 'desc' },
        ],
      },
      _count: {
        select: {
          comments: true,
          answers: true,
          votes: true,
        },
      },
    },
  });

    return post;
  } catch (error) {
    console.error('[DAL] getPostById error:', error);
    throw new Error(`게시글 조회 중 오류가 발생했습니다: ${postId}`);
  }
}

/**
 * 게시글 ID로 단일 게시글 조회 (30초 캐싱)
 * 게시글 상세 페이지에서 사용
 */
export const getPostById = (postId: string) =>
  unstable_cache(
    () => fetchPostById(postId),
    [`post-detail-${postId}`],
    {
      revalidate: 30, // 30초마다 재검증 (댓글 반영을 위해 짧게 설정)
      tags: ['posts', `post-${postId}`],
    }
  )();

/**
 * 내부 함수: 뉴스 게시글 목록 조회
 */
async function fetchNewsPosts(limit?: number): Promise<PostWithAuthor[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        category: { route: '/news' },
        deletedAt: null, // 삭제되지 않은 게시글만
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            image: true,
            reputation: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
            route: true,
            hasAnswers: true,
          },
        },
        images: {
          where: {
            isFeatured: true, // 대표 이미지만
          },
          take: 1,
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
            answers: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return posts || [];
  } catch (error) {
    console.error('[DAL] fetchNewsPosts error:', error);
    // 빌드 시 DB 연결 실패 시 빈 배열 반환
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('[DAL] fetchNewsPosts: 빌드 중 DB 연결 실패, 빈 배열 반환');
      return [];
    }
    throw new Error('뉴스 게시글 조회 중 오류가 발생했습니다');
  }
}

/**
 * 뉴스 게시글 목록 조회 (3분 캐싱)
 */
export const getNewsPosts = unstable_cache(
  fetchNewsPosts,
  ['news-posts'],
  {
    revalidate: 180, // 3분마다 재검증
    tags: ['news', 'posts'],
  }
);

/**
 * 내부 함수: Q&A 게시글 목록 조회
 */
async function fetchQuestionPosts(
  limit?: number
): Promise<PostWithAnswers[]> {
  try {
    const posts = await prisma.post.findMany({
    where: { category: { hasAnswers: true } },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          route: true,
          hasAnswers: true,
        },
      },
      answers: {
        select: {
          id: true,
          isAccepted: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
          answers: true,
        },
      },
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  });

    return posts || [];
  } catch (error) {
    console.error('[DAL] fetchQuestionPosts error:', error);
    // 빌드 시 DB 연결 실패 시 빈 배열 반환
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('[DAL] fetchQuestionPosts: 빌드 중 DB 연결 실패, 빈 배열 반환');
      return [];
    }
    throw new Error('Q&A 게시글 조회 중 오류가 발생했습니다');
  }
}

/**
 * Q&A 게시글 목록 조회 (1분 캐싱 - Q&A는 자주 갱신 필요)
 */
export const getQuestionPosts = unstable_cache(
  fetchQuestionPosts,
  ['question-posts'],
  {
    revalidate: 60, // 1분마다 재검증 (Q&A는 실시간성 요구)
    tags: ['questions', 'posts'],
  }
);

/**
 * 최신 게시글 조회 (메인 페이지용)
 */
export async function getRecentPosts(
  limit: number = 10
): Promise<PostWithAuthor[]> {
  try {
    const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          route: true,
          hasAnswers: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

    return posts || [];
  } catch (error) {
    console.error('[DAL] getRecentPosts error:', error);
    // 빌드 시 DB 연결 실패 시 빈 배열 반환
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('[DAL] getRecentPosts: 빌드 중 DB 연결 실패, 빈 배열 반환');
      return [];
    }
    throw new Error('최신 게시글 조회 중 오류가 발생했습니다');
  }
}

/**
 * 사용자별 게시글 조회
 */
export async function getPostsByUser(
  userId: string
): Promise<PostWithAuthor[]> {
  try {
    const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          reputation: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          route: true,
          hasAnswers: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

    return posts || [];
  } catch (error) {
    console.error('[DAL] getPostsByUser error:', error);
    throw new Error(`사용자별 게시글 조회 중 오류가 발생했습니다: ${userId}`);
  }
}

/**
 * 내부 최신 게시글 페이지네이션 조회 함수 (캐싱 없음)
 */
async function fetchRecentPostsPaginated(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedPostsResult> {
  const safePage = page < 1 ? 1 : page;
  const take = limit < 1 ? 20 : limit;
  const skip = (safePage - 1) * take;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
              reputation: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
              color: true,
              route: true,
              hasAnswers: true,
            },
          },
          _count: {
            select: {
              comments: true,
              votes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.post.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        total,
        page: safePage,
        limit: take,
        totalPages: Math.max(1, Math.ceil(total / take)),
      },
    };
  } catch (error) {
    console.error('[DAL] getRecentPostsPaginated error:', error);
    // 빌드 시 DB 연결 실패 시 빈 결과 반환
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('[DAL] getRecentPostsPaginated: 빌드 중 DB 연결 실패, 빈 결과 반환');
      return {
        posts: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      };
    }
    throw new Error('최신 게시글 페이지네이션 조회 중 오류가 발생했습니다');
  }
}

/**
 * 최신 게시글 페이지네이션 조회 (1분 캐싱)
 * 커뮤니티 메인 페이지에서 사용
 */
export const getRecentPostsPaginated = (page: number = 1, limit: number = 20) =>
  unstable_cache(
    () => fetchRecentPostsPaginated(page, limit),
    [`recent-posts-page-${page}-limit-${limit}`],
    {
      revalidate: 60, // 1분마다 재검증
      tags: ['posts', 'recent-posts'],
    }
  )();

/**
 * 게시글 투표 요약 정보 (up/down 카운트)
 */
export async function getPostVoteSummary(postId: string): Promise<VoteSummary> {
  try {
    const summary: VoteSummary = { upvotes: 0, downvotes: 0 };

    const groupedVotes = await prisma.vote.groupBy({
      by: ['voteType'],
      _count: {
        voteType: true,
      },
      where: {
        postId,
      },
    });

    for (const vote of groupedVotes) {
      if (vote.voteType === VoteType.UP) {
        summary.upvotes = vote._count.voteType;
      } else if (vote.voteType === VoteType.DOWN) {
        summary.downvotes = vote._count.voteType;
      }
    }

    return summary;
  } catch (error) {
    console.error('[DAL] getPostVoteSummary error:', error);
    throw new Error(`게시글 투표 요약 조회 중 오류가 발생했습니다: ${postId}`);
  }
}

/**
 * 특정 사용자의 게시글 투표 상태
 */
export async function getUserVoteForPost(
  postId: string,
  userId: string
): Promise<VoteType | null> {
  try {
    const vote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: {
        voteType: true,
      },
    });

    return vote?.voteType ?? null;
  } catch (error) {
    console.error('[DAL] getUserVoteForPost error:', error);
    throw new Error(`게시글 투표 상태 조회 중 오류가 발생했습니다: ${postId}`);
  }
}
