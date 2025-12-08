"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu, X, LogOut, User, Settings, Home, Users, Lightbulb, Palette, MessageSquare, Code, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  postCount: number;
}

interface HeaderProps {
  categories: Category[];
}

export function Header({ categories }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  useTheme(); // 테마 훅 초기화
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // 카테고리 slug에 따른 아이콘 매핑
  const getCategoryIcon = (slug: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'tips': <Lightbulb className="h-4 w-4" />,
      'showcase': <Palette className="h-4 w-4" />,
      'free-board': <MessageSquare className="h-4 w-4" />,
      'flowcoder-feed': <Code className="h-4 w-4" />,
    };
    return iconMap[slug];
  };

  // 클라이언트에서만 테마 이미지 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {mounted && (
            <Image
              src="/FlowCoder.png"
              alt="FlowCoder"
              width={40}
              height={40}
              style={{ height: 'auto' }}
              className="w-[40px]"
              priority
            />
          )}
          <span className="text-xl font-semibold">FlowCoder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-2 transition-colors pb-1 ${
              pathname === "/"
                ? "text-foreground font-bold border-b-2 border-current"
                : "hover:text-primary"
            }`}
          >
            <Home className="h-4 w-4" />
            홈
          </Link>

          {/* 커뮤니티 드롭다운 메뉴 (flowcoder-feed 제외) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-2 transition-colors pb-1 ${
                  pathname.startsWith("/community") && !pathname.startsWith("/community/flowcoder-feed")
                    ? "text-foreground font-bold border-b-2 border-current"
                    : "hover:text-primary"
                }`}
              >
                <Users className="h-4 w-4" />
                커뮤니티
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/community" className="cursor-pointer flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  전체 게시글
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories
                .filter((category) => category.slug !== 'flowcoder-feed')
                .map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link
                      href={`/community/${category.slug}`}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      {getCategoryIcon(category.slug)}
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* FlowCoder Feed 별도 링크 */}
          <Link
            href="/community/flowcoder-feed"
            className={`flex items-center gap-2 transition-colors pb-1 ${
              pathname.startsWith("/community/flowcoder-feed")
                ? "text-foreground font-bold border-b-2 border-current"
                : "hover:text-primary"
            }`}
          >
            <Code className="h-4 w-4" />
            Feed
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />
          {status === "authenticated" && session?.user && <NotificationBell />}
          {status === "authenticated" && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                    <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${session.user.id}`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    프로필
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">시작하기</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          {status === "authenticated" && session?.user && <NotificationBell />}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 토글"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 transition-colors pl-3 ${
                pathname === "/"
                  ? "text-foreground font-bold border-l-2 border-current"
                  : "hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              홈
            </Link>

            {/* 커뮤니티 섹션 (flowcoder-feed 제외) */}
            <div className="flex flex-col gap-2">
              <Link
                href="/community"
                className={`flex items-center gap-2 transition-colors pl-3 ${
                  pathname === "/community"
                    ? "text-foreground font-bold border-l-2 border-current"
                    : "hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                커뮤니티
              </Link>

              {/* 카테고리별 하위 링크 (flowcoder-feed 제외) */}
              <div className="flex flex-col gap-2 pl-6">
                {categories
                  .filter((category) => category.slug !== 'flowcoder-feed')
                  .map((category) => (
                  <Link
                    key={category.id}
                    href={`/community/${category.slug}`}
                    className={`flex items-center gap-2 transition-colors pl-3 text-sm ${
                      pathname.startsWith(`/community/${category.slug}`)
                        ? "text-foreground font-bold border-l-2 border-current"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {getCategoryIcon(category.slug)}
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* FlowCoder Feed 별도 링크 */}
            <Link
              href="/community/flowcoder-feed"
              className={`flex items-center gap-2 transition-colors pl-3 ${
                pathname.startsWith("/community/flowcoder-feed")
                  ? "text-foreground font-bold border-l-2 border-current"
                  : "hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Code className="h-4 w-4" />
              Feed
            </Link>

            <div className="flex flex-col gap-2 mt-4">
              {status === "authenticated" && session?.user ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href={`/profile/${session.user.id}`}>프로필</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/settings">설정</Link>
                  </Button>
                  <Button variant="outline" onClick={() => signOut()}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/auth/signin">로그인</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">시작하기</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}