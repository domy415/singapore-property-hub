import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'
import { ImageSelector } from '@/services/image-selector'

export async function GET(request: NextRequest) {
  try {
    console.log('Starting image fix for all articles...')
    
    // Get all published articles
    const articles = await prisma.article.findMany({
      where: { 
        status: ArticleStatus.PUBLISHED 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        featuredImage: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${articles.length} articles to update`)

    const updatedArticles = []
    const failedUpdates = []

    for (const article of articles) {
      try {
        console.log(`Updating image for: ${article.title}`)

        // Get a new unique image for this article's category
        const newImage = await ImageSelector.getUniqueImage(article.category)
        
        // Update the article with new image
        await prisma.article.update({
          where: { id: article.id },
          data: {
            featuredImage: newImage,
            updatedAt: new Date()
          }
        })

        updatedArticles.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          category: article.category,
          oldImage: article.featuredImage,
          newImage: newImage,
          url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
        })

        console.log(`✅ Updated image for: ${article.title}`)

        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`❌ Failed to update image for article ${article.id}:`, error)
        failedUpdates.push({
          id: article.id,
          title: article.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Article image update completed',
      stats: {
        totalArticles: articles.length,
        articlesUpdated: updatedArticles.length,
        failedUpdates: failedUpdates.length
      },
      updatedArticles: updatedArticles.slice(0, 20), // Show first 20 for brevity
      failures: failedUpdates
    })

  } catch (error) {
    console.error('Error fixing article images:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}