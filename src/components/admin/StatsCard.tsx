import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  /**
   * 통계 항목 제목
   * 예: "총 사용자 수", "총 게시글 수"
   */
  title: string;

  /**
   * 통계 값 (숫자)
   */
  value: number;

  /**
   * lucide-react 아이콘 컴포넌트
   */
  icon: LucideIcon;

  /**
   * 아이콘 색상 (선택적)
   * 예: "text-blue-600", "text-green-600"
   */
  iconColor?: string;

  /**
   * 증감 표시 (선택적)
   * 예: "+12%", "-5%"
   */
  trend?: string;
}

/**
 * 관리자 대시보드 통계 카드 컴포넌트
 *
 * - shadcn/ui Card 기반
 * - 아이콘 + 제목 + 숫자 표시
 * - 선택적 증감 표시
 */
export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}
