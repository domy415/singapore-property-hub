import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing market updates API...')
    
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        publishedAt: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${articles.length} articles for market updates`)
    
    const updates = articles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || article.title.substring(0, 80) + '...',
      date: article.publishedAt || article.createdAt,
      category: article.category.replace(/_/g, ' ')
    }))
    
    return NextResponse.json({
      success: true,
      count: updates.length,
      updates: updates
    })
    
  } catch (error) {
    console.error('Error in market updates test:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}