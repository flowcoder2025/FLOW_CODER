"use client";

import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback";
import { Github, ExternalLink, Star, GitFork } from "lucide-react";

type Project = {
  id: string;
  categorySlug: string;
  title: string;
  description: string;
  image: string;
  techs: string[];
  stars: number;
  forks: number;
  featured?: boolean;
};

interface FeaturedProjectsClientProps {
  projects: Project[];
}

export function FeaturedProjectsClient({ projects }: FeaturedProjectsClientProps) {
  return (
    <section id="projects" className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            주목할 만한 프로젝트들
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            커뮤니티에서 만들어진 혁신적인 프로젝트들을 탐험하고 영감을 얻어보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {projects.map((project, index) => (
            <Link key={index} href={`/community/${project.categorySlug}/${project.id}`}>
            <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className="relative overflow-hidden h-40 md:h-44">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {project.featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 text-yellow-900 text-[10px] px-2 py-0.5">추천 프로젝트</Badge>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="secondary" className="gap-1 h-7 text-xs px-2">
                      <Github className="w-3 h-3" />
                      Code
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1 h-7 text-xs px-2">
                      <ExternalLink className="w-3 h-3" />
                      Demo
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base md:text-lg font-semibold line-clamp-1 flex-1 pr-2">{project.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3" />
                      {project.stars}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <GitFork className="w-3 h-3" />
                      {project.forks}
                    </div>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 max-h-[44px] overflow-hidden">
                  {project.techs.slice(0, 3).map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-[10px] px-2 py-0.5">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6 md:mt-8">
          <Button size="default" variant="outline">
            더 많은 프로젝트 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
