import { NextRequest, NextResponse } from 'next/server'
import { BasicArticleCreator } from '@/services/basic-article-creator'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting basic article creation...')
    
    const creator = new BasicArticleCreator()
    const articleId = await creator.createArticle()
    
    if (!articleId) {
      return NextResponse.json({
        success: false,
        message: 'Article creation not available (OpenAI not configured)'
      }, { status: 503 })
    }
    
    console.log(`Article created successfully: ${articleId}`)
    
    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      articleId,
      articleUrl: `https://singapore-property-hub.vercel.app/articles/${articleId}`,
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