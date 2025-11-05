import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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
    // 로컬 개발 환경에서만 이메일/비밀번호 로그인 지원
    ...(process.env.NODE_ENV === 'development'
      ? [
          CredentialsProvider({
            name: "Email",
            credentials: {
              email: { label: "이메일", type: "email" },
              password: { label: "비밀번호", type: "password" },
            },
            async authorize(credentials) {
              if (!credentials?.email || !credentials?.password) {
                return null;
              }

              // 로컬 테스트용 하드코딩된 admin 계정
              // 실제 프로덕션에서는 이 provider가 비활성화됨
              if (
                credentials.email === "admin@local.dev" &&
                credentials.password === "admin123"
              ) {
                // DB에서 admin 사용자 조회 또는 생성
                let user = await prisma.user.findUnique({
                  where: { email: "admin@local.dev" },
                });

                if (!user) {
                  // admin 사용자가 없으면 생성
                  user = await prisma.user.create({
                    data: {
                      email: "admin@local.dev",
                      username: "admin",
                      displayName: "로컬 Admin",
                      reputation: 1000,
                    },
                  });
                }

                return {
                  id: user.id,
                  email: user.email,
                  name: user.displayName || user.username,
                  image: user.image,
                };
              }

              return null;
            },
          }),
        ]
      : []),
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
