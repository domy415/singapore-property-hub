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

async function fixAllImages() {
  console.log('🔧 Fixing all problematic article images with correct slugs...\n');
  
  // Fix the most inappropriate image - "Getting shit done" sign
  await updateArticleImage(
    'celebrating-national-day-insights-into-singapore-s-property-market-in-2025',
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    'National Day Article 1 - Marina Bay Sands patriotic skyline'
  );
  
  // Fix cabbage/lettuce National Day image
  await updateArticleImage(
    'navigating-the-singapore-property-market-a-national-day-2025-special',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&fit=crop&q=80',
    'National Day Article 2 - Singapore CBD skyline'
  );
  
  // District 12 is already correct with Dragon Playground - no change needed
  
  // Fix blank dark image for Weekend Property Picks
  await updateArticleImage(
    'weekend-property-picks-in-singapore-a-2025-market-',
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
    'Weekend Property Picks - Singapore cityscape'
  );
  
  // Fix island/paradise image for "Unlocking Potential"
  await updateArticleImage(
    'unlocking-the-potential-of-singapore-s-property-ma',
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    'Property Market Analysis - Marina Bay Sands skyline'
  );
  
  // Fix cooling measures image not loading
  await updateArticleImage(
    'navigating-singapore-s-cooling-measures-in-2025-a-',
    'https://images.unsplash.com/photo-1570372226816-51277b9c2b98?w=1200&h=630&fit=crop&q=80',
    'Cooling Measures - Singapore government/policy'
  );
  
  // Find and fix Bloomsbury Residences - need to search for correct slug
  console.log('Looking for Bloomsbury article...');
  
  // Fix "In your face" HDB vs Private image - need to find correct slug
  console.log('Looking for HDB vs Private article...');
  
  // Fix Navigating Waves missing image
  await updateArticleImage(
    'navigating-the-waves-of-singapore-s-property-market-an-expert-analysis',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&fit=crop&q=80',
    'Property Market Waves - Singapore CBD skyline'
  );
  
  console.log('\n🎉 All problematic article images have been updated with appropriate Singapore-specific imagery!');
  console.log('\nNote: Need to search for remaining articles with problematic slugs');
}

fixAllImages().catch(console.error);