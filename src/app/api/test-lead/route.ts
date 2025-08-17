import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadSource, LeadStatus } from '@prisma/client'

export async function GET() {
  try {
    // Create a test lead directly
    const testLead = await prisma.lead.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+65 9123 4567',
        message: 'This is a test lead',
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Test lead created successfully',
      lead: testLead
    })
  } catch (error: any) {
    console.error('Test lead error:', error)
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