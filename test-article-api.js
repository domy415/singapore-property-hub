const http = require('http');

// Function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          resolve({ rawData: data, error: 'Failed to parse JSON' });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testArticleAPI() {
  try {
    console.log('🔍 Testing API endpoint...\n');
    
    // Test 1: Get all articles to see what we have
    console.log('Step 1: Fetching all articles...');
    const allArticles = await makeRequest('http://localhost:3000/api/articles?limit=50');
    
    if (allArticles.error) {
      console.error('❌ Error fetching articles:', allArticles.error);
      return;
    }
    
    if (!allArticles.articles || allArticles.articles.length === 0) {
      console.log('❌ No articles found in database');
      return;
    }
    
    console.log(`✅ Found ${allArticles.articles.length} articles\n`);
    
    // Look for the specific article
    const targetArticle = allArticles.articles.find(article => 
      article.title.toLowerCase().includes('property market poised') ||
      article.title.toLowerCase().includes('continued growth')
    );
    
    if (!targetArticle) {
      console.log('❌ Target article not found. Available articles:');
      allArticles.articles.slice(0, 10).forEach((article, index) => {
        console.log(`${index + 1}. "${article.title}"`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Status: ${article.status}\n`);
      });
      return;
    }
    
    console.log('✅ Found target article!');
    console.log(`Title: "${targetArticle.title}"`);
    console.log(`Slug: ${targetArticle.slug}`);
    console.log(`Status: ${targetArticle.status}\n`);
    
    // Test 2: Use our debug endpoint
    console.log('Step 2: Testing debug endpoint...');
    const encodedTitle = encodeURIComponent(targetArticle.title);
    const debugResult = await makeRequest(`http://localhost:3000/api/debug-article-content?title=${encodedTitle}`);
    
    if (debugResult.error) {
      console.error('❌ Debug endpoint error:', debugResult.error);
      
      // Fallback: show content from the general articles endpoint
      console.log('\n📖 Content analysis from general endpoint:');
      if (targetArticle.content) {
        analyzeContent(targetArticle.content);
      } else {
        console.log('⚠️  Content not available in general articles endpoint');
      }
      return;
    }
    
    console.log('✅ Debug endpoint successful!\n');
    console.log('📄 Article Analysis:');
    console.log(`Content Length: ${debugResult.contentAnalysis.contentLength} characters`);
    console.log(`Has Heading Merge Issues: ${debugResult.contentAnalysis.hasHeadingMergeIssues}`);
    
    if (debugResult.contentAnalysis.suspiciousPatterns.mergedHeadings.length > 0) {
      console.log('\n🚨 Merged Headings Found:');
      debugResult.contentAnalysis.suspiciousPatterns.mergedHeadings.slice(0, 5).forEach((pattern, index) => {
        console.log(`${index + 1}. ${pattern}`);
      });
    }
    
    if (debugResult.contentAnalysis.suspiciousPatterns.boldPatterns.length > 0) {
      console.log('\n⚠️  Bold Pattern Issues:');
      debugResult.contentAnalysis.suspiciousPatterns.boldPatterns.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.issue}: ${issue.example}`);
      });
    }
    
    if (debugResult.contentAnalysis.suspiciousPatterns.spacingIssues.length > 0) {
      console.log('\n⚠️  Spacing Issues:');
      debugResult.contentAnalysis.suspiciousPatterns.spacingIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }
    
    // Show first 500 characters of content
    if (debugResult.article && debugResult.article.content) {
      console.log('\n📖 Content Preview (first 500 characters):');
      console.log('-'.repeat(60));
      console.log(debugResult.article.content.substring(0, 500));
      console.log('-'.repeat(60));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function analyzeContent(content) {
  if (!content) {
    console.log('❌ No content to analyze');
    return;
  }
  
  console.log(`Content length: ${content.length} characters`);
  
  // Simple analysis
  const headingMergePattern = /\*\*([^*]+)\*\*([A-Z][^*\n]+)/g;
  const mergedHeadings = [];
  let match;
  
  while ((match = headingMergePattern.exec(content)) !== null) {
    mergedHeadings.push(`"**${match[1]}**${match[2].substring(0, 30)}..."`);
  }
  
  if (mergedHeadings.length > 0) {
    console.log(`🚨 Found ${mergedHeadings.length} potential merged heading-text patterns:`);
    mergedHeadings.slice(0, 3).forEach((pattern, index) => {
      console.log(`  ${index + 1}. ${pattern}`);
    });
  }
  
  console.log('\n📖 Content Preview (first 300 characters):');
  console.log('-'.repeat(50));
  console.log(content.substring(0, 300));
  console.log('-'.repeat(50));
}

testArticleAPI();