import { NextRequest, NextResponse } from 'next/server'
import { PropertyScoringEngine } from '@/services/property-scoring-engine'
import { DeveloperTier, GreenMarkLevel } from '@prisma/client'

// Sample analysis endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyName, developer, district, analysisType = 'comprehensive' } = body
    
    if (!propertyName || !developer || !district) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyName, developer, district' },
        { status: 400 }
      )
    }

    const scoringEngine = new PropertyScoringEngine()
    
    // Sample property data - in production, this would come from your database
    const sampleInput = {
      name: propertyName,
      developer: developer,
      location: `District ${district}`,
      district: parseInt(district),
      
      dqiInput: {
        district: parseInt(district),
        mrtDistance: 400, // 400m from MRT
        schoolProximity: {
          elite1km: false,
          good1km: true,
          elite2km: true, 
          good2km: true
        },
        amenitiesScore: 4,
        totalUnits: 380,
        propertyAge: 5,
        tenure: "99-year leasehold",
        remainingLease: 94,
        facilitiesCount: 25,
        facilitiesQuality: 3,
        currentPsf: 2400,
        districtAvgPsf: 2200,
        developerTier: 'ESTABLISHED' as DeveloperTier,
        greenMarkLevel: 'GOLD' as GreenMarkLevel,
        rentalYield: 3.8,
        historicalReturns: 5.2,
        transactionVolume: 45,
        hasAwards: false
      },
      
      targetAnalysis: 'both' as const,
      analysisDepth: analysisType as 'standard' | 'comprehensive' | 'executive'
    }
    
    console.log(`🔍 Starting property analysis for ${propertyName}...`)
    
    const analysis = await scoringEngine.analyzeProperty(sampleInput)
    
    // Generate article if requested
    let articleId = null
    if (body.generateArticle) {
      articleId = await scoringEngine.generatePropertyReviewArticle(analysis, sampleInput)
    }
    
    return NextResponse.json({
      success: true,
      analysis: analysis,
      articleId: articleId,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Property analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze property', details: error.message },
      { status: 500 }
    )
  }
}

// Get analysis for existing properties
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const propertyId = searchParams.get('propertyId')
  const format = searchParams.get('format') || 'json'
  
  if (!propertyId) {
    return NextResponse.json(
      { error: 'Property ID required' },
      { status: 400 }
    )
  }
  
  try {
    // In production, fetch property data from database by ID
    // const property = await prisma.property.findUnique({ where: { id: propertyId } })
    
    const scoringEngine = new PropertyScoringEngine()
    
    // Sample data for demonstration
    const sampleInput = {
      name: "The Orie",
      developer: "CDL, Frasers Property, Sekisui House", 
      location: "Lorong 1 Toa Payoh",
      district: 12,
      
      dqiInput: {
        district: 12,
        mrtDistance: 300,
        schoolProximity: {
          elite1km: true,
          good1km: true,
          elite2km: true,
          good2km: true
        },
        amenitiesScore: 5,
        totalUnits: 777,
        propertyAge: 1,
        tenure: "99-year leasehold",
        remainingLease: 98,
        facilitiesCount: 35,
        facilitiesQuality: 4,
        currentPsf: 2650,
        districtAvgPsf: 2400,
        developerTier: 'TIER_1' as DeveloperTier,
        greenMarkLevel: 'GOLDPLUS' as GreenMarkLevel,
        rentalYield: 4.1,
        historicalReturns: 6.8,
        transactionVolume: 120,
        hasAwards: true
      },
      
      targetAnalysis: 'both' as const,
      analysisDepth: 'comprehensive' as const
    }
    
    const analysis = await scoringEngine.analyzeProperty(sampleInput)
    
    if (format === 'summary') {
      return NextResponse.json({
        propertyName: sampleInput.name,
        overallRating: analysis.score.overallRating,
        recommendation: analysis.score.recommendation,
        dqiScore: analysis.score.dqiResult.totalScore,
        executiveSummary: analysis.executiveSummary,
        strengths: analysis.strengths.slice(0, 3),
        concerns: analysis.concerns.slice(0, 3)
      })
    }
    
    return NextResponse.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching property analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: error.message },
      { status: 500 }
    )
  }
}