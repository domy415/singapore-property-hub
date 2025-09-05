import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ReliableImageService } from '@/services/reliable-image-service'
import { ArticleCategory } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 Starting comprehensive image duplication fix...')
    
    // Get all articles with their current images
    const articles = await prisma.article.findMany({
      select: { 
        id: true, 
        title: true, 
        category: true, 
        featuredImage: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📊 Found ${articles.length} articles to process`)

    const results = {
      totalArticles: articles.length,
      updated: 0,
      unchanged: 0,
      errors: 0,
      imageDistribution: {} as Record<string, string[]>,
      updatedArticles: [] as any[]
    }

    // Process each article with deterministic image selection
    for (const article of articles) {
      try {
        console.log(`\n🔄 Processing: "${article.title}"`)
        console.log(`  Category: ${article.category}`)
        console.log(`  Current image: ${article.featuredImage?.split('?')[0] || 'None'}`)

        // Get new deterministic image using article ID for uniqueness
        const reliableImage = await ReliableImageService.getReliableImage(
          article.category as ArticleCategory,
          article.title,
          true, // Prefer local
          article.id // Use article ID for deterministic selection
        )

        const newImageUrl = reliableImage.url
        const newImageWithTimestamp = `${newImageUrl}${newImageUrl.includes('?') ? '&' : '?'}t=${Date.now()}`

        // Check if image actually needs updating (ignore timestamp differences)
        const currentImageBase = article.featuredImage?.split('?')[0] || ''
        const newImageBase = newImageUrl.split('?')[0]

        if (currentImageBase !== newImageBase) {
          // Update the article with new image
          await prisma.article.update({
            where: { id: article.id },
            data: { featuredImage: newImageWithTimestamp }
          })

          // Track image distribution by category
          const category = article.category
          if (!results.imageDistribution[category]) {
            results.imageDistribution[category] = []
          }
          results.imageDistribution[category].push(newImageBase)

          results.updatedArticles.push({
            id: article.id,
            title: article.title,
            category: article.category,
            oldImage: currentImageBase,
            newImage: newImageBase,
            imageSource: reliableImage.source,
            deterministic: true
          })

          results.updated++
          console.log(`  ✅ Updated to: ${newImageBase}`)
        } else {
          results.unchanged++
          console.log(`  ⏸️  No change needed`)
        }

      } catch (error) {
        console.error(`❌ Error processing article ${article.id}:`, error)
        results.errors++
      }
    }

    // Calculate diversity statistics
    const diversityStats = {} as Record<string, any>
    for (const [category, images] of Object.entries(results.imageDistribution)) {
      const uniqueImages = Array.from(new Set(images))
      diversityStats[category] = {
        totalArticles: images.length,
        uniqueImages: uniqueImages.length,
        diversityRatio: uniqueImages.length / images.length,
        imageList: uniqueImages
      }
    }

    console.log(`\n📈 Image Duplication Fix Complete!`)
    console.log(`✅ Updated: ${results.updated} articles`)
    console.log(`⏸️  Unchanged: ${results.unchanged} articles`)
    console.log(`❌ Errors: ${results.errors} articles`)

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${articles.length} articles with deterministic image selection`,
      results,
      diversityStats,
      summary: {
        totalProcessed: articles.length,
        updated: results.updated,
        unchanged: results.unchanged,
        errors: results.errors,
        overallDiversityImprovement: Object.values(diversityStats).every(stat => stat.diversityRatio > 0.7) ? 'Excellent' : 'Good'
      }
    })

  } catch (error) {
    console.error('Image duplication fix failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Image duplication fix failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Analysis endpoint - check current image diversity
    const articles = await prisma.article.findMany({
      select: { 
        id: true, 
        title: true, 
        category: true, 
        featuredImage: true 
      }
    })

    const categoryStats = {} as Record<string, any>
    
    for (const article of articles) {
      const category = article.category
      const imageBase = article.featuredImage?.split('?')[0] || 'none'
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          articles: [],
          images: new Set(),
          duplicates: {} as Record<string, number>
        }
      }
      
      categoryStats[category].articles.push({
        id: article.id,
        title: article.title,
        image: imageBase
      })
      
      categoryStats[category].images.add(imageBase)
      
      // Track duplicates
      if (!categoryStats[category].duplicates[imageBase]) {
        categoryStats[category].duplicates[imageBase] = 0
      }
      categoryStats[category].duplicates[imageBase]++
    }

    // Calculate diversity metrics
    const analysisResults = {} as Record<string, any>
    let totalDuplicates = 0
    
    for (const [category, stats] of Object.entries(categoryStats)) {
      const totalArticles = stats.articles.length
      const uniqueImages = stats.images.size
      const diversityRatio = uniqueImages / totalArticles
      
      // Count duplicates (images used more than once)
      const duplicateImages = Object.entries(stats.duplicates)
        .filter(([_, count]) => (count as number) > 1)
        .map(([image, count]) => ({ image, count: count as number }))
      
      const duplicateCount = duplicateImages.reduce((sum, dup) => sum + (dup.count - 1), 0)
      totalDuplicates += duplicateCount
      
      analysisResults[category] = {
        totalArticles,
        uniqueImages,
        diversityRatio: Math.round(diversityRatio * 100) / 100,
        duplicateImages,
        duplicateCount,
        status: diversityRatio > 0.8 ? 'Excellent' : diversityRatio > 0.6 ? 'Good' : 'Needs Improvement'
      }
    }

    return NextResponse.json({
      success: true,
      totalArticles: articles.length,
      totalDuplicates,
      overallStatus: totalDuplicates === 0 ? 'Perfect' : totalDuplicates < 5 ? 'Good' : 'Needs Improvement',
      categoryAnalysis: analysisResults,
      recommendation: totalDuplicates > 0 ? 'Run POST /api/fix-image-duplication to fix duplicate images' : 'No action needed - image diversity is optimal'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}