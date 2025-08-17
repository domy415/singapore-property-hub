import { NextRequest, NextResponse } from 'next/server'
import { LinkedInManager } from '@/services/linkedin-manager'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()
    
    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      )
    }
    
    const linkedinManager = new LinkedInManager()
    const success = await linkedinManager.postArticleToLinkedIn(articleId)
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Article posted to LinkedIn successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to post to LinkedIn' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('LinkedIn post API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Get LinkedIn configuration status
export async function GET() {
  try {
    const hasAccessToken = !!process.env.LINKEDIN_ACCESS_TOKEN
    const hasPersonId = !!process.env.LINKEDIN_PERSON_ID
    const hasCompanyId = !!process.env.LINKEDIN_COMPANY_ID
    
    return NextResponse.json({
      success: true,
      configured: hasAccessToken && hasPersonId,
      config: {
        hasAccessToken,
        hasPersonId,
        hasCompanyId
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}