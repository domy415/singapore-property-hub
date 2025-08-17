import { NextResponse } from 'next/server'
import { LeadManager } from '@/services/lead-manager'

export async function POST() {
  try {
    const leadManager = new LeadManager()
    
    // Create a test lead object
    const testLead = {
      id: 'test-' + Date.now(),
      name: 'Email Test User',
      email: 'test@example.com',
      phone: '12345678',
      message: 'This is a test email notification',
      source: 'WEBSITE' as const,
      status: 'NEW' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      propertyId: null,
      responseDate: null,
      notes: null
    }

    // Try to process the lead which should trigger email
    const result = await leadManager.processNewLead({
      name: testLead.name,
      email: testLead.email,
      phone: testLead.phone,
      message: testLead.message,
      source: testLead.source
    })

    return NextResponse.json({
      success: true,
      message: 'Test email processing completed',
      leadId: result.id
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process test email',
      details: error.message
    }, { status: 500 })
  }
}