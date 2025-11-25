import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@/generated/prisma';

/**
 * API 에러 응답 형식
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * API 성공 응답 형식
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * API 핸들러 타입
 */
export type ApiHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

/**
 * Prisma 에러 코드별 HTTP 상태 코드 및 메시지 매핑
 */
const PRISMA_ERROR_MAP: Record<
  string,
  { status: number; message: string }
> = {
  P2002: {
    status: 409,
    message: '이미 존재하는 데이터입니다',
  },
  P2025: {
    status: 404,
    message: '요청한 데이터를 찾을 수 없습니다',
  },
  P2003: {
    status: 400,
    message: '참조 무결성 제약 조건 위반입니다',
  },
  P2014: {
    status: 400,
    message: '관계 제약 조건 위반입니다',
  },
  P2016: {
    status: 400,
    message: '쿼리 해석 오류입니다',
  },
};

/**
 * Zod 검증 에러를 사용자 친화적 메시지로 변환
 */
function formatZodError(error: ZodError): string {
  const firstIssue = error.issues[0];
  return firstIssue?.message || '입력 데이터 검증에 실패했습니다';
}

/**
 * Prisma 에러를 사용자 친화적 메시지로 변환
 */
function formatPrismaError(error: Prisma.PrismaClientKnownRequestError): {
  status: number;
  message: string;
  code: string;
} {
  const errorInfo = PRISMA_ERROR_MAP[error.code];

  if (errorInfo) {
    // P2002 (Unique constraint) 에러의 경우 필드 이름 추출
    if (error.code === 'P2002' && error.meta?.target) {
      const fields = error.meta.target as string[];
      const fieldName = fields.join(', ');
      return {
        status: errorInfo.status,
        message: `${errorInfo.message}: ${fieldName}`,
        code: error.code,
      };
    }

    return {
      status: errorInfo.status,
      message: errorInfo.message,
      code: error.code,
    };
  }

  // 알려지지 않은 Prisma 에러
  return {
    status: 500,
    message: '데이터베이스 작업 중 오류가 발생했습니다',
    code: error.code,
  };
}

/**
 * 에러를 API 응답으로 변환
 */
function createErrorResponse(
  error: unknown,
  defaultStatus = 500
): NextResponse<ApiErrorResponse> {
  const timestamp = new Date().toISOString();

  // Zod 검증 에러
  if (error instanceof ZodError) {
    return NextResponse.json<ApiErrorResponse>(
      {
        error: formatZodError(error),
        code: 'VALIDATION_ERROR',
        details: error.issues,
        timestamp,
      },
      { status: 400 }
    );
  }

  // Prisma Known Request Error (P2002, P2025 등)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, message, code } = formatPrismaError(error);
    return NextResponse.json<ApiErrorResponse>(
      {
        error: message,
        code,
        timestamp,
      },
      { status }
    );
  }

  // Prisma Validation Error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json<ApiErrorResponse>(
      {
        error: '데이터 검증에 실패했습니다',
        code: 'VALIDATION_ERROR',
        timestamp,
      },
      { status: 400 }
    );
  }

  // 일반 Error 객체
  if (error instanceof Error) {
    // 개발 환경에서만 상세 에러 메시지 노출
    const isDevelopment = process.env.NODE_ENV === 'development';

    return NextResponse.json<ApiErrorResponse>(
      {
        error: isDevelopment ? error.message : '서버 오류가 발생했습니다',
        code: 'INTERNAL_SERVER_ERROR',
        details: isDevelopment ? error.stack : undefined,
        timestamp,
      },
      { status: defaultStatus }
    );
  }

  // 알 수 없는 에러
  return NextResponse.json<ApiErrorResponse>(
    {
      error: '알 수 없는 오류가 발생했습니다',
      code: 'UNKNOWN_ERROR',
      timestamp,
    },
    { status: defaultStatus }
  );
}

/**
 * API 핸들러를 에러 핸들링으로 감싸는 미들웨어
 *
 * @param handler - API 핸들러 함수
 * @returns 에러 핸들링이 적용된 API 핸들러
 *
 * @example
 * ```typescript
 * export const POST = withErrorHandling(async (request) => {
 *   const body = await request.json();
 *   const data = createPostSchema.parse(body); // Zod 검증
 *
 *   const post = await prisma.post.create({ data }); // Prisma 작업
 *
 *   return NextResponse.json({ success: true, data: post });
 * });
 * ```
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      // 에러 로깅 (프로덕션에서는 Sentry 등으로 전송)
      console.error('[API Error]', {
        url: request.url,
        method: request.method,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      });

      // 프로덕션 환경에서 Sentry로 에러 전송
      if (process.env.NODE_ENV === 'production' && error instanceof Error) {
        // TODO: Sentry.captureException(error);
      }

      return createErrorResponse(error);
    }
  };
}

/**
 * 성공 응답 생성 헬퍼
 *
 * @param data - 응답 데이터
 * @param status - HTTP 상태 코드 (기본 200)
 * @returns NextResponse
 *
 * @example
 * ```typescript
 * return createSuccessResponse(post, 201);
 * ```
 */
export function createSuccessResponse<T>(
  data: T,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
