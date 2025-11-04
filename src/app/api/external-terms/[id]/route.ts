import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/external-terms/[id] - 단일 외부 약관 조회
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const terms = await prisma.externalTerms.findUnique({
      where: { id },
    });

    if (!terms) {
      return NextResponse.json(
        { success: false, error: '약관을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: terms });
  } catch (error) {
    console.error('External terms fetch error:', error);
    return NextResponse.json(
      { success: false, error: '약관을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/external-terms/[id] - 외부 약관 수정
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { slug, title, description, content, published } = body;

    // 약관 존재 확인
    const existing = await prisma.externalTerms.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '약관을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // slug 변경 시 중복 확인
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.externalTerms.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { success: false, error: '이미 사용 중인 slug입니다.' },
          { status: 409 }
        );
      }
    }

    // 약관 수정
    const updatedTerms = await prisma.externalTerms.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json({ success: true, data: updatedTerms });
  } catch (error) {
    console.error('External terms update error:', error);
    return NextResponse.json(
      { success: false, error: '약관 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/external-terms/[id] - 외부 약관 삭제
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // 약관 존재 확인
    const existing = await prisma.externalTerms.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '약관을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 약관 삭제
    await prisma.externalTerms.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: '약관이 삭제되었습니다.' });
  } catch (error) {
    console.error('External terms deletion error:', error);
    return NextResponse.json(
      { success: false, error: '약관 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
