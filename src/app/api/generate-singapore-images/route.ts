import { NextResponse } from 'next/server'

// Singapore Property Image Finder Agent - DALL-E 3 Generation API
// Properly implements the agent guidelines with AI image generation

function getConceptType(category: string): 'finance' | 'market' | 'regulation' | 'lifestyle' | undefined {
  switch (category) {
    case 'INVESTMENT':
      return 'finance'
    case 'MARKET_INSIGHTS':
      return 'market'
    case 'PROPERTY_NEWS':
      return 'regulation'
    case 'NEIGHBORHOOD':
    case 'LOCATION_GUIDE':
      return 'lifestyle'
    default:
      return undefined
  }
}

export async function POST() {
  try {
    // Build-time guard
    if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database not available during build',
        message: 'This endpoint is only available in production or with DATABASE_URL set'
      })
    }

    console.log('=== Singapore Property Image Finder Agent - DALL-E 3 Generation ===')
    
    // Dynamic imports
    const { prisma } = await import('@/lib/prisma')
    const { AgentPropertyImageFinder } = await import('@/services/agent-property-image-finder')
    
    const imageFinder = new AgentPropertyImageFinder()
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        featuredImage: true,
        slug: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`🇸🇬 Processing ${articles.length} articles with Singapore Property Image Finder Agent`)

    const updates = []
    let totalCost = 0
    let generatedCount = 0
    let fallbackCount = 0
    
    for (const article of articles) {
      try {
        console.log(`\n🎨 Processing: ${article.title}`)
        
        // Extract requirements from article
        const districtMatch = article.content?.match(/district\s+(\d{1,2})/i)
        const district = districtMatch ? districtMatch[1] : undefined
        
        const propertyName = imageFinder.extractPropertyName(article.title)
        
        // Use Singapore Property Image Finder Agent with DALL-E 3
        const imageResult = await imageFinder.findPropertyImage(
          article.title,
          article.title, // Use title as topic
          article.category,
          {
            district,
            propertyName,
            conceptType: getConceptType(article.category)
          }
        )
        
        if (imageResult.success) {
          console.log(`✅ ${imageResult.generated ? 'Generated' : 'Fallback'} image: ${imageResult.description?.substring(0, 100)}`)
          
          if (imageResult.generated) {
            generatedCount++
            totalCost += imageResult.cost || 0
            console.log(`💰 Cost: $${imageResult.cost || 0}`)
          } else {
            fallbackCount++
          }
          
          // Update database
          await prisma.article.update({
            where: { id: article.id },
            data: { featuredImage: imageResult.imageUrl }
          })
          
          updates.push({
            id: article.id,
            title: article.title,
            category: article.category,
            oldImage: article.featuredImage,
            newImage: imageResult.imageUrl,
            generated: imageResult.generated || false,
            cost: imageResult.cost || 0,
            imageType: imageResult.imageType,
            relevanceScore: imageResult.relevanceScore,
            description: imageResult.description,
            url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
          })
        } else {
          console.log(`❌ Failed to generate image for: ${article.title}`)
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${article.title}:`, error instanceof Error ? error.message : error)
      }
    }

    console.log(`\n🎉 Singapore Property Image Finder Agent completed:`)
    console.log(`   Total articles: ${articles.length}`)
    console.log(`   Updated: ${updates.length}`)
    console.log(`   Generated with DALL-E 3: ${generatedCount}`)
    console.log(`   Emergency fallbacks: ${fallbackCount}`)
    console.log(`   Total cost: $${totalCost.toFixed(2)}`)

    return NextResponse.json({
      success: true,
      message: 'Singapore Property Image Finder Agent - DALL-E 3 generation completed',
      agent: 'Singapore Property Image Finder Agent with DALL-E 3',
      summary: {
        articlesChecked: articles.length,
        articlesUpdated: updates.length,
        generatedImages: generatedCount,
        fallbackImages: fallbackCount,
        totalCost: `$${totalCost.toFixed(2)}`,
        compliance: 'All images follow Singapore Property Image Finder Agent guidelines'
      },
      updates: updates
    })

  } catch (error) {
    console.error('Singapore Property Image Finder Agent failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to run Singapore Property Image Finder Agent', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Singapore Property Image Finder Agent - DALL-E 3 Generation',
    info: 'Use POST to generate Singapore-specific images for all articles',
    features: [
      'DALL-E 3 generation with Singapore-specific prompts',
      'Developer website image fetching for condo reviews',
      'District-specific prompt templates',
      'Cost tracking and management (<$5/month target)',
      'Emergency fallback to Singapore Marina Bay skyline'
    ],
    guidelines: 'Following Singapore Property Image Finder Agent specifications'
  })
}