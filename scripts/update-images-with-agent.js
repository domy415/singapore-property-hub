/**
 * Update Article Images Using Singapore Property Image Finder Agent
 * This script properly uses the agent guidelines instead of hardcoded URLs
 */

const { AgentPropertyImageFinder } = require('../src/services/agent-property-image-finder');
const { prisma } = require('../src/lib/prisma');

async function updateArticleImagesWithAgent() {
  try {
    console.log('🇸🇬 Starting Singapore Property Image Finder Agent Update...\n');

    // Initialize the agent
    const imageFinder = new AgentPropertyImageFinder();
    
    // Get all published articles
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        featuredImage: true,
        slug: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${articles.length} articles to process\n`);

    const updates = [];

    for (const article of articles) {
      try {
        console.log(`\n🔍 Processing: ${article.title}`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Current image: ${article.featuredImage}`);

        // Extract requirements from the article
        const requirements = {
          district: extractDistrictFromContent(article.title + ' ' + article.content),
          propertyName: extractPropertyName(article.title),
          conceptType: getConceptType(article.category)
        };

        // Use the agent to find the appropriate image
        const imageResult = await imageFinder.findPropertyImage(
          article.title,
          article.content.substring(0, 500), // First 500 chars for topic
          article.category,
          requirements
        );

        if (imageResult.success && imageResult.imageUrl !== article.featuredImage) {
          console.log(`   ✅ New image found: ${imageResult.imageUrl}`);
          console.log(`   📝 Description: ${imageResult.description}`);
          console.log(`   📊 Relevance: ${imageResult.relevanceScore}`);

          // Update the database
          await prisma.article.update({
            where: { id: article.id },
            data: { featuredImage: imageResult.imageUrl }
          });

          updates.push({
            id: article.id,
            title: article.title,
            category: article.category,
            oldImage: article.featuredImage,
            newImage: imageResult.imageUrl,
            relevanceScore: imageResult.relevanceScore,
            description: imageResult.description,
            url: `https://singapore-property-hub.vercel.app/articles/${article.slug}`
          });

          console.log(`   🔄 Updated in database`);
        } else {
          console.log(`   ⏭️  Keeping current image (agent returned same or failed)`);
        }

      } catch (articleError) {
        console.error(`❌ Error processing "${article.title}":`, articleError.message);
      }
    }

    console.log(`\n✅ Completed! Updated ${updates.length} articles with compliant images\n`);

    // Print summary
    console.log('📊 SUMMARY:');
    console.log(`   Total articles: ${articles.length}`);
    console.log(`   Images updated: ${updates.length}`);
    console.log(`   Compliance rate: ${Math.round((updates.length / articles.length) * 100)}%\n`);

    if (updates.length > 0) {
      console.log('🔄 UPDATED ARTICLES:');
      updates.forEach((update, index) => {
        console.log(`   ${index + 1}. ${update.title}`);
        console.log(`      Score: ${update.relevanceScore}`);
        console.log(`      URL: ${update.url}`);
      });
    }

    return {
      success: true,
      articlesProcessed: articles.length,
      articlesUpdated: updates.length,
      updates
    };

  } catch (error) {
    console.error('❌ Script failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
function extractDistrictFromContent(text) {
  const districtMatch = text.match(/district\s+(\d{1,2})/i);
  return districtMatch ? parseInt(districtMatch[1]) : null;
}

function extractPropertyName(title) {
  // Extract property names from titles like "Review of Grand Dunman" or "Grand Dunman Condo Review"
  const patterns = [
    /(?:review|guide|analysis)(?:\s+of)?\s+(.+?)(?:\s+condo|\s+condominium|\s+singapore)?$/i,
    /^(.+?)(?:\s+review|\s+guide|\s+analysis)/i,
    /(?:ultimate guide to living in|guide to)\s+(.+?):/i
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function getConceptType(category) {
  switch (category) {
    case 'INVESTMENT':
      return 'finance';
    case 'MARKET_INSIGHTS':
      return 'market';
    case 'BUYING_GUIDE':
    case 'SELLING_GUIDE':
      return 'regulation';
    case 'LOCATION_GUIDE':
      return 'lifestyle';
    default:
      return 'market';
  }
}

// Export for API use or run directly
if (require.main === module) {
  updateArticleImagesWithAgent()
    .then((result) => {
      console.log('\n🎉 Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { updateArticleImagesWithAgent };