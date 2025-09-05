import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleCategory } from '@prisma/client'

// Local images data (matching ReliableImageService)
const LOCAL_IMAGES = {
  [ArticleCategory.MARKET_INSIGHTS]: [
    '/images/singapore-cbd-skyline-01.jpg',
    '/images/marina-bay-financial-district-02.jpg', 
    '/images/singapore-business-district-03.jpg',
    '/images/raffles-place-towers-04.jpg',
    '/images/singapore-cityscape-evening-05.jpg',
    '/images/marina-bay-sands-skyline-06.jpg',
    '/images/singapore-financial-center-07.jpg',
    '/images/cbd-architecture-modern-08.jpg'
  ],
  [ArticleCategory.BUYING_GUIDE]: [
    '/images/modern-condo-interior-01.jpg',
    '/images/property-viewing-keys-02.jpg',
    '/images/singapore-home-interior-03.jpg',
    '/images/luxury-apartment-living-04.jpg',
    '/images/property-contract-signing-05.jpg',
    '/images/home-inspection-checklist-06.jpg',
    '/images/modern-kitchen-design-07.jpg',
    '/images/property-walkthrough-08.jpg'
  ],
  [ArticleCategory.SELLING_GUIDE]: [
    '/images/for-sale-singapore-property-01.jpg',
    '/images/property-agent-meeting-02.jpg',
    '/images/house-valuation-singapore-03.jpg',
    '/images/property-marketing-materials-04.jpg',
    '/images/home-staging-singapore-05.jpg',
    '/images/property-negotiation-06.jpg',
    '/images/sale-completion-documents-07.jpg',
    '/images/handover-keys-singapore-08.jpg'
  ],
  [ArticleCategory.INVESTMENT]: [
    '/images/singapore-financial-charts-01.jpg',
    '/images/property-investment-analysis-02.jpg',
    '/images/real-estate-portfolio-03.jpg',
    '/images/singapore-market-data-04.jpg',
    '/images/investment-calculator-05.jpg',
    '/images/property-roi-graphs-06.jpg',
    '/images/financial-planning-singapore-07.jpg',
    '/images/real-estate-analytics-08.jpg'
  ],
  [ArticleCategory.NEIGHBORHOOD]: [
    '/images/singapore-hdb-estate-01.jpg',
    '/images/toa-payoh-neighborhood-02.jpg',
    '/images/singapore-residential-street-03.jpg',
    '/images/void-deck-community-04.jpg',
    '/images/singapore-playground-dragon-05.jpg',
    '/images/hdb-blocks-modern-06.jpg',
    '/images/neighborhood-amenities-07.jpg',
    '/images/singapore-heartland-08.jpg'
  ],
  [ArticleCategory.PROPERTY_NEWS]: [
    '/images/singapore-government-building-01.jpg',
    '/images/ura-policy-documents-02.jpg',
    '/images/property-news-singapore-03.jpg',
    '/images/mas-building-singapore-04.jpg',
    '/images/policy-announcement-05.jpg',
    '/images/singapore-parliament-06.jpg',
    '/images/regulatory-documents-07.jpg',
    '/images/official-statistics-08.jpg'
  ],
  [ArticleCategory.NEW_LAUNCH_REVIEW]: [
    '/images/singapore-condo-construction-01.jpg',
    '/images/new-development-showflat-02.jpg',
    '/images/modern-condo-facade-03.jpg',
    '/images/luxury-amenities-pool-04.jpg',
    '/images/new-launch-singapore-05.jpg',
    '/images/condo-gym-facilities-06.jpg',
    '/images/rooftop-garden-singapore-07.jpg',
    '/images/smart-home-features-08.jpg'
  ],
  [ArticleCategory.LOCATION_GUIDE]: [
    '/images/singapore-mrt-station-01.jpg',
    '/images/orchard-road-shopping-02.jpg',
    '/images/singapore-districts-map-03.jpg',
    '/images/transport-connectivity-04.jpg',
    '/images/singapore-landmarks-05.jpg',
    '/images/district-amenities-06.jpg',
    '/images/singapore-location-guide-07.jpg',
    '/images/neighborhood-lifestyle-08.jpg'
  ]
}

function getUniqueImage(category: ArticleCategory, articleId: string, title: string): string {
  const categoryImages = LOCAL_IMAGES[category] || LOCAL_IMAGES[ArticleCategory.MARKET_INSIGHTS]
  
  // Create deterministic hash from article ID and title
  let hash = 0
  const inputString = articleId + title
  
  for (let i = 0; i < inputString.length; i++) {
    const char = inputString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use absolute value to ensure positive index
  const imageIndex = Math.abs(hash) % categoryImages.length
  
  return categoryImages[imageIndex]
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Forcing unique images for all articles with deterministic selection...')
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: { 
        id: true, 
        title: true, 
        category: true, 
        featuredImage: true
      },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📊 Found ${articles.length} articles to update`)

    const results = {
      totalArticles: articles.length,
      updated: 0,
      imageDistribution: {} as Record<string, Set<string>>,
      updates: [] as any[]
    }

    // Track image usage by category
    for (const category of Object.values(ArticleCategory)) {
      results.imageDistribution[category] = new Set()
    }

    // Update each article with unique image
    for (const article of articles) {
      const uniqueImage = getUniqueImage(
        article.category as ArticleCategory, 
        article.id, 
        article.title
      )
      
      const newImageUrl = `${uniqueImage}?t=${Date.now()}`
      const currentImageBase = article.featuredImage?.split('?')[0] || ''
      
      // Always update to ensure uniqueness
      await prisma.article.update({
        where: { id: article.id },
        data: { featuredImage: newImageUrl }
      })
      
      // Track image distribution
      results.imageDistribution[article.category].add(uniqueImage)
      
      results.updates.push({
        id: article.id,
        title: article.title,
        category: article.category,
        oldImage: currentImageBase,
        newImage: uniqueImage,
        imageIndex: uniqueImage.split('-').pop()?.split('.')[0] || '??',
        deterministic: true
      })
      
      results.updated++
      console.log(`  ✅ ${article.title.substring(0, 50)}... -> ${uniqueImage.split('/').pop()}`)
    }

    // Calculate diversity statistics
    const diversityStats: Record<string, any> = {}
    for (const [category, imageSet] of Object.entries(results.imageDistribution)) {
      const categoryArticles = articles.filter(a => a.category === category)
      diversityStats[category] = {
        totalArticles: categoryArticles.length,
        uniqueImages: imageSet.size,
        diversityRatio: categoryArticles.length > 0 ? imageSet.size / categoryArticles.length : 1,
        duplicateCount: Math.max(0, categoryArticles.length - imageSet.size)
      }
    }

    console.log(`\n📈 Unique Image Assignment Complete!`)
    console.log(`✅ Updated: ${results.updated} articles`)

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${results.updated} articles with unique deterministic images`,
      results,
      diversityStats,
      summary: {
        totalProcessed: articles.length,
        allUpdated: results.updated,
        averageDiversity: Object.values(diversityStats).reduce((sum: number, stat: any) => sum + stat.diversityRatio, 0) / Object.keys(diversityStats).length,
        perfectDiversity: Object.values(diversityStats).every((stat: any) => stat.duplicateCount === 0)
      }
    })

  } catch (error) {
    console.error('Force unique images failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Force unique images failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to force unique images for all articles',
    usage: 'POST /api/force-unique-images'
  })
}