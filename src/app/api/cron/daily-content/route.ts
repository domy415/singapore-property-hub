import { NextRequest, NextResponse } from 'next/server'
import { VerifiedContentGenerator } from '@/services/verified-content-generator'
import { LinkedInPublisher } from '@/services/linkedin-publisher'

// This endpoint will be called by Vercel Cron or external scheduler
// Complete workflow: property-article-writer → singapore-property-scorer (if condo) → singapore-property-report-generator → linkedin-property-content-optimizer
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from an authorized source (Vercel Cron)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Extract Bearer token from authorization header
    const bearerToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1] 
      : null

    // Vercel cron jobs automatically send CRON_SECRET as Bearer token
    if (!cronSecret) {
      console.error('CRON_SECRET environment variable is not configured')
      return NextResponse.json(
        { success: false, error: 'Server configuration error - CRON_SECRET not set' },
        { status: 500 }
      )
    }
    
    if (!bearerToken || bearerToken !== cronSecret) {
      console.log('Unauthorized cron request:', {
        hasAuthHeader: !!authHeader,
        hasBearerToken: !!bearerToken,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid or missing CRON_SECRET' },
        { status: 401 }
      )
    }

    console.log('Starting daily multi-agent content generation workflow...')
    console.log('Cron execution details:', {
      time: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      hasValidAuth: true,
      cronSecretConfigured: !!cronSecret
    })
    
    // Step 1: Generate article using full multi-agent pipeline (property-article-writer + singapore-property-image-finder + fact-checker + etc.)
    const verifiedGenerator = new VerifiedContentGenerator(true)
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
    console.log(`Property scoring used: ${result.propertyScore ? 'Yes' : 'No'}`)
    
    // Step 2: Generate one-pager report (singapore-property-report-generator)
    // TODO: Implement report generation
    
    // Step 3: Post to LinkedIn
    let linkedinPosted = false
    if (result.articleId) {
      try {
        const linkedInPublisher = new LinkedInPublisher()
        await linkedInPublisher.publishArticle(result.articleId)
        linkedinPosted = true
        console.log('Successfully posted article to LinkedIn')
      } catch (linkedinError) {
        console.error('LinkedIn posting failed:', linkedinError)
        // Don't fail the whole workflow if LinkedIn posting fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Daily multi-agent content workflow completed successfully',
      workflow: {
        articleGenerated: true,
        articleId: result.articleId,
        qualityScore: result.review.qualityScore,
        factChecked: result.review.factCheckPassed,
        propertyScoringUsed: !!result.propertyScore,
        reportGenerated: false, // TODO: Implement
        linkedinPosted: linkedinPosted
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