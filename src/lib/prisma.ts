import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  return globalForPrisma.prisma
}

// During build, return a mock that has the shape of PrismaClient
function getMockPrisma(): any {
  return new Proxy({}, {
    get() {
      // Return a chainable mock for any property access
      return getMockPrisma()
    },
    apply() {
      // Return promise for any function calls
      return Promise.resolve(null)
    }
  })
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚫 Skipping Prisma during build');
      return getMockPrisma()
    }
    const client = getPrismaClient();
    return (client as any)[prop];
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = getPrismaClient()
}

export default prisma