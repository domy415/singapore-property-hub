import { NextRequest, NextResponse } from 'next/server'
import { VerifiedContentGenerator } from '@/services/verified-content-generator'

// This endpoint will be called by Vercel Cron or external scheduler
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from an authorized source
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET || 'singapore-property-cron-2024'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting daily verified content generation...')
    
    const verifiedGenerator = new VerifiedContentGenerator()
    const result = await verifiedGenerator.generateVerifiedArticle(undefined, true)
    
    if (!result.saved) {
      return NextResponse.json({
        success: false,
        message: 'Content generation failed quality checks',
        qualityScore: result.review.qualityScore,
        issues: result.review.issues,
        timestamp: new Date().toISOString()
      })
    }
    
    console.log(`Daily verified article generated: ${result.articleId}`)
    
    return NextResponse.json({
      success: true,
      message: 'Daily verified content generated successfully',
      articleId: result.articleId,
      qualityScore: result.review.qualityScore,
      factChecked: result.review.factCheckPassed,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Daily content generation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate daily content',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Allow POST requests for manual triggering
  return GET(request)
}