"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Heart, MessageSquare, ChevronLeft, ChevronRight, TrendingUp, Sparkles, Flame } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

type PostItem = {
  type: 'post';
  id: string;
  categorySlug: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  title: string;
  excerpt: string;
  tags: string[];
  likes: number;
  comments: number;
  timeAgo: string;
  trending: boolean;
  thumbnail: string;
  /** 캐러셀 배지: 'new' = 최신 게시글, 'best' = 베스트 게시글 */
  badge?: 'new' | 'best';
};

type AdItem = {
  type: 'ad';
  title: string;
  description: string;
  action: string;
  gradient: string;
};

type CommunityItem = PostItem | AdItem;

interface CommunityPreviewClientProps {
  items: CommunityItem[];
}

export function CommunityPreviewClient({ items }: CommunityPreviewClientProps) {
  // 무한 루프를 위해 아이템 복제
  const duplicatedPosts = [...items, ...items, ...items];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section id="community" className="py-8 md:py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* 좌상단 토픽 배지 */}
        <div className="mb-4">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 text-xs font-semibold border-0 shadow-md pointer-events-none">
            🔥 오늘의 토픽
          </Badge>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -mr-6">
              {duplicatedPosts.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-6">
                  {item.type === "post" ? (
                    <Link href={`/community/${item.categorySlug}/${item.id}`} className="block h-full">
                      <Card className="h-[320px] md:h-[360px] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative">
                      {/* 배경 이미지 - Next.js Image로 최적화 */}
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
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
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8 ring-2 ring-white/20 flex-shrink-0">
                            <AvatarImage src={item.author.avatar} />
                            <AvatarFallback className="text-xs">{item.author.name[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-medium text-white">{item.author.name}</span>
                              {item.badge === 'new' && (
                                <Badge variant="secondary" className="text-[10px] gap-0.5 bg-green-500/90 text-white border-0 px-1.5 py-0.5">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  New
                                </Badge>
                              )}
                              {item.badge === 'best' && (
                                <Badge variant="secondary" className="text-[10px] gap-0.5 bg-orange-500/90 text-white border-0 px-1.5 py-0.5">
                                  <Flame className="w-2.5 h-2.5" />
                                  Best
                                </Badge>
                              )}
                              {!item.badge && item.trending && (
                                <Badge variant="secondary" className="text-[10px] gap-0.5 bg-orange-500/90 text-white border-0 px-1.5 py-0.5">
                                  <TrendingUp className="w-2.5 h-2.5" />
                                  인기
                                </Badge>
                              )}
                            </div>

                            <div className="text-[10px] text-white/70 mb-1.5">{item.author.role}</div>
                            <h3 className="font-semibold mb-1.5 leading-tight text-white text-sm md:text-base line-clamp-2">{item.title}</h3>
                            <p className="text-xs text-white/80 mb-2 line-clamp-2 hidden md:block">
                              {item.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
                                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-[10px] bg-white/20 text-white border-0 backdrop-blur-sm px-1.5 py-0.5">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-white/70">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {item.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {item.comments}
                                </div>
                              </div>
                            </div>

                            <div className="text-[10px] text-white/60 mt-1.5">{item.timeAgo}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    </Link>
                  ) : (
                    <Card className={`h-[320px] md:h-[360px] bg-gradient-to-br ${item.gradient} text-white border-0`}>
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                        <h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3>
                        <p className="text-white/90 mb-4 text-sm md:text-base">{item.description}</p>
                        <Button size="default" className="bg-white text-purple-900 hover:bg-white/90 hover:text-purple-950 font-semibold shadow-lg">
                          {item.action}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - 무한 루프이므로 항상 표시 */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* 페이지네이션 인디케이터 (우하단) */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
            {(selectedIndex % items.length) + 1} / {items.length}
          </div>
        </div>
      </div>
    </section>
  );
}
