import { ReactNode } from "react";
import "./terms-layout.css";

/**
 * 약관 페이지 레이아웃
 * - 헤더와 푸터를 숨기고 전체 화면으로 표시
 */
export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="terms-page-wrapper min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </div>
    </div>
  );
}
