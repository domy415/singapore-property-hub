import { NextResponse } from 'next/server'
import { LinkedInManager } from '@/services/linkedin-manager'

export async function GET() {
  try {
    const linkedinManager = new LinkedInManager()
    const profileInfo = await linkedinManager.getProfileInfo()
    
    if (profileInfo) {
      return NextResponse.json({
        success: true,
        message: 'LinkedIn connection successful',
        profile: {
          id: profileInfo.id,
          firstName: profileInfo.localizedFirstName,
          lastName: profileInfo.localizedLastName
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to LinkedIn or credentials not configured'
      }, { status: 401 })
    }
  } catch (error: any) {
    console.error('LinkedIn test connection error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}