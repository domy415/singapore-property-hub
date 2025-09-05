import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    
    const body = await request.json()
    const { id, content, title, excerpt, tags, featuredImage } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(tags && { tags }),
        ...(featuredImage && { featuredImage }),
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      article: updatedArticle
    })

  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}