import { NextRequest, NextResponse } from 'next/server'
import { LeadSource } from '@prisma/client'

export async function POST(request: NextRequest) {
  // Build guard: Skip during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      success: false,
      error: 'Lead service not available during build phase'
    }, { status: 503 });
  }

  try {
    // Dynamic imports to prevent build-time loading
    const { emailService } = await import('@/lib/email-service')
    const { LeadManager } = await import('@/services/lead-manager')
    const leadData = await request.json()
    console.log('Received lead data:', leadData)
    
    // Validate required fields
    if (!leadData.name || !leadData.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Extract only the fields that exist in the database schema
    const validLeadData = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || null,
      message: leadData.message || null,
      propertyId: leadData.propertyId || null,
      source: leadData.source || LeadSource.WEBSITE
    }
    
    const leadManager = new LeadManager()
    const lead = await leadManager.processNewLead(validLeadData)
    
    // Send email notifications
    try {
      await emailService.sendLeadNotification({
        ...leadData,
        id: lead.id
      })
      console.log('Lead notification emails sent successfully')
    } catch (emailError) {
      console.error('Failed to send lead notification emails:', emailError)
      // Continue with success response even if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We\'ll contact you shortly.',
      leadId: lead.id
    })
  } catch (error: any) {
    console.error('Lead API error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error name:', error.name)
    console.error('Error code:', error.code)
    
    // Check if it's a Prisma/Database error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This email has already been registered',
          details: 'Duplicate entry' 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process lead',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const leadManager = new LeadManager()
    const stats = await leadManager.getLeadStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Lead stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get lead stats' },
      { status: 500 }
    )
  }
}