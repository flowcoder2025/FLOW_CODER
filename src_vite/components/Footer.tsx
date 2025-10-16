import { Code, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6" />
              <span className="text-lg">Vibe Coding</span>
            </div>
            <p className="text-sm text-muted-foreground">
              개발자들을 위한 영감이 넘치는 공간. 함께 코딩하고, 배우고, 성장하는 커뮤니티.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm">제품</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">대시보드</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">프로젝트 관리</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">코드 리뷰</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API 문서</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-sm">커뮤니티</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">포럼</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">이벤트</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">블로그</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm">지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">도움말</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">문의하기</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">상태 페이지</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">개발자 가이드</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Vibe Coding. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-primary transition-colors">이용약관</a>
            <a href="#" className="hover:text-primary transition-colors">쿠키 정책</a>
          </div>
        </div>
      </div>
    </footer>
  );
}