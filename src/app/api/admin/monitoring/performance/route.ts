import { NextResponse } from 'next/server';
import { requireModerator } from '@/lib/admin-middleware';

/**
 * 성능 모니터링 API
 *
 * GET /api/admin/monitoring/performance
 * - 시스템 성능 메트릭 조회
 * - 권한: Moderator 이상
 */

interface PerformanceMetric {
  timestamp: string;
  pageLoadTime: number;
  apiResponseTime: number;
  errorCount: number;
}

interface PerformanceStats {
  overview: {
    avgPageLoadTime: number;
    avgApiResponseTime: number;
    totalErrors: number;
    activeUsers: number;
  };
  timeline: PerformanceMetric[];
  topErrors: {
    message: string;
    count: number;
    lastOccurred: string;
  }[];
  pagePerformance: {
    path: string;
    avgLoadTime: number;
    visits: number;
  }[];
}

/**
 * Mock 데이터 생성 함수
 * 실제 환경에서는 데이터베이스나 모니터링 서비스에서 가져옴
 */
function generateMockPerformanceData(): PerformanceStats {
  const now = new Date();
  const timeline: PerformanceMetric[] = [];

  // 최근 24시간 데이터 (1시간 간격)
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    timeline.push({
      timestamp: timestamp.toISOString(),
      pageLoadTime: 800 + Math.random() * 400, // 800-1200ms
      apiResponseTime: 100 + Math.random() * 200, // 100-300ms
      errorCount: Math.floor(Math.random() * 5), // 0-5 errors
    });
  }

  return {
    overview: {
      avgPageLoadTime: 980,
      avgApiResponseTime: 185,
      totalErrors: 24,
      activeUsers: 142,
    },
    timeline,
    topErrors: [
      {
        message: 'Failed to fetch /api/posts',
        count: 8,
        lastOccurred: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        message: 'Unauthorized: 로그인이 필요합니다',
        count: 6,
        lastOccurred: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        message: 'Prisma query timeout',
        count: 4,
        lastOccurred: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      },
      {
        message: 'Image optimization failed',
        count: 3,
        lastOccurred: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      },
      {
        message: 'Network request failed',
        count: 3,
        lastOccurred: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      },
    ],
    pagePerformance: [
      { path: '/', avgLoadTime: 865, visits: 3420 },
      { path: '/community', avgLoadTime: 920, visits: 2180 },
      { path: '/help', avgLoadTime: 1050, visits: 1560 },
      { path: '/news', avgLoadTime: 780, visits: 890 },
      { path: '/admin', avgLoadTime: 1120, visits: 245 },
    ],
  };
}

export async function GET() {
  try {
    // 모더레이터 권한 확인
    await requireModerator();

    // 성능 데이터 조회
    const performanceData = generateMockPerformanceData();

    return NextResponse.json({
      success: true,
      data: performanceData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 권한 에러 처리
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('권한')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    if (errorMessage.includes('Forbidden') || errorMessage.includes('moderator')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 403 }
      );
    }

    // 기타 에러
    console.error('Performance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
