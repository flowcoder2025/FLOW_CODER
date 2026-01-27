import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FlowCoder - AI와 함께하는 바이브 코딩 커뮤니티",
    template: "%s | FlowCoder",
  },
  description: "FlowCoder는 AI 도구를 활용한 바이브 코딩(Vibe Coding) 커뮤니티입니다. Claude, Cursor, Windsurf 등 최신 AI 코딩 도구를 배우고, 프로젝트를 공유하며, 함께 성장하세요.",
  keywords: [
    "FlowCoder", "플로우코더", "바이브코딩", "Vibe Coding",
    "AI 코딩", "Claude", "Cursor", "Windsurf", "Copilot",
    "AI 개발", "코딩 커뮤니티", "프로그래밍", "인공지능",
    "개발자 커뮤니티", "코드 공유", "프로젝트", "Q&A"
  ],
  authors: [{ name: "FlowCoder", url: "https://flow-coder.com" }],
  creator: "FlowCoder",
  publisher: "FlowCoder",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://flow-coder.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
    },
  },
  openGraph: {
    title: "FlowCoder - AI와 함께하는 바이브 코딩 커뮤니티",
    description: "FlowCoder는 AI 도구를 활용한 바이브 코딩 커뮤니티입니다. Claude, Cursor, Windsurf 등 최신 AI 코딩 도구를 배우고, 프로젝트를 공유하세요.",
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://flow-coder.com",
    siteName: "FlowCoder",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FlowCoder - AI 바이브 코딩 커뮤니티",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowCoder - AI와 함께하는 바이브 코딩 커뮤니티",
    description: "FlowCoder는 AI 도구를 활용한 바이브 코딩 커뮤니티입니다. Claude, Cursor, Windsurf 등 AI 코딩 도구를 배우고 프로젝트를 공유하세요.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 인증 코드 (발급 후 추가)
    // google: "구글서치콘솔인증코드",
    // 네이버 웹마스터 도구 인증 코드 (발급 후 추가)
    // other: {
    //   "naver-site-verification": "네이버웹마스터도구인증코드",
    // },
  },
  icons: {
    icon: "/FlowCoder.png",
    apple: "/FlowCoder.png",
  },
  manifest: "/manifest.json",
  other: {
    // 네이버 SEO 추가 메타 태그
    "naver-site-verification": "네이버웹마스터도구인증코드",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider>
            <Header />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
