export async function validateDatabaseConnection() {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return { connected: false, error: 'Database not available during build' }
  }

  try {
    console.log('🔍 Testing database connection...')
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    return { connected: true, error: null }
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
  }
}

export async function getArticleCount() {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return 0
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    const count = await prisma.article.count({
      where: { status: 'PUBLISHED' }
    })
    console.log(`📊 Found ${count} published articles in database`)
    return count
  } catch (error) {
    console.error('❌ Failed to get article count:', error)
    return 0
  }
}

export async function validateArticleImages() {
  // Build-time guard: Skip database operations during build
  if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
    return {
      total: 0,
      withImages: 0,
      withoutImages: 0,
      singaporeSpecific: 0,
      generic: 0
    }
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import('@/lib/prisma')
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        featuredImage: true
      },
      take: 20
    })

    const imageStats = {
      total: articles.length,
      withImages: articles.filter(a => a.featuredImage).length,
      withoutImages: articles.filter(a => !a.featuredImage).length,
      singaporeSpecific: 0,
      generic: 0
    }

    // Basic Singapore image validation
    const singaporePatterns = [
      'photo-1567360425618', // Singapore CBD
      'photo-1533628635777', // Marina Bay Sands
      'photo-1648365300669', // HDB blocks
      'photo-1560036486-def2e0dbebb7', // Toa Payoh
      'photo-1631086459917', // Singapore flag
      'photo-1567620832903', // CBD skyline
      'photo-1575089976121', // Government buildings
      'photo-1564013799919', // Modern developments
      'photo-1508964942454' // Singapore properties
    ]

    articles.forEach(article => {
      if (article.featuredImage) {
        const isSingaporeSpecific = singaporePatterns.some(pattern => 
          article.featuredImage?.includes(pattern)
        )
        
        if (isSingaporeSpecific) {
          imageStats.singaporeSpecific++
        } else {
          imageStats.generic++
        }
      }
    })

    console.log('🖼️ Image validation results:', imageStats)
    return imageStats

  } catch (error) {
    console.error('❌ Failed to validate article images:', error)
    return {
      total: 0,
      withImages: 0,
      withoutImages: 0,
      singaporeSpecific: 0,
      generic: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getSystemHealth() {
  const dbHealth = await validateDatabaseConnection()
  const articleCount = await getArticleCount()
  const imageStats = await validateArticleImages()

  const overallHealth = {
    status: dbHealth.connected && articleCount > 0 ? 'healthy' : 'warning',
    timestamp: new Date().toISOString(),
    database: dbHealth,
    content: {
      articleCount,
      hasContent: articleCount > 0
    },
    images: imageStats
  }

  console.log('🏥 System health check completed:', overallHealth)
  return overallHealth
}