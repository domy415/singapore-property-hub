import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Fixing header-text merge issues...\n');

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
      
      // Check for specific patterns like "Current Market DynamicsThe Singapore property"
      const problematicPatterns = [
        // Pattern 1: Header text merged with following sentence
        /^(#{1,6}\s+[^#\n]*[a-z])([A-Z][a-z][^\n]{10,})/gm,
        // Pattern 2: Sentence ending merged with next sentence
        /([.!?])([A-Z][a-z]{3,}[^.!?\n]{20,})/g,
        // Pattern 3: Headers without proper line breaks
        /^(#{1,6}\s+[^#\n]+)([A-Z][a-z]+[^\n]*)/gm
      ];

      for (const pattern of problematicPatterns) {
        if (pattern.test(content)) {
          needsFix = true;
          break;
        }
      }

      if (needsFix) {
        console.log(`\n📝 Fixing article: "${article.title}"`);
        
        // Apply targeted fixes
        let fixedContent = content
          // Fix merged headers with text - more intelligent splitting
          .replace(/^(#{1,6}\s+)([^#\n]*?)([A-Z][a-z][^\n]*)/gm, (match, hashSymbols, potentialHeader, text) => {
            // Skip if it's already properly formatted
            if (potentialHeader.includes('\n') || text.includes('\n')) {
              return match;
            }
            
            // Look for natural break points
            const combined = potentialHeader + text;
            const words = combined.split(' ');
            
            // Find a good breaking point (typically after 2-6 words for headers)
            for (let i = 2; i <= Math.min(6, words.length - 1); i++) {
              const headerPart = words.slice(0, i).join(' ');
              const textPart = words.slice(i).join(' ');
              
              // Good break if next word starts with capital and looks like start of sentence
              if (words[i] && /^[A-Z]/.test(words[i]) && 
                  textPart.length > 20 && 
                  !['And', 'But', 'Or', 'The', 'A', 'An'].includes(words[i])) {
                return `${hashSymbols}${headerPart}\n\n${textPart}`;
              }
            }
            
            // Fallback: split at reasonable point
            if (words.length > 4) {
              const headerPart = words.slice(0, 3).join(' ');
              const textPart = words.slice(3).join(' ');
              return `${hashSymbols}${headerPart}\n\n${textPart}`;
            }
            
            return match;
          })
          
          // Fix sentence run-ons (more conservative)
          .replace(/([.!?])([A-Z][a-z]{4,}[^.!?\n]{15,})/g, '$1 $2')
          
          // Ensure proper line breaks after headers
          .replace(/^(#{1,6}\s+[^\n]+)(\n)([A-Z][a-z])/gm, '$1\n\n$3')
          
          // Clean up excessive newlines
          .replace(/\n{4,}/g, '\n\n\n')
          
          // Fix specific patterns we know about
          .replace(/Market DynamicsThe/g, 'Market Dynamics\n\nThe')
          .replace(/Central Region \(CCR\)where/g, 'Central Region (CCR)\n\nwhere')
          .replace(/Residences and(\s*)Wallich/g, 'Residences and$1\n\nWallich')
          
          // Fix other common patterns
          .replace(/([a-z])([A-Z][a-z]+\s+[A-Z][a-z]+)/g, (match, lastChar, capitalizedText) => {
            // Only split if it looks like a new sentence/section
            if (capitalizedText.length > 10 && /^[A-Z][a-z]+\s+[A-Z]/.test(capitalizedText)) {
              return `${lastChar}\n\n${capitalizedText}`;
            }
            return match;
          });

        // Only update if content actually changed
        if (fixedContent !== content) {
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
            url: `/articles/${article.slug}`,
            changes: [
              content.length !== fixedContent.length ? `Length changed: ${content.length} → ${fixedContent.length}` : null,
              content.match(/Market DynamicsThe/) ? 'Fixed "Market DynamicsThe"' : null,
              content.match(/([.!?])([A-Z][a-z]{4,}[^.!?\n]{15,})/) ? 'Fixed sentence run-ons' : null
            ].filter(Boolean)
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: fixedCount === 0 
        ? 'No header-text merge issues found in any articles!' 
        : `Successfully fixed header-text merge issues in ${fixedCount} articles!`,
      totalArticles: articles.length,
      fixedCount,
      fixedArticles,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fixing header-text merge issues:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fix header-text merge issues',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}