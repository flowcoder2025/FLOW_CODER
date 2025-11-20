"use client";

import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Heart, MessageSquare, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
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
    <section id="community" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* 좌상단 토픽 배지 */}
        <div className="mb-6">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 text-base font-bold hover:from-orange-600 hover:to-red-600 border-0 shadow-lg">
            🔥 오늘의 토픽
          </Badge>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {duplicatedPosts.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-6">
                  {item.type === "post" ? (
                    <Link href={`/community/${item.categorySlug}/${item.id}`} className="block h-full">
                      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative min-h-[400px]">
                      {/* 배경 이미지 */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.thumbnail})` }}
                      />

                      {/* 어두운 오버레이 (텍스트 가독성) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                      {/* 텍스트 콘텐츠 */}
                      <CardContent className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10 ring-2 ring-white/20">
                            <AvatarImage src={item.author.avatar} />
                            <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">{item.author.name}</span>
                              {item.trending && (
                                <Badge variant="secondary" className="text-xs gap-1 bg-orange-500/90 text-white border-0">
                                  <TrendingUp className="w-3 h-3" />
                                  인기
                                </Badge>
                              )}
                            </div>

                            <div className="text-xs text-white/70 mb-2">{item.author.role}</div>
                            <h3 className="font-semibold mb-2 leading-tight text-white text-lg">{item.title}</h3>
                            <p className="text-sm text-white/80 mb-3 line-clamp-2">
                              {item.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs bg-white/20 text-white border-0 backdrop-blur-sm">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-white/70">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {item.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  {item.comments}
                                </div>
                              </div>
                            </div>

                            <div className="text-xs text-white/60 mt-2">{item.timeAgo}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    </Link>
                  ) : (
                    <Card className={`h-full bg-gradient-to-br ${item.gradient} text-white border-0`}>
                      <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                        <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                        <p className="text-white/90 mb-6">{item.description}</p>
                        <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
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
