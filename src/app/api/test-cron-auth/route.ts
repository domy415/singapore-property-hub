import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test the cron authentication logic without actually running content generation
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Extract Bearer token from authorization header
    const bearerToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1] 
      : null

    const response = {
      timestamp: new Date().toISOString(),
      headers: {
        authorization: !!authHeader,
        userAgent: request.headers.get('user-agent'),
        authHeaderValue: authHeader ? `${authHeader.substring(0, 20)}...` : null
      },
      environment: {
        hasCronSecret: !!cronSecret,
        cronSecretLength: cronSecret?.length || 0
      },
      authentication: {
        hasBearerToken: !!bearerToken,
        bearerTokenLength: bearerToken?.length || 0,
        tokensMatch: bearerToken === cronSecret,
        isAuthenticated: !!bearerToken && bearerToken === cronSecret
      }
    }

    if (!cronSecret) {
      return NextResponse.json({
        ...response,
        status: 'error',
        message: 'CRON_SECRET environment variable is not configured'
      }, { status: 500 })
    }
    
    if (!bearerToken || bearerToken !== cronSecret) {
      return NextResponse.json({
        ...response,
        status: 'unauthorized',
        message: 'Invalid or missing CRON_SECRET in Authorization header'
      }, { status: 401 })
    }

    return NextResponse.json({
      ...response,
      status: 'success',
      message: 'Cron authentication successful - ready for content generation'
    })
  } catch (error: any) {
    console.error('Cron auth test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test failed',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}