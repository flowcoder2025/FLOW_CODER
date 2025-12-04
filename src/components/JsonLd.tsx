"use client";

/**
 * JSON-LD Structured Data 컴포넌트
 *
 * 구글 검색 결과에서 풍부한 스니펫을 표시하기 위한 구조화된 데이터
 * - Organization: 조직 정보
 * - WebSite: 웹사이트 정보 및 검색 기능
 * - BreadcrumbList: 페이지 계층 구조
 */

interface JsonLdProps {
  type?: "website" | "organization" | "article";
}

export function JsonLd({ type = "website" }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://flow-coder.com";

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FlowCoder",
    alternateName: "플로우코더",
    url: baseUrl,
    logo: `${baseUrl}/FlowCoder.png`,
    description: "AI와 함께하는 바이브 코딩 커뮤니티",
    sameAs: [
      "https://github.com/flowcoder2025",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Korean", "English"],
    },
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FlowCoder",
    alternateName: "플로우코더",
    url: baseUrl,
    description: "AI 도구를 활용한 바이브 코딩 커뮤니티",
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "FlowCoder",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/FlowCoder.png`,
      },
    },
  };

  // BreadcrumbList Schema (홈페이지용)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}

/**
 * 게시글용 Article Schema
 */
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  authorName: string;
  datePublished: string;
  dateModified: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  authorName,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://flow-coder.com";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    image: imageUrl || `${baseUrl}/og-image.jpg`,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "FlowCoder",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/FlowCoder.png`,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  );
}
