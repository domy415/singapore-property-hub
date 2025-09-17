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

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.log('🚫 Skipping Prisma during build');
      return () => Promise.resolve(null);
    }
    const client = getPrismaClient();
    return (client as any)[prop];
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = getPrismaClient()
}

export default prisma