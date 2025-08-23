import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'
import { abTestManager } from '@/lib/ab-testing'

export async function POST(request: NextRequest) {
  try {
    const { email, name, type = 'welcome', leadData } = await request.json()

    // Validate email
    if (!email || !emailService.validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if already subscribed (to avoid duplicate welcome emails)
    const isSubscribed = await emailService.isEmailSubscribed(email)
    
    let result
    switch (type) {
      case 'welcome':
        if (isSubscribed) {
          return NextResponse.json(
            { success: false, error: 'Email already subscribed' },
            { status: 409 }
          )
        }
        result = await emailService.sendWelcomeEmail(email, name)
        
        // Track A/B test conversion for email signup
        abTestManager.trackConversion('hero-headline', 'email_signup', 3)
        abTestManager.trackConversion('button-color', 'email_signup', 3)
        abTestManager.trackConversion('form-position', 'email_signup', 3)
        break
        
      case 'lead_notification':
        if (!leadData) {
          return NextResponse.json(
            { success: false, error: 'Lead data is required for lead notifications' },
            { status: 400 }
          )
        }
        result = await emailService.sendLeadNotification(leadData)
        
        // Track A/B test conversion for lead capture
        abTestManager.trackConversion('hero-headline', 'lead_generated', 5)
        abTestManager.trackConversion('button-color', 'lead_generated', 5)
        abTestManager.trackConversion('form-position', 'lead_generated', 5)
        break
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type' },
          { status: 400 }
        )
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        data: { email, type }
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Email API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for checking subscription status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const isSubscribed = await emailService.isEmailSubscribed(email)
    
    return NextResponse.json({
      success: true,
      data: {
        email,
        isSubscribed
      }
    })
  } catch (error: any) {
    console.error('Email check API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check email status',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}