const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.lmxxlypamhrzdvwadmgi:VlbX8$Y5QwzDf5E@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
    }
  }
});

async function checkArticleSlugs() {
  try {
    console.log('🔍 Checking database for existing articles...\n');
    
    // Get all published articles from database
    const dbArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        publishedAt: true,
        views: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });

    console.log(`📊 Found ${dbArticles.length} published articles in database:`);
    dbArticles.forEach((article, index) => {
      console.log(`${index + 1}. Slug: "${article.slug}"`);
      console.log(`   Title: ${article.title}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Published: ${article.publishedAt ? article.publishedAt.toISOString().split('T')[0] : 'Not set'}`);
      console.log(`   Views: ${article.views}`);
      console.log('');
    });

    console.log('🔍 Fallback articles from homepage and components:\n');

    // List of fallback slugs from the code we analyzed
    const fallbackSlugs = [
      // From homepage fallback (page.tsx line 52)
      'singapore-property-market-outlook-2025',
      
      // From LatestArticles component fallback
      'singapore-property-market-outlook-2025', // duplicate
      'complete-guide-buying-first-condo-singapore',
      'top-5-districts-condo-investment-2025',
      'lentor-mansion-comprehensive-review',
      'singapore-cooling-measures-impact-analysis',
      'orchard-sophia-investment-analysis',
    ];

    // Remove duplicates
    const uniqueFallbackSlugs = [...new Set(fallbackSlugs)];
    
    console.log(`📋 ${uniqueFallbackSlugs.length} unique fallback article slugs:`);
    uniqueFallbackSlugs.forEach((slug, index) => {
      console.log(`${index + 1}. "${slug}"`);
    });

    console.log('\n🔗 Static article routes found:');
    console.log('1. singapore-property-market-outlook-2024 (hardcoded page)');

    console.log('\n⚠️  SLUG MISMATCH ANALYSIS:\n');
    
    const dbSlugs = dbArticles.map(a => a.slug);
    const staticSlugs = ['singapore-property-market-outlook-2024'];
    const allExistingSlugs = [...dbSlugs, ...staticSlugs];
    
    console.log('❌ Fallback slugs that lead to 404 errors:');
    let mismatches = 0;
    uniqueFallbackSlugs.forEach(fallbackSlug => {
      if (!allExistingSlugs.includes(fallbackSlug)) {
        mismatches++;
        console.log(`   ${mismatches}. "${fallbackSlug}" - NOT FOUND`);
      }
    });

    console.log('\n✅ Fallback slugs that work:');
    let matches = 0;
    uniqueFallbackSlugs.forEach(fallbackSlug => {
      if (allExistingSlugs.includes(fallbackSlug)) {
        matches++;
        console.log(`   ${matches}. "${fallbackSlug}" - EXISTS`);
      }
    });

    console.log('\n📈 SUMMARY:');
    console.log(`- Articles in database: ${dbArticles.length}`);
    console.log(`- Static article pages: 1`);
    console.log(`- Total working articles: ${dbArticles.length + 1}`);
    console.log(`- Fallback slugs causing 404s: ${mismatches}`);
    console.log(`- Working fallback slugs: ${matches}`);
    
    if (mismatches > 0) {
      console.log('\n🛠️  RECOMMENDED FIXES:');
      console.log('1. Update fallback slugs to match existing articles');
      console.log('2. Create missing articles in database');
      console.log('3. Remove non-existent articles from fallback data');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.log('\n💡 If this is a connection error, check:');
    console.log('- DATABASE_URL environment variable');
    console.log('- Network connectivity to Supabase');
    console.log('- Database permissions');
  } finally {
    await prisma.$disconnect();
  }
}

checkArticleSlugs();