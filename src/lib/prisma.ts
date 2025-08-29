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

// Build-safe Prisma initialization
function createPrismaClient(): PrismaClient | null {
  // Completely skip Prisma during build without DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  Skipping Prisma initialization (no DATABASE_URL)')
    return null
  }
  
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: getDatabaseUrl()
        }
      }
    })
  } catch (error) {
    console.error('❌ Failed to initialize Prisma:', error)
    return null
  }
}

const prismaClient = globalForPrisma.prisma ?? createPrismaClient()

// Type-safe export that handles null case
export const prisma = prismaClient as PrismaClient

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient
}