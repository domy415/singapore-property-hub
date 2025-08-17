import { NextRequest, NextResponse } from 'next/server'
import { LeadManager } from '@/services/lead-manager'
import { LeadSource } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    console.log('Received lead data:', leadData)
    
    // Validate required fields
    if (!leadData.name || !leadData.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    const leadManager = new LeadManager()
    const lead = await leadManager.processNewLead({
      ...leadData,
      source: leadData.source || LeadSource.WEBSITE
    })
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We\'ll contact you shortly.',
      leadId: lead.id
    })
  } catch (error: any) {
    console.error('Lead API error:', error)
    console.error('Error stack:', error.stack)
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