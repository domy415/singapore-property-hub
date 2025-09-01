import { NextRequest, NextResponse } from 'next/server'
import { WebFactChecker } from '@/lib/agents/agent-fact-checker-web'

export async function GET(request: NextRequest) {
  try {
    const webFactChecker = new WebFactChecker()
    
    // Test article with known issues for verification
    const testArticle = `# Singapore Property Market Test

The Singapore property market has several regulations:
- ABSD rates for citizens are 0% for first property, 25% for second property  
- Foreigners face a 65% ABSD rate
- LTV limit is 80% for first-time buyers
- District 12 includes Toa Payoh and Balestier
- District 24 is a premium area for expats
- Grand Dunman achieved TOP in 2023

These facts should be verified against current sources.`
    
    console.log('Testing web fact-checker with test article...')
    
    const result = await webFactChecker.checkArticle(
      testArticle, 
      'Singapore Property Market Test Article'
    )
    
    return NextResponse.json({
      success: true,
      message: 'Web fact-checker test completed',
      results: {
        isAccurate: result.isAccurate,
        score: result.score,
        issuesFound: result.issues.length,
        sourcesUsed: result.sources.length,
        verifiedClaims: result.verifiedFacts.length
      },
      details: {
        issues: result.issues,
        sources: result.sources,
        verifiedFacts: result.verifiedFacts.map(fact => ({
          claim: fact.claim,
          status: fact.status,
          confidence: fact.confidence
        }))
      }
    })
    
  } catch (error) {
    console.error('Web fact-checker test API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Web fact-checker test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'Traditional fact-checker would be used in production'
    }, { status: 500 })
  }
}