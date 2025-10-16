"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Code, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Button variant="outline">로그인</Button>
          <Button>시작하기</Button>
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
              <Button variant="outline">로그인</Button>
              <Button>시작하기</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}