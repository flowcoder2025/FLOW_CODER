"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, TrendingUp } from "lucide-react";
import type { NewsItem } from "@/lib/data-access";

interface LatestNewsClientProps {
  items: NewsItem[];
}

/**
 * LatestNews Client Component
 * 서버에서 전달받은 뉴스 데이터를 렌더링
 */
export function LatestNewsClient({ items }: LatestNewsClientProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            최신 뉴스
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            개발 트렌드와 커뮤니티 소식을 빠르게 확인하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((news, index) => (
            <Link key={index} href={`/community/${news.categorySlug}/${news.id}`}>
              <Card className="h-[260px] md:h-[280px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
                {/* 배경 이미지 - Next.js Image로 최적화 */}
                <Image
                  src={news.thumbnail}
                  alt={news.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={75}
                />

                {/* 어두운 오버레이 (텍스트 가독성) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                {/* 텍스트 콘텐츠 */}
                <CardContent className="relative z-10 p-4 md:p-5 h-full flex flex-col justify-end text-white">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm text-[10px] px-2 py-0.5">
                      {news.category}
                    </Badge>
                    {news.trending && (
                      <div className="flex items-center gap-1 text-[10px] text-orange-400">
                        <TrendingUp className="w-2.5 h-2.5" />
                        <span>인기</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-semibold mb-1.5 leading-tight text-white line-clamp-2">
                    {news.title}
                  </h3>

                  <p className="text-xs text-white/80 mb-2 line-clamp-2 hidden md:block">
                    {news.excerpt}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{news.date}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
