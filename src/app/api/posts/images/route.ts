/**
 * 게시글 이미지 관리 API
 *
 * POST /api/posts/images
 * - PostImage 레코드 생성
 * - 게시글에 이미지 연결
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { postId, images } = body as {
      postId: string;
      images: Array<{ url: string; isFeatured: boolean; order: number }>;
    };

    if (!postId || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 게시글 소유권 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 기존 이미지 삭제 후 새 이미지 생성 (트랜잭션으로 처리)
    const result = await prisma.$transaction(async (tx) => {
      // 1. 기존 PostImage 레코드 모두 삭제
      await tx.postImage.deleteMany({
        where: { postId },
      });

      // 2. 새 PostImage 레코드 생성
      const createdImages = await tx.postImage.createMany({
        data: images.map((img) => ({
          postId,
          url: img.url,
          isFeatured: img.isFeatured,
          order: img.order,
        })),
      });

      return createdImages;
    });

    return NextResponse.json({
      success: true,
      data: {
        count: result.count,
      },
    });
  } catch (error) {
    console.error('PostImage creation error:', error);
    return NextResponse.json(
      { success: false, error: '이미지 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
