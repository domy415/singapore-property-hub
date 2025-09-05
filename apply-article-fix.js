const https = require('https');
const fs = require('fs');

// Read the fixed article JSON
const fixedArticleFile = 'fixed-article-1757083136766.json';
const fixedArticle = JSON.parse(fs.readFileSync(fixedArticleFile, 'utf8'));

console.log('📄 Loaded fixed article:');
console.log(`   Title: ${fixedArticle.title}`);
console.log(`   ID: ${fixedArticle.id}`);
console.log(`   Content length: ${fixedArticle.content.length} characters`);

// Function to apply the fix using the articles API
function updateArticle(articleData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      id: articleData.id,
      title: articleData.title,
      slug: articleData.slug,
      excerpt: articleData.excerpt,
      content: articleData.content,
      category: articleData.category,
      tags: articleData.tags,
      featuredImage: articleData.featuredImage,
      authorEmail: 'expert@singaporepropertyhub.sg', // Use default author
      seoTitle: articleData.seoTitle,
      seoDescription: articleData.seoDescription,
      seoKeywords: articleData.seoKeywords,
      status: articleData.status,
      publish: articleData.status === 'PUBLISHED'
    });

    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: '/api/articles',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('🚀 Sending update request...');
    console.log(`   Method: ${options.method}`);
    console.log(`   Path: ${options.path}`);
    console.log(`   Data size: ${Buffer.byteLength(postData)} bytes`);

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        console.log(`   Response status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          console.log('Raw response:', responseData.substring(0, 1000));
          resolve({ 
            success: false, 
            error: 'Failed to parse response', 
            rawResponse: responseData.substring(0, 500) 
          });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Function to check if the article exists and needs updating
function checkArticleStatus() {
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
          const currentArticle = response.articles.find(article => 
            article.id === fixedArticle.id ||
            article.slug === fixedArticle.slug
          );
          resolve(currentArticle);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function applyFix() {
  try {
    console.log('🔍 Step 1: Checking current article status...');
    
    const currentArticle = await checkArticleStatus();
    
    if (!currentArticle) {
      console.log('❌ Current article not found in database');
      return;
    }
    
    console.log('✅ Current article found:');
    console.log(`   Current content length: ${currentArticle.content?.length || 0} characters`);
    console.log(`   Fixed content length: ${fixedArticle.content.length} characters`);
    
    // Compare content to see if fix is needed
    if (currentArticle.content === fixedArticle.content) {
      console.log('✅ Article is already fixed - no changes needed!');
      return;
    }
    
    // Show what will be changed
    console.log('\n📊 Changes to be applied:');
    
    // Check for the specific pattern we're fixing
    const hasProblematicPattern = currentArticle.content && 
      currentArticle.content.includes('Policy Impacts and Regulatory LandscapeThe Singapore government');
    
    if (hasProblematicPattern) {
      console.log('   ✅ Will fix: "Policy Impacts and Regulatory LandscapeThe Singapore government"');
      console.log('   ✅ Will add proper spacing between headings and text');
    }
    
    const currentMergedSentences = currentArticle.content ? 
      (currentArticle.content.match(/[a-z]\.[A-Z][a-z]/g) || []).length : 0;
    
    if (currentMergedSentences > 0) {
      console.log(`   ✅ Will fix: ${currentMergedSentences} merged sentences`);
    }
    
    console.log('\n🚀 Step 2: Applying fixes...');
    
    // Note: The articles POST API typically creates new articles, not updates existing ones
    // For this specific case, we might need to use a different approach
    console.log('⚠️  Note: The standard articles API creates new articles rather than updates existing ones.');
    console.log('   For production updates, you may need to:');
    console.log('   1. Use an admin interface');
    console.log('   2. Create a specific update endpoint');
    console.log('   3. Apply the changes manually through the database');
    
    // Let's try the POST API anyway to see what happens
    console.log('\n🧪 Testing update via POST API...');
    
    try {
      const result = await updateArticle(fixedArticle);
      
      if (result.success) {
        console.log('✅ Update successful!');
        console.log(`   Message: ${result.message}`);
        if (result.article) {
          console.log(`   Updated article ID: ${result.article.id}`);
          console.log(`   Title: ${result.article.title}`);
        }
      } else {
        console.log('❌ Update failed');
        console.log(`   Error: ${result.error || 'Unknown error'}`);
        if (result.rawResponse) {
          console.log(`   Raw response: ${result.rawResponse}`);
        }
      }
      
    } catch (updateError) {
      console.log('❌ Update request failed:');
      console.log(`   Error: ${updateError.message}`);
    }
    
    // Provide alternative solutions
    console.log('\n💡 Alternative Solutions:');
    console.log('1. Database Direct Update (if you have database access):');
    console.log(`   UPDATE "Article" SET content = '<fixed_content>' WHERE id = '${fixedArticle.id}';`);
    
    console.log('\n2. Admin Interface Update:');
    console.log(`   - Log into the admin interface`);
    console.log(`   - Navigate to articles management`);
    console.log(`   - Edit the article: "${fixedArticle.title}"`);
    console.log(`   - Replace the content with the fixed version from ${fixedArticleFile}`);
    
    console.log('\n3. Create Update API Endpoint:');
    console.log(`   - Deploy the fix-article-formatting endpoint we created`);
    console.log(`   - Use PUT method to update existing articles`);
    
    // Save a simple update query for manual application
    const updateQuery = `-- SQL Update Query\nUPDATE "Article" \nSET content = $1, "updatedAt" = NOW() \nWHERE id = '${fixedArticle.id}';`;
    
    fs.writeFileSync('article-update-query.sql', updateQuery);
    console.log('\n💾 SQL update query saved to: article-update-query.sql');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

applyFix();