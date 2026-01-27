import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getBlogHomePageData } from "@/lib/data-access";
import { BlogFeedSection } from "@/components/BlogFeedSection";
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
 * 홈페이지 (블로그형)
 * - 캐러셀: 최신 2개(New) + 베스트 3개(Best)
 * - 블로그 피드: flowcoder-feed 카테고리 게시글
 * - 병렬 데이터 페칭으로 성능 최적화
 * - 3분 캐싱 적용
 */
export default async function HomePage() {
  // 모든 홈페이지 데이터를 병렬로 가져옴 (핵심 최적화!)
  const { carouselPosts, blogFeedPosts } = await getBlogHomePageData();

  return (
    <>
      {/* 캐러셀 (최상단): 최신 2개 + 베스트 3개 */}
      <Suspense fallback={<CommunityPreviewSkeleton />}>
        <CommunityPreviewClient items={carouselPosts} />
      </Suspense>

      {/* 블로그 피드: flowcoder-feed 카테고리 */}
      <BlogFeedSection posts={blogFeedPosts} />
    </>
  );
}
