import { NextResponse } from 'next/server'
import { getSystemHealth } from '@/lib/db-health'

export async function GET() {
  // Build guard: Prevent execution during Next.js build phase
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test') {
    return NextResponse.json({
      status: 'build-phase',
      timestamp: new Date().toISOString(),
      message: 'Health check not available during build'
    }, { status: 503 });
  }

  try {
    const health = await getSystemHealth()
    
    const statusCode = health.status === 'healthy' ? 200 : 503
    
    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}