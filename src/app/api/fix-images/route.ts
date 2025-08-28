import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ImageSelector } from '@/services/image-selector'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting article image fix...')
    
    // Get all articles ordered by creation date
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, category: true, featuredImage: true }
    })

    console.log(`Found ${articles.length} articles to process`)

    const usedImages = new Set<string>()
    const updates = []

    for (const article of articles) {
      try {
        // Get a unique image for this category
        let newImage = await ImageSelector.getUniqueImage(article.category)
        
        // If this image is already used in our current session, try to get another
        let attempts = 0
        while (usedImages.has(newImage) && attempts < 5) {
          newImage = await ImageSelector.getUniqueImage(article.category)
          attempts++
        }
        
        // Update if different from current image
        if (article.featuredImage !== newImage) {
          await prisma.article.update({
            where: { id: article.id },
            data: { featuredImage: newImage }
          })
          
          updates.push({
            title: article.title.substring(0, 50) + '...',
            oldImage: article.featuredImage?.split('/').pop()?.split('?')[0] || 'none',
            newImage: newImage.split('/').pop()?.split('?')[0] || 'unknown'
          })
        }
        
        usedImages.add(newImage)
        
        // Reset if we've used too many
        if (usedImages.size > 20) {
          usedImages.clear()
        }
        
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Article images fixed successfully',
      stats: {
        totalArticles: articles.length,
        updatedArticles: updates.length,
        unchangedArticles: articles.length - updates.length
      },
      updates: updates.slice(0, 10) // Show first 10 updates
    })

  } catch (error) {
    console.error('Error fixing article images:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fix article images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}