import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, TrendingUp } from "lucide-react";

const newsItems = [
  {
    title: "Next.js 15 정식 출시: 새로운 기능과 개선사항",
    excerpt: "성능 향상과 개발자 경험 개선을 중심으로 한 메이저 업데이트",
    category: "Framework",
    date: "2024-01-15",
    trending: true
  },
  {
    title: "TypeScript 5.4 베타 버전 공개",
    excerpt: "타입 추론 개선과 새로운 유틸리티 타입 추가",
    category: "Language",
    date: "2024-01-14",
    trending: false
  },
  {
    title: "React Server Components 실전 활용 가이드",
    excerpt: "커뮤니티 멤버가 공유한 실무 적용 경험담",
    category: "Tutorial",
    date: "2024-01-13",
    trending: true
  }
];

export function LatestNews() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            최신 뉴스
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            개발 트렌드와 커뮤니티 소식을 빠르게 확인하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary">{news.category}</Badge>
                  {news.trending && (
                    <div className="flex items-center gap-1 text-xs text-orange-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>인기</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2 leading-tight">
                  {news.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  {news.excerpt}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{news.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
