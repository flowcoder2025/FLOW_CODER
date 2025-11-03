"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TermsSection } from "@/types/terms";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  sections: TermsSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Intersection Observer로 현재 보이는 섹션 추적
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -35% 0px",
        threshold: 0.5,
      }
    );

    // 모든 섹션 헤딩 관찰
    const headings = document.querySelectorAll("h2[id], h3[id]");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <Card className="sticky top-24 hidden lg:block">
      <CardHeader>
        <CardTitle className="text-lg">목차</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-240px)]">
          <nav className="space-y-1">
            {sections.map((section) => (
              <div key={section.id}>
                <Link
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={cn(
                    "block py-2 px-3 text-sm rounded-md hover:bg-accent transition-colors",
                    activeId === section.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {section.title}
                </Link>
                {section.subsections && (
                  <div className="ml-4 space-y-1 mt-1">
                    {section.subsections.map((subsection) => (
                      <Link
                        key={subsection.id}
                        href={`#${subsection.id}`}
                        onClick={(e) => handleClick(e, subsection.id)}
                        className={cn(
                          "block py-1.5 px-3 text-xs rounded-md hover:bg-accent transition-colors",
                          activeId === subsection.id
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {subsection.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
