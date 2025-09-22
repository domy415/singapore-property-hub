import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const path = require('path')
    const fs = require('fs')
    const articlesPath = path.join(process.cwd(), 'database-articles-check.json')
    
    if (fs.existsSync(articlesPath)) {
      const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'))
      return NextResponse.json({
        count: data.articles.length,
        slugs: data.articles.map((a: any) => ({
          id: a.id,
          slug: a.slug,
          title: a.title
        }))
      })
    }
    
    return NextResponse.json({ error: 'No articles found' })
  } catch (error) {
    return NextResponse.json({ error: String(error) })
  }
}