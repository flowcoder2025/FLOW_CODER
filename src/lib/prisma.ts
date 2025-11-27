import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Supabase Pooler 사용 시 prepared statement 충돌 방지
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL

  // 빌드 시점에 DATABASE_URL이 없으면 더미 URL 사용
  // 실제 연결은 런타임에만 발생하므로 빌드는 성공함
  if (!url) {
    return 'postgresql://user:password@localhost:5432/dummy?schema=public'
  }

  // 이미 pgbouncer 파라미터가 있는지 확인
  if (url.includes('pgbouncer=true')) return url

  // Supabase pooler를 사용하는 경우 pgbouncer 파라미터 추가
  if (url.includes('pooler.supabase.com')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}pgbouncer=true&statement_cache_size=0`
  }

  return url
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    // 프로덕션 환경에서 로깅 비활성화 (성능 최적화)
    log: process.env.NODE_ENV === 'production'
      ? []
      : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma