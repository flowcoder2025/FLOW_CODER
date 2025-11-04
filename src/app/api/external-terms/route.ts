import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/external-terms - 외부 약관 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';

    const terms = await prisma.externalTerms.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: terms });
  } catch (error) {
    console.error('External terms list error:', error);
    return NextResponse.json(
      { success: false, error: '약관 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/external-terms - 새 외부 약관 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, description, content, published } = body;

    // 필수 필드 검증
    if (!slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'slug, title, content는 필수 항목입니다.' },
        { status: 400 }
      );
    }

    // slug 중복 확인
    const existing = await prisma.externalTerms.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 slug입니다.' },
        { status: 409 }
      );
    }

    // 새 약관 생성
    const newTerms = await prisma.externalTerms.create({
      data: {
        slug,
        title,
        description: description || null,
        content,
        published: published ?? false,
      },
    });

    return NextResponse.json(
      { success: true, data: newTerms },
      { status: 201 }
    );
  } catch (error) {
    console.error('External terms creation error:', error);
    return NextResponse.json(
      { success: false, error: '약관 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
