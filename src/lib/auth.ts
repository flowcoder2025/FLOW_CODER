import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

/**
 * 필수 환경변수 검증 함수
 * @param key 환경변수 키
 * @returns 환경변수 값
 * @throws 환경변수가 없을 경우 명확한 에러 메시지
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env file.`
    );
  }
  return value;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: getRequiredEnv('GITHUB_ID'),
      clientSecret: getRequiredEnv('GITHUB_SECRET'),
    }),
    GoogleProvider({
      clientId: getRequiredEnv('GOOGLE_ID'),
      clientSecret: getRequiredEnv('GOOGLE_SECRET'),
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
