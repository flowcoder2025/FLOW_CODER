import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Github, ExternalLink, Star, GitFork } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "현대적인 온라인 쇼핑몰 솔루션. React, Node.js, PostgreSQL을 사용하여 구축된 확장 가능한 플랫폼입니다.",
    image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBjb21wdXRlciUyMHNldHVwfGVufDF8fHx8MTc1OTExODI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techs: ["React", "Node.js", "PostgreSQL", "Stripe"],
    stars: 234,
    forks: 45,
    featured: true
  },
  {
    title: "AI Chat Bot",
    description: "OpenAI GPT를 활용한 지능형 챗봇. 자연어 처리와 컨텍스트 이해 기능을 제공합니다.",
    image: "https://images.unsplash.com/photo-1582005450386-52b25f82d9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NTkxMTgyOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techs: ["Python", "OpenAI", "FastAPI", "Docker"],
    stars: 189,
    forks: 32
  },
  {
    title: "Mobile Finance App",
    description: "React Native로 개발된 개인 재정 관리 앱. 실시간 거래 추적과 예산 관리 기능을 제공합니다.",
    image: "https://images.unsplash.com/photo-1628017974725-18928e8e8211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwb2ZmaWNlfGVufDF8fHx8MTc1OTA4NzUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    techs: ["React Native", "Firebase", "Expo", "TypeScript"],
    stars: 156,
    forks: 28
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">
            주목할 만한 프로젝트들
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            커뮤니티에서 만들어진 혁신적인 프로젝트들을 탐험하고 영감을 얻어보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className={`group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${project.featured ? 'lg:col-span-2 lg:row-span-1' : ''}`}>
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
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
                  <h3 className="text-xl">{project.title}</h3>
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