import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
    const fixedArticles = [];

    for (const article of articles) {
      let content = article.content;
      let needsFix = false;
      
      // Check if article has formatting issues
      const problematicPatterns = [
        // Pattern 1: ### Header directly attached to text (no space after ###)
        /^(#{1,6})([^#\s\n])/m,
        // Pattern 2: Header text merged with following content
        /^(#{1,6}\s+[^#\n]+)([A-Z][a-z])/m,
        // Pattern 3: Missing line break after header
        /^(#{1,6}\s+[^#\n]+)(\n)([^\n])/m
      ];

      for (const pattern of problematicPatterns) {
        if (pattern.test(content)) {
          needsFix = true;
          break;
        }
      }

      if (needsFix) {
        console.log(`\n📝 Fixing article: "${article.title}"`);
        
        // Apply comprehensive fixes
        let fixedContent = content
          // Fix headers without space after # symbols
          .replace(/^(#{1,6})([^#\s\n])/gm, '$1 $2')
          // Fix headers merged with content (add double line break)
          .replace(/^(#{1,6}\s+[^#\n]+)([A-Z][a-z])/gm, '$1\n\n$2')
          // Ensure proper spacing after ALL headers
          .replace(/^(#{1,6}\s+.+?)(\n)([^\n])/gm, '$1\n\n$3')
          // Fix sentences running together
          .replace(/([.!?])([A-Z][a-z])/g, '$1 $2')
          // Clean up excessive newlines
          .replace(/\n{4,}/g, '\n\n\n')
          // Remove any stray markdown bold syntax
          .replace(/\*\*/g, '');

        // Update the article
        await prisma.article.update({
          where: { id: article.id },
          data: { 
            content: fixedContent,
            updatedAt: new Date()
          }
        });

        fixedCount++;
        fixedArticles.push({
          title: article.title,
          slug: article.slug,
          url: `/articles/${article.slug}`
        });
      }
    }

    // Verify the specific article mentioned by the user
    const specificArticle = await prisma.article.findFirst({
      where: {
        slug: 'navigating-singapore-s-property-landscape-in-q3-2025-insights-from-a-seasoned-expert'
      }
    });

    let specificArticlePreview = null;
    if (specificArticle) {
      // Check if "### Market Context" is properly formatted
      const marketContextIndex = specificArticle.content.indexOf('### Market Context');
      if (marketContextIndex !== -1) {
        specificArticlePreview = specificArticle.content.substring(
          marketContextIndex,
          Math.min(marketContextIndex + 300, specificArticle.content.length)
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: fixedCount === 0 
        ? 'No formatting issues found in any articles!' 
        : `Successfully fixed formatting in ${fixedCount} articles!`,
      totalArticles: articles.length,
      fixedCount,
      fixedArticles,
      specificArticlePreview,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fixing article formatting:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fix article formatting',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}