import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from an authorized source (Vercel Cron)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Extract Bearer token from authorization header
    const bearerToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1] 
      : null

    return NextResponse.json({
      success: true,
      message: 'Cron authentication test',
      configuration: {
        cronSecretConfigured: !!cronSecret,
        authHeaderPresent: !!authHeader,
        bearerTokenPresent: !!bearerToken,
        authValid: cronSecret && bearerToken && bearerToken === cronSecret
      },
      timestamp: new Date().toISOString(),
      nextScheduledRun: 'Daily at 9 AM SGT (1 AM UTC)'
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test failed',
        message: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}