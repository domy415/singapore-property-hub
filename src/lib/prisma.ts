import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fix the DATABASE_URL for Supabase pooler compatibility
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL || ''
  // Add pgbouncer parameters if not already present
  if (url && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?'
    return url + separator + 'pgbouncer=true&statement_cache_size=0'
  }
  return url
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma