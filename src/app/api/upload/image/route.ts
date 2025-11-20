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
import { requirePermission } from '@/lib/permissions';

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
      console.error('[Upload] 파일이 전송되지 않았습니다.');
      return NextResponse.json(
        { success: false, error: '파일이 전송되지 않았습니다.' },
        { status: 400 }
      );
    }

    console.log('[Upload] 파일 정보:', {
      name: file.name,
      size: file.size,
      type: file.type,
      postId,
    });

    // Zanzibar 권한 체크: 게시글 수정 권한 확인
    if (postId) {
      try {
        await requirePermission(session.user.id, 'post', postId, 'editor');
        console.log('[Upload] 권한 체크 성공:', {
          userId: session.user.id,
          postId,
        });
      } catch (permissionError: unknown) {
        console.error('[Upload] 권한 체크 실패:', permissionError);
        return NextResponse.json(
          {
            success: false,
            error:
              permissionError instanceof Error
                ? permissionError.message
                : '게시글 수정 권한이 없습니다.',
          },
          { status: 403 }
        );
      }
    }

    // 이미지 업로드
    const result = await uploadPostImage(file, postId || undefined);

    console.log('[Upload] 업로드 결과:', result);

    if (!result.success) {
      console.error('[Upload] 업로드 실패:', result.error);
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
