import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    
    // Test database connection
    await prisma.$connect()
    
    // Try to count leads
    const leadCount = await prisma.lead.count()
    
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      leadCount
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}