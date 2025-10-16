import { Hero } from "@/components/Hero";
import { TechStack } from "@/components/TechStack";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { CommunityPreview } from "@/components/CommunityPreview";
import { LatestNews } from "@/components/LatestNews";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechStack />
      <FeaturedProjects />
      <CommunityPreview />
      <LatestNews />
    </>
  );
}
