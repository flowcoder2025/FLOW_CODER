import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { grantPostOwnership } from '@/lib/permissions';
import { triggerWebhooks } from '@/lib/webhooks';
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response';

/**
 * POST /api/admin/webhooks/inbound/posts
 * 인바운드 웹훅: 외부 시스템에서 게시글 생성
 *
 * Headers:
 * - X-Admin-API-Key: 관리자 API 키 (환경변수 ADMIN_API_KEY와 일치해야 함)
 *
 * Body:
 * - title: string (필수)
 * - content: string (필수)
 * - categoryId: string (필수) - 카테고리가 게시글 유형을 결정 (Q&A, 뉴스, 커뮤니티 등)
 * - tags: string[]
 * - coverImageUrl: string (optional)
 * - authorId: string (선택 - 없으면 시스템 계정 사용)
 */
export async function POST(request: NextRequest) {
  try {
    // API Key 인증 확인
    const apiKey = request.headers.get('X-Admin-API-Key');
    const validApiKey = process.env.ADMIN_API_KEY;

    if (!validApiKey) {
      console.error('ADMIN_API_KEY not configured in environment variables');
      return serverErrorResponse('서버 설정 오류: API 키가 구성되지 않았습니다');
    }

    if (!apiKey || apiKey !== validApiKey) {
      return unauthorizedResponse('유효하지 않은 API 키입니다');
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { title, content, categoryId, tags, coverImageUrl, authorId } = body;

    // 필수 필드 검증
    if (!title || !content || !categoryId) {
      return validationErrorResponse('title, content, categoryId는 필수입니다.');
    }

    // 입력 길이 검증
    if (title.length > 200) {
      return validationErrorResponse('제목은 최대 200자까지 입력 가능합니다.');
    }

    if (content.length > 10000) {
      return validationErrorResponse('내용은 최대 10,000자까지 입력 가능합니다.');
    }

    // tags 처리: 문자열이면 배열로 변환
    let processedTags: string[] = [];
    if (tags) {
      if (typeof tags === 'string') {
        // 쉼표로 구분된 문자열을 배열로 변환
        processedTags = tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0);
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }

      // 태그 검증
      if (processedTags.length > 5) {
        return validationErrorResponse('태그는 최대 5개까지 추가 가능합니다.');
      }

      for (const tag of processedTags) {
        if (typeof tag !== 'string' || tag.length > 20) {
          return validationErrorResponse('각 태그는 최대 20자까지 입력 가능합니다.');
        }
      }
    }

    // 카테고리 존재 확인
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      return validationErrorResponse('유효하지 않은 categoryId입니다.');
    }

    // authorId 검증 (제공된 경우)
    let finalAuthorId = authorId;
    if (authorId) {
      const authorExists = await prisma.user.findUnique({
        where: { id: authorId },
      });
      if (!authorExists) {
        return validationErrorResponse('유효하지 않은 authorId입니다.');
      }
    } else {
      // authorId가 없으면 시스템 계정 또는 첫 번째 admin 사용
      const systemUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });
      if (!systemUser) {
        return serverErrorResponse('시스템 계정을 찾을 수 없습니다. authorId를 제공해주세요.');
      }
      finalAuthorId = systemUser.id;
    }

    // 트랜잭션: 게시글 생성 + postCount 증가
    const post = await prisma.$transaction(async (tx) => {
      // 1. 게시글 생성
      const newPost = await tx.post.create({
        data: {
          title,
          content,
          authorId: finalAuthorId,
          categoryId,
          tags: processedTags,
          coverImageUrl,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              image: true,
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
        },
      });

      // 2. 카테고리 게시글 수 증가
      await tx.category.update({
        where: { id: categoryId },
        data: {
          postCount: {
            increment: 1,
          },
        },
      });

      return newPost;
    });

    // Zanzibar 권한 부여: 게시글 작성자에게 owner 권한 자동 부여 (트랜잭션 외부)
    await grantPostOwnership(post.id, finalAuthorId);

    // 웹훅 트리거 (비동기, 실패해도 메인 로직에 영향 없음)
    triggerWebhooks('POST_CREATED', {
      postId: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      categoryId: post.categoryId,
      tags: post.tags,
      source: 'inbound_webhook',
    }).catch((err) => console.error('Webhook trigger failed:', err));

    // 게시글 URL 생성
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flowcoder.co.kr';
    let postUrl: string;

    if (post.category.slug === 'news') {
      postUrl = `${baseUrl}/news/${post.id}`;
    } else if (post.category.slug === 'qna') {
      postUrl = `${baseUrl}/help/${post.id}`;
    } else {
      postUrl = `${baseUrl}/community/${post.category.slug}/${post.id}`;
    }

    return successResponse({ post, postUrl }, 201);
  } catch (error) {
    console.error('POST /api/admin/webhooks/inbound/posts error:', error);
    return serverErrorResponse('게시글 생성 중 오류가 발생했습니다', error);
  }
}
