import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection by counting articles and authors
    const [articlesCount, authorsCount, sampleArticles] = await Promise.all([
      prisma.article.count(),
      prisma.author.count(), 
      prisma.article.findMany({ 
        take: 3,
        select: {
          title: true,
          slug: true,
          category: true,
          publishedAt: true
        }
      })
    ])
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      data: {
        totalArticles: articlesCount,
        totalAuthors: authorsCount,
        sampleArticles: sampleArticles
      }
    })
  } catch (error: any) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to connect to Supabase database'
    }, { status: 500 })
  }
}