import { prisma } from '@/lib/prisma'
import { DQICalculator, DQIInput, DQIResult } from './scoring/dqi-calculator'
import { USQICalculator, USQIInput, USQIResult } from './scoring/usqi-calculator'
import { ArticleCategory, ArticleStatus, DeveloperTier, GreenMarkLevel } from '@prisma/client'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface PropertyScoringInput {
  // Basic Property Information
  name: string
  developer: string
  location: string
  district: number
  
  // Scoring Inputs
  dqiInput: DQIInput
  unitAnalysis?: USQIInput[]
  
  // Market Context
  currentMarketConditions?: {
    interestRates: number
    coolingMeasures: string[]
    governmentIncentives: string[]
  }
  
  // Additional Analysis Parameters
  targetAnalysis: 'investment' | 'own-stay' | 'both'
  analysisDepth: 'standard' | 'comprehensive' | 'executive'
}

interface PropertyScore {
  overallRating: number // 1-5 stars
  dqiResult: DQIResult
  usqiResults?: USQIResult[]
  
  categoryScores: {
    location: number // 1-5
    developer: number // 1-5
    design: number // 1-5
    investmentPotential: number // 1-5
    facilities: number // 1-5
  }
  
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Consider' | 'Pass'
  confidenceLevel: number // 0-100%
}

interface PropertyAnalysis {
  score: PropertyScore
  executiveSummary: string
  
  strengths: string[]
  concerns: string[]
  
  investmentAnalysis: {
    rentalYield: {
      estimated: string
      range: string
      confidence: 'High' | 'Medium' | 'Low'
    }
    capitalAppreciation: {
      outlook: 'Strong' | 'Moderate' | 'Weak'
      timeframe: string
      drivers: string[]
    }
    targetBuyers: string[]
    exitStrategy: string[]
  }
  
  locationAssessment: {
    connectivity: {
      score: number
      details: string[]
    }
    amenities: {
      score: number
      nearby: string[]
    }
    futureGrowth: {
      score: number
      factors: string[]
    }
  }
  
  developerProfile: {
    tier: DeveloperTier
    trackRecord: string
    reputation: number // 1-5
    reliabilityFactors: string[]
  }
  
  marketPosition: {
    pricing: 'Undervalued' | 'Fair Value' | 'Premium' | 'Overpriced'
    competitiveAdvantage: string[]
    marketShare: string
  }
  
  risks: {
    high: string[]
    medium: string[]
    low: string[]
  }
  
  finalVerdict: {
    buyRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Consider' | 'Pass'
    targetPrice: string
    investmentHorizon: string
    suitability: string[]
  }
}

export class PropertyScoringEngine {
  private dqiCalculator = new DQICalculator()
  private usqiCalculator = new USQICalculator()
  
  async analyzeProperty(input: PropertyScoringInput): Promise<PropertyAnalysis> {
    console.log(`🔍 Starting comprehensive analysis for ${input.name}...`)
    
    try {
      // Calculate quantitative scores
      const score = await this.calculatePropertyScore(input)
      
      // Generate AI-powered qualitative analysis
      const analysis = await this.generateQualitativeAnalysis(input, score)
      
      console.log(`✅ Analysis completed for ${input.name} - Overall Rating: ${score.overallRating}/5`)
      
      return {
        score,
        ...analysis
      }
      
    } catch (error) {
      console.error('Error in property analysis:', error)
      throw new Error(`Failed to analyze ${input.name}: ${error.message}`)
    }
  }
  
  private async calculatePropertyScore(input: PropertyScoringInput): Promise<PropertyScore> {
    // Calculate DQI score
    const dqiResult = this.dqiCalculator.calculate(input.dqiInput)
    
    // Calculate USQI scores if unit data provided
    let usqiResults: USQIResult[] | undefined
    if (input.unitAnalysis && input.unitAnalysis.length > 0) {
      usqiResults = input.unitAnalysis.map(unit => 
        this.usqiCalculator.calculateUSQI(unit)
      )
    }
    
    // Calculate category scores (1-5 scale)
    const categoryScores = this.calculateCategoryScores(dqiResult, input.dqiInput)
    
    // Calculate overall rating (weighted average)
    const overallRating = this.calculateOverallRating(categoryScores, dqiResult.totalScore)
    
    // Determine recommendation
    const recommendation = this.getRecommendation(overallRating, dqiResult.grade)
    
    // Calculate confidence based on data completeness
    const confidenceLevel = this.calculateConfidence(input.dqiInput, usqiResults)
    
    return {
      overallRating,
      dqiResult,
      usqiResults,
      categoryScores,
      recommendation,
      confidenceLevel
    }
  }
  
  private calculateCategoryScores(dqiResult: DQIResult, input: DQIInput) {
    return {
      location: Math.round((dqiResult.breakdown.locationConnectivity / 35) * 5),
      developer: this.getDeveloperScore(input.developerTier),
      design: Math.round((dqiResult.breakdown.facilities + dqiResult.breakdown.sustainability) / 15 * 5),
      investmentPotential: Math.round((dqiResult.breakdown.investmentPerformance / 15) * 5),
      facilities: Math.round((dqiResult.breakdown.facilities / 10) * 5)
    }
  }
  
  private getDeveloperScore(tier?: DeveloperTier): number {
    switch (tier) {
      case 'TIER_1': return 5
      case 'ESTABLISHED': return 4
      case 'MID_TIER': return 3
      case 'NEW': return 2
      default: return 2
    }
  }
  
  private calculateOverallRating(categoryScores: any, totalScore: number): number {
    // Weighted average with DQI influence
    const weightedAvg = (
      categoryScores.location * 0.3 +
      categoryScores.developer * 0.2 +
      categoryScores.design * 0.15 +
      categoryScores.investmentPotential * 0.25 +
      categoryScores.facilities * 0.1
    )
    
    // Adjust based on total DQI score
    const dqiInfluence = totalScore >= 80 ? 0.2 : totalScore >= 60 ? 0.1 : totalScore <= 40 ? -0.3 : 0
    
    return Math.max(1, Math.min(5, Math.round(weightedAvg + dqiInfluence)))
  }
  
  private getRecommendation(rating: number, grade: string): PropertyScore['recommendation'] {
    if (rating >= 4.5 || grade === 'Premium Investment Grade') return 'Strong Buy'
    if (rating >= 4 || grade === 'Strong Buy') return 'Buy'
    if (rating >= 3.5 || grade === 'Good Value') return 'Hold'
    if (rating >= 2.5 || grade === 'Fair Value') return 'Consider'
    return 'Pass'
  }
  
  private calculateConfidence(dqiInput: DQIInput, usqiResults?: USQIResult[]): number {
    let confidence = 60 // Base confidence
    
    // Add points for available data
    if (dqiInput.rentalYield) confidence += 10
    if (dqiInput.historicalReturns) confidence += 10
    if (dqiInput.transactionVolume) confidence += 5
    if (dqiInput.conquasScore) confidence += 5
    if (dqiInput.developerTier && dqiInput.developerTier !== 'UNKNOWN') confidence += 5
    if (usqiResults && usqiResults.length > 0) confidence += 5
    
    return Math.min(100, confidence)
  }
  
  private async generateQualitativeAnalysis(
    input: PropertyScoringInput, 
    score: PropertyScore
  ): Promise<Omit<PropertyAnalysis, 'score'>> {
    
    if (!openai) {
      // Fallback analysis without AI
      return this.generateStaticAnalysis(input, score)
    }
    
    const currentDate = new Date().toLocaleDateString('en-SG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const prompt = `You are Singapore's most experienced property analyst specializing in condominium investments. Analyze "${input.name}" developed by ${input.developer} in District ${input.district}.

Current Analysis Date: ${currentDate}

QUANTITATIVE SCORES:
- Overall Rating: ${score.overallRating}/5 stars
- DQI Score: ${score.dqiResult.totalScore}/100 (${score.dqiResult.grade})
- Location Score: ${score.categoryScores.location}/5
- Developer Score: ${score.categoryScores.developer}/5
- Investment Potential: ${score.categoryScores.investmentPotential}/5
- Recommendation: ${score.recommendation}

DEVELOPMENT DATA:
- District: ${input.district}
- MRT Distance: ${input.dqiInput.mrtDistance}m
- Total Units: ${input.dqiInput.totalUnits}
- Property Age: ${input.dqiInput.propertyAge} years
- Tenure: ${input.dqiInput.tenure}
- Current PSF: $${input.dqiInput.currentPsf}
- District Average PSF: $${input.dqiInput.districtAvgPsf}
- Facilities Count: ${input.dqiInput.facilitiesCount}

ANALYSIS REQUIREMENTS:
1. Write a compelling 200-word executive summary
2. Identify 5-7 key strengths and 3-5 concerns
3. Provide detailed investment analysis with rental yield estimates and capital appreciation outlook
4. Assess location connectivity, amenities, and future growth potential
5. Evaluate developer profile and track record
6. Determine market positioning and competitive advantages
7. Identify high/medium/low risk factors
8. Provide final investment verdict with target pricing and suitability

CONTEXT: Analysis for ${input.targetAnalysis} buyers seeking ${input.analysisDepth} level analysis.

Format response as JSON with the following structure:
{
  "executiveSummary": "string",
  "strengths": ["string"],
  "concerns": ["string"],
  "investmentAnalysis": {
    "rentalYield": {
      "estimated": "string",
      "range": "string", 
      "confidence": "High|Medium|Low"
    },
    "capitalAppreciation": {
      "outlook": "Strong|Moderate|Weak",
      "timeframe": "string",
      "drivers": ["string"]
    },
    "targetBuyers": ["string"],
    "exitStrategy": ["string"]
  },
  "locationAssessment": {
    "connectivity": {
      "score": number,
      "details": ["string"]
    },
    "amenities": {
      "score": number,
      "nearby": ["string"]
    },
    "futureGrowth": {
      "score": number,
      "factors": ["string"]
    }
  },
  "developerProfile": {
    "tier": "${input.dqiInput.developerTier || 'UNKNOWN'}",
    "trackRecord": "string",
    "reputation": number,
    "reliabilityFactors": ["string"]
  },
  "marketPosition": {
    "pricing": "string",
    "competitiveAdvantage": ["string"],
    "marketShare": "string"
  },
  "risks": {
    "high": ["string"],
    "medium": ["string"], 
    "low": ["string"]
  },
  "finalVerdict": {
    "buyRating": "${score.recommendation}",
    "targetPrice": "string",
    "investmentHorizon": "string",
    "suitability": ["string"]
  }
}`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 0.3, // Lower temperature for more consistent analysis
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content generated from OpenAI')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('Error generating AI analysis:', error)
      return this.generateStaticAnalysis(input, score)
    }
  }
  
  private generateStaticAnalysis(input: PropertyScoringInput, score: PropertyScore): Omit<PropertyAnalysis, 'score'> {
    // Fallback static analysis when AI is not available
    return {
      executiveSummary: `${input.name} by ${input.developer} in District ${input.district} receives a ${score.overallRating}/5 star rating based on our comprehensive analysis. The development shows ${score.recommendation.toLowerCase()} potential with a DQI score of ${score.dqiResult.totalScore}/100.`,
      
      strengths: [
        score.categoryScores.location >= 4 ? "Excellent location and connectivity" : "Decent location access",
        score.categoryScores.developer >= 4 ? "Reputable developer with proven track record" : "Established developer background", 
        score.categoryScores.facilities >= 4 ? "Comprehensive facilities and amenities" : "Good range of facilities",
        score.dqiResult.breakdown.investmentPerformance >= 12 ? "Strong investment fundamentals" : "Stable investment metrics"
      ],
      
      concerns: [
        score.categoryScores.location < 3 ? "Location accessibility could be better" : null,
        score.dqiResult.breakdown.marketPosition < 3 ? "Premium pricing vs market average" : null,
        input.dqiInput.propertyAge > 15 ? "Property age may impact future appreciation" : null
      ].filter(Boolean),
      
      investmentAnalysis: {
        rentalYield: {
          estimated: "3.0-4.2%",
          range: "2.8-4.5%",
          confidence: score.confidenceLevel > 75 ? "High" : score.confidenceLevel > 50 ? "Medium" : "Low"
        },
        capitalAppreciation: {
          outlook: score.overallRating >= 4 ? "Strong" : score.overallRating >= 3 ? "Moderate" : "Weak",
          timeframe: "5-7 years",
          drivers: ["Location development", "Transport improvements", "District gentrification"]
        },
        targetBuyers: ["Young professionals", "Families", "Investors"],
        exitStrategy: ["Hold for rental yield", "Sell after 3-5 years", "Upgrade to larger unit"]
      },
      
      locationAssessment: {
        connectivity: {
          score: score.categoryScores.location,
          details: [`${input.dqiInput.mrtDistance}m from MRT`, "Bus services available", "Major expressways accessible"]
        },
        amenities: {
          score: Math.min(5, Math.floor(input.dqiInput.facilitiesCount / 10)),
          nearby: ["Shopping malls", "Schools", "Healthcare", "Food & dining"]
        },
        futureGrowth: {
          score: score.categoryScores.location,
          factors: ["Government development plans", "Transport improvements", "Commercial developments"]
        }
      },
      
      developerProfile: {
        tier: input.dqiInput.developerTier || 'UNKNOWN',
        trackRecord: "Established developer with multiple completed projects in Singapore",
        reputation: score.categoryScores.developer,
        reliabilityFactors: ["Timely project delivery", "Quality construction", "Good maintenance"]
      },
      
      marketPosition: {
        pricing: input.dqiInput.currentPsf > input.dqiInput.districtAvgPsf * 1.1 ? "Premium" : 
                input.dqiInput.currentPsf < input.dqiInput.districtAvgPsf * 0.9 ? "Undervalued" : "Fair Value",
        competitiveAdvantage: ["Location benefits", "Developer reputation", "Facility offerings"],
        marketShare: "Competitive positioning in district market"
      },
      
      risks: {
        high: score.overallRating < 2.5 ? ["Weak fundamentals", "Poor location"] : [],
        medium: ["Market cooling measures", "Interest rate changes"],
        low: ["Minor maintenance issues", "Facility upgrades needed"]
      },
      
      finalVerdict: {
        buyRating: score.recommendation,
        targetPrice: `$${Math.round(input.dqiInput.currentPsf * 0.95)}-${input.dqiInput.currentPsf} PSF`,
        investmentHorizon: score.overallRating >= 4 ? "3-5 years" : "5-7 years",
        suitability: [
          input.targetAnalysis === 'investment' ? "Property investors" : "Owner-occupiers",
          score.overallRating >= 4 ? "First-time buyers" : "Experienced buyers",
          "Long-term holders"
        ]
      }
    }
  }
  
  async generatePropertyReviewArticle(analysis: PropertyAnalysis, input: PropertyScoringInput): Promise<string | null> {
    if (!openai) {
      console.log('OpenAI not configured - skipping article generation')
      return null
    }

    try {
      const currentDate = new Date().toLocaleDateString('en-SG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })

      const prompt = `You are writing for Singapore Property Hub, a platform run by passionate property enthusiasts. Create a comprehensive review article for "${input.name}" based on this detailed property analysis.

Current Date: ${currentDate}
Context: We are property enthusiasts (not agents) sharing honest insights to help fellow Singaporeans make informed decisions.

ANALYSIS RESULTS:
Overall Rating: ${analysis.score.overallRating}/5 stars
DQI Score: ${analysis.score.dqiResult.totalScore}/100
Recommendation: ${analysis.score.recommendation}

Executive Summary: ${analysis.executiveSummary}

Key Strengths: ${analysis.strengths.join(', ')}
Main Concerns: ${analysis.concerns.join(', ')}

Investment Analysis:
- Rental Yield: ${analysis.investmentAnalysis.rentalYield.estimated}
- Capital Appreciation: ${analysis.investmentAnalysis.capitalAppreciation.outlook}
- Target Buyers: ${analysis.investmentAnalysis.targetBuyers.join(', ')}

Requirements:
1. 2000-2500 words comprehensive review
2. Professional analysis tone with enthusiasm
3. Include detailed pros/cons analysis
4. Add investment perspective with realistic projections  
5. Compare with similar developments in the district
6. SEO optimized with Singapore property keywords
7. Include expert commentary style quotes
8. Structure with clear sections and subheadings

Use the exact article structure:
1. Quick Facts & Rating
2. Executive Summary  
3. Development Overview
4. Location Analysis (Connectivity & Amenities)
5. Developer Profile & Track Record
6. Investment Analysis (Rental Yields & Capital Appreciation)
7. Pros & Cons Analysis (Detailed)
8. Market Positioning & Competition
9. Risk Assessment
10. Final Verdict & Recommendations

Format as JSON:
{
  "title": "SEO-optimized title with project name and 2025",
  "slug": "url-friendly-slug", 
  "excerpt": "Compelling 150-word excerpt",
  "content": "Full HTML article with proper headings and structure",
  "category": "CONDO_REVIEWS",
  "tags": ["condo review", "District ${input.district}", "property analysis", "investment"],
  "seoTitle": "SEO title under 60 characters",
  "seoDescription": "SEO description under 160 characters", 
  "seoKeywords": ["${input.name}", "singapore condo review", "district ${input.district} property"],
  "featuredImage": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop"
}`

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content generated from OpenAI')
      }

      const articleData = JSON.parse(content)
      const savedArticle = await this.saveArticle(articleData)
      
      console.log(`📄 Generated review article for ${input.name}: ${savedArticle.id}`)
      return savedArticle.id
      
    } catch (error) {
      console.error('Error generating review article:', error)
      return null
    }
  }
  
  private async saveArticle(articleData: any) {
    // Find or create author
    let author = await prisma.author.findUnique({
      where: { email: 'expert@singaporepropertyhub.sg' }
    })

    if (!author) {
      author = await prisma.author.create({
        data: {
          email: 'expert@singaporepropertyhub.sg',
          name: 'Singapore Property Hub Team',
          bio: 'Passionate property enthusiasts sharing honest insights and analysis to help fellow Singaporeans make informed real estate decisions.'
        }
      })
    }

    // Create and save the article
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: ArticleCategory.CONDO_REVIEWS,
        tags: articleData.tags,
        featuredImage: articleData.featuredImage,
        authorId: author.id,
        seoTitle: articleData.seoTitle,
        seoDescription: articleData.seoDescription,
        seoKeywords: articleData.seoKeywords,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date()
      },
      include: {
        author: true
      }
    })

    return article
  }
}