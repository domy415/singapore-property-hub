import { NextResponse } from 'next/server'
import { clearRateLimit } from '@/lib/admin-auth'

export async function POST() {
  try {
    // Clear all rate limiting data
    clearRateLimit()
    
    return NextResponse.json({
      success: true,
      message: 'Rate limiting cleared successfully'
    })
  } catch (error) {
    console.error('Failed to clear rate limit:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to clear rate limit'
    }, { status: 500 })
  }
}