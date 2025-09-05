const https = require('https');

// Function to get articles with full content
function getArticlesWithContent() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: '/api/articles?limit=100',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Node.js Script'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          console.log('Raw API Response (first 500 chars):', data.substring(0, 500));
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          console.log('Failed to parse JSON. Raw response:', data.substring(0, 1000));
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// Function to scrape the actual article page content
function scrapeArticlePage(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: `/articles/${slug}`,
      method: 'GET',
      headers: {
        'Accept': 'text/html',
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
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

function extractContentFromHTML(html) {
  // Try multiple methods to extract the article content
  const extractionMethods = [
    // Method 1: Look for article tag
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    // Method 2: Look for main content area
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    // Method 3: Look for content div
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // Method 4: Look for markdown or prose content
    /<div[^>]*class="[^"]*prose[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  ];
  
  for (const method of extractionMethods) {
    const match = html.match(method);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

function analyzeContentForIssues(content, source = 'unknown') {
  console.log(`\n🔍 Analyzing content from ${source}`);
  console.log(`Content length: ${content.length} characters`);
  
  // Remove HTML tags for analysis
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
  
  console.log('\n📖 Content sample (first 800 characters):');
  console.log('-'.repeat(80));
  console.log(cleanContent.substring(0, 800));
  console.log('-'.repeat(80));
  
  // Look for problematic patterns
  const issues = [];
  
  // Check for heading-text merges in HTML
  const htmlBoldMerge = content.match(/<strong[^>]*>([^<]+)<\/strong>([A-Z][a-z][^<\n]{20,})/gi) || [];
  if (htmlBoldMerge.length > 0) {
    issues.push(`HTML bold-text merge: ${htmlBoldMerge.length} instances`);
    console.log('\n🚨 HTML Bold-Text Merge Issues Found:');
    htmlBoldMerge.slice(0, 5).forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue.substring(0, 150)}...`);
    });
  }
  
  // Check for markdown-style bold merges
  const markdownBoldMerge = cleanContent.match(/\*\*([^*]+)\*\*([A-Z][a-z][^*\n]{20,})/g) || [];
  if (markdownBoldMerge.length > 0) {
    issues.push(`Markdown bold-text merge: ${markdownBoldMerge.length} instances`);
    console.log('\n🚨 Markdown Bold-Text Merge Issues Found:');
    markdownBoldMerge.slice(0, 5).forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue.substring(0, 150)}...`);
    });
  }
  
  // Check for excessive bold formatting
  const boldSections = content.match(/<strong[^>]*>[^<]+<\/strong>/gi) || content.match(/\*\*[^*]+\*\*/g) || [];
  if (boldSections.length > 20) {
    issues.push(`Excessive bold formatting: ${boldSections.length} instances`);
  }
  
  // Look for specific problematic patterns mentioned in the original issue
  const problematicPatterns = [
    'Policy Impacts and Regulatory LandscapeThe Singapore government',
    'Market OutlookThe Singapore property market',
    'Investment OpportunitiesFor investors looking',
    'ConclusionSingapore\'s property market'
  ];
  
  problematicPatterns.forEach(pattern => {
    if (cleanContent.includes(pattern)) {
      issues.push(`Found specific problematic pattern: "${pattern}"`);
      console.log(`🚨 Found problematic pattern: "${pattern}"`);
    }
  });
  
  // Look for sentences that run together without proper spacing
  const mergedSentencePattern = /[a-z]\.[A-Z][a-z]/g;
  const mergedSentences = cleanContent.match(mergedSentencePattern) || [];
  if (mergedSentences.length > 0) {
    issues.push(`Merged sentences: ${mergedSentences.length} instances`);
    console.log(`\n⚠️  Found ${mergedSentences.length} potential merged sentences:`);
    mergedSentences.slice(0, 5).forEach((sentence, index) => {
      console.log(`   ${index + 1}. "${sentence}"`);
    });
  }
  
  console.log(`\n📊 Analysis Summary:`);
  console.log(`   Total issues found: ${issues.length}`);
  issues.forEach(issue => console.log(`   - ${issue}`));
  
  return issues;
}

async function extractAndAnalyze() {
  const targetSlug = "singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape";
  
  try {
    console.log('🔍 Step 1: Getting articles from API...');
    const articlesResponse = await getArticlesWithContent();
    
    let targetArticle = null;
    
    if (articlesResponse && articlesResponse.articles) {
      targetArticle = articlesResponse.articles.find(article => 
        article.slug === targetSlug || 
        (article.title && article.title.toLowerCase().includes('property market poised'))
      );
      
      if (targetArticle) {
        console.log(`✅ Found target article in API response`);
        console.log(`Title: ${targetArticle.title}`);
        
        if (targetArticle.content && targetArticle.content.length > 0) {
          console.log('✅ Article content is available in API response');
          analyzeContentForIssues(targetArticle.content, 'API');
          return; // Success, no need to scrape
        } else {
          console.log('⚠️  Article found but content field is empty or missing');
        }
      } else {
        console.log('❌ Target article not found in API response');
        if (articlesResponse.articles) {
          console.log(`Available articles (${articlesResponse.articles.length}):`);
          articlesResponse.articles.slice(0, 10).forEach((article, index) => {
            console.log(`   ${index + 1}. "${article.title}" (${article.slug})`);
          });
        }
      }
    }
    
    console.log('\n🔍 Step 2: Scraping article page HTML...');
    const htmlContent = await scrapeArticlePage(targetSlug);
    console.log(`✅ Retrieved HTML (${htmlContent.length} characters)`);
    
    const extractedContent = extractContentFromHTML(htmlContent);
    
    if (extractedContent) {
      console.log('✅ Successfully extracted content from HTML');
      analyzeContentForIssues(extractedContent, 'HTML scraping');
    } else {
      console.log('❌ Could not extract content from HTML');
      console.log('\nHTML structure sample:');
      console.log(htmlContent.substring(0, 2000));
      
      // Still try to analyze the raw HTML for patterns
      analyzeContentForIssues(htmlContent, 'raw HTML');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

extractAndAnalyze();