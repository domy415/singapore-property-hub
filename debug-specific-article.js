const https = require('https');

function getArticles() {
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
          resolve(response.articles || response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function analyzeContentIssues(content, title) {
  console.log(`\n🔍 Analyzing "${title}"`);
  console.log(`Content length: ${content.length} characters`);
  
  // Check for heading-text merge patterns
  const headingMergePattern = /\*\*([^*]+)\*\*([A-Z][a-z]*[^*\n]+)/g;
  const mergedHeadings = [];
  let match;
  
  console.log('\n🚨 Searching for merged heading patterns like "**Heading**Text"...');
  
  while ((match = headingMergePattern.exec(content)) !== null) {
    const heading = match[1].trim();
    const followingText = match[2].substring(0, 100);
    
    mergedHeadings.push({
      heading: heading,
      followingText: followingText,
      fullMatch: match[0],
      position: match.index
    });
  }
  
  if (mergedHeadings.length > 0) {
    console.log(`\n❌ Found ${mergedHeadings.length} merged heading-text patterns:`);
    
    mergedHeadings.slice(0, 10).forEach((item, index) => {
      console.log(`\n${index + 1}. Merged Pattern Found:`);
      console.log(`   Heading: "${item.heading}"`);
      console.log(`   Merged Text: "${item.followingText}${item.followingText.length >= 100 ? '...' : ''}"`);
      console.log(`   Position in content: ${item.position}`);
      console.log(`   Full problematic text: "${item.fullMatch.substring(0, 150)}${item.fullMatch.length > 150 ? '...' : ''}"`);
    });
    
    // Show context around the first issue
    if (mergedHeadings.length > 0) {
      const firstIssue = mergedHeadings[0];
      const start = Math.max(0, firstIssue.position - 100);
      const end = Math.min(content.length, firstIssue.position + 300);
      const contextContent = content.substring(start, end);
      
      console.log(`\n📖 Context around first issue:`);
      console.log('-'.repeat(80));
      console.log(contextContent);
      console.log('-'.repeat(80));
    }
    
  } else {
    console.log('✅ No obvious heading-text merge patterns found');
  }
  
  // Check for excessive bold formatting
  const boldMatches = content.match(/\*\*[^*]+\*\*/g) || [];
  console.log(`\n📊 Bold formatting analysis:`);
  console.log(`   Total bold sections: ${boldMatches.length}`);
  
  if (boldMatches.length > 30) {
    console.log('⚠️  Excessive bold formatting detected');
    console.log('   First 10 bold sections:');
    boldMatches.slice(0, 10).forEach((bold, index) => {
      console.log(`   ${index + 1}. ${bold}`);
    });
  }
  
  // Check for spacing issues
  console.log(`\n🔍 Checking for spacing issues:`);
  const spacingIssues = [];
  
  if (content.includes('.The ') || content.includes('.Singapore ') || content.includes('.Property ')) {
    spacingIssues.push('Missing spaces after periods detected');
  }
  
  const mergedSentences = content.match(/[a-z][A-Z]/g) || [];
  if (mergedSentences.length > 0) {
    spacingIssues.push(`Possible merged sentences: ${mergedSentences.length} instances`);
  }
  
  if (spacingIssues.length > 0) {
    spacingIssues.forEach(issue => console.log(`   ❌ ${issue}`));
  } else {
    console.log('   ✅ No obvious spacing issues found');
  }
  
  return {
    mergedHeadings: mergedHeadings.length,
    boldSections: boldMatches.length,
    spacingIssues: spacingIssues.length,
    hasProblems: mergedHeadings.length > 0 || boldMatches.length > 30 || spacingIssues.length > 0
  };
}

getArticles().then(articles => {
  console.log(`📊 Found ${articles.length} articles in database`);
  
  // Search for the specific article
  const targetTitles = [
    "Singapore's Property Market Poised for Continued Growth Amid Evolving Regulatory Landscape",
    "Singapore Property Market Poised",
    "Continued Growth",
    "Regulatory Landscape"
  ];
  
  let targetArticle = null;
  
  for (const searchTitle of targetTitles) {
    targetArticle = articles.find(article => 
      article.title && article.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    if (targetArticle) {
      console.log(`\n✅ Found target article using search term: "${searchTitle}"`);
      break;
    }
  }
  
  if (!targetArticle) {
    console.log('\n❌ Target article not found. Available articles:');
    articles.slice(0, 15).forEach((article, index) => {
      console.log(`${index + 1}. "${article.title}"`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Status: ${article.status}`);
      console.log(`   Published: ${article.publishedAt || 'Not published'}`);
      console.log('');
    });
    return;
  }
  
  console.log(`\n🎯 Target Article Found:`);
  console.log(`   Title: "${targetArticle.title}"`);
  console.log(`   Slug: ${targetArticle.slug}`);
  console.log(`   Status: ${targetArticle.status}`);
  console.log(`   Published: ${targetArticle.publishedAt || 'Not published'}`);
  
  if (!targetArticle.content) {
    console.log('\n❌ Article content is not available in the API response');
    console.log('This might be because the content field is not included in the articles endpoint');
    console.log('Available fields:', Object.keys(targetArticle));
    return;
  }
  
  // Analyze the content for issues
  const analysis = analyzeContentIssues(targetArticle.content, targetArticle.title);
  
  console.log(`\n📋 Summary:`);
  console.log(`   Merged headings found: ${analysis.mergedHeadings}`);
  console.log(`   Bold sections: ${analysis.boldSections}`);
  console.log(`   Spacing issues: ${analysis.spacingIssues}`);
  console.log(`   Has problems: ${analysis.hasProblems ? 'YES' : 'NO'}`);
  
  if (analysis.hasProblems) {
    console.log(`\n🔧 This article needs formatting fixes!`);
  } else {
    console.log(`\n✅ This article appears to be properly formatted`);
  }
  
}).catch(error => {
  console.error('❌ Error fetching articles:', error);
});