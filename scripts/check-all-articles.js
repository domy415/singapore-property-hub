const https = require('https');

// Singapore Property Image Finder Agent Guidelines Check
const SINGAPORE_GUIDELINES = {
  // District-specific iconic elements
  DISTRICT_12: 'Should show Toa Payoh HDB blocks with void decks, Dragon Playground',
  DISTRICT_2: 'Should show CBD/Tanjong Pagar skyline, Marina Bay backdrop',
  DISTRICT_9: 'Should show Orchard Road, shopping district imagery',
  
  // Content-specific requirements
  NATIONAL_DAY: 'Should show Singapore flag celebrations, Marina Bay Sands patriotic imagery',
  HDB_CONTENT: 'Should show authentic Singapore HDB blocks with void decks, public housing',
  CONDO_CONTENT: 'Should show modern Singapore condominiums, private residential',
  MARKET_ANALYSIS: 'Should show Marina Bay Sands skyline, CBD financial district',
  
  // Image standards
  RESOLUTION: '1200x630 minimum',
  CONTEXT: '100% Singapore-specific, no generic stock photos',
  QUALITY: 'Professional aesthetics, warm Singapore lighting'
};

async function fetchArticles() {
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

function analyzeImageCompliance(article) {
  const title = article.title.toLowerCase();
  const currentImage = article.featuredImage || 'No image';
  
  let analysis = {
    compliant: false,
    issues: [],
    recommendations: [],
    currentImage: currentImage
  };

  // Check for District 12 content
  if (title.includes('district 12') || title.includes('toa payoh') || title.includes('balestier')) {
    const expectedImage = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80';
    if (!currentImage.includes('zIp4YexPPhQ')) {
      analysis.issues.push('District 12 content should show Toa Payoh HDB blocks');
      analysis.recommendations.push(expectedImage);
    } else {
      analysis.compliant = true;
    }
  }
  
  // Check for District 2 content
  else if (title.includes('district 2') || title.includes('tanjong pagar') || title.includes('anson')) {
    const expectedImage = 'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80';
    if (!currentImage.includes('1567360425618')) {
      analysis.issues.push('District 2 content should show CBD/Tanjong Pagar skyline');
      analysis.recommendations.push(expectedImage);
    } else {
      analysis.compliant = true;
    }
  }
  
  // Check for National Day content
  else if (title.includes('national day') || title.includes('independence') || title.includes('celebrating')) {
    const expectedImage = 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80';
    if (!currentImage.includes('1508964942454')) {
      analysis.issues.push('National Day content should show Marina Bay Sands patriotic imagery');
      analysis.recommendations.push(expectedImage);
    } else {
      analysis.compliant = true;
    }
  }
  
  // Check for Market Analysis content
  else if (title.includes('market') || title.includes('analysis') || title.includes('insights') || title.includes('navigating')) {
    const expectedImages = [
      'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80', // Marina Bay Sands
      'https://images.unsplash.com/photo-1567360425618?w=1200&h=630&q=80', // CBD skyline
      'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&q=80' // Financial district
    ];
    const hasMarketImage = expectedImages.some(img => {
      const photoId = img.match(/photo-([^?]+)/)?.[1];
      return photoId && currentImage.includes(photoId);
    });
    
    if (!hasMarketImage) {
      analysis.issues.push('Market analysis content should show Singapore skyline/financial district');
      analysis.recommendations.push(expectedImages[0]);
    } else {
      analysis.compliant = true;
    }
  }
  
  // Check for HDB content
  else if (title.includes('hdb') || title.includes('public housing')) {
    const expectedImage = 'https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80';
    if (!currentImage.includes('zIp4YexPPhQ')) {
      analysis.issues.push('HDB content should show authentic Singapore HDB blocks');
      analysis.recommendations.push(expectedImage);
    } else {
      analysis.compliant = true;
    }
  }
  
  // Check for Condo/Property Review content
  else if (title.includes('review') || title.includes('condo') || title.includes('residence')) {
    const expectedImages = [
      'https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80', // Modern condo
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=630&q=80' // Luxury condo
    ];
    const hasCondoImage = expectedImages.some(img => {
      const photoId = img.match(/photo-([^?]+)/)?.[1];
      return photoId && currentImage.includes(photoId);
    });
    
    if (!hasCondoImage) {
      analysis.issues.push('Condo review content should show modern Singapore condominiums');
      analysis.recommendations.push(expectedImages[0]);
    } else {
      analysis.compliant = true;
    }
  }
  
  // Default check for general content
  else {
    const singaporeImages = [
      '1508964942454', // Marina Bay Sands
      '1567360425618', // CBD skyline
      'zIp4YexPPhQ', // HDB blocks
      'kNzqXxlvmE4' // Modern condo
    ];
    
    const hasSingaporeImage = singaporeImages.some(id => currentImage.includes(id));
    if (!hasSingaporeImage) {
      analysis.issues.push('Should use Singapore-specific imagery');
      analysis.recommendations.push('https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80');
    } else {
      analysis.compliant = true;
    }
  }

  return analysis;
}

async function checkAllArticles() {
  try {
    console.log('🔍 Checking all articles against Singapore Property Image Finder guidelines...\n');
    
    const articles = await fetchArticles();
    
    if (!articles || !Array.isArray(articles)) {
      console.log('❌ Could not fetch articles');
      return;
    }
    
    console.log(`📄 Found ${articles.length} articles\n`);
    
    const nonCompliantArticles = [];
    
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      
      const analysis = analyzeImageCompliance(article);
      
      if (analysis.compliant) {
        console.log('   ✅ COMPLIANT with Singapore Property Image Finder guidelines');
      } else {
        console.log('   ❌ NON-COMPLIANT');
        analysis.issues.forEach(issue => {
          console.log(`      Issue: ${issue}`);
        });
        analysis.recommendations.forEach(rec => {
          console.log(`      Recommended: ${rec}`);
        });
        
        nonCompliantArticles.push({
          slug: article.slug,
          title: article.title,
          currentImage: analysis.currentImage,
          recommendedImage: analysis.recommendations[0],
          issues: analysis.issues
        });
      }
      
      console.log('');
    });
    
    // Summary
    console.log('=== COMPLIANCE SUMMARY ===');
    console.log(`Total articles: ${articles.length}`);
    console.log(`Compliant: ${articles.length - nonCompliantArticles.length}`);
    console.log(`Non-compliant: ${nonCompliantArticles.length}`);
    
    if (nonCompliantArticles.length > 0) {
      console.log('\n=== NON-COMPLIANT ARTICLES ===');
      nonCompliantArticles.forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Current: ${article.currentImage}`);
        console.log(`   Recommended: ${article.recommendedImage}`);
        console.log(`   Issues: ${article.issues.join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking articles:', error);
  }
}

checkAllArticles();