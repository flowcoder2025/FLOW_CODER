import { getHomePageData } from "@/lib/data-access";
import { CommunityPreviewClient } from "@/components/CommunityPreviewClient";
import { FeaturedProjectsClient } from "@/components/FeaturedProjectsClient";
import { LatestNewsClient } from "@/components/LatestNewsClient";

/**
 * 홈페이지
 * - 병렬 데이터 페칭으로 성능 최적화
 * - 3분 캐싱 적용
 */
export default async function HomePage() {
  // 모든 홈페이지 데이터를 병렬로 가져옴 (핵심 최적화!)
  const { featuredPosts, newsItems, projects } = await getHomePageData();

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
      <CommunityPreviewClient items={communityItems} />
      <LatestNewsClient items={newsItems} />
      <FeaturedProjectsClient projects={projects} />
    </>
  );
}
