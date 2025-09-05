const https = require('https');

function getFullArticle(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: `/articles/${slug}`,
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function getDebugArticleContent(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: `/api/debug-article-content?slug=${encodeURIComponent(slug)}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function analyzeHTMLContent(htmlContent, articleTitle) {
  console.log(`\n🔍 Analyzing HTML content for "${articleTitle}"`);
  
  // Extract content from HTML
  const contentMatches = htmlContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (!contentMatches) {
    console.log('❌ Could not find article content in HTML');
    
    // Look for patterns in the raw HTML that might indicate formatting issues
    const boldPatterns = htmlContent.match(/<strong[^>]*>([^<]+)<\/strong>([A-Z][^<]*)/gi) || [];
    if (boldPatterns.length > 0) {
      console.log(`\n🚨 Found ${boldPatterns.length} potential bold-text merge patterns in HTML:`);
      boldPatterns.slice(0, 5).forEach((pattern, index) => {
        console.log(`   ${index + 1}. ${pattern.substring(0, 150)}...`);
      });
    }
    
    // Look for markdown-style bold patterns
    const markdownBoldPatterns = htmlContent.match(/\*\*([^*]+)\*\*([A-Z][^*\n]+)/g) || [];
    if (markdownBoldPatterns.length > 0) {
      console.log(`\n🚨 Found ${markdownBoldPatterns.length} markdown bold-text merge patterns:`);
      markdownBoldPatterns.slice(0, 5).forEach((pattern, index) => {
        console.log(`   ${index + 1}. ${pattern}`);
      });
    }
    
    return;
  }
  
  const articleContent = contentMatches[1];
  console.log(`Article content length: ${articleContent.length} characters`);
  
  // Look for problematic patterns in the extracted content
  const strongTags = articleContent.match(/<strong[^>]*>[^<]+<\/strong>/gi) || [];
  console.log(`Strong tags found: ${strongTags.length}`);
  
  // Check if there are strong tags immediately followed by text without spacing
  const mergedStrongPatterns = articleContent.match(/<strong[^>]*>([^<]+)<\/strong>([A-Z][^<]*)/gi) || [];
  if (mergedStrongPatterns.length > 0) {
    console.log(`\n❌ Found ${mergedStrongPatterns.length} strong tag merge patterns:`);
    mergedStrongPatterns.slice(0, 5).forEach((pattern, index) => {
      console.log(`   ${index + 1}. ${pattern.substring(0, 200)}...`);
    });
  }
  
  // Show a sample of the content
  console.log('\n📖 Sample content:');
  console.log('-'.repeat(80));
  console.log(articleContent.substring(0, 1000));
  console.log('-'.repeat(80));
}

async function debugFullArticle() {
  const slug = "singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape";
  
  try {
    console.log('🔍 Step 1: Trying debug API endpoint...');
    
    try {
      const debugResult = await getDebugArticleContent(slug);
      
      if (debugResult.error) {
        console.log(`❌ Debug API error: ${debugResult.error}`);
      } else {
        console.log('✅ Debug API successful!');
        console.log(`\nArticle details:`);
        console.log(`Title: ${debugResult.article.title}`);
        console.log(`Content length: ${debugResult.article.content.length} characters`);
        
        console.log(`\nContent analysis:`);
        console.log(`Has heading merge issues: ${debugResult.contentAnalysis.hasHeadingMergeIssues}`);
        console.log(`Merged headings: ${debugResult.contentAnalysis.suspiciousPatterns.mergedHeadings.length}`);
        console.log(`Bold patterns: ${debugResult.contentAnalysis.suspiciousPatterns.boldPatterns.length}`);
        console.log(`Spacing issues: ${debugResult.contentAnalysis.suspiciousPatterns.spacingIssues.length}`);
        
        if (debugResult.contentAnalysis.suspiciousPatterns.mergedHeadings.length > 0) {
          console.log('\n🚨 Merged heading patterns found:');
          debugResult.contentAnalysis.suspiciousPatterns.mergedHeadings.forEach((pattern, index) => {
            console.log(`   ${index + 1}. ${pattern}`);
          });
        }
        
        // Show raw content sample
        console.log('\n📖 Raw content sample (first 1000 characters):');
        console.log('-'.repeat(80));
        console.log(debugResult.article.content.substring(0, 1000));
        console.log('-'.repeat(80));
        
        return; // Exit successfully
      }
    } catch (debugError) {
      console.log(`❌ Debug API failed: ${debugError.message}`);
    }
    
    console.log('\n🔍 Step 2: Trying HTML scraping approach...');
    
    const htmlContent = await getFullArticle(slug);
    console.log(`✅ Retrieved HTML content (${htmlContent.length} characters)`);
    
    analyzeHTMLContent(htmlContent, "Singapore's Property Market Article");
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugFullArticle();