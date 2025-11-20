/**
 * Supabase Storage 유틸리티
 *
 * 게시글 이미지 업로드/삭제 기능 제공
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 스토리지 버킷 이름
export const POST_IMAGES_BUCKET = 'post-images';

// 허용되는 이미지 타입
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * 파일 유효성 검증
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 타입 검증
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: '허용되지 않는 파일 형식입니다. JPG, PNG, GIF, WebP만 업로드 가능합니다.',
    };
  }

  // 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: '파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.',
    };
  }

  return { valid: true };
}

/**
 * 고유한 파일명 생성
 * 형식: {postId}_{timestamp}_{random}.{ext}
 */
export function generateUniqueFilename(originalName: string, postId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const prefix = postId || 'temp';

  return `${prefix}_${timestamp}_${random}.${ext}`;
}

/**
 * 게시글 이미지 업로드
 *
 * @param file - 업로드할 파일
 * @param postId - 게시글 ID (없으면 temp)
 * @returns 업로드된 이미지의 공개 URL
 */
export async function uploadPostImage(
  file: File,
  postId?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  // 파일 유효성 검증
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // 고유 파일명 생성
    const filename = generateUniqueFilename(file.name, postId);
    const filePath = postId ? `${postId}/${filename}` : `temp/${filename}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from(POST_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: '이미지 업로드에 실패했습니다.' };
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from(POST_IMAGES_BUCKET)
      .getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' };
  }
}

/**
 * 게시글 이미지 삭제
 *
 * @param url - 삭제할 이미지의 공개 URL
 */
export async function deletePostImage(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    // URL에서 파일 경로 추출
    // 예: https://[project].supabase.co/storage/v1/object/public/post-images/post123/file.jpg
    const urlParts = url.split(`/${POST_IMAGES_BUCKET}/`);
    if (urlParts.length !== 2) {
      return { success: false, error: '잘못된 이미지 URL입니다.' };
    }

    const filePath = urlParts[1];

    // Supabase Storage에서 삭제
    const { error } = await supabase.storage.from(POST_IMAGES_BUCKET).remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return { success: false, error: '이미지 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: '이미지 삭제 중 오류가 발생했습니다.' };
  }
}

/**
 * 여러 이미지 업로드
 *
 * @param files - 업로드할 파일 배열
 * @param postId - 게시글 ID
 * @returns 업로드된 이미지 URL 배열
 */
export async function uploadPostImages(
  files: File[],
  postId?: string
): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> {
  const results = await Promise.all(files.map((file) => uploadPostImage(file, postId)));

  const urls: string[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.success && result.url) {
      urls.push(result.url);
    } else if (result.error) {
      errors.push(`${files[index].name}: ${result.error}`);
    }
  });

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, urls };
}

/**
 * 게시글의 모든 이미지 삭제
 *
 * @param urls - 삭제할 이미지 URL 배열
 */
export async function deletePostImages(urls: string[]): Promise<{ success: boolean; errors?: string[] }> {
  const results = await Promise.all(urls.map(deletePostImage));

  const errors = results.filter((r) => !r.success).map((r) => r.error || '알 수 없는 오류');

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}
