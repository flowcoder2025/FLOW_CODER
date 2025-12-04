/**
 * API Response 유틸리티
 *
 * 일관된 API 응답 형식 제공
 * - 성공 응답: { success: true, data: T }
 * - 에러 응답: { success: false, error: string, code?: string }
 */

import { NextResponse } from 'next/server';

/**
 * 캐시 설정 옵션
 */
export interface CacheOptions {
  /** CDN/브라우저 캐시 시간 (초) */
  maxAge?: number;
  /** CDN 캐시 시간 (초) - Vercel Edge에서 사용 */
  sMaxAge?: number;
  /** stale-while-revalidate 시간 (초) */
  staleWhileRevalidate?: number;
  /** private 캐시 (브라우저만) */
  private?: boolean;
}

/**
 * Cache-Control 헤더 생성
 */
function buildCacheControl(options: CacheOptions): string {
  const directives: string[] = [];

  if (options.private) {
    directives.push('private');
  } else {
    directives.push('public');
  }

  if (options.maxAge !== undefined) {
    directives.push(`max-age=${options.maxAge}`);
  }

  if (options.sMaxAge !== undefined) {
    directives.push(`s-maxage=${options.sMaxAge}`);
  }

  if (options.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }

  return directives.join(', ');
}

/**
 * 성공 응답 생성
 *
 * @param data 응답 데이터
 * @param status HTTP 상태 코드 (기본: 200)
 * @param cacheOptions 캐시 설정 옵션 (선택)
 * @returns NextResponse
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  cacheOptions?: CacheOptions
) {
  const headers: HeadersInit = {};

  if (cacheOptions) {
    headers['Cache-Control'] = buildCacheControl(cacheOptions);
  }

  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status, headers }
  );
}

/**
 * 에러 응답 생성
 *
 * @param message 에러 메시지
 * @param status HTTP 상태 코드 (기본: 400)
 * @param code 선택적 에러 코드
 * @returns NextResponse
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code && { code }),
    },
    { status }
  );
}

/**
 * 유효성 검사 에러 응답
 *
 * @param message 검증 실패 메시지
 * @param fields 선택적 필드별 에러 정보
 * @returns NextResponse (400)
 */
export function validationErrorResponse(
  message: string,
  fields?: Record<string, string>
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'VALIDATION_ERROR',
      ...(fields && { fields }),
    },
    { status: 400 }
  );
}

/**
 * 인증 에러 응답 (401 Unauthorized)
 *
 * @param message 에러 메시지 (기본: "인증이 필요합니다")
 * @returns NextResponse (401)
 */
export function unauthorizedResponse(
  message: string = '인증이 필요합니다'
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'UNAUTHORIZED',
    },
    { status: 401 }
  );
}

/**
 * 권한 부족 에러 응답 (403 Forbidden)
 *
 * @param message 에러 메시지 (기본: "권한이 없습니다")
 * @returns NextResponse (403)
 */
export function forbiddenResponse(
  message: string = '권한이 없습니다'
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'FORBIDDEN',
    },
    { status: 403 }
  );
}

/**
 * 리소스 없음 에러 응답 (404 Not Found)
 *
 * @param message 에러 메시지 (기본: "리소스를 찾을 수 없습니다")
 * @returns NextResponse (404)
 */
export function notFoundResponse(
  message: string = '리소스를 찾을 수 없습니다'
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'NOT_FOUND',
    },
    { status: 404 }
  );
}

/**
 * 서버 내부 에러 응답 (500 Internal Server Error)
 *
 * @param message 에러 메시지 (기본: "서버 오류가 발생했습니다")
 * @param error 선택적 에러 객체 (개발 환경에서만 포함)
 * @returns NextResponse (500)
 */
export function serverErrorResponse(
  message: string = '서버 오류가 발생했습니다',
  error?: unknown
) {
  const response: {
    success: false;
    error: string;
    code: string;
    details?: unknown;
  } = {
    success: false,
    error: message,
    code: 'SERVER_ERROR',
  };

  // 디버깅을 위해 에러 상세 정보 포함
  if (error) {
    if (error instanceof Error) {
      response.details = {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5),
      };
    } else {
      response.details = error;
    }
  }

  return NextResponse.json(response, { status: 500 });
}

/**
 * 응답 타입 정의
 */
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  code?: string;
  fields?: Record<string, string>;
  details?: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
