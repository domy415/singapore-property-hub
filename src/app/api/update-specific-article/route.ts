import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, title, content, excerpt, category, tags, seoTitle, seoDescription, seoKeywords } = body

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Slug is required'
      }, { status: 400 })
    }

    // Find the article by slug
    const existingArticle = await prisma.article.findFirst({
      where: { slug }
    })

    if (!existingArticle) {
      return NextResponse.json({
        success: false,
        error: `Article with slug "${slug}" not found`
      }, { status: 404 })
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: existingArticle.id },
      data: {
        title: title || existingArticle.title,
        content: content || existingArticle.content,
        excerpt: excerpt || existingArticle.excerpt,
        category: category || existingArticle.category,
        tags: tags || existingArticle.tags,
        seoTitle: seoTitle || existingArticle.seoTitle,
        seoDescription: seoDescription || existingArticle.seoDescription,
        seoKeywords: seoKeywords || existingArticle.seoKeywords,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        slug: updatedArticle.slug,
        updatedAt: updatedArticle.updatedAt
      }
    })

  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}