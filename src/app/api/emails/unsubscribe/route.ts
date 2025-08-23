import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email, reason } = await request.json()

    // Validate email
    if (!email || !emailService.validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Unsubscribe the email
    const result = await emailService.unsubscribeEmail(email)
    
    if (result) {
      // Log the unsubscribe reason if provided
      console.log(`Email unsubscribed: ${email}, Reason: ${reason || 'Not specified'}`)
      
      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed from all email communications',
        data: { email }
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to unsubscribe email' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Unsubscribe API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to unsubscribe email',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for unsubscribe page
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return NextResponse.redirect('/unsubscribe')
    }

    // Auto-unsubscribe if email is provided in URL
    const result = await emailService.unsubscribeEmail(email)
    
    if (result) {
      return NextResponse.redirect(`/unsubscribe/success?email=${encodeURIComponent(email)}`)
    } else {
      return NextResponse.redirect('/unsubscribe/error')
    }
  } catch (error) {
    console.error('Unsubscribe GET error:', error)
    return NextResponse.redirect('/unsubscribe/error')
  }
}