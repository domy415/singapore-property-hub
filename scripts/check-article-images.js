const https = require('https');

// API to check all articles and their current images
async function checkAllArticles() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: '/api/articles',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const articles = JSON.parse(data);
          resolve(articles);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function analyzeImages() {
  try {
    console.log('🔍 Checking all article images in database...');
    
    const articles = await checkAllArticles();
    console.log('📊 Total articles found:', articles.length);
    console.log('');
    
    articles.slice(0, 10).forEach((article, index) => {
      console.log((index + 1) + '. ' + article.title);
      console.log('   Slug: ' + article.slug);
      console.log('   Image: ' + (article.featuredImage || 'No image'));
      console.log('');
    });
    
    // Check for any generic or problematic images
    const problematicImages = articles.filter(article => 
      !article.featuredImage || 
      article.featuredImage.includes('singapore-skyline-property') ||
      !article.featuredImage.includes('unsplash.com')
    );
    
    if (problematicImages.length > 0) {
      console.log('⚠️  Articles with potential image issues:');
      problematicImages.forEach(article => {
        console.log('   - ' + article.title + ': ' + (article.featuredImage || 'No image'));
      });
    } else {
      console.log('✅ All articles have proper Singapore-specific Unsplash images!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

analyzeImages();