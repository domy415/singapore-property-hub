import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ImageSelector } from '@/services/image-selector'

export async function GET() {
  try {
    // Get first 10 articles to update
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        featuredImage: true
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })

    const results = []

    for (const article of articles) {
      const newImage = await ImageSelector.getUniqueImage(article.category)
      
      await prisma.article.update({
        where: { id: article.id },
        data: { featuredImage: newImage }
      })

      results.push({
        title: article.title,
        oldImage: article.featuredImage,
        newImage: newImage
      })
    }

    return NextResponse.json({
      success: true,
      updated: results.length,
      results: results
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}