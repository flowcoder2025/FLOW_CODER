import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/FlowCoder_White_-removebg-preview.png"
                alt="FlowCoder"
                width={120}
                height={40}
                style={{ height: 'auto' }}
                className="w-[120px] dark:hidden"
              />
              <Image
                src="/FlowCoder_Dark_-removebg-preview.png"
                alt="FlowCoder"
                width={120}
                height={40}
                style={{ height: 'auto' }}
                className="w-[120px] hidden dark:block"
              />
              <span className="text-lg font-semibold">FlowCoder</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              개발자들을 위한 영감이 넘치는 공간. 함께 코딩하고, 배우고, 성장하는 커뮤니티.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@vibecoding.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">제품</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  대시보드
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">
                  프로젝트 관리
                </Link>
              </li>
              <li>
                <Link href="/code-review" className="hover:text-primary transition-colors">
                  코드 리뷰
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-primary transition-colors">
                  API 문서
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">커뮤니티</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/community" className="hover:text-primary transition-colors">
                  포럼
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.gg/vibecoding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  이벤트
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  블로그
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  도움말
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary transition-colors">
                  상태 페이지
                </Link>
              </li>
              <li>
                <Link href="/developer-guide" className="hover:text-primary transition-colors">
                  개발자 가이드
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">법률 및 정책</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/terms/privacy" className="hover:text-primary transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms/community" className="hover:text-primary transition-colors">
                  커뮤니티 가이드라인
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary transition-colors">
                  쿠키 정책
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 FlowCoder. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms/privacy" className="hover:text-primary transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              이용약관
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              쿠키 정책
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
