import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { MessageCircle, Users, Calendar, Trophy, Heart, MessageSquare } from "lucide-react";

const communityStats = [
  { icon: Users, label: "활성 멤버", value: "10,234" },
  { icon: MessageCircle, label: "일일 메시지", value: "1,567" },
  { icon: Calendar, label: "월간 이벤트", value: "24" },
  { icon: Trophy, label: "완료된 챌린지", value: "456" }
];

const recentPosts = [
  {
    author: {
      name: "김개발",
      avatar: "/api/placeholder/32/32",
      role: "Senior Frontend Developer"
    },
    title: "React 19의 새로운 기능들에 대한 리뷰",
    excerpt: "새로 출시된 React 19를 실제 프로젝트에 적용해보면서 느낀 점들을 공유합니다...",
    tags: ["React", "Frontend", "Review"],
    likes: 42,
    comments: 18,
    timeAgo: "2시간 전"
  },
  {
    author: {
      name: "박풀스택",
      avatar: "/api/placeholder/32/32",
      role: "Fullstack Engineer"
    },
    title: "AI를 활용한 코드 리뷰 자동화 경험담",
    excerpt: "OpenAI API를 활용해서 팀의 코드 리뷰 프로세스를 개선한 과정을 소개합니다...",
    tags: ["AI", "DevOps", "Productivity"],
    likes: 67,
    comments: 25,
    timeAgo: "4시간 전"
  },
  {
    author: {
      name: "이모바일",
      avatar: "/api/placeholder/32/32",
      role: "Mobile Developer"
    },
    title: "Flutter vs React Native 2024년 비교분석",
    excerpt: "두 프레임워크의 최신 버전을 실제 프로젝트에서 비교 테스트한 결과입니다...",
    tags: ["Flutter", "React Native", "Mobile"],
    likes: 38,
    comments: 12,
    timeAgo: "6시간 전"
  }
];

export function Community() {
  return (
    <section id="community" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">
            활발한 개발자 커뮤니티
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            전 세계 개발자들과 함께 지식을 나누고, 협업하며, 함께 성장하는 공간입니다
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl mb-6">최근 인기 포스트</h3>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{post.author.name}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                        </div>
                        
                        <h4 className="text-sm text-muted-foreground mb-2">{post.author.role}</h4>
                        <h3 className="mb-2 leading-tight">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {post.comments}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Join Community */}
          <div>
            <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl">커뮤니티에 참여하세요</h3>
                  <p className="text-muted-foreground">
                    전 세계 10,000명 이상의 개발자들과 함께 학습하고 성장하세요
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm">실시간 채팅</div>
                      <div className="text-xs text-muted-foreground">24/7 활발한 토론</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm">코딩 챌린지</div>
                      <div className="text-xs text-muted-foreground">주간 프로그래밍 대회</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm">멘토링</div>
                      <div className="text-xs text-muted-foreground">1:1 개발자 멘토링</div>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full">
                  지금 참여하기
                </Button>

                <p className="text-xs text-muted-foreground">
                  무료로 시작하고, 언제든 업그레이드 가능
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}