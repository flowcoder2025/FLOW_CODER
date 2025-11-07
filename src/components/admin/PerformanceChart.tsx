'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * 성능 모니터링 차트 컴포넌트
 *
 * Recharts를 사용하여 시간별 성능 메트릭을 시각화합니다.
 */

interface PerformanceMetric {
  timestamp: string;
  pageLoadTime: number;
  apiResponseTime: number;
  errorCount: number;
}

interface PerformanceChartProps {
  data: PerformanceMetric[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  // 시간 포맷팅 (시:분)
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 차트 데이터 변환
  const chartData = data.map(item => ({
    time: formatTime(item.timestamp),
    '페이지 로드 시간 (ms)': Math.round(item.pageLoadTime),
    'API 응답 시간 (ms)': Math.round(item.apiResponseTime),
    '에러 수': item.errorCount,
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="time"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="페이지 로드 시간 (ms)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="API 응답 시간 (ms)"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="에러 수"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
