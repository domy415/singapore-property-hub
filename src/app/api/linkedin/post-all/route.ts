import { NextResponse } from 'next/server'
import { LinkedInManager } from '@/services/linkedin-manager'

export async function POST() {
  try {
    const linkedinManager = new LinkedInManager()
    const postedCount = await linkedinManager.postAllUnpostedArticles()
    
    return NextResponse.json({
      success: true,
      message: `Posted ${postedCount} articles to LinkedIn`,
      postedCount
    })
  } catch (error: any) {
    console.error('LinkedIn bulk post API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}