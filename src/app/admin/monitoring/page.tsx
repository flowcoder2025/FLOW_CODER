import { requireModerator } from '@/lib/admin-middleware';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertCircle, Clock, Users } from 'lucide-react';
import PerformanceChart from '@/components/admin/PerformanceChart';

/**
 * 어드민 모니터링 대시보드
 *
 * 시스템 성능과 에러를 실시간으로 모니터링합니다.
 */

interface PerformanceData {
  overview: {
    avgPageLoadTime: number;
    avgApiResponseTime: number;
    totalErrors: number;
    activeUsers: number;
  };
  timeline: {
    timestamp: string;
    pageLoadTime: number;
    apiResponseTime: number;
    errorCount: number;
  }[];
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

async function getPerformanceData(): Promise<PerformanceData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/monitoring/performance`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch performance data:', res.status);
      return null;
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return null;
  }
}

export default async function MonitoringPage() {
  // 모더레이터 권한 확인
  await requireModerator();

  // 성능 데이터 조회
  const performanceData = await getPerformanceData();

  if (!performanceData) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">시스템 모니터링</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              성능 데이터를 불러올 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { overview, timeline, topErrors, pagePerformance } = performanceData;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">시스템 모니터링</h1>
        <p className="text-muted-foreground mt-2">
          실시간 성능 메트릭 및 에러 추적
        </p>
      </div>

      {/* 성능 개요 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              평균 페이지 로드
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.avgPageLoadTime.toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.avgPageLoadTime < 1000 ? '✓ 목표 달성' : '⚠ 최적화 필요'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              평균 API 응답
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.avgApiResponseTime.toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.avgApiResponseTime < 300 ? '✓ 양호' : '⚠ 점검 필요'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              총 에러 (24시간)
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.totalErrors}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              최근 24시간 기준
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              활성 사용자
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              현재 온라인
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 성능 트렌드 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>성능 트렌드 (최근 24시간)</CardTitle>
          <CardDescription>
            페이지 로드 시간, API 응답 시간, 에러 발생 추이
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceChart data={timeline} />
        </CardContent>
      </Card>

      {/* 하단 2열 레이아웃 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 주요 에러 */}
        <Card>
          <CardHeader>
            <CardTitle>주요 에러 Top 5</CardTitle>
            <CardDescription>
              최근 24시간 동안 가장 많이 발생한 에러
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topErrors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {error.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      최종 발생: {new Date(error.lastOccurred).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                      {error.count}회
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 페이지별 성능 */}
        <Card>
          <CardHeader>
            <CardTitle>페이지별 성능</CardTitle>
            <CardDescription>
              평균 로드 시간 및 방문 수
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pagePerformance.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {page.path}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {page.visits.toLocaleString()} 방문
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {page.avgLoadTime.toFixed(0)}ms
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {page.avgLoadTime < 1000 ? '✓' : '⚠'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentry 통합 안내 */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Sentry 연동 안내</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            실시간 에러 추적을 위해 Sentry를 연동하세요:
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Sentry 프로젝트 생성 (https://sentry.io)</li>
            <li>.env 파일에 NEXT_PUBLIC_SENTRY_DSN 설정</li>
            <li>서버 재시작</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
