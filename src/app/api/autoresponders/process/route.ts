import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Build guard: Skip during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      success: false,
      error: 'Autoresponders not available during build phase'
    }, { status: 503 });
  }

  try {
    // Dynamic import to prevent build-time loading
    const { emailService } = await import('@/lib/email-service')
    // Verify the request is from a cron job or authorized source
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-cron-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Processing autoresponder emails...')
    
    // Process all pending autoresponder emails
    await emailService.processAutoresponders()
    
    return NextResponse.json({
      success: true,
      message: 'Autoresponders processed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Autoresponder processing error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process autoresponders',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  // Build guard: Skip during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      success: false,
      error: 'Autoresponders not available during build phase'
    }, { status: 503 });
  }

  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { success: false, error: 'Only available in development' },
        { status: 403 }
      )
    }

    // Dynamic import to prevent build-time loading
    const { emailService } = await import('@/lib/email-service')

    console.log('Processing autoresponder emails (manual)...')
    
    await emailService.processAutoresponders()
    
    return NextResponse.json({
      success: true,
      message: 'Autoresponders processed successfully (manual)',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Autoresponder processing error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process autoresponders',
        details: error.message
      },
      { status: 500 }
    )
  }
}