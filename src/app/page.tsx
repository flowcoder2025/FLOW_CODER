import { FeaturedProjects } from "@/components/FeaturedProjects";
import { CommunityPreview } from "@/components/CommunityPreview";
import { LatestNews } from "@/components/LatestNews";

export default function HomePage() {
  return (
    <>
      <CommunityPreview />
      <LatestNews />
      <FeaturedProjects />
    </>
  );
}
