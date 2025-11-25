import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

/**
 * 이메일 회원가입 API (로컬 개발 환경 전용)
 *
 * POST /api/auth/signup
 */
export async function POST(request: NextRequest) {
  // 로컬 개발 환경에서만 활성화
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: '이메일 회원가입은 현재 지원되지 않습니다.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, username, displayName } = body;

    // 입력 검증
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: '이메일, 비밀번호, 사용자명은 필수입니다.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: '사용자명은 최소 3자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // 사용자명 중복 확인
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: '이미 사용 중인 사용자명입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱 (bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성 (해싱된 비밀번호 저장)
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || username,
        password: hashedPassword,
        reputation: 10, // 신규 사용자 기본 평판
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { error: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
