import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getHomePageData } from "@/lib/data-access";
import { FeaturedProjectsClient } from "@/components/FeaturedProjectsClient";
import { Skeleton } from "@/components/ui/skeleton";

// 3분마다 재검증 (홈페이지 데이터와 동기화)
export const revalidate = 180;

// 캐러셀 컴포넌트 동적 로드 (embla-carousel 번들 분리)
const CommunityPreviewClient = dynamic(
  () => import("@/components/CommunityPreviewClient").then(mod => ({ default: mod.CommunityPreviewClient })),
  {
    loading: () => <CommunityPreviewSkeleton />,
    ssr: true,
  }
);

/**
 * 캐러셀 로딩 스켈레톤
 */
function CommunityPreviewSkeleton() {
  return (
    <section className="py-8 md:py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[320px] md:h-[360px] rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 홈페이지
 * - 병렬 데이터 페칭으로 성능 최적화
 * - 3분 캐싱 적용
 * - 캐러셀 동적 로드로 초기 번들 최적화
 */
export default async function HomePage() {
  // 모든 홈페이지 데이터를 병렬로 가져옴 (핵심 최적화!)
  const { featuredPosts, projects } = await getHomePageData();

  // 광고 카드 추가
  const adCard = {
    type: 'ad' as const,
    title: 'FlowCoder와 함께 성장하세요',
    description: '비개발자들을 위한 커뮤니티',
    action: '지금 참여하기',
    gradient: 'from-blue-500 to-purple-600',
  };

  const communityItems = [...featuredPosts, adCard];

  return (
    <>
      <Suspense fallback={<CommunityPreviewSkeleton />}>
        <CommunityPreviewClient items={communityItems} />
      </Suspense>
      <FeaturedProjectsClient projects={projects} />
    </>
  );
}
