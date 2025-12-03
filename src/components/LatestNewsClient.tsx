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
          {items.map((news, index) => (
            <Link key={index} href={`/community/${news.categorySlug}/${news.id}`}>
              <Card className="h-[380px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
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
                <CardContent className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      {news.category}
                    </Badge>
                    {news.trending && (
                      <div className="flex items-center gap-1 text-xs text-orange-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>인기</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2 leading-tight text-white line-clamp-2">
                    {news.title}
                  </h3>

                  <p className="text-sm text-white/80 mb-4 line-clamp-2">
                    {news.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Clock className="w-3 h-3" />
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
