import { handlers } from "@/lib/auth";

// NextAuth route는 항상 동적으로 처리되어야 함 (OAuth callback 캐싱 방지)
export const dynamic = 'force-dynamic';

export const { GET, POST } = handlers;
