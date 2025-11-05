import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Supabase Pooler 사용 시 prepared statement 충돌 방지
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (!url) return undefined

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
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma