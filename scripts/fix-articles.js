const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting article alignment check...');
  
  try {
    // Find all published articles
    const articles = await prisma.article.findMany({
      where: { 
        status: 'PUBLISHED' 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true,
        publishedAt: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });

    console.log(`Found ${articles.length} published articles`);
    
    let issuesFound = 0;
    const problematicArticles = [];

    for (const article of articles) {
      const issues = [];
      
      // Check for district-specific titles without district content
      if (article.title.toLowerCase().includes('district discovery') || 
          article.title.toLowerCase().includes('district')) {
        
        const hasDistrictContent = /district \d+|district [a-z]+/i.test(article.content) ||
                                 /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast|north|south|central)\b/i.test(article.content);
        
        if (!hasDistrictContent) {
          issues.push('Title suggests district focus but content lacks specific district analysis');
        }
      }

      // Check for neighborhood-specific titles
      if (article.title.toLowerCase().includes('neighborhood spotlight') || 
          article.title.toLowerCase().includes('neighborhood')) {
        
        const hasNeighborhoodContent = /\b(orchard|marina|sentosa|jurong|woodlands|tampines|punggol|sengkang|bishan|toa payoh|ang mo kio|bedok|clementi|bukit timah|newton|novena|dhoby ghaut|city hall|raffles place|marina bay|clarke quay|boat quay|chinatown|little india|arab street|bugis|beach road|lavender|kallang|geylang|katong|east coast|west coast)\b/i.test(article.content);
        
        if (!hasNeighborhoodContent) {
          issues.push('Title suggests neighborhood focus but content lacks specific area analysis');
        }
      }

      // Check for generic "navigating singapore property market" with minimal content
      if (article.title.toLowerCase().includes('navigating singapore\'s property market') &&
          article.content.length < 1500) {
        issues.push('Generic title with insufficient content depth');
      }

      if (issues.length > 0) {
        problematicArticles.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          issues: issues,
          contentLength: article.content.length,
          publishedAt: article.publishedAt
        });
        issuesFound++;
      }
    }

    console.log('\n=== ARTICLE ALIGNMENT REPORT ===');
    console.log(`Total articles checked: ${articles.length}`);
    console.log(`Articles with issues: ${issuesFound}`);
    
    if (problematicArticles.length > 0) {
      console.log('\nProblematic Articles:');
      problematicArticles.forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   ID: ${article.id}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Content Length: ${article.contentLength} characters`);
        console.log(`   Published: ${article.publishedAt}`);
        console.log(`   Issues:`);
        article.issues.forEach(issue => {
          console.log(`     - ${issue}`);
        });
      });

      console.log('\n=== RECOMMENDED ACTIONS ===');
      console.log('1. Articles with district/neighborhood titles need specific location content');
      console.log('2. Generic titles with minimal content should be expanded or regenerated');
      console.log('3. Consider using the DistrictArticleCreator service to generate proper content');
    } else {
      console.log('\n✅ All articles appear to have properly aligned titles and content!');
    }

  } catch (error) {
    console.error('Error checking articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(console.error);