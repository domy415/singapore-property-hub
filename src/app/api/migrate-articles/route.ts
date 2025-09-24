import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import articlesData from '@/database-articles-check.json'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting migration to Supabase...')
    console.log(`📚 Found ${articlesData.articles.length} articles to migrate`)
    
    // Create default author if doesn't exist
    let author = await prisma.author.findFirst({
      where: { email: 'team@singaporepropertyhub.com' }
    })
    
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: 'Property Hub Team',
          email: 'team@singaporepropertyhub.com',
          bio: 'Expert analysis and insights from our property research team.'
        }
      })
      console.log('✅ Created default author')
    } else {
      console.log('✅ Default author already exists')
    }
    
    let migratedCount = 0
    let skippedCount = 0
    const errors: string[] = []
    
    // Migrate each article
    for (const article of articlesData.articles) {
      try {
        // Check if article already exists
        const exists = await prisma.article.findUnique({
          where: { slug: article.slug }
        })
        
        if (exists) {
          console.log(`⏭️  Skipping existing: ${article.title.substring(0, 50)}...`)
          skippedCount++
          continue
        }
        
        // Map category to enum value
        const categoryMapping: Record<string, any> = {
          'MARKET_INSIGHTS': 'MARKET_INSIGHTS',
          'BUYING_GUIDE': 'BUYING_GUIDE', 
          'SELLING_GUIDE': 'SELLING_GUIDE',
          'INVESTMENT': 'INVESTMENT',
          'NEIGHBORHOOD': 'NEIGHBORHOOD',
          'PROPERTY_NEWS': 'PROPERTY_NEWS',
          'NEW_LAUNCH_REVIEW': 'NEW_LAUNCH_REVIEW',
          'LOCATION_GUIDE': 'LOCATION_GUIDE'
        }
        
        const category = categoryMapping[article.category] || 'MARKET_INSIGHTS'
        
        // Create article
        await prisma.article.create({
          data: {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || '',
            content: article.content || '',
            category: category,
            status: 'PUBLISHED',
            publishedAt: new Date(article.publishedAt || Date.now()),
            authorId: author.id,
            views: article.views || 0,
            readTime: '5 min read',
            tags: article.tags || [],
            featuredImage: null, // Will be set by image mapping function
            seoTitle: article.seoTitle || article.title,
            seoDescription: article.seoDescription || article.excerpt,
            seoKeywords: article.seoKeywords || []
          }
        })
        
        console.log(`✅ Migrated: ${article.title.substring(0, 50)}...`)
        migratedCount++
      } catch (error: any) {
        const errorMsg = `Failed to migrate ${article.title.substring(0, 50)}...: ${error.message}`
        console.error(`❌ ${errorMsg}`)
        errors.push(errorMsg)
      }
    }
    
    const totalCount = await prisma.article.count()
    
    const result = {
      success: true,
      message: 'Migration completed',
      stats: {
        migrated: migratedCount,
        skipped: skippedCount,
        totalInDatabase: totalCount,
        errors: errors
      }
    }
    
    console.log(`\n🎉 Migration complete!`)
    console.log(`📊 Results:`, result.stats)
    
    return NextResponse.json(result)
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}