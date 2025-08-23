import { NextRequest, NextResponse } from 'next/server'
import { validateAdminPassword, setAdminSession, clearAdminSession, checkRateLimit, isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'

    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many login attempts. Please try again in 15 minutes.' 
        },
        { status: 429 }
      )
    }

    // Validate password
    const isValid = await validateAdminPassword(password)
    
    if (!isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid password' 
        },
        { status: 401 }
      )
    }

    // Set authentication session
    await setAdminSession()
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Authentication successful' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication failed' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated()
    
    if (authenticated) {
      return NextResponse.json(
        { 
          success: true, 
          authenticated: true 
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { 
          success: false, 
          authenticated: false 
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin auth check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        authenticated: false 
      },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await clearAdminSession()
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Logged out successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed' 
      },
      { status: 500 }
    )
  }
}