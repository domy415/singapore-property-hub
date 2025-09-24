require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

console.log('🔌 Environment check:')
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL starts with postgresql://', process.env.DATABASE_URL ? process.env.DATABASE_URL.startsWith('postgresql://') : false)
console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'not found')
console.log('DIRECT_URL present:', !!process.env.DIRECT_URL)

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables')
  process.exit(1)
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Read the articles data
const articlesDataPath = path.join(__dirname, '..', 'database-articles-check.json')
const articlesData = JSON.parse(fs.readFileSync(articlesDataPath, 'utf8'))

async function migrate() {
  console.log('🚀 Starting migration to Supabase...')
  console.log(`📚 Found ${articlesData.articles.length} articles to migrate`)
  
  try {
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
        const categoryMapping = {
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
      } catch (error) {
        console.error(`❌ Failed to migrate ${article.title.substring(0, 50)}...:`, error.message)
      }
    }
    
    const totalCount = await prisma.article.count()
    console.log(`\n🎉 Migration complete!`)
    console.log(`📊 Results:`)
    console.log(`   - Migrated: ${migratedCount} articles`)
    console.log(`   - Skipped: ${skippedCount} articles`) 
    console.log(`   - Total in database: ${totalCount} articles`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrate()