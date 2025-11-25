'use client';

import dynamic from 'next/dynamic';

// 동적 Import: recharts 라이브러리는 무겁기 때문에 lazy load
const PerformanceChart = dynamic(
  () => import('@/components/admin/PerformanceChart'),
  {
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground">
        차트 로딩 중...
      </div>
    ),
    ssr: false, // 차트는 클라이언트에서만 렌더링
  }
);

interface PerformanceMetric {
  timestamp: string;
  pageLoadTime: number;
  apiResponseTime: number;
  errorCount: number;
}

interface PerformanceChartWrapperProps {
  data: PerformanceMetric[];
}

export default function PerformanceChartWrapper({ data }: PerformanceChartWrapperProps) {
  return <PerformanceChart data={data} />;
}
