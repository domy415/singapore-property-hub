import { NextRequest, NextResponse } from 'next/server'
import { AgentPropertyScorer } from '@/services/agent-property-scorer'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectName = url.searchParams.get('project') || 'The Orie'
    const topicHint = url.searchParams.get('topic') || 'new launch condo review Singapore'
    
    console.log('Testing AgentPropertyScorer...')
    console.log('Project:', projectName)
    console.log('Topic:', topicHint)
    
    const scorer = new AgentPropertyScorer()
    const result = await scorer.scoreProperty(projectName, topicHint)
    
    return NextResponse.json({
      success: true,
      message: 'Property scoring completed successfully',
      data: {
        projectName: result.projectName,
        overallRating: result.overallRating,
        categoryScores: result.categoryScores,
        executiveSummary: result.executiveSummary,
        strengths: result.strengths,
        concerns: result.concerns,
        investmentAnalysis: result.investmentAnalysis,
        recommendation: result.recommendation,
        articlePreview: result.fullArticleContent.substring(0, 500) + '...'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Property scoring test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Property scoring test failed',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { projectName, topicHint, additionalContext } = await request.json()
    
    console.log('Testing AgentPropertyScorer with POST...')
    console.log('Project:', projectName)
    console.log('Topic:', topicHint)
    console.log('Context:', additionalContext)
    
    const scorer = new AgentPropertyScorer()
    const result = await scorer.scoreProperty(
      projectName || 'Featured New Launch',
      topicHint || 'new launch condo review Singapore',
      additionalContext
    )
    
    return NextResponse.json({
      success: true,
      message: 'Property scoring completed successfully via POST',
      data: result,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Property scoring POST test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Property scoring POST test failed',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}