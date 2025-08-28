const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkArticleTitles() {
  try {
    console.log('Checking article title-content alignment...\n');
    
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true
      }
    });

    console.log(`Found ${articles.length} published articles\n`);

    const problematicArticles = [];

    for (const article of articles) {
      const issues = [];
      
      // Check for district-specific titles without district content
      if (article.title.toLowerCase().includes('district discovery') || 
          article.title.toLowerCase().includes('district')) {
        const hasDistrictContent = /district \d+|district [a-z]+/i.test(article.content) ||
                                 /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast|north|south|central)\b/i.test(article.content);
        
        if (!hasDistrictContent) {
          issues.push('❌ District title but no specific district content');
        }
      }

      // Check for neighborhood-specific titles without neighborhood content
      if (article.title.toLowerCase().includes('neighborhood spotlight') || 
          article.title.toLowerCase().includes('neighborhood')) {
        const hasNeighborhoodContent = /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast)\b/i.test(article.content);
        
        if (!hasNeighborhoodContent) {
          issues.push('❌ Neighborhood title but no specific neighborhood content');
        }
      }

      if (issues.length > 0) {
        problematicArticles.push({
          title: article.title,
          slug: article.slug,
          issues: issues
        });
        
        console.log(`🚨 PROBLEMATIC ARTICLE:`);
        console.log(`   Title: ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Issues: ${issues.join(', ')}`);
        console.log(`   URL: /articles/${article.slug}\n`);
      }
    }

    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total articles: ${articles.length}`);
    console.log(`   Problematic articles: ${problematicArticles.length}`);
    console.log(`   Clean articles: ${articles.length - problematicArticles.length}`);

    if (problematicArticles.length > 0) {
      console.log(`\n🔧 RECOMMENDATIONS:`);
      console.log(`   1. Run the fix-misleading-articles API to regenerate content`);
      console.log(`   2. Manually review and update the problematic articles`);
      console.log(`   3. Use district-specific content generators for future articles`);
    } else {
      console.log(`\n✅ All articles have proper title-content alignment!`);
    }

  } catch (error) {
    console.error('❌ Error checking articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticleTitles();