import { NextRequest, NextResponse } from 'next/server'
import { condoReviewGenerator } from '@/services/agent-condo-review-generator'
import { developerDomainManager } from '@/services/developer-domain-manager'

/**
 * Test endpoint for automated domain management during condo review generation
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'validate'

    switch (action) {
      case 'validate':
        const validation = await developerDomainManager.validateDomainWhitelist()
        return NextResponse.json({
          success: true,
          action: 'validate',
          data: validation
        })

      case 'extract':
        const extraction = await developerDomainManager.extractDomainsFromCondoData()
        return NextResponse.json({
          success: true,
          action: 'extract',
          data: extraction
        })

      case 'test-condo-review':
        // Test the full condo review generation with domain management
        const testCondoData = {
          projectName: 'Test Residences',
          developerName: 'Test Developer Pte Ltd',
          location: 'Marina Bay',
          district: 1,
          images: [
            'https://test-developer.sg/images/facade.jpg',
            'https://test-developer.sg/images/pool.jpg',
            'https://new-developer-site.com.sg/gallery/interior.jpg'
          ],
          developerWebsite: 'https://test-developer.sg'
        }

        const reviewResult = await condoReviewGenerator.generateCondoReview(testCondoData)
        
        return NextResponse.json({
          success: true,
          action: 'test-condo-review',
          data: {
            reviewGenerated: reviewResult.success,
            domainManagement: reviewResult.domainManagement,
            articleTitle: reviewResult.article.title,
            featuredImage: reviewResult.article.featuredImage
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: validate, extract, test-condo-review'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Domain automation test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, condoData } = await request.json()

    switch (action) {
      case 'generate-with-domains':
        if (!condoData) {
          return NextResponse.json({
            success: false,
            error: 'condoData is required'
          }, { status: 400 })
        }

        const reviewResult = await condoReviewGenerator.generateCondoReview(condoData)
        
        return NextResponse.json({
          success: true,
          action: 'generate-with-domains',
          data: reviewResult
        })

      case 'batch-update-domains':
        // Update all domains from current condo data
        const result = await developerDomainManager.autoUpdateDomains()
        
        return NextResponse.json({
          success: true,
          action: 'batch-update-domains',
          data: result
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: generate-with-domains, batch-update-domains'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Domain automation test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}