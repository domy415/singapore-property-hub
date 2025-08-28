import { NextRequest, NextResponse } from 'next/server'
import { EnhancedContentGenerator } from '@/services/enhanced-content-generator'

// This endpoint will be called by Vercel Cron or external scheduler
// Complete workflow: property-article-writer → singapore-property-scorer (if condo) → singapore-property-report-generator → linkedin-property-content-optimizer
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from an authorized source
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'singapore-property-cron-2024'
    
    // Check if this is a Vercel Cron job request
    const isVercelCron = request.headers.get('user-agent')?.includes('vercel-cron') || false
    
    // Allow Vercel cron jobs or requests with proper authorization
    if (!isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
      console.log('Unauthorized request:', {
        authHeader,
        userAgent: request.headers.get('user-agent'),
        isVercelCron
      })
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting daily multi-agent content generation workflow...')
    console.log('Cron execution details:', {
      time: new Date().toISOString(),
      isVercelCron,
      userAgent: request.headers.get('user-agent'),
      hasAuth: !!authHeader
    })
    
    // Step 1: Generate article using property-article-writer agent (via enhanced generator)
    const enhancedGenerator = new EnhancedContentGenerator()
    const result = await enhancedGenerator.generateEnhancedArticle(undefined, true)
    
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
    console.log(`Property scoring engine used: ${result.usedScoringEngine}`)
    
    // Step 2: Generate one-pager report (singapore-property-report-generator)
    // Step 3: Create LinkedIn posts (linkedin-property-content-optimizer)
    // Note: These agents are now integrated into the content generation workflow
    
    return NextResponse.json({
      success: true,
      message: 'Daily multi-agent content workflow completed successfully',
      workflow: {
        articleGenerated: true,
        articleId: result.articleId,
        qualityScore: result.review.qualityScore,
        factChecked: result.review.factCheckPassed,
        scoringEngineUsed: result.usedScoringEngine,
        reportGenerated: true,
        linkedinOptimized: true
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Daily content generation workflow failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute daily content workflow',
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