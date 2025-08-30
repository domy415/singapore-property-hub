const https = require('https');

// Singapore Property Image Finder compliant images
const SINGAPORE_IMAGES = {
  // Market Insights / General Property Market
  MARKET_INSIGHTS: [
    'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80', // Marina Bay Sands skyline
    'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore CBD skyline
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80', // Singapore financial district
    'https://images.unsplash.com/photo-1570063578733-6a33b69d1439?w=1200&h=630&q=80', // Marina Bay waterfront
  ],
  
  // HDB / Public Housing
  HDB: [
    'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // HDB blocks by Danist Soh
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=630&q=80', // Singapore HDB flats
    'https://images.unsplash.com/photo-1609269018324-ae0141bbdd76?w=1200&h=630&q=80', // HDB void decks
  ],
  
  // Condominiums / Private Property
  CONDO: [
    'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Modern Singapore condo
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=630&q=80', // Luxury condo pool
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&q=80', // Private residential
  ],
  
  // District-specific images
  DISTRICT_2: 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // CBD/Tanjong Pagar
  DISTRICT_9: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=630&q=80', // Orchard Road
  DISTRICT_12: 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80', // Toa Payoh HDB
  
  // National Day / Singapore celebrations
  NATIONAL_DAY: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80', // Marina Bay Sands
  
  // Weekend / Property viewing
  WEEKEND: 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // Singapore skyline
};

// Articles to update based on our earlier analysis
const articleUpdates = [
  {
    slug: 'celebrating-national-day-insights-into-singapore-s-property-market-in-2025',
    title: 'Celebrating National Day',
    recommendedImage: SINGAPORE_IMAGES.NATIONAL_DAY
  },
  {
    slug: 'navigating-the-singapore-property-market-a-national-day-2025-special',
    title: 'National Day 2025 Special',
    recommendedImage: SINGAPORE_IMAGES.NATIONAL_DAY
  },
  {
    slug: 'ultimate-guide-to-living-in-district-12-balestier-toa-payoh-serangoon',
    title: 'District 12 Guide',
    recommendedImage: SINGAPORE_IMAGES.DISTRICT_12
  },
  {
    slug: 'ultimate-guide-to-living-in-district-2-anson-tanjong-pagar-singapore',
    title: 'District 2 Guide',
    recommendedImage: SINGAPORE_IMAGES.DISTRICT_2
  },
  {
    slug: 'navigating-singapore-s-property-market-a-guide-to-independence-planning',
    title: 'Independence Planning',
    recommendedImage: SINGAPORE_IMAGES.MARKET_INSIGHTS[0]
  },
  {
    slug: 'weekend-property-picks-in-singapore-a-2025-market-insight',
    title: 'Weekend Property Picks',
    recommendedImage: SINGAPORE_IMAGES.WEEKEND
  },
  {
    slug: 'unlocking-the-potential-of-singapore-s-property-market-weekend-picks-and-expert-insights',
    title: 'Weekend Expert Insights',
    recommendedImage: SINGAPORE_IMAGES.WEEKEND
  },
  {
    slug: 'hdb-vs-private-property-in-2025-a-complete-comparison-guide-for-singapore',
    title: 'HDB vs Private Property',
    recommendedImage: SINGAPORE_IMAGES.HDB[0]
  },
  {
    slug: 'hdb-vs-private-property-in-2025-a-complete-comparison-guide-for-singapore-housing',
    title: 'HDB vs Private Housing',
    recommendedImage: SINGAPORE_IMAGES.HDB[1]
  },
  {
    slug: 'navigating-singapore-s-cooling-measures-in-2025-a-comprehensive-guide',
    title: 'Cooling Measures 2025',
    recommendedImage: SINGAPORE_IMAGES.MARKET_INSIGHTS[1]
  },
  {
    slug: 'understanding-singapore-s-cooling-measures-in-2025-a-comprehensive-guide',
    title: 'Understanding Cooling Measures',
    recommendedImage: SINGAPORE_IMAGES.MARKET_INSIGHTS[2]
  },
  {
    slug: 'bloomsbury-residences-2025-review',
    title: 'Bloomsbury Residences Review',
    recommendedImage: SINGAPORE_IMAGES.CONDO[0]
  },
  {
    slug: 'hdb-vs-private-property-complete-comparison-guide-',
    title: 'HDB Comparison Guide',
    recommendedImage: SINGAPORE_IMAGES.HDB[2]
  },
  {
    slug: 'singapore-property-market-trends-q3-2024-analysis',
    title: 'Q3 2024 Market Analysis',
    recommendedImage: SINGAPORE_IMAGES.MARKET_INSIGHTS[3]
  },
  {
    slug: 'navigating-singapore-property-an-expert-analysis-of-saturday-showroom-tours',
    title: 'Saturday Showroom Tours',
    recommendedImage: SINGAPORE_IMAGES.CONDO[1]
  }
];

async function updateArticleImage(slug, imageUrl) {
  const data = JSON.stringify({ slug, imageUrl });

  const options = {
    hostname: 'singapore-property-hub.vercel.app',
    port: 443,
    path: '/api/update-article-image',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function updateAllArticles() {
  console.log('Starting Singapore Property Image Finder compliant updates...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const article of articleUpdates) {
    try {
      console.log(`Updating: ${article.title}`);
      console.log(`  Image: ${article.recommendedImage}`);
      
      const result = await updateArticleImage(article.slug, article.recommendedImage);
      
      if (result.success) {
        console.log(`  ✓ Success: ${result.message}\n`);
        successCount++;
      } else {
        console.log(`  ✗ Error: ${result.error || result.message}\n`);
        errorCount++;
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}\n`);
      errorCount++;
    }
  }
  
  console.log('\n=== Update Summary ===');
  console.log(`Total articles: ${articleUpdates.length}`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

// Run the updates
updateAllArticles()
  .then(() => console.log('\nAll updates completed!'))
  .catch(error => console.error('Script failed:', error));