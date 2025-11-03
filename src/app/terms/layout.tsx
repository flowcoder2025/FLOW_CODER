import { ReactNode } from "react";

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </div>
    </div>
  );
}
