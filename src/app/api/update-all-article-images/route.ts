import { NextRequest, NextResponse } from 'next/server'

// Dynamic import to prevent build-time Prisma initialization
async function updateAllArticleImages() {
  try {
    // Import Prisma and services dynamically
    const { prisma } = await import('@/lib/prisma')
    const { AgentPropertyImageFinder } = await import('@/services/agent-property-image-finder')
    
    const imageFinder = new AgentPropertyImageFinder()
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: { id: true, title: true, category: true, content: true, featuredImage: true },
      orderBy: { publishedAt: 'desc' }
    })
    
    console.log(`Updating images for ${articles.length} articles...`)
    
    const results = []
    
    for (const article of articles) {
      try {
        console.log(`Processing: ${article.title}`)
        
        // Extract requirements from content
        const districtMatch = article.content?.match(/district\s+(\d{1,2})/i)
        const district = districtMatch ? districtMatch[1] : undefined
        
        const propertyMatch = article.title.match(/(grand dunman|marina one|bloomsbury|lentor|the sail)/i)
        const propertyName = propertyMatch ? propertyMatch[1] : undefined
        
        // Find appropriate image
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
        
        // Update article with new image
        const updatedArticle = await prisma.article.update({
          where: { id: article.id },
          data: { 
            featuredImage: imageResult.imageUrl + `&t=${Date.now()}` // Cache busting
          }
        })
        
        results.push({
          title: article.title,
          oldImage: article.featuredImage,
          newImage: imageResult.imageUrl,
          imageType: imageResult.imageType,
          relevanceScore: imageResult.relevanceScore,
          description: imageResult.description,
          updated: true
        })
        
        console.log(`✅ Updated: ${article.title} -> ${imageResult.imageType}`)
        
      } catch (error) {
        console.error(`Failed to update ${article.title}:`, error)
        results.push({
          title: article.title,
          error: error instanceof Error ? error.message : 'Unknown error',
          updated: false
        })
      }
    }
    
    return results
    
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  }
}

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

export async function GET(request: NextRequest) {
  try {
    console.log('Starting comprehensive article image update...')
    
    const results = await updateAllArticleImages()
    
    const successCount = results.filter(r => r.updated).length
    const failureCount = results.filter(r => !r.updated).length
    
    return NextResponse.json({
      success: true,
      message: `Updated images for ${successCount} articles`,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      },
      results: results.map(r => ({
        title: r.title,
        imageType: r.imageType,
        relevanceScore: r.relevanceScore,
        updated: r.updated,
        error: r.error
      }))
    })
    
  } catch (error) {
    console.error('Article image update failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update article images',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}