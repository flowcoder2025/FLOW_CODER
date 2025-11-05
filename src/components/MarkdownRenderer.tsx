"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  { ssr: false }
);

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * 마크다운 콘텐츠를 렌더링하는 컴포넌트
 * @uiw/react-markdown-preview를 사용하여 GitHub 스타일의 마크다운 렌더링 제공
 */
export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className}>
        <p className="text-muted-foreground">콘텐츠를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <article className={className}>
      <MarkdownPreview
        source={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeSanitize]}
        style={{
          backgroundColor: "transparent",
          color: "inherit",
          fontFamily: "inherit",
        }}
        wrapperElement={{
          "data-color-mode": "light"
        }}
        className="markdown-body"
      />
    </article>
  );
}
