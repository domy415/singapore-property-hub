/**
 * Direct Database Audit Script - No AI APIs Used
 * Audits and fixes article images directly in Supabase database
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

// Singapore-specific image mappings (no AI required)
const SINGAPORE_IMAGE_MAP = {
  // HDB and public housing articles
  'hdb': 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80',
  'public_housing': 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80',
  
  // District-specific images
  'district_12': 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80', // Toa Payoh
  'district_2': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80', // CBD
  'district_9': 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=1200&h=630&q=80', // Orchard
  'district_10': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=630&q=80', // Bukit Timah
  
  // National Day and celebrations
  'national_day': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80',
  'celebrating': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80',
  'independence': 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80',
  
  // Property types
  'weekend_property': 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80',
  'new_launch': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80',
  'bloomsbury': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80',
  
  // Government and policy
  'cooling_measures': 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80',
  'government': 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80',
  'policy': 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80',
  
  // Default Singapore property images
  'market_insights': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // CBD skyline
  'default': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80'
};

function determineImageFromTitle(title) {
  const lowerTitle = title.toLowerCase();
  
  // Check for specific keywords in title
  if (lowerTitle.includes('hdb') || lowerTitle.includes('private property')) {
    return SINGAPORE_IMAGE_MAP.hdb;
  }
  
  if (lowerTitle.includes('district 12') || lowerTitle.includes('toa payoh') || lowerTitle.includes('balestier')) {
    return SINGAPORE_IMAGE_MAP.district_12;
  }
  
  if (lowerTitle.includes('district 2') || lowerTitle.includes('anson') || lowerTitle.includes('tanjong pagar')) {
    return SINGAPORE_IMAGE_MAP.district_2;
  }
  
  if (lowerTitle.includes('national day') || lowerTitle.includes('celebrating')) {
    return SINGAPORE_IMAGE_MAP.national_day;
  }
  
  if (lowerTitle.includes('weekend') || lowerTitle.includes('property picks')) {
    return SINGAPORE_IMAGE_MAP.weekend_property;
  }
  
  if (lowerTitle.includes('bloomsbury') || lowerTitle.includes('new launch')) {
    return SINGAPORE_IMAGE_MAP.new_launch;
  }
  
  if (lowerTitle.includes('cooling measures') || lowerTitle.includes('policy')) {
    return SINGAPORE_IMAGE_MAP.cooling_measures;
  }
  
  // Default to market insights image
  return SINGAPORE_IMAGE_MAP.market_insights;
}

async function auditDatabase() {
  console.log('🔍 Starting Direct Database Audit...\n');
  
  try {
    // Get all published articles
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 Found ${articles.length} published articles\n`);
    
    // Analyze current image URLs
    const imageFrequency = {};
    articles.forEach(article => {
      const baseUrl = article.featuredImage ? article.featuredImage.split('?')[0] : 'null';
      imageFrequency[baseUrl] = (imageFrequency[baseUrl] || 0) + 1;
    });
    
    console.log('📈 Current Image Distribution:');
    Object.entries(imageFrequency).forEach(([url, count]) => {
      console.log(`   ${count} articles: ${url}`);
    });
    
    console.log('\n🔧 Articles that need fixing:');
    
    // Check each article and recommend fixes
    const articlesToFix = [];
    articles.forEach(article => {
      const recommendedImage = determineImageFromTitle(article.title);
      const currentImage = article.featuredImage?.split('?')[0];
      
      if (currentImage !== recommendedImage.split('?')[0]) {
        articlesToFix.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          currentImage: article.featuredImage,
          recommendedImage: recommendedImage
        });
        
        console.log(`   📝 "${article.title}"`);
        console.log(`      Current:  ${currentImage || 'null'}`);
        console.log(`      Should be: ${recommendedImage.split('?')[0]}`);
        console.log('');
      }
    });
    
    console.log(`\n✅ Summary: ${articlesToFix.length} articles need image updates out of ${articles.length} total\n`);
    
    return { articles, articlesToFix };
    
  } catch (error) {
    console.error('❌ Database audit failed:', error);
    throw error;
  }
}

async function updateArticleImages(articlesToFix) {
  console.log('🛠️ Starting Article Image Updates...\n');
  
  const results = [];
  
  for (const article of articlesToFix) {
    try {
      console.log(`📝 Updating: ${article.title}`);
      
      // Add cache-busting timestamp
      const imageUrlWithTimestamp = `${article.recommendedImage}&t=${Date.now()}`;
      
      await prisma.article.update({
        where: { id: article.id },
        data: { 
          featuredImage: imageUrlWithTimestamp 
        }
      });
      
      console.log(`   ✅ Updated successfully`);
      console.log(`   🖼️  New image: ${article.recommendedImage.split('?')[0]}`);
      
      results.push({
        ...article,
        success: true,
        finalImageUrl: imageUrlWithTimestamp
      });
      
    } catch (error) {
      console.error(`   ❌ Failed to update: ${error.message}`);
      results.push({
        ...article,
        success: false,
        error: error.message
      });
    }
    
    console.log('');
  }
  
  return results;
}

async function validateUpdates() {
  console.log('🔍 Validating Updates...\n');
  
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      title: true,
      featuredImage: true
    }
  });
  
  // Check image diversity
  const uniqueImages = new Set();
  articles.forEach(article => {
    if (article.featuredImage) {
      const baseUrl = article.featuredImage.split('?')[0];
      uniqueImages.add(baseUrl);
    }
  });
  
  console.log(`📊 Validation Results:`);
  console.log(`   Total articles: ${articles.length}`);
  console.log(`   Unique images: ${uniqueImages.size}`);
  console.log(`   Diversity rate: ${((uniqueImages.size / articles.length) * 100).toFixed(1)}%\n`);
  
  if (uniqueImages.size < articles.length * 0.5) {
    console.log('⚠️  Warning: Low image diversity detected');
  } else {
    console.log('✅ Good image diversity achieved');
  }
  
  return {
    totalArticles: articles.length,
    uniqueImages: uniqueImages.size,
    diversityRate: (uniqueImages.size / articles.length) * 100
  };
}

async function main() {
  console.log('🚀 Singapore Property Hub - Direct Database Image Fix\n');
  console.log('   No AI APIs used - Direct database operations only\n');
  
  try {
    // Step 1: Audit current state
    const { articles, articlesToFix } = await auditDatabase();
    
    if (articlesToFix.length === 0) {
      console.log('🎉 No articles need fixing - all images are correctly assigned!');
      return;
    }
    
    // Step 2: Update articles
    const updateResults = await updateArticleImages(articlesToFix);
    
    // Step 3: Validate results
    const validation = await validateUpdates();
    
    // Step 4: Summary
    const successful = updateResults.filter(r => r.success).length;
    const failed = updateResults.filter(r => !r.success).length;
    
    console.log('\n🎯 Final Summary:');
    console.log(`   ✅ Successfully updated: ${successful} articles`);
    console.log(`   ❌ Failed updates: ${failed} articles`);
    console.log(`   📊 Final diversity rate: ${validation.diversityRate.toFixed(1)}%`);
    
    if (validation.diversityRate > 80) {
      console.log('\n🎉 SUCCESS: Image diversity has been restored!');
    } else {
      console.log('\n⚠️  PARTIAL SUCCESS: Some issues may remain');
    }
    
  } catch (error) {
    console.error('\n💥 Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { auditDatabase, updateArticleImages, validateUpdates };