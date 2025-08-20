import { NextRequest, NextResponse } from 'next/server'
import { BasicArticleCreator } from '@/services/basic-article-creator'
import { EnhancedArticleCreator } from '@/services/enhanced-article-creator'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting basic article creation...')
    
    // Use enhanced creator for better formatting and property-specific images
    const creator = new EnhancedArticleCreator()
    const articleSlug = await creator.createArticle()
    
    if (!articleSlug) {
      return NextResponse.json({
        success: false,
        message: 'Article creation not available (OpenAI not configured)'
      }, { status: 503 })
    }
    
    console.log(`Article created successfully: ${articleSlug}`)
    
    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      articleSlug,
      articleUrl: `https://singapore-property-hub.vercel.app/articles/${articleSlug}`,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Article creation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create article',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    available: !!process.env.OPENAI_API_KEY,
    message: process.env.OPENAI_API_KEY 
      ? 'Basic article creation is available' 
      : 'Article creation requires OpenAI API key'
  })
}