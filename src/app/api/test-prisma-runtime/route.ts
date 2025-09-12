export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      take: 1,
      select: {
        id: true,
        title: true,
        slug: true
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prisma working with Node.js runtime',
      sampleArticle: articles[0] || null
    })
  } catch (error: any) {
    console.error('Prisma runtime test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack?.substring(0, 500)
    }, { status: 500 })
  }
}