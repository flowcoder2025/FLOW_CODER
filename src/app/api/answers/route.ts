import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { check } from '@/lib/permissions';

/**
 * POST /api/answers
 * 답변 작성 (인증 필요)
 *
 * Body:
 * - questionId: string (필수)
 * - content: string (필수, 최소 30자)
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: 로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { questionId, content } = body;

    // 필수 필드 검증
    if (!questionId || !content) {
      return NextResponse.json(
        { error: 'Bad Request: questionId, content는 필수입니다.' },
        { status: 400 }
      );
    }

    // 답변 내용 검증
    if (content.length < 30) {
      return NextResponse.json(
        { error: 'Bad Request: 답변은 최소 30자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 질문 존재 확인 (postType: QUESTION이어야 함)
    const question = await prisma.post.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        postType: true,
        isLocked: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Bad Request: 유효하지 않은 questionId입니다.' },
        { status: 404 }
      );
    }

    if (question.postType !== 'QUESTION') {
      return NextResponse.json(
        { error: 'Bad Request: 답변은 QUESTION 타입 게시글에만 작성할 수 있습니다.' },
        { status: 400 }
      );
    }

    // 답변 잠금 확인
    if (question.isLocked) {
      return NextResponse.json(
        { error: 'Forbidden: 이 질문은 답변이 잠겨있습니다.' },
        { status: 403 }
      );
    }

    // 답변 생성
    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: session.user.id,
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
      },
    });

    return NextResponse.json({ answer }, { status: 201 });
  } catch (error) {
    console.error('POST /api/answers error:', error);
    return NextResponse.json(
      { error: 'Failed to create answer' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/answers/[id]/accept
 * 답변 채택 (질문 작성자만 가능)
 *
 * Body:
 * - answerId: string (필수)
 * - questionId: string (필수)
 */
export async function PATCH(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: 로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { answerId, questionId } = body;

    // 필수 필드 검증
    if (!answerId || !questionId) {
      return NextResponse.json(
        { error: 'Bad Request: answerId, questionId는 필수입니다.' },
        { status: 400 }
      );
    }

    // 질문 작성자 권한 확인 (owner 권한)
    const hasPermission = await check(
      session.user.id,
      'post',
      questionId,
      'owner'
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: 질문 작성자만 답변을 채택할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 답변 존재 확인
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: {
        id: true,
        questionId: true,
        isAccepted: true,
      },
    });

    if (!answer) {
      return NextResponse.json(
        { error: 'Bad Request: 유효하지 않은 answerId입니다.' },
        { status: 404 }
      );
    }

    if (answer.questionId !== questionId) {
      return NextResponse.json(
        { error: 'Bad Request: 이 답변은 해당 질문의 답변이 아닙니다.' },
        { status: 400 }
      );
    }

    if (answer.isAccepted) {
      return NextResponse.json(
        { error: 'Bad Request: 이미 채택된 답변입니다.' },
        { status: 400 }
      );
    }

    // 기존 채택된 답변 해제 (한 질문당 하나의 답변만 채택 가능)
    await prisma.answer.updateMany({
      where: {
        questionId,
        isAccepted: true,
      },
      data: {
        isAccepted: false,
      },
    });

    // 답변 채택
    const acceptedAnswer = await prisma.answer.update({
      where: { id: answerId },
      data: {
        isAccepted: true,
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
      },
    });

    // TODO: 답변 작성자에게 reputation 보상 (+15)
    await prisma.user.update({
      where: { id: acceptedAnswer.author.id },
      data: {
        reputation: {
          increment: 15,
        },
      },
    });

    return NextResponse.json({ answer: acceptedAnswer });
  } catch (error) {
    console.error('PATCH /api/answers error:', error);
    return NextResponse.json(
      { error: 'Failed to accept answer' },
      { status: 500 }
    );
  }
}
