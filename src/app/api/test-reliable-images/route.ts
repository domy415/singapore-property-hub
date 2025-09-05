import { NextRequest, NextResponse } from 'next/server'
import { ReliableImageService } from '@/services/reliable-image-service'
import { AgentPropertyImageFinder } from '@/services/agent-property-image-finder'
import { ArticleCategory } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Reliable Image System...')

    const results = {
      timestamp: new Date().toISOString(),
      reliable_service_stats: ReliableImageService.getImageStats(),
      test_results: [] as any[],
      performance: {
        start_time: Date.now(),
        total_time: 0,
        tests_passed: 0,
        tests_failed: 0
      }
    }

    // Test 1: Local image selection for each category
    console.log('📋 Test 1: Local image selection for each category')
    
    for (const [categoryName, category] of Object.entries(ArticleCategory)) {
      try {
        const image = await ReliableImageService.getReliableImage(
          category as ArticleCategory,
          `Test Article for ${categoryName}`,
          true // Prefer local
        )
        
        results.test_results.push({
          test: `Local image for ${categoryName}`,
          status: 'PASSED',
          image_url: image.url,
          source: image.source,
          fallback_index: image.fallbackIndex,
          alt_text: image.alt
        })
        
        results.performance.tests_passed++
      } catch (error) {
        results.test_results.push({
          test: `Local image for ${categoryName}`,
          status: 'FAILED', 
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        
        results.performance.tests_failed++
      }
    }

    // Test 2: External image fallback system
    console.log('📋 Test 2: External image fallback system')
    
    try {
      const externalImage = await ReliableImageService.getReliableImage(
        ArticleCategory.MARKET_INSIGHTS,
        'Singapore Market Analysis Test',
        false // Don't prefer local - test external
      )
      
      results.test_results.push({
        test: 'External image fallback',
        status: 'PASSED',
        image_url: externalImage.url,
        source: externalImage.source,
        fallback_index: externalImage.fallbackIndex
      })
      
      results.performance.tests_passed++
    } catch (error) {
      results.test_results.push({
        test: 'External image fallback',
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      results.performance.tests_failed++
    }

    // Test 3: AgentPropertyImageFinder with new system
    console.log('📋 Test 3: AgentPropertyImageFinder integration')
    
    try {
      const imageFinder = new AgentPropertyImageFinder()
      const agentResult = await imageFinder.findPropertyImage(
        'Singapore District 10 Property Review',
        'Luxury condos in prime district',
        'NEW_LAUNCH_REVIEW',
        { district: '10', neighborhood: 'Bukit Timah' }
      )
      
      results.test_results.push({
        test: 'AgentPropertyImageFinder integration',
        status: 'PASSED',
        image_url: agentResult.imageUrl,
        description: agentResult.description,
        relevance_score: agentResult.relevanceScore,
        cost: agentResult.cost || 0
      })
      
      results.performance.tests_passed++
    } catch (error) {
      results.test_results.push({
        test: 'AgentPropertyImageFinder integration', 
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      results.performance.tests_failed++
    }

    // Test 4: Performance and reliability metrics
    console.log('📋 Test 4: Performance metrics')
    
    const performanceStart = Date.now()
    const performancePromises = []
    
    // Test concurrent image requests
    for (let i = 0; i < 5; i++) {
      performancePromises.push(
        ReliableImageService.getReliableImage(
          ArticleCategory.BUYING_GUIDE,
          `Performance test ${i + 1}`,
          true
        )
      )
    }
    
    const performanceResults = await Promise.allSettled(performancePromises)
    const performanceTime = Date.now() - performanceStart
    
    const successfulPerformanceTests = performanceResults.filter(
      result => result.status === 'fulfilled'
    ).length
    
    results.test_results.push({
      test: 'Concurrent performance test',
      status: successfulPerformanceTests === 5 ? 'PASSED' : 'PARTIAL',
      concurrent_requests: 5,
      successful_requests: successfulPerformanceTests,
      total_time_ms: performanceTime,
      avg_time_per_request_ms: performanceTime / 5
    })
    
    if (successfulPerformanceTests === 5) {
      results.performance.tests_passed++
    } else {
      results.performance.tests_failed++
    }

    // Final calculations
    results.performance.total_time = Date.now() - results.performance.start_time
    
    const summary = {
      overall_status: results.performance.tests_failed === 0 ? 'ALL_TESTS_PASSED' : 'SOME_TESTS_FAILED',
      total_tests: results.performance.tests_passed + results.performance.tests_failed,
      success_rate: `${Math.round((results.performance.tests_passed / (results.performance.tests_passed + results.performance.tests_failed)) * 100)}%`,
      recommendations: [] as string[]
    }

    // Generate recommendations based on test results
    if (results.performance.tests_failed > 0) {
      summary.recommendations.push('Some tests failed - check error details above')
    }
    
    if (results.performance.total_time > 5000) {
      summary.recommendations.push('Performance is slower than expected - consider optimizing image loading')
    }

    if (results.performance.tests_passed === results.performance.tests_passed + results.performance.tests_failed) {
      summary.recommendations.push('All systems operational - reliable image system is working correctly')
    }

    console.log(`✅ Image system test completed: ${summary.success_rate} success rate`)

    return NextResponse.json({
      success: true,
      summary,
      detailed_results: results,
      message: `Reliable Image System tested: ${summary.success_rate} success rate`
    })

  } catch (error) {
    console.error('Reliable Image System test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Test execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint to test specific image scenarios
export async function POST(request: NextRequest) {
  try {
    const { category, title, preferLocal } = await request.json()
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category is required'
      }, { status: 400 })
    }

    const image = await ReliableImageService.getReliableImage(
      category as ArticleCategory,
      title || 'Test Article',
      preferLocal !== false // Default to prefer local
    )

    return NextResponse.json({
      success: true,
      image,
      message: 'Image retrieved successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Image retrieval failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}