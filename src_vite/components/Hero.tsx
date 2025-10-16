import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Play, Github, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="pt-20 pb-16 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">새로운 프로젝트가 진행 중입니다</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight">
                코딩의 새로운
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  바이브
                </span>
                를 경험하세요
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                개발자들을 위한 영감이 넘치는 공간. 함께 코딩하고, 배우고, 성장하는 커뮤니티에 참여하세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                시작하기
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                데모 보기
              </Button>
              <Button variant="ghost" size="lg" className="gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="text-2xl">10K+</div>
                <div className="text-sm text-muted-foreground">활성 개발자</div>
              </div>
              <div>
                <div className="text-2xl">500+</div>
                <div className="text-sm text-muted-foreground">완료된 프로젝트</div>
              </div>
              <div>
                <div className="text-2xl">50+</div>
                <div className="text-sm text-muted-foreground">지원 언어</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1653564142048-d5af2cf9b50f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTkwOTUwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="코딩 워크스페이스"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-background p-4 rounded-xl shadow-lg border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">실시간 협업</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background p-4 rounded-xl shadow-lg border">
              <div className="text-sm text-muted-foreground">현재 온라인</div>
              <div className="text-xl">1,234명</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}