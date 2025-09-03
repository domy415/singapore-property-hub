import { NextResponse } from 'next/server'

// Test Singapore Property Image Finder Agent DALL-E 3 Generation

export async function GET() {
  try {
    console.log('🧪 Testing Singapore Property Image Finder Agent with DALL-E 3')
    
    // Dynamic import
    const { AgentPropertyImageFinder } = await import('@/services/agent-property-image-finder')
    
    const imageFinder = new AgentPropertyImageFinder()
    
    // Test cases based on your guidelines
    const testCases = [
      {
        title: 'Ultimate Guide to Living in District 12: Balestier, Toa Payoh, Serangoon',
        category: 'LOCATION_GUIDE',
        requirements: { district: '12' }
      },
      {
        title: 'Celebrating National Day: Insights into Singapore\'s Property Market in 2025',
        category: 'MARKET_INSIGHTS',
        requirements: {}
      },
      {
        title: 'Grand Dunman Comprehensive Review 2025',
        category: 'NEW_LAUNCH_REVIEW',
        requirements: { propertyName: 'Grand Dunman' }
      }
    ]

    const results = []
    let totalCost = 0

    for (const testCase of testCases) {
      try {
        console.log(`\n🎨 Testing: ${testCase.title}`)
        
        const imageResult = await imageFinder.findPropertyImage(
          testCase.title,
          testCase.title,
          testCase.category,
          testCase.requirements
        )

        results.push({
          title: testCase.title,
          success: imageResult.success,
          generated: imageResult.generated || false,
          imageUrl: imageResult.imageUrl,
          description: imageResult.description,
          cost: imageResult.cost || 0,
          imageType: imageResult.imageType,
          error: imageResult.error
        })

        if (imageResult.cost) {
          totalCost += imageResult.cost
        }

        console.log(`   Result: ${imageResult.success ? '✅' : '❌'}`)
        console.log(`   Generated: ${imageResult.generated ? 'Yes' : 'No'}`)
        console.log(`   Cost: $${imageResult.cost || 0}`)

      } catch (error) {
        console.error(`❌ Test failed for ${testCase.title}:`, error)
        results.push({
          title: testCase.title,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const generatedCount = results.filter(r => r.generated).length

    return NextResponse.json({
      success: true,
      message: 'Singapore Property Image Finder Agent test completed',
      summary: {
        totalTests: testCases.length,
        successful: successCount,
        generated: generatedCount,
        totalCost: `$${totalCost.toFixed(2)}`,
        successRate: `${Math.round((successCount / testCases.length) * 100)}%`
      },
      results: results,
      agent: 'Singapore Property Image Finder Agent with DALL-E 3',
      features: [
        'DALL-E 3 image generation with Singapore-specific prompts',
        'District-specific template matching',
        'Cost tracking and management',
        'Emergency fallback system'
      ]
    })

  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Singapore Property Image Finder Agent test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}