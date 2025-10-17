"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Code, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code className="w-8 h-8" />
          <span className="text-xl font-semibold">Vibe Coding</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-primary transition-colors">홈</Link>
          <Link href="/community" className="hover:text-primary transition-colors">커뮤니티</Link>
          <Link href="/projects" className="hover:text-primary transition-colors">프로젝트</Link>
          <Link href="/help" className="hover:text-primary transition-colors">Help me</Link>
          <Link href="/news" className="hover:text-primary transition-colors">뉴스</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
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
            <Link
              href="/projects"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              프로젝트
            </Link>
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