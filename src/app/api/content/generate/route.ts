import { NextRequest, NextResponse } from 'next/server'
import { ContentGenerator } from '@/services/content-generator'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting content generation...')
    
    const contentGenerator = new ContentGenerator()
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
      articleId
    })
  } catch (error: any) {
    console.error('Content generation error:', error)
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

// GET endpoint to check if content generation is available
export async function GET() {
  return NextResponse.json({
    success: true,
    available: !!process.env.OPENAI_API_KEY,
    message: process.env.OPENAI_API_KEY 
      ? 'Content generation is available' 
      : 'Content generation requires OpenAI API key'
  })
}