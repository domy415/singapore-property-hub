const https = require('https');

// Function to get the current article content
function getCurrentArticle() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: '/api/articles?limit=100',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          const targetArticle = response.articles.find(article => 
            article.title && article.title.toLowerCase().includes('property market poised')
          );
          resolve(targetArticle);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Function to apply formatting fixes to content
function fixContentFormatting(content) {
  let fixedContent = content;
  const appliedFixes = [];

  console.log('🔧 Applying formatting fixes...');

  // Fix 1: Specific problematic patterns we found
  const specificPatterns = [
    {
      search: 'Policy Impacts and Regulatory LandscapeThe Singapore government',
      replace: 'Policy Impacts and Regulatory Landscape\n\nThe Singapore government',
      name: 'Policy section heading fix'
    },
    {
      search: 'Market OutlookThe Singapore property market',
      replace: 'Market Outlook\n\nThe Singapore property market',
      name: 'Market outlook heading fix'
    },
    {
      search: 'Investment OpportunitiesFor investors looking',
      replace: 'Investment Opportunities\n\nFor investors looking',
      name: 'Investment opportunities heading fix'
    },
    {
      search: 'ConclusionSingapore\'s property market',
      replace: 'Conclusion\n\nSingapore\'s property market',
      name: 'Conclusion heading fix'
    }
  ];

  specificPatterns.forEach(({ search, replace, name }) => {
    if (fixedContent.includes(search)) {
      fixedContent = fixedContent.replaceAll(search, replace);
      appliedFixes.push(`✅ ${name}`);
      console.log(`   Applied: ${name}`);
    }
  });

  // Fix 2: General heading-text merge patterns
  // Look for patterns like **Heading**Text and fix to **Heading**\n\nText
  const headingMergePattern = /(\*\*[^*]+\*\*)([A-Z][a-z][^*\n]{15,})/g;
  const headingMergeMatches = fixedContent.match(headingMergePattern) || [];
  
  if (headingMergeMatches.length > 0) {
    fixedContent = fixedContent.replace(headingMergePattern, '$1\n\n$2');
    appliedFixes.push(`✅ Fixed ${headingMergeMatches.length} heading-text merge patterns`);
    console.log(`   Fixed ${headingMergeMatches.length} heading-text merge patterns`);
    
    // Show examples
    headingMergeMatches.slice(0, 3).forEach((match, index) => {
      console.log(`     Example ${index + 1}: ${match.substring(0, 80)}...`);
    });
  }

  // Fix 3: Merged sentences (period immediately followed by capital letter)
  const mergedSentencePattern = /([a-z])\.([A-Z][a-z])/g;
  const mergedSentenceMatches = fixedContent.match(mergedSentencePattern) || [];
  
  if (mergedSentenceMatches.length > 0) {
    fixedContent = fixedContent.replace(mergedSentencePattern, '$1. $2');
    appliedFixes.push(`✅ Fixed ${mergedSentenceMatches.length} merged sentences`);
    console.log(`   Fixed ${mergedSentenceMatches.length} merged sentences`);
  }

  // Fix 4: Clean up excessive line breaks
  const originalLineBreaks = fixedContent.match(/\n{3,}/g) || [];
  if (originalLineBreaks.length > 0) {
    fixedContent = fixedContent.replace(/\n{3,}/g, '\n\n');
    appliedFixes.push(`✅ Cleaned up ${originalLineBreaks.length} excessive line break sections`);
    console.log(`   Cleaned up excessive line breaks`);
  }

  // Fix 5: Ensure proper spacing around markdown headings
  fixedContent = fixedContent.replace(/(\n)(#{1,6}\s[^\n]+)(\n)([^\n#])/g, '$1$2\n\n$4');

  // Fix 6: Remove any stray bold formatting that might be causing issues
  const strayBoldPattern = /\*\*([^*]*)\*\*(\s*)([a-z])/g;
  const strayBoldMatches = fixedContent.match(strayBoldPattern) || [];
  if (strayBoldMatches.length > 0) {
    // Only fix if it looks like a heading followed immediately by lowercase text
    fixedContent = fixedContent.replace(strayBoldPattern, '**$1**$2\n\n$3');
    appliedFixes.push(`✅ Fixed ${strayBoldMatches.length} potential stray bold formatting issues`);
    console.log(`   Fixed stray bold formatting`);
  }

  return {
    content: fixedContent,
    appliedFixes,
    hasChanges: content !== fixedContent,
    originalLength: content.length,
    fixedLength: fixedContent.length
  };
}

// Function to create a fixed article content
function generateFixedArticleJSON(article, fixedContent) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: fixedContent,
    category: article.category,
    tags: article.tags,
    featuredImage: article.featuredImage,
    authorId: article.authorId,
    seoTitle: article.seoTitle || article.title,
    seoDescription: article.seoDescription || article.excerpt,
    seoKeywords: article.seoKeywords || article.tags,
    status: article.status,
    publishedAt: article.publishedAt,
    linkedinPostId: article.linkedinPostId,
    linkedinUrl: article.linkedinUrl,
    linkedInPosted: article.linkedInPosted,
    linkedInPostDate: article.linkedInPostDate
  };
}

async function fixArticleFormatting() {
  try {
    console.log('🔍 Getting current article...');
    
    const article = await getCurrentArticle();
    
    if (!article) {
      console.log('❌ Article not found');
      return;
    }
    
    console.log('✅ Found article:');
    console.log(`   Title: "${article.title}"`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Current content length: ${article.content?.length || 0} characters`);
    
    if (!article.content) {
      console.log('❌ Article content is not available from the API');
      return;
    }
    
    console.log('\n📖 Current content preview (first 500 characters):');
    console.log('-'.repeat(80));
    console.log(article.content.substring(0, 500));
    console.log('-'.repeat(80));
    
    // Apply fixes
    console.log('\n🔧 Analyzing and fixing content...');
    const fixResult = fixContentFormatting(article.content);
    
    console.log(`\n📊 Fix Summary:`);
    console.log(`   Original length: ${fixResult.originalLength} characters`);
    console.log(`   Fixed length: ${fixResult.fixedLength} characters`);
    console.log(`   Has changes: ${fixResult.hasChanges}`);
    console.log(`   Fixes applied: ${fixResult.appliedFixes.length}`);
    
    if (fixResult.appliedFixes.length > 0) {
      console.log(`\n🔧 Applied fixes:`);
      fixResult.appliedFixes.forEach(fix => console.log(`   ${fix}`));
    }
    
    if (!fixResult.hasChanges) {
      console.log('\n✅ No formatting issues found - article is already properly formatted!');
      return;
    }
    
    console.log('\n📖 Fixed content preview (first 500 characters):');
    console.log('-'.repeat(80));
    console.log(fixResult.content.substring(0, 500));
    console.log('-'.repeat(80));
    
    // Generate the fixed article JSON
    const fixedArticle = generateFixedArticleJSON(article, fixResult.content);
    
    // Save to a file for manual review/application
    const fs = require('fs');
    const fixedArticleFileName = `fixed-article-${Date.now()}.json`;
    
    fs.writeFileSync(fixedArticleFileName, JSON.stringify(fixedArticle, null, 2));
    
    console.log(`\n💾 Fixed article saved to: ${fixedArticleFileName}`);
    console.log('\n🎯 Next Steps:');
    console.log('   1. Review the fixed content in the generated JSON file');
    console.log('   2. Use the article update API or admin interface to apply these changes');
    console.log('   3. Verify the formatting on the live site');
    
    console.log('\n🚀 Manual Update Command:');
    console.log(`   You can use this data to update the article through your admin interface`);
    console.log(`   or create an API call to update article ID: ${article.id}`);
    
    // Show some before/after comparisons
    console.log('\n🔍 Before/After Comparison Examples:');
    
    const problematicPatterns = [
      'Policy Impacts and Regulatory LandscapeThe Singapore government',
      'Market OutlookThe Singapore property market'
    ];
    
    problematicPatterns.forEach((pattern, index) => {
      if (article.content.includes(pattern)) {
        const position = article.content.indexOf(pattern);
        const before = article.content.substring(position, position + 150);
        
        const fixedPosition = fixResult.content.indexOf(pattern.replace(/([A-Z][a-z]+)([A-Z])/g, '$1\n\n$2'));
        const after = fixedPosition !== -1 ? 
          fixResult.content.substring(fixedPosition, fixedPosition + 150) : 
          'Pattern fixed';
        
        console.log(`\n   Example ${index + 1}:`);
        console.log(`   BEFORE: ${before}...`);
        console.log(`   AFTER:  ${after}...`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixArticleFormatting();