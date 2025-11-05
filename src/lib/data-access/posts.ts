/**
 * Data Access Layer - Posts
 * 게시글 관련 데이터베이스 접근 로직
 */

import { prisma } from '@/lib/prisma';
import { Post, PostType, Prisma } from '@/generated/prisma';

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
