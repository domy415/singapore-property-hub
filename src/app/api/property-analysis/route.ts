import { NextRequest, NextResponse } from 'next/server'
import { PropertyScoringEngine } from '@/services/property-scoring-engine'

// Define enums locally since they don't exist in Prisma schema
enum DeveloperTier {
  TIER_1 = 'TIER_1',
  ESTABLISHED = 'ESTABLISHED', 
  MID_TIER = 'MID_TIER',
  BOUTIQUE = 'BOUTIQUE'
}

enum GreenMarkLevel {
  CERTIFIED = 'CERTIFIED',
  GOLD = 'GOLD',
  GOLDPLUS = 'GOLDPLUS',
  PLATINUM = 'PLATINUM'
}

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
        location: {
          district: parseInt(district),
          mrtDistance: 400,
          busStops: 3,
          amenities: 4
        },
        developer: {
          tier: 'ESTABLISHED' as DeveloperTier,
          trackRecord: 8,
          financialStrength: 9
        },
        project: {
          totalUnits: 380,
          landArea: 15000,
          plotRatio: 2.8,
          facilities: ['pool', 'gym', 'tennis', 'playground', 'bbq'],
          greenMark: 'GOLD' as GreenMarkLevel
        },
        pricing: {
          avgPsf: 2400,
          marketComparison: 1.1
        }
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
      { 
        error: 'Failed to analyze property', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
        location: {
          district: 12,
          mrtDistance: 300,
          busStops: 5,
          amenities: 5
        },
        developer: {
          tier: 'TIER_1' as DeveloperTier,
          trackRecord: 10,
          financialStrength: 10
        },
        project: {
          totalUnits: 777,
          landArea: 25000,
          plotRatio: 3.2,
          facilities: ['pool', 'gym', 'tennis', 'playground', 'bbq', 'clubhouse', 'spa'],
          greenMark: 'GOLDPLUS' as GreenMarkLevel
        },
        pricing: {
          avgPsf: 2650,
          marketComparison: 1.15
        }
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
      { 
        error: 'Failed to fetch analysis', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}