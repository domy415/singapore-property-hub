import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Build guard: Prevent execution during Next.js build phase
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test') {
    return NextResponse.json({
      success: false,
      error: 'Emergency fix not available during build phase'
    }, { status: 503 });
  }

  try {
    console.log('🚨 Running EMERGENCY article formatting fix...\n');

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
      
      // EMERGENCY FIXES - Target the exact issues we see
      let fixedContent = content
        
        // 1. Fix the specific "Expert### Market Context" pattern
        .replace(/Expert###\s*Market Context/g, 'Expert\n\n### Market Context')
        .replace(/Expert###([^#\n]+)/g, 'Expert\n\n###$1')
        
        // 2. Fix title fragmentation - reconstruct proper titles
        .replace(/^Navigating\n+Singapore's\n+Property Landscape in Q3 2025: Insights from a\n+Seasoned\n+Expert/m, 
                '# Navigating Singapore\'s Property Landscape in Q3 2025: Insights from a Seasoned Expert')
        
        // 3. Fix any header that starts mid-sentence
        .replace(/([a-z])###\s*([A-Z][^#\n]*)/g, '$1\n\n### $2')
        
        // 4. Fix headers without proper # spacing
        .replace(/^(#{1,6})([^#\s\n])/gm, '$1 $2')
        
        // 5. Fix merged text patterns we see
        .replace(/ContextIt's/g, 'Context\n\nIt\'s')
        .replace(/DynamicsThe/g, 'Dynamics\n\nThe')
        .replace(/ExpertIt's/g, 'Expert\n\nIt\'s')
        .replace(/AuthorityThe/g, 'Authority\n\nThe')
        .replace(/AuthorityAs/g, 'Authority\n\nAs')
        
        // 6. Fix line breaks in title fragments
        .replace(/^([A-Z][a-z]+)\n+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\n+([A-Z][a-z]+)/gm, (match, part1, part2, part3) => {
          // If this looks like a fragmented title, join it
          if (part1.length < 20 && part2.length < 50 && part3.length < 20) {
            return `# ${part1} ${part2} ${part3}`;
          }
          return match;
        })
        
        // 7. Ensure proper spacing after headers
        .replace(/^(#{1,6}\s+[^\n]+)\n([A-Z][a-z])/gm, '$1\n\n$2')
        
        // 8. Fix Current Market Dynamics specific issue
        .replace(/^Current\n+Market\n+Dynamics$/gm, '### Current Market Dynamics')
        
        // 9. Fix any standalone header words that should be combined
        .replace(/^([A-Z][a-z]+)\n+([A-Z][a-z]+)\n+([A-Z][a-z]+)\n*$/gm, (match, word1, word2, word3) => {
          // Common header patterns
          if ((word1 === 'Current' && word2 === 'Market' && word3 === 'Dynamics') ||
              (word1 === 'Market' && word2 === 'Analysis') ||
              (word1 === 'Property' && word2 === 'Trends') ||
              (word1 === 'Investment' && word2 === 'Outlook')) {
            return `### ${word1} ${word2} ${word3}`;
          }
          return match;
        })
        
        // 10. Fix two-word header fragments
        .replace(/^([A-Z][a-z]+)\n+([A-Z][a-z]+)$/gm, (match, word1, word2) => {
          if ((word1 === 'Market' && word2 === 'Context') ||
              (word1 === 'Market' && word2 === 'Dynamics') ||
              (word1 === 'Investment' && word2 === 'Analysis') ||
              (word1 === 'Property' && word2 === 'Trends')) {
            return `### ${word1} ${word2}`;
          }
          return match;
        })
        
        // 11. Fix sentences that run together
        .replace(/([.!?])([A-Z][a-z]{3,}[^.!?\n]{15,})/g, '$1 $2')
        
        // 12. Fix specific URA pattern
        .replace(/Urban Redevelopment Authority \(URA\)([A-Z][a-z]+)/g, 'Urban Redevelopment Authority (URA) $1')
        
        // 13. Clean up multiple newlines
        .replace(/\n{4,}/g, '\n\n\n')
        
        // 14. Fix double spaces
        .replace(/  +/g, ' ')
        
        // 15. Ensure no headers are on the same line as content
        .replace(/(#{1,6}\s+[^#\n]+)([A-Z][a-z])/g, '$1\n\n$2')
        
        // 16. Trim lines
        .split('\n').map(line => line.trimEnd()).join('\n').trim();

      // Check if we made significant changes
      if (fixedContent !== originalContent) {
        // Log what we're changing
        const changes = [];
        if (originalContent.includes('Expert###')) changes.push('Fixed Expert### pattern');
        if (originalContent.match(/^Navigating\n+Singapore's/m)) changes.push('Fixed title fragmentation');
        if (originalContent.includes('ContextIt\'s')) changes.push('Fixed ContextIt\'s merge');
        if (originalContent.includes('DynamicsThe')) changes.push('Fixed DynamicsThe merge');
        if (originalContent.match(/^Current\n+Market\n+Dynamics$/m)) changes.push('Fixed header fragmentation');
        
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
        
        console.log(`   ✅ FIXED! Changes: ${changes.join(', ')}`);
      } else {
        console.log(`   ℹ️  No emergency fixes needed`);
      }
    }

    return NextResponse.json({
      success: true,
      message: fixedCount === 0 
        ? 'No emergency formatting issues found!' 
        : `🚨 EMERGENCY FIX: Successfully fixed ${fixedCount} articles!`,
      totalArticles: articles.length,
      fixedCount,
      fixedArticles,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error running emergency article fix:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run emergency article fix',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}