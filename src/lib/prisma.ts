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

// Build-safe Prisma initialization with better error handling
function createPrismaClient(): PrismaClient | null {
  // Skip Prisma during build phase or if explicitly disabled
  if (process.env.SKIP_PRISMA === 'true' || (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)) {
    console.log('⚠️  Skipping Prisma initialization')
    return null
  }
  
  // Skip if no DATABASE_URL at all
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not found - Prisma operations will be skipped')
    return null
  }
  
  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: getDatabaseUrl()
        }
      },
      // Add error handling options
      errorFormat: 'minimal'
    })
    
    // Test the connection on first use
    if (process.env.NODE_ENV !== 'production') {
      client.$connect().catch((error) => {
        console.error('⚠️  Prisma connection test failed:', error.message)
      })
    }
    
    return client
  } catch (error) {
    console.error('⚠️  Prisma initialization error:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

// Initialize only if not in build phase
const prismaClient = globalForPrisma.prisma ?? (typeof window === 'undefined' ? createPrismaClient() : null)

// Create a proxy that handles Prisma unavailability gracefully
const createPrismaProxy = () => {
  if (prismaClient) {
    return prismaClient
  }
  
  // Return a more sophisticated proxy that mimics Prisma structure
  const mockPrismaObject = {
    article: undefined,
    lead: undefined,
    property: undefined,
    author: undefined,
    // Add other models as needed
  }
  
  return new Proxy(mockPrismaObject as PrismaClient, {
    get(target, prop) {
      // For debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️  Prisma client not available - attempted to access: ${String(prop)}`)
      }
      
      // Return undefined for model properties to make type checks fail gracefully
      if (typeof prop === 'string' && ['article', 'lead', 'property', 'author'].includes(prop)) {
        return undefined
      }
      
      // Return a function that returns null for any Prisma operation
      if (typeof prop === 'string' && !['then', 'catch', 'finally', 'constructor'].includes(prop)) {
        return () => {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️  Prisma operation skipped: ${prop}`)
          }
          return Promise.resolve(null)
        }
      }
      
      // Handle promise-like behavior
      if (prop === 'then') {
        return undefined
      }
      
      return undefined
    }
  })
}

export const prisma = createPrismaProxy()

if (process.env.NODE_ENV !== 'production' && prismaClient) {
  globalForPrisma.prisma = prismaClient
}