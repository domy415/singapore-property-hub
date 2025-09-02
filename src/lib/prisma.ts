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
  // Skip Prisma during build phase
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    console.log('⚠️  Skipping Prisma initialization during build')
    return null
  }
  
  // Skip if no DATABASE_URL at all
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

// Initialize only if not in build phase
const prismaClient = globalForPrisma.prisma ?? (typeof window === 'undefined' ? createPrismaClient() : null)

// Create a proxy that throws helpful errors when Prisma is not available
const createPrismaProxy = () => {
  if (prismaClient) {
    return prismaClient
  }
  
  return new Proxy({} as PrismaClient, {
    get() {
      throw new Error('Prisma client not available. Ensure DATABASE_URL is set and not in build phase.')
    }
  })
}

export const prisma = createPrismaProxy()

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient
}