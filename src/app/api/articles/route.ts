import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArticleCategory, ArticleStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as ArticleStatus | null
    const category = searchParams.get('category') as ArticleCategory | null
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (status) where.status = status
    if (category) where.category = category

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              email: true,
              bio: true,
              photo: true
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.article.count({ where })
    ])

    return NextResponse.json({
      articles,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      authorEmail,
      seoTitle,
      seoDescription,
      seoKeywords,
      status = ArticleStatus.DRAFT,
      publish = false
    } = body

    // Find or create author
    let author = await prisma.author.findUnique({
      where: { email: authorEmail || 'expert@singaporepropertyhub.sg' }
    })

    if (!author) {
      author = await prisma.author.create({
        data: {
          email: authorEmail || 'expert@singaporepropertyhub.sg',
          name: 'Singapore Property Hub Expert Team',
          bio: 'Expert analysts and property professionals providing insights into Singapore real estate market.'
        }
      })
    }

    // Create the article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        featuredImage,
        authorId: author.id,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        seoKeywords: seoKeywords || tags,
        status: publish ? ArticleStatus.PUBLISHED : status,
        publishedAt: publish ? new Date() : null
      },
      include: {
        author: true
      }
    })

    return NextResponse.json({
      success: true,
      article,
      message: publish ? 'Article published successfully!' : 'Article saved as draft'
    })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}