import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, TrendingUp } from "lucide-react";

/**
 * LatestNews Server Component
 *
 * DB에서 isFeatured=true인 NEWS 타입 게시물을 조회하여 표시
 */
export async function LatestNews() {
  // isFeatured=true이고 NEWS 타입인 게시물 조회 (최신순, 최대 3개)
  const posts = await prisma.post.findMany({
    where: {
      isFeatured: true,
      postType: 'NEWS',
      deletedAt: null, // 삭제되지 않은 게시글만
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      images: {
        where: {
          isFeatured: true, // 대표 이미지만
        },
        take: 1,
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  // 뉴스 항목 변환
  const newsItems = posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.content.substring(0, 100),
    category: post.category.name,
    categorySlug: post.category.slug,
    date: post.createdAt.toLocaleDateString('ko-KR'),
    trending: post.upvotes > 50, // 추천 50개 이상이면 trending
    // 대표 이미지 우선, 없으면 랜덤 기본 이미지
    thumbnail: post.images[0]?.url || getDefaultNewsThumbnail(),
  }));
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
            <Link key={index} href={`/community/${news.categorySlug}/${news.id}`}>
            <Card className="h-[380px] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
              {/* 배경 이미지 */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${news.thumbnail})` }}
              />

              {/* 어두운 오버레이 (텍스트 가독성) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

              {/* 텍스트 콘텐츠 */}
              <CardContent className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">{news.category}</Badge>
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

/**
 * 기본 뉴스 썸네일 이미지 랜덤 선택
 */
function getDefaultNewsThumbnail(): string {
  const defaults = [
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
