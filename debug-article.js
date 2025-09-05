const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugArticle() {
  try {
    console.log('🔍 Searching for article with title containing "Singapore\'s Property Market Poised"...\n');
    
    const article = await prisma.article.findFirst({
      where: {
        title: {
          contains: "Singapore's Property Market Poised",
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        category: true,
        status: true,
        featuredImage: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!article) {
      console.log('❌ Article not found. Let me search for all articles with "Property Market" in title...\n');
      
      const similarArticles = await prisma.article.findMany({
        where: {
          title: {
            contains: "Property Market",
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true
        }
      });
      
      console.log('Found similar articles:');
      similarArticles.forEach((art, index) => {
        console.log(`${index + 1}. "${art.title}" (slug: ${art.slug})`);
      });
      
      return;
    }

    console.log('✅ Article found!\n');
    console.log('📄 Article Details:');
    console.log(`Title: ${article.title}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Category: ${article.category}`);
    console.log(`Status: ${article.status}`);
    console.log(`Published: ${article.publishedAt}`);
    console.log(`Author: ${article.author.name}\n`);
    
    console.log('🔍 Content Analysis:');
    console.log(`Content length: ${article.content.length} characters`);
    
    // Check for heading-text merge issues
    const headingMergePattern = /\*\*([^*]+)\*\*([A-Z][^*\n]+)/g;
    const mergedHeadings = [];
    let match;
    
    while ((match = headingMergePattern.exec(article.content)) !== null) {
      mergedHeadings.push({
        heading: match[1],
        mergedText: match[2].substring(0, 50) + (match[2].length > 50 ? '...' : ''),
        fullMatch: match[0]
      });
    }
    
    if (mergedHeadings.length > 0) {
      console.log(`❌ Found ${mergedHeadings.length} merged heading-text patterns:`);
      mergedHeadings.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. Heading: "${item.heading}"`);
        console.log(`     Merged text: "${item.mergedText}"`);
        console.log(`     Full pattern: "${item.fullMatch.substring(0, 100)}..."\n`);
      });
    } else {
      console.log('✅ No heading-text merge issues found');
    }
    
    // Check for bold formatting issues
    const boldMatches = article.content.match(/\*\*[^*]+\*\*/g) || [];
    console.log(`Bold sections found: ${boldMatches.length}`);
    
    if (boldMatches.length > 20) {
      console.log('⚠️  Excessive bold formatting detected');
      console.log('First few bold sections:');
      boldMatches.slice(0, 5).forEach((bold, index) => {
        console.log(`  ${index + 1}. ${bold}`);
      });
    }
    
    // Show first 500 characters of content for inspection
    console.log('\n📖 Content Preview (first 500 characters):');
    console.log('-'.repeat(50));
    console.log(article.content.substring(0, 500));
    console.log('-'.repeat(50));
    
    // Show a section that might have issues
    const problemSection = article.content.match(/\*\*[^*]+\*\*[A-Z][^*\n]{50,150}/);
    if (problemSection) {
      console.log('\n🚨 Example of potential heading-text merge issue:');
      console.log('-'.repeat(50));
      console.log(problemSection[0]);
      console.log('-'.repeat(50));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugArticle();