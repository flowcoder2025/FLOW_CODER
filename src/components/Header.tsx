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
import { Code, Menu, X, LogOut, User, Settings } from "lucide-react";
import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  postCount: number;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: session, status } = useSession();

  // 카테고리 목록 로드
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((response) => {
        if (response.success && response.data?.categories) {
          setCategories(response.data.categories);
        }
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
      });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code className="w-8 h-8" />
          <span className="text-xl font-semibold">Vibe Coding</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <Link href="/community" className="hover:text-primary transition-colors">커뮤니티</Link>

          {/* 카테고리별 개별 버튼 */}
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/community/${category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
            </Link>
          ))}

          <Link href="/help" className="hover:text-primary transition-colors">Help me</Link>
          <Link href="/news" className="hover:text-primary transition-colors">뉴스</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
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
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              홈
            </Link>
            <Link
              href="/community"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              커뮤니티
            </Link>

            {/* 카테고리별 개별 링크 */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/community/${category.slug}`}
                className="hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </Link>
            ))}
            <Link
              href="/help"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Help me
            </Link>
            <Link
              href="/news"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              뉴스
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