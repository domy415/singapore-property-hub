const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeAndFixArticleFormatting() {
  try {
    console.log('🔍 Analyzing article formatting issues...\n');

    // Get all published articles
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true
      }
    });

    console.log(`Found ${articles.length} published articles to analyze\n`);

    let fixedCount = 0;
    const problematicPatterns = [
      // Pattern 1: ### Header directly attached to text (no space after ###)
      /^(#{1,6})([^#\s\n])/gm,
      // Pattern 2: Header text merged with following content
      /^(#{1,6}\s+[^#\n]+)([A-Z][a-z])/gm,
      // Pattern 3: Missing line break after header
      /^(#{1,6}\s+[^#\n]+)(\n)([^\n])/gm
    ];

    for (const article of articles) {
      let content = article.content;
      let needsFix = false;
      
      // Check if article has formatting issues
      for (const pattern of problematicPatterns) {
        if (pattern.test(content)) {
          needsFix = true;
          break;
        }
      }

      if (needsFix) {
        console.log(`\n📝 Fixing article: "${article.title}"`);
        console.log(`   URL: /articles/${article.slug}`);
        
        // Apply comprehensive fixes
        let fixedContent = content
          // Fix headers without space after # symbols
          .replace(/^(#{1,6})([^#\s\n])/gm, '$1 $2')
          // Fix headers merged with content (add double line break)
          .replace(/^(#{1,6}\s+[^#\n]+)([A-Z][a-z])/gm, '$1\n\n$2')
          // Ensure proper spacing after ALL headers
          .replace(/^(#{1,6}\s+.+?)(\n)([^\n])/gm, '$1\n\n$3')
          // Fix sentences running together
          .replace(/([.!?])([A-Z][a-z])/g, '$1\n\n$2')
          // Clean up excessive newlines
          .replace(/\n{4,}/g, '\n\n\n')
          // Remove any stray markdown bold syntax
          .replace(/\*\*/g, '');

        // Log specific fixes found
        const headerIssues = content.match(/^#{1,6}[^#\s\n]/gm);
        if (headerIssues) {
          console.log(`   - Fixed ${headerIssues.length} headers missing spaces`);
        }

        const mergedContent = content.match(/^(#{1,6}\s+[^#\n]+)([A-Z][a-z])/gm);
        if (mergedContent) {
          console.log(`   - Fixed ${mergedContent.length} headers merged with content`);
        }

        // Update the article
        await prisma.article.update({
          where: { id: article.id },
          data: { content: fixedContent }
        });

        fixedCount++;
        console.log(`   ✅ Article formatting fixed!`);
      }
    }

    if (fixedCount === 0) {
      console.log('\n✅ No formatting issues found in any articles!');
    } else {
      console.log(`\n🎉 Successfully fixed formatting in ${fixedCount} articles!`);
    }

    // Verify the specific article mentioned by the user
    const specificArticle = await prisma.article.findFirst({
      where: {
        slug: 'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert'
      }
    });

    if (specificArticle) {
      console.log('\n📋 Verification of specific article:');
      console.log(`Title: ${specificArticle.title}`);
      
      // Check if "### Market Context" is properly formatted
      const marketContextMatch = specificArticle.content.match(/### Market Context/);
      if (marketContextMatch) {
        const contextArea = specificArticle.content.substring(
          specificArticle.content.indexOf('### Market Context'),
          specificArticle.content.indexOf('### Market Context') + 200
        );
        console.log('\nContent preview around "Market Context":');
        console.log('---');
        console.log(contextArea);
        console.log('---');
      }
    }

  } catch (error) {
    console.error('Error analyzing articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the analysis and fix
analyzeAndFixArticleFormatting();