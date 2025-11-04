import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "바이브코딩 커뮤니티",
    template: "%s | 바이브코딩",
  },
  description: "바이브코딩 사용자들을 위한 커뮤니티 플랫폼 - 함께 코딩하고, 배우고, 성장하는 공간",
  keywords: ["코딩", "개발자", "커뮤니티", "프로그래밍", "바이브코딩", "학습", "Q&A", "뉴스"],
  authors: [{ name: "Vibe Coding" }],
  creator: "Vibe Coding",
  publisher: "Vibe Coding",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://vibecoding.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "바이브코딩 커뮤니티",
    description: "바이브코딩 사용자들을 위한 커뮤니티 플랫폼 - 함께 코딩하고, 배우고, 성장하는 공간",
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://vibecoding.com",
    siteName: "바이브코딩",
  },
  twitter: {
    card: "summary_large_image",
    title: "바이브코딩 커뮤니티",
    description: "바이브코딩 사용자들을 위한 커뮤니티 플랫폼",
    creator: "@vibecoding",
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
    // Google Search Console 인증 코드 (필요 시 추가)
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
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
