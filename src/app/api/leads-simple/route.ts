import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadSource, LeadStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    console.log('Simple lead endpoint - Received data:', leadData)
    
    // Validate required fields
    if (!leadData.name || !leadData.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Create lead directly without email processing
    const lead = await prisma.lead.create({
      data: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || null,
        message: leadData.message || null,
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW
      }
    })
    
    console.log('Lead created successfully:', lead.id)
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We\'ll contact you shortly.',
      leadId: lead.id
    })
  } catch (error: any) {
    console.error('Simple lead API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process lead',
        details: error.message 
      },
      { status: 500 }
    )
  }
}