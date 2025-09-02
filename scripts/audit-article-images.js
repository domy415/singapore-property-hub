require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Singapore Property Image Finder Guidelines
const IMAGE_GUIDELINES = {
  DISTRICT_SPECIFIC: {
    '1': 'Marina Bay Sands, CBD skyline, Singapore River',
    '2': 'Chinatown, Tanjong Pagar, CBD financial district',
    '9': 'Orchard Road, ION Orchard, shopping district',
    '10': 'Bukit Timah, landed properties, nature reserve',
    '12': 'Toa Payoh HDB blocks, void decks, heartland',
    '15': 'East Coast, beachfront condos, Marine Parade',
    '19': 'Punggol Waterway, HDB new towns, LRT tracks'
  },
  CATEGORY_SPECIFIC: {
    'HDB': 'HDB flat exterior, void deck, covered linkways',
    'CONDO': 'Modern condominium, swimming pool, luxury',
    'NEW_LAUNCH': 'Construction site, showflat, developer',
    'SHOPHOUSE': 'Traditional shophouse, Peranakan architecture',
    'INVESTMENT': 'Financial district, skyline, charts',
    'MARKET': 'Marina Bay skyline, business district'
  },
  REQUIRED_KEYWORDS: [
    'singapore',
    'marina bay',
    'hdb',
    'condo',
    'orchard',
    'cbd',
    'toa payoh',
    'punggol',
    'east coast'
  ]
};

// Approved Singapore-specific images
const APPROVED_IMAGES = {
  // District-specific
  'district_1_cbd': 'https://images.unsplash.com/photo-1567360425618-1594206637d2',
  'district_9_orchard': 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
  'district_10_bukit_timah': 'https://images.unsplash.com/photo-1565649794736-f25064f88262',
  'district_12_toa_payoh': 'https://images.unsplash.com/photo-1633628207825-f8ab7d83810f',
  'district_15_east_coast': 'https://images.unsplash.com/photo-1600664356348-10686526af4f',
  
  // Category-specific
  'hdb_general': 'https://images.unsplash.com/photo-1633628207825-f8ab7d83810f',
  'condo_luxury': 'https://images.unsplash.com/photo-1600664356348-10686526af4f',
  'market_insights': 'https://images.unsplash.com/photo-1567360425618-1594206637d2',
  'investment_guide': 'https://images.unsplash.com/photo-1570296091715-27a1149643fb',
  'national_day': 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7',
  
  // Fallback Singapore skyline
  'singapore_skyline': 'https://images.unsplash.com/photo-1567360425618-1594206637d2'
};

async function auditArticleImages() {
  try {
    console.log('🔍 Starting Singapore Property Image Audit...\n');
    
    // Get all published articles
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        featuredImage: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${articles.length} published articles to audit\n`);
    
    const issues = [];
    const compliant = [];
    
    for (const article of articles) {
      const imageUrl = article.featuredImage || '';
      let isCompliant = false;
      let issue = '';
      let suggestedImage = '';
      
      // Check if image exists
      if (!imageUrl) {
        issue = 'Missing featured image';
        suggestedImage = getRecommendedImage(article);
      }
      // Check if it's a Singapore-specific image
      else if (!isSingaporeSpecificImage(imageUrl, article)) {
        issue = 'Image not Singapore-specific or doesn\'t match content';
        suggestedImage = getRecommendedImage(article);
      }
      // Check if image URL is valid
      else if (!isValidImageUrl(imageUrl)) {
        issue = 'Invalid or broken image URL';
        suggestedImage = getRecommendedImage(article);
      }
      else {
        isCompliant = true;
        compliant.push(article);
      }
      
      if (!isCompliant) {
        issues.push({
          article,
          currentImage: imageUrl || 'None',
          issue,
          suggestedImage
        });
      }
    }
    
    // Print audit results
    console.log('📊 AUDIT RESULTS:');
    console.log(`✅ Compliant articles: ${compliant.length}`);
    console.log(`❌ Non-compliant articles: ${issues.length}\n`);
    
    if (issues.length > 0) {
      console.log('🚨 ISSUES FOUND:\n');
      
      for (const item of issues) {
        console.log(`Article: "${item.article.title}"`);
        console.log(`  Slug: ${item.article.slug}`);
        console.log(`  Category: ${item.article.category}`);
        console.log(`  Current Image: ${item.currentImage}`);
        console.log(`  Issue: ${item.issue}`);
        console.log(`  Suggested Image: ${item.suggestedImage}`);
        console.log('  ---');
      }
      
      console.log('\n🔧 FIXING NON-COMPLIANT IMAGES...\n');
      
      // Fix the issues
      for (const item of issues) {
        try {
          await prisma.article.update({
            where: { id: item.article.id },
            data: {
              featuredImage: item.suggestedImage + '?q=80&w=1200&h=630'
            }
          });
          console.log(`✅ Fixed: "${item.article.title}"`);
        } catch (error) {
          console.error(`❌ Failed to fix: "${item.article.title}"`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Image audit and fixes completed!');
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function isSingaporeSpecificImage(imageUrl, article) {
  const url = imageUrl.toLowerCase();
  const title = article.title.toLowerCase();
  const category = article.category;
  
  // Check if it's an approved Singapore image
  if (Object.values(APPROVED_IMAGES).includes(imageUrl.split('?')[0])) {
    return true;
  }
  
  // Check for Singapore-specific keywords in URL
  const hasSingaporeKeyword = IMAGE_GUIDELINES.REQUIRED_KEYWORDS.some(keyword => 
    url.includes(keyword)
  );
  
  // Check if image matches district content
  if (title.includes('district')) {
    const districtMatch = title.match(/district\s+(\d+)/);
    if (districtMatch) {
      const districtNum = districtMatch[1];
      const expectedKeywords = IMAGE_GUIDELINES.DISTRICT_SPECIFIC[districtNum];
      if (expectedKeywords && !url.includes(districtNum)) {
        return false;
      }
    }
  }
  
  return hasSingaporeKeyword;
}

function isValidImageUrl(url) {
  try {
    new URL(url);
    return url.includes('unsplash.com') && !url.includes('undefined');
  } catch {
    return false;
  }
}

function getRecommendedImage(article) {
  const title = article.title.toLowerCase();
  const category = article.category;
  
  // District-specific images
  if (title.includes('district')) {
    const districtMatch = title.match(/district\s+(\d+)/);
    if (districtMatch) {
      const districtNum = districtMatch[1];
      switch(districtNum) {
        case '1':
        case '2':
          return APPROVED_IMAGES.district_1_cbd;
        case '9':
          return APPROVED_IMAGES.district_9_orchard;
        case '10':
          return APPROVED_IMAGES.district_10_bukit_timah;
        case '12':
          return APPROVED_IMAGES.district_12_toa_payoh;
        case '15':
          return APPROVED_IMAGES.district_15_east_coast;
        default:
          return APPROVED_IMAGES.singapore_skyline;
      }
    }
  }
  
  // National Day themed
  if (title.includes('national day') || title.includes('celebrating')) {
    return APPROVED_IMAGES.national_day;
  }
  
  // Category-based selection
  if (category === 'HDB' || title.includes('hdb')) {
    return APPROVED_IMAGES.hdb_general;
  }
  
  if (category === 'NEW_LAUNCH_REVIEW' || category === 'CONDO') {
    return APPROVED_IMAGES.condo_luxury;
  }
  
  if (category === 'INVESTMENT_GUIDE' || title.includes('investment')) {
    return APPROVED_IMAGES.investment_guide;
  }
  
  if (category === 'MARKET_INSIGHTS' || title.includes('market')) {
    return APPROVED_IMAGES.market_insights;
  }
  
  // Default Singapore skyline
  return APPROVED_IMAGES.singapore_skyline;
}

// Run the audit
auditArticleImages();