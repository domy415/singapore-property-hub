import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Running comprehensive article formatting fix...\n');

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

    console.log(`Found ${articles.length} published articles to fix\n`);

    let fixedCount = 0;
    const fixedArticles = [];

    for (const article of articles) {
      let content = article.content;
      let originalContent = content;
      
      console.log(`\n📝 Processing article: "${article.title}"`);
      
      // COMPREHENSIVE FIXES - Apply all patterns
      let fixedContent = content
        
        // 1. Fix headers without proper spacing after # symbols
        .replace(/^(#{1,6})([^#\s\n])/gm, '$1 $2')
        
        // 2. Fix merged headers with text - very comprehensive pattern
        .replace(/^(#{1,6}\s*)([^#\n]*?)([A-Z][a-z][^\n]*)/gm, (match, hashSymbols, headerPart, textPart) => {
          // Skip if already properly formatted (has line breaks)
          if (match.includes('\n\n') || headerPart.trim().length === 0) {
            return match;
          }
          
          const fullText = headerPart + textPart;
          const words = fullText.trim().split(/\s+/);
          
          // If it's very short, probably not merged
          if (words.length <= 2) {
            return match;
          }
          
          // Look for natural break points (typically 2-8 words for headers)
          for (let i = 2; i <= Math.min(8, words.length - 2); i++) {
            const potentialHeader = words.slice(0, i).join(' ');
            const remainingText = words.slice(i).join(' ');
            
            // Good break point indicators:
            // - Next word is capitalized and looks like start of sentence
            // - Header part doesn't end with common sentence words
            // - Remaining text is substantial (>15 characters)
            const nextWord = words[i];
            if (nextWord && 
                /^[A-Z]/.test(nextWord) && 
                remainingText.length > 15 &&
                !potentialHeader.match(/\b(the|and|or|but|in|on|at|to|for|with|by)$/i) &&
                !['And', 'But', 'Or', 'The', 'In', 'On', 'At', 'To', 'For', 'With', 'By', 'Of'].includes(nextWord)) {
              return `${hashSymbols}${potentialHeader}\n\n${remainingText}`;
            }
          }
          
          // Fallback: If we have many words, split roughly in the middle of reasonable header length
          if (words.length > 6) {
            const headerWords = words.slice(0, 4);
            const textWords = words.slice(4);
            return `${hashSymbols}${headerWords.join(' ')}\n\n${textWords.join(' ')}`;
          }
          
          return match;
        })
        
        // 3. Fix sentences that run together (end of sentence + start of sentence)
        .replace(/([.!?])([A-Z][a-z]{3,}[^.!?\n]{10,})/g, '$1 $2')
        
        // 4. Fix specific common patterns we see in articles
        .replace(/Market DynamicsThe/g, 'Market Dynamics\n\nThe')
        .replace(/Central Region \(CCR\)where/g, 'Central Region (CCR)\n\nwhere')
        .replace(/Core Central Region \(CCR\)where/g, 'Core Central Region (CCR)\n\nwhere')
        .replace(/Residences and(\s*)Wallich/g, 'Residences and$1\n\nWallich')
        .replace(/Marina One(\s*)Residences and/g, 'Marina One$1Residences and')
        
        // 5. Fix district/location merges
        .replace(/District (\d+)([A-Z][a-z]+)/g, 'District $1\n\n$2')
        .replace (/Singapore([A-Z][a-z]+\s+[a-z]+)/g, 'Singapore $1')
        
        // 6. Fix common section transitions
        .replace(/analysis([A-Z][a-z]+)/g, 'analysis\n\n$1')
        .replace(/market([A-Z][a-z]+\s+[a-z]+)/g, 'market\n\n$1')
        .replace /outlook([A-Z][a-z]+)/g, 'outlook\n\n$1')
        .replace(/trends([A-Z][a-z]+)/g, 'trends\n\n$1')
        
        // 7. Fix proper nouns that got merged
        .replace(/Singapore([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g, (match, after) => {
          // Only split if it looks like a new sentence/section
          if (after.length > 8 && /^[A-Z][a-z]+\s+[a-z]+/.test(after)) {
            return `Singapore\n\n${after}`;
          }
          return `Singapore ${after}`;
        })
        
        // 8. Fix year patterns that got merged
        .replace(/(\d{4})([A-Z][a-z]+\s+[a-z]+)/g, '$1\n\n$2')
        
        // 9. Fix percentage/number patterns
        .replace(/(\d+(?:\.\d+)?%)([A-Z][a-z]+\s+[a-z]+)/g, '$1\n\n$2')
        
        // 10. Fix property name merges
        .replace(/([A-Z][a-z]+\s+(?:Residences|Towers?|Heights?|Gardens?|Park|Plaza|Centre|Mall))([A-Z][a-z]+\s+[a-z]+)/g, '$1\n\n$2')
        
        // 11. Ensure proper spacing after headings
        .replace(/^(#{1,6}\s+[^\n]+)(\n)([A-Z][a-z])/gm, '$1\n\n$3')
        
        // 12. Fix word boundaries that got merged
        .replace(/([a-z])([A-Z][a-z]+(?:\s+[a-z]+){2,})/g, (match, lastChar, capitalizedText) => {
          // Only split if it looks like the start of a new sentence/section
          if (capitalizedText.length > 15 && 
              /^[A-Z][a-z]+\s+[a-z]+\s+[a-z]+/.test(capitalizedText) &&
              !capitalizedText.match(/^(The|A|An|In|On|Of|To|For|With|By|And|But|Or)\s/)) {
            return `${lastChar}\n\n${capitalizedText}`;
          }
          return `${lastChar} ${capitalizedText}`;
        })
        
        // 13. Clean up excessive line breaks
        .replace(/\n{4,}/g, '\n\n\n')
        
        // 14. Fix any remaining double spaces
        .replace(/  +/g, ' ')
        
        // 15. Trim each line to remove trailing spaces
        .split('\n').map(line => line.trimEnd()).join('\n')
        
        // 16. Remove empty lines at start and end
        .trim();

      // Check if we made any changes
      if (fixedContent !== originalContent) {
        // Count the types of changes made
        const changes = [];
        if (originalContent.includes('Market DynamicsThe')) changes.push('Fixed "Market DynamicsThe"');
        if (originalContent.match(/([.!?])([A-Z][a-z]{3,}[^.!?\n]{10,})/)) changes.push('Fixed sentence run-ons');
        if (originalContent.match(/^(#{1,6}\s*)([^#\n]*?)([A-Z][a-z][^\n]*)/m)) changes.push('Fixed merged headers');
        if (originalContent.match(/([a-z])([A-Z][a-z]+(?:\s+[a-z]+){2,})/)) changes.push('Fixed word boundary merges');
        
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
          originalLength: originalContent.length,
          fixedLength: fixedContent.length,
          changes: changes
        });
        
        console.log(`   ✅ Fixed! Changes: ${changes.join(', ')}`);
      } else {
        console.log(`   ℹ️  No formatting issues found`);
      }
    }

    return NextResponse.json({
      success: true,
      message: fixedCount === 0 
        ? 'No formatting issues found in any articles!' 
        : `Successfully applied comprehensive formatting fixes to ${fixedCount} articles!`,
      totalArticles: articles.length,
      fixedCount,
      fixedArticles,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error running comprehensive article fix:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run comprehensive article fix',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}