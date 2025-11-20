/**
 * 이미지 업로드 API
 *
 * POST /api/upload/image
 * - 게시글 이미지를 Supabase Storage에 업로드
 * - 인증된 사용자만 업로드 가능
 * - 파일 유효성 검증 (크기, 타입)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadPostImage } from '@/lib/storage';

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

    // FormData 파싱
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const postId = formData.get('postId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 전송되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 이미지 업로드
    const result = await uploadPostImage(file, postId || undefined);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
