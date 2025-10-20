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
  title: "바이브코딩 커뮤니티",
  description: "바이브코딩 사용자들을 위한 커뮤니티 플랫폼 - 함께 코딩하고, 배우고, 성장하는 공간",
  keywords: ["코딩", "개발자", "커뮤니티", "프로그래밍", "바이브코딩"],
  authors: [{ name: "Vibe Coding" }],
  openGraph: {
    title: "바이브코딩 커뮤니티",
    description: "바이브코딩 사용자들을 위한 커뮤니티 플랫폼",
    type: "website",
    locale: "ko_KR",
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
