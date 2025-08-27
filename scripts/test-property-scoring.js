// Test script for Property Scoring Engine
// Run with: node scripts/test-property-scoring.js

const { PropertyScoringEngine } = require('../src/services/property-scoring-engine.ts')

async function testPropertyScoring() {
  console.log('🏠 Testing Property Scoring Engine...\n')
  
  const scoringEngine = new PropertyScoringEngine()
  
  // Test data for The Orie
  const testProperty = {
    name: "The Orie",
    developer: "CDL, Frasers Property, Sekisui House",
    location: "Lorong 1 Toa Payoh",
    district: 12,
    
    dqiInput: {
      district: 12,
      mrtDistance: 300, // 300m from Toa Payoh MRT
      schoolProximity: {
        elite1km: true,   // CHIJ St. Nicholas Girls' School
        good1km: true,    // Multiple good schools nearby
        elite2km: true,   // Catholic High School
        good2km: true
      },
      amenitiesScore: 5, // Excellent - HDB Hub, swimming complex, library
      totalUnits: 777,
      propertyAge: 1, // Brand new
      tenure: "99-year leasehold",
      remainingLease: 98,
      unitMixStrategy: {
        oneBed: 120,
        twoBed: 300,
        threeBed: 250,
        fourBed: 80,
        penthouse: 27
      },
      facilitiesCount: 35, // Comprehensive facilities
      facilitiesQuality: 4, // High quality
      currentPsf: 2650,
      districtAvgPsf: 2400,
      developerTier: 'TIER_1',
      greenMarkLevel: 'GOLDPLUS',
      rentalYield: 4.1,
      historicalReturns: 6.8, // Strong appreciation in district
      transactionVolume: 120, // High liquidity
      conquasScore: 92, // Excellent construction quality
      hasAwards: true // BCA Green Mark Award
    },
    
    // Unit-specific analysis for premium units
    unitAnalysis: [
      {
        // Same DQI inputs plus unit-specific data
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
        developerTier: 'TIER_1',
        greenMarkLevel: 'GOLDPLUS',
        rentalYield: 4.1,
        historicalReturns: 6.8,
        transactionVolume: 120,
        conquasScore: 92,
        hasAwards: true,
        
        // Unit-specific attributes
        unitSize: 1200, // 3-bedroom
        unitType: '3BR',
        floorLevel: 25, // High floor
        viewType: 'CITY', // City view
        unitPosition: 'CORNER', // Corner unit
        facing: 'South'
      },
      {
        // Mid-tier unit comparison
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
        developerTier: 'TIER_1',
        greenMarkLevel: 'GOLDPLUS',
        rentalYield: 4.1,
        historicalReturns: 6.8,
        transactionVolume: 120,
        conquasScore: 92,
        hasAwards: true,
        
        // Unit-specific attributes
        unitSize: 850, // 2-bedroom
        unitType: '2BR',
        floorLevel: 12, // Mid floor
        viewType: 'POOL', // Pool view
        unitPosition: 'REGULAR_GOOD', // Regular unit
        facing: 'East'
      }
    ],
    
    targetAnalysis: 'both',
    analysisDepth: 'comprehensive'
  }
  
  try {
    console.log('📊 Analyzing The Orie...')
    const analysis = await scoringEngine.analyzeProperty(testProperty)
    
    console.log('\n=== PROPERTY SCORING RESULTS ===')
    console.log(`Overall Rating: ${analysis.score.overallRating}/5 stars`)
    console.log(`DQI Score: ${analysis.score.dqiResult.totalScore}/100 (${analysis.score.dqiResult.grade})`)
    console.log(`Recommendation: ${analysis.score.recommendation}`)
    console.log(`Confidence Level: ${analysis.score.confidenceLevel}%`)
    
    console.log('\n=== CATEGORY SCORES ===')
    Object.entries(analysis.score.categoryScores).forEach(([category, score]) => {
      console.log(`${category.replace(/([A-Z])/g, ' $1').trim()}: ${score}/5`)
    })
    
    console.log('\n=== EXECUTIVE SUMMARY ===')
    console.log(analysis.executiveSummary)
    
    console.log('\n=== KEY STRENGTHS ===')
    analysis.strengths.forEach((strength, i) => {
      console.log(`${i + 1}. ${strength}`)
    })
    
    console.log('\n=== AREAS OF CONCERN ===')
    analysis.concerns.forEach((concern, i) => {
      console.log(`${i + 1}. ${concern}`)
    })
    
    console.log('\n=== INVESTMENT ANALYSIS ===')
    console.log(`Rental Yield: ${analysis.investmentAnalysis.rentalYield.estimated} (${analysis.investmentAnalysis.rentalYield.confidence} confidence)`)
    console.log(`Capital Appreciation: ${analysis.investmentAnalysis.capitalAppreciation.outlook} over ${analysis.investmentAnalysis.capitalAppreciation.timeframe}`)
    console.log(`Growth Drivers: ${analysis.investmentAnalysis.capitalAppreciation.drivers.join(', ')}`)
    console.log(`Target Buyers: ${analysis.investmentAnalysis.targetBuyers.join(', ')}`)
    
    console.log('\n=== UNIT-SPECIFIC ANALYSIS ===')
    if (analysis.score.usqiResults && analysis.score.usqiResults.length > 0) {
      analysis.score.usqiResults.forEach((usqi, i) => {
        const unit = testProperty.unitAnalysis[i]
        console.log(`\nUnit ${i + 1}: ${unit.unitType} (${unit.unitSize}sqft, Floor ${unit.floorLevel})`)
        console.log(`USQI Score: ${usqi.totalScore}/100`)
        console.log(`Unit Rating: ${usqi.grade}`)
        console.log(`Unit Insights: ${usqi.unitSpecificInsights.join('; ')}`)
      })
    }
    
    console.log('\n=== FINAL VERDICT ===')
    console.log(`Buy Rating: ${analysis.finalVerdict.buyRating}`)
    console.log(`Target Price: ${analysis.finalVerdict.targetPrice}`)
    console.log(`Investment Horizon: ${analysis.finalVerdict.investmentHorizon}`)
    console.log(`Suitable For: ${analysis.finalVerdict.suitability.join(', ')}`)
    
    console.log('\n=== RISK ASSESSMENT ===')
    if (analysis.risks.high.length > 0) {
      console.log(`High Risk: ${analysis.risks.high.join(', ')}`)
    }
    if (analysis.risks.medium.length > 0) {
      console.log(`Medium Risk: ${analysis.risks.medium.join(', ')}`)
    }
    if (analysis.risks.low.length > 0) {
      console.log(`Low Risk: ${analysis.risks.low.join(', ')}`)
    }
    
    // Test article generation
    console.log('\n📝 Generating article...')
    const articleId = await scoringEngine.generatePropertyReviewArticle(analysis, testProperty)
    
    if (articleId) {
      console.log(`✅ Article generated successfully! Article ID: ${articleId}`)
      console.log(`View at: http://localhost:3000/articles/${articleId}`)
    } else {
      console.log('❌ Article generation failed or skipped (OpenAI not configured)')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error(error.stack)
  }
}

// Run test
if (require.main === module) {
  testPropertyScoring()
    .then(() => {
      console.log('\n✅ Property Scoring Engine test completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error)
      process.exit(1)
    })
}

module.exports = { testPropertyScoring }