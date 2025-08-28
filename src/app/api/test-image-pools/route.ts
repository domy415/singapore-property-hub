import { NextRequest, NextResponse } from 'next/server'
import { ImageSelector } from '@/services/image-selector'
import { ArticleCategory } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const results: any = {}
    
    // Test each category
    const categories = Object.values(ArticleCategory)
    
    for (const category of categories) {
      try {
        // Get 5 images for each category to test uniqueness
        const images = []
        for (let i = 0; i < 5; i++) {
          const image = await ImageSelector.getUniqueImage(category)
          images.push(image)
        }
        
        results[category] = {
          success: true,
          sampleImages: images,
          uniqueImages: new Set(images).size,
          totalSampled: images.length
        }
      } catch (error) {
        results[category] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image pool testing completed',
      results: results,
      summary: {
        categoriesTested: categories.length,
        totalImagesGenerated: Object.values(results).reduce((sum: number, result: any) => 
          sum + (result.totalSampled || 0), 0
        ),
        averageUniqueness: Object.values(results).reduce((sum: number, result: any) => 
          sum + (result.uniqueImages || 0) / (result.totalSampled || 1), 0
        ) / categories.length
      }
    })

  } catch (error) {
    console.error('Error testing image pools:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}