// Simple HTTP-based audit using the existing API
const http = require('http');

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      timeout: 60000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          resolve({ error: 'Failed to parse JSON', raw: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runImageAudit() {
  try {
    console.log('🔍 Singapore Property Image Finder Agent - Auditing all articles...\n');
    
    // First, preview what would be changed
    console.log('Step 1: Previewing image compliance check...');
    const preview = await makeRequest('/api/fix-all-article-images-comprehensive');
    
    if (preview.error) {
      console.error('❌ Error during preview:', preview.error);
      return;
    }

    console.log(`📊 Audit Results:`);
    console.log(`   Total articles: ${preview.totalArticles}`);
    console.log(`   Changes needed: ${preview.changesNeeded}`);
    console.log(`   Compliant articles: ${preview.totalArticles - preview.changesNeeded}`);

    if (preview.changesNeeded === 0) {
      console.log('\n✅ All article images already follow Singapore Property Image Finder rules!');
      console.log('   No updates needed.');
      return;
    }

    console.log('\n📋 Articles requiring image updates:');
    preview.preview.forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Current: ${article.currentImage.substring(0, 60)}...`);
      console.log(`   Suggested: ${article.suggestedImage.substring(0, 60)}...`);
      console.log(`   URL: ${article.url}`);
    });

    // Now execute the updates
    console.log('\n⚡ Step 2: Applying Singapore Property Image Finder rules...');
    const updateResult = await makeRequest('/api/fix-all-article-images-comprehensive', 'POST');
    
    if (updateResult.success) {
      console.log('\n🎉 SUCCESS! All images now follow Singapore Property Image Finder rules');
      console.log(`   Articles updated: ${updateResult.articlesUpdated}`);
      console.log(`   Articles checked: ${updateResult.articlesChecked}`);
      
      if (updateResult.updates && updateResult.updates.length > 0) {
        console.log('\n📝 Updated articles:');
        updateResult.updates.forEach((update, index) => {
          console.log(`   ${index + 1}. ${update.title}`);
          console.log(`      URL: ${update.url}`);
        });
        
        console.log('\n⚡ DEPLOYMENT REQUIRED:');
        console.log('   Database changes made. Vercel deployment needed for live site update.');
      }
    } else {
      console.error('\n❌ Update failed:', updateResult.error || 'Unknown error');
    }

  } catch (error) {
    console.error('\n❌ Audit failed:', error.message);
  }
}

// Run the audit
console.log('🚀 Starting Singapore Property Image Finder Agent Audit\n');
runImageAudit();