import { Button } from "./ui/button";
import { Code, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-8 h-8" />
          <span className="text-xl">Vibe Coding</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="hover:text-primary transition-colors">홈</a>
          <a href="#tech" className="hover:text-primary transition-colors">기술</a>
          <a href="#projects" className="hover:text-primary transition-colors">프로젝트</a>
          <a href="#community" className="hover:text-primary transition-colors">커뮤니티</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline">로그인</Button>
          <Button>시작하기</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#home" className="hover:text-primary transition-colors">홈</a>
            <a href="#tech" className="hover:text-primary transition-colors">기술</a>
            <a href="#projects" className="hover:text-primary transition-colors">프로젝트</a>
            <a href="#community" className="hover:text-primary transition-colors">커뮤니티</a>
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