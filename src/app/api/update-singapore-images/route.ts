import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AgentPropertyImageFinder } from '@/services/agent-property-image-finder'

export async function POST(request: NextRequest) {
  try {
    const { dryRun = true } = await request.json()
    
    console.log(`Starting Singapore-specific image update (dry run: ${dryRun})`)
    
    // Get all published articles
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        category: true,
        featuredImage: true
      }
    })

    const imageFinder = new AgentPropertyImageFinder()
    const updates = []

    for (const article of articles) {
      try {
        // Get Singapore-specific image for this article
        const imageResult = await imageFinder.findPropertyImage(
          article.title,
          article.title, // Use title as topic
          article.category,
          {} // No specific requirements, let the agent decide
        )

        if (imageResult.success && imageResult.imageUrl !== article.featuredImage) {
          const updateInfo = {
            articleId: article.id,
            title: article.title,
            currentImage: article.featuredImage,
            newImage: imageResult.imageUrl,
            description: imageResult.description,
            relevanceScore: imageResult.relevanceScore,
            imageType: imageResult.imageType
          }

          updates.push(updateInfo)

          if (!dryRun) {
            // Actually update the database
            await prisma.article.update({
              where: { id: article.id },
              data: { featuredImage: imageResult.imageUrl }
            })
            console.log(`✅ Updated: ${article.title}`)
          } else {
            console.log(`📋 Would update: ${article.title}`)
          }
        }
      } catch (error) {
        console.error(`Error processing article ${article.title}:`, error)
      }
    }

    const response = {
      success: true,
      dryRun,
      totalArticles: articles.length,
      updatesAvailable: updates.length,
      updates: updates.map(update => ({
        title: update.title,
        imageType: update.imageType,
        relevanceScore: update.relevanceScore,
        description: update.description,
        currentImage: update.currentImage?.substring(0, 60) + '...',
        newImage: update.newImage.substring(0, 60) + '...'
      })),
      message: dryRun 
        ? `Found ${updates.length} articles that would benefit from Singapore-specific images` 
        : `Successfully updated ${updates.length} articles with Singapore-specific images`
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error updating Singapore images:', error)
    return NextResponse.json(
      { error: 'Failed to update images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Singapore Property Image Updater',
    usage: {
      dryRun: 'POST with {"dryRun": true} to see what would be updated',
      execute: 'POST with {"dryRun": false} to apply updates'
    }
  })
}