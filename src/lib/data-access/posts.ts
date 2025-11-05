/**
 * Data Access Layer - Posts
 * 게시글 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { PostType, Prisma, VoteType } from '@/generated/prisma';

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
 * 카테고리별 게시글 조회
 */
export async function getPostsByCategory(
  categorySlug: string
): Promise<PostWithAuthor[]> {
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
 * 게시글 ID로 단일 게시글 조회
 */
export async function getPostById(
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
 * 게시글 타입별 조회 (QUESTION, NEWS, DISCUSSION 등)
 */
export async function getPostsByType(
  postType: PostType,
  limit?: number
): Promise<PostWithAuthor[]> {
  try {
    const posts = await prisma.post.findMany({
    where: { postType },
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
    console.error('[DAL] getPostsByType error:', error);
    throw new Error(`게시글 타입별 조회 중 오류가 발생했습니다: ${postType}`);
  }
}

/**
 * 뉴스 게시글 목록 조회
 */
export async function getNewsPosts(limit?: number): Promise<PostWithAuthor[]> {
  return await getPostsByType(PostType.NEWS, limit);
}

/**
 * Q&A 게시글 목록 조회 (답변 정보 포함)
 */
export async function getQuestionPosts(
  limit?: number
): Promise<PostWithAnswers[]> {
  try {
    const posts = await prisma.post.findMany({
    where: { postType: PostType.QUESTION },
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
    console.error('[DAL] getQuestionPosts error:', error);
    throw new Error('Q&A 게시글 조회 중 오류가 발생했습니다');
  }
}

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
 * 최신 게시글 페이지네이션 조회
 */
export async function getRecentPostsPaginated(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedPostsResult> {
  const safePage = page < 1 ? 1 : page;
  const take = limit < 1 ? 20 : limit;
  const skip = (safePage - 1) * take;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
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
      prisma.post.count(),
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
    throw new Error('최신 게시글 페이지네이션 조회 중 오류가 발생했습니다');
  }
}

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
