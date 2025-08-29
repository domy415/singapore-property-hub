import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        featuredImage: true,
        slug: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles: articles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        featuredImage: article.featuredImage,
        createdAt: article.createdAt
      }))
    })
  } catch (error) {
    console.error('Error inspecting articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to inspect articles' },
      { status: 500 }
    )
  }
}