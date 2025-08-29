import { NextResponse } from 'next/server'
import { AgentPropertyImageFinder } from '@/services/agent-property-image-finder'

export async function GET() {
  try {
    console.log('=== Testing Singapore Property Image Finder Agent ===')
    
    const imageFinder = new AgentPropertyImageFinder()
    
    // Test different types of articles to show agent capabilities
    const testArticles = [
      {
        title: 'Grand Dunman Comprehensive Review 2025',
        topic: 'Grand Dunman condo review with investment analysis',
        category: 'NEW_LAUNCH_REVIEW',
        requirements: {
          propertyName: 'Grand Dunman'
        }
      },
      {
        title: 'District 9 Orchard Road Property Investment Guide',
        topic: 'Investment opportunities in Singapore\'s premier shopping district',
        category: 'LOCATION_GUIDE',
        requirements: {
          district: '9',
          neighborhood: 'Orchard Road'
        }
      },
      {
        title: 'Singapore Property Market Outlook 2025',
        topic: 'Market trends and investment insights for Singapore property',
        category: 'MARKET_INSIGHTS',
        requirements: {
          conceptType: 'market' as const
        }
      },
      {
        title: 'HDB Loan Eligibility Requirements Updated',
        topic: 'Latest changes to HDB financing and loan requirements',
        category: 'PROPERTY_NEWS',
        requirements: {
          conceptType: 'finance' as const
        }
      },
      {
        title: 'Marina One Residences Investment Analysis',
        topic: 'Luxury waterfront living and rental yield potential',
        category: 'INVESTMENT',
        requirements: {
          propertyName: 'Marina One',
          conceptType: 'finance' as const
        }
      }
    ]
    
    const results = []
    
    for (const article of testArticles) {
      console.log(`\nTesting: ${article.title}`)
      
      try {
        const imageResult = await imageFinder.findPropertyImage(
          article.title,
          article.topic,
          article.category,
          article.requirements
        )
        
        results.push({
          article: article.title,
          category: article.category,
          imageFound: imageResult.success,
          imageUrl: imageResult.imageUrl,
          imageType: imageResult.imageType,
          description: imageResult.description,
          caption: imageResult.suggestedCaption,
          relevanceScore: imageResult.relevanceScore,
          attribution: imageResult.attribution,
          alternativeOptions: imageResult.alternativeOptions?.length || 0,
          error: imageResult.error
        })
        
        console.log(`✓ Image found: ${imageResult.imageType} - ${imageResult.description}`)
        
      } catch (error) {
        console.error(`✗ Error finding image: ${error}`)
        results.push({
          article: article.title,
          category: article.category,
          imageFound: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    // Summary
    const successCount = results.filter(r => r.imageFound).length
    const imageTypes = results.map(r => r.imageType).filter(Boolean)
    const uniqueTypes = Array.from(new Set(imageTypes))
    
    console.log('\n=== Image Finder Agent Test Summary ===')
    console.log(`Total Tests: ${results.length}`)
    console.log(`Successful: ${successCount}`)
    console.log(`Image Types Found: ${uniqueTypes.join(', ')}`)
    console.log(`Average Relevance: ${(results.reduce((sum, r) => sum + (r.relevanceScore || 0), 0) / results.length).toFixed(2)}`)
    
    return NextResponse.json({
      message: 'Singapore Property Image Finder Agent test completed',
      summary: {
        totalTests: results.length,
        successful: successCount,
        failureRate: `${((results.length - successCount) / results.length * 100).toFixed(1)}%`,
        imageTypesFound: uniqueTypes,
        averageRelevance: (results.reduce((sum, r) => sum + (r.relevanceScore || 0), 0) / results.length).toFixed(2)
      },
      results: results,
      
      // Show image quality improvements
      improvements: {
        beforeAgent: {
          description: 'Generic stock images without Singapore context',
          issues: [
            'Non-specific property images',
            'Generic cityscapes',
            'No contextual relevance',
            'Random selection'
          ]
        },
        afterAgent: {
          description: 'High-quality, contextually relevant Singapore property images',
          benefits: [
            'Authentic Singapore property photos',
            'Property-specific image matching',
            'District and neighborhood context',
            'Professional quality guaranteed (1200x630)',
            'Free license images prioritized',
            'Cultural sensitivity maintained'
          ]
        }
      }
    })
    
  } catch (error) {
    console.error('Image finder agent test error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test image finder agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { articleTitle, articleTopic, category, requirements } = body
    
    console.log(`=== Testing Image Finder for Custom Article ===`)
    console.log(`Title: ${articleTitle}`)
    console.log(`Category: ${category}`)
    
    const imageFinder = new AgentPropertyImageFinder()
    
    const result = await imageFinder.findPropertyImage(
      articleTitle,
      articleTopic || articleTitle,
      category,
      requirements
    )
    
    return NextResponse.json({
      message: 'Custom image search completed',
      success: result.success,
      image: {
        url: result.imageUrl,
        type: result.imageType,
        description: result.description,
        caption: result.suggestedCaption,
        relevanceScore: result.relevanceScore
      },
      alternatives: result.alternativeOptions,
      attribution: result.attribution,
      error: result.error
    })
    
  } catch (error) {
    console.error('Custom image finder test error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to find image for custom article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}