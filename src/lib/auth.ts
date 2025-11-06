import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { grantSystemAdmin } from "./permissions";

/**
 * 필수 환경변수 검증 함수
 * @param key 환경변수 키
 * @returns 환경변수 값
 * @throws 런타임에 환경변수가 없을 경우 명확한 에러 메시지
 * @note 빌드 시점에는 더미 값 사용 (실제 연결은 런타임에만 발생)
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];

  // 빌드 시점에는 더미 값 사용
  if (!value) {
    // 프로덕션 런타임에서만 에러 발생 (빌드 시점 제외)
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      throw new Error(
        `Missing required environment variable: ${key}. Please check your .env file.`
      );
    }
    // 빌드 시점이나 서버 시작 전에는 더미 값 반환
    return 'dummy-value-for-build';
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

              // 1. 하드코딩된 admin 계정 체크
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

                  // 시스템 admin 권한 부여
                  await grantSystemAdmin(user.id);
                }

                return {
                  id: user.id,
                  email: user.email,
                  name: user.displayName || user.username,
                  image: user.image,
                };
              }

              // 2. 일반 사용자 로그인 (DB 조회)
              const user = await prisma.user.findUnique({
                where: { email: credentials.email as string },
              });

              if (!user) {
                return null;
              }

              // 로컬 개발 환경에서는 비밀번호 검증 생략
              // (회원가입 시 비밀번호를 저장하지 않았으므로)
              // 실제 프로덕션에서는 bcrypt 등으로 해싱된 비밀번호 검증 필요

              return {
                id: user.id,
                email: user.email,
                name: user.displayName || user.username,
                image: user.image,
              };
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
