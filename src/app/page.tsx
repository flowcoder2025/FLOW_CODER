import { FeaturedProjectsServer } from "@/components/FeaturedProjectsServer";
import { CommunityPreviewServer } from "@/components/CommunityPreviewServer";
import { LatestNews } from "@/components/LatestNews";

export default function HomePage() {
  return (
    <>
      <CommunityPreviewServer />
      <LatestNews />
      <FeaturedProjectsServer />
    </>
  );
}
