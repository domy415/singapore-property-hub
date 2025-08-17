import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const recentLeads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        responseDate: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      success: true,
      leads: recentLeads,
      count: recentLeads.length
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}