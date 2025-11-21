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
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            주목할 만한 프로젝트들
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            커뮤니티에서 만들어진 혁신적인 프로젝트들을 탐험하고 영감을 얻어보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link key={index} href={`/community/${project.categorySlug}/${project.id}`}>
            <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${project.featured ? 'lg:col-span-2 lg:row-span-1' : ''}`}>
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  width={1080}
                  height={project.featured ? 512 : 384}
                  className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${project.featured ? 'h-64' : 'h-48'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-yellow-900">추천 프로젝트</Badge>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Github className="w-4 h-4" />
                      Code
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1">
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {project.stars}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      {project.forks}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.techs.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            더 많은 프로젝트 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
