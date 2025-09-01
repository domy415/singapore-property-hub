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
  console.log('🔧 Fixing all problematic article images...\n');
  
  // Fix the most inappropriate image first
  await updateArticleImage(
    'celebrating-national-day-insights-into-singapore-s-',
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    'National Day Article 1 - Marina Bay Sands patriotic skyline'
  );
  
  // Fix cabbage/lettuce National Day image
  await updateArticleImage(
    'navigating-the-singapore-property-market-a-nationa',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&fit=crop&q=80',
    'National Day Article 2 - Singapore CBD skyline'
  );
  
  // Fix District 12 with proper Dragon Playground
  await updateArticleImage(
    'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon',
    'https://remembersingapore.org/wp-content/uploads/2011/04/toa-payoh-dragon-playground1.jpg',
    'District 12 Guide - Authentic Toa Payoh Dragon Playground'
  );
  
  // Fix blank dark image
  await updateArticleImage(
    'weekend-property-picks-in-singapore-a-2025-market-',
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
    'Weekend Property Picks - Singapore cityscape'
  );
  
  // Fix island/paradise image
  await updateArticleImage(
    'unlocking-the-potential-of-singapore-s-property-ma',
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    'Property Market Analysis - Marina Bay Sands skyline'
  );
  
  // Fix cooling measures image
  await updateArticleImage(
    'navigating-singapore-s-cooling-measures-in-2025-a-',
    'https://images.unsplash.com/photo-1570372226816-51277b9c2b98?w=1200&h=630&fit=crop&q=80',
    'Cooling Measures - Singapore government/policy'
  );
  
  // Fix Bloomsbury Residences with proper development image
  await updateArticleImage(
    'bloomsbury-residences-review-a-detailed-look-at-th',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
    'Bloomsbury Residences - Modern Singapore condo development'
  );
  
  // Fix HDB comparison inappropriate image
  await updateArticleImage(
    'hdb-vs-private-property-complete-comparison-guide',
    'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&fit=crop&q=80',
    'HDB vs Private - Singapore HDB blocks'
  );
  
  // Fix Navigating Waves missing image
  await updateArticleImage(
    'navigating-the-waves-of-singapore-s-property-marke',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&fit=crop&q=80',
    'Property Market Waves - Singapore CBD skyline'
  );
  
  console.log('\n🎉 All article images have been updated with appropriate Singapore-specific imagery!');
}

fixAllImages().catch(console.error);