import { requireAdmin } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, FileText, MessageSquare, Activity } from 'lucide-react';

/**
 * 관리자 대시보드 페이지
 *
 * - requireAdmin() 권한 체크 (layout.tsx에서도 체크하지만 명시적으로)
 * - 통계 카드 4개: 총 사용자, 게시글, 댓글, DAU
 * - Server Component로 직접 Prisma 쿼리
 */
export default async function AdminDashboardPage() {
  // 관리자 권한 확인 (layout.tsx에서도 체크하지만 명시적으로)
  await requireAdmin();

  // 24시간 전 시각 계산
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  // Prisma 병렬 쿼리로 성능 최적화
  const [totalUsers, totalPosts, totalComments, newUsersToday] =
    await Promise.all([
      // 총 사용자 수
      prisma.user.count(),

      // 총 게시글 수
      prisma.post.count(),

      // 총 댓글 수
      prisma.comment.count(),

      // 오늘의 신규 가입자 (최근 24시간 동안 가입한 사용자)
      prisma.user.count({
        where: {
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
      }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        <p className="text-muted-foreground">
          플랫폼 전체 통계 및 활동 현황
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 사용자 수"
          value={totalUsers}
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="총 게시글 수"
          value={totalPosts}
          icon={FileText}
          iconColor="text-green-600"
        />
        <StatsCard
          title="총 댓글 수"
          value={totalComments}
          icon={MessageSquare}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="오늘의 신규 가입자"
          value={newUsersToday}
          icon={Activity}
          iconColor="text-orange-600"
        />
      </div>

      {/* 최근 활동 섹션 - 향후 추가 예정 */}
      {/* <div className="mt-8">
        <RecentActivity />
      </div> */}
    </div>
  );
}
