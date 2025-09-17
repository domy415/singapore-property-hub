import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced build guard: Skip Prisma initialization during build phase
function createPrismaClient() {
  // Multiple checks for build phase detection
  const isBuildPhase = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NODE_ENV === 'test' ||
    process.env.SKIP_BUILD_STATIC_GENERATION === 'true' ||
    !process.env.DATABASE_URL

  if (isBuildPhase) {
    console.log('🚫 Skipping Prisma initialization during build phase')
    // Return a proxy that throws helpful errors if accessed
    return new Proxy({}, {
      get() {
        throw new Error('Database operations are not available during build time')
      }
    }) as any
  }
  
  console.log('✅ Initializing Prisma client for runtime')
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma