const https = require('https');

async function updateArticleImage(slug, imageUrl, description) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      slug: slug,
      imageUrl: imageUrl
    });

    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: '/api/update-article-image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ ${description}: HTTP ${res.statusCode}`);
        resolve(responseData);
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error updating ${description}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function fixRemainingImages() {
  console.log('🔧 Fixing remaining problematic article images...\n');
  
  // Fix Bloomsbury Residences with proper development image
  await updateArticleImage(
    'bloomsbury-residences-2025-review',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
    'Bloomsbury Residences - Modern Singapore condo development'
  );
  
  // Fix HDB comparison 'In your face' image - using correct slug
  await updateArticleImage(
    'hdb-vs-private-property-complete-comparison-guide-',
    'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&fit=crop&q=80',
    'HDB vs Private - Singapore HDB blocks'
  );
  
  console.log('\n🎉 All remaining article images have been updated!');
}

fixRemainingImages().catch(console.error);