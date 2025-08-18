import { NextRequest, NextResponse } from 'next/server'
import { SimpleContentGenerator } from '@/services/simple-content-generator'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting simple content generation...')
    
    const contentGenerator = new SimpleContentGenerator()
    const articleId = await contentGenerator.generateDailyArticle()
    
    if (!articleId) {
      return NextResponse.json({
        success: false,
        message: 'Content generation is not available (OpenAI not configured)'
      }, { status: 503 })
    }
    
    console.log(`Article generated successfully: ${articleId}`)
    
    return NextResponse.json({
      success: true,
      message: 'Article generated successfully',
      articleId,
      url: `https://singapore-property-hub.vercel.app/articles/${articleId}`
    })
  } catch (error: any) {
    console.error('Simple content generation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate content',
        details: error.message 
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
      ? 'Simple content generation is available' 
      : 'Content generation requires OpenAI API key'
  })
}