"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // 세션 재검증 간격: 5분 (기본값 0은 매번 호출)
      refetchInterval={5 * 60}
      // 창 포커스 시 세션 재검증 비활성화 (중복 호출 방지)
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
