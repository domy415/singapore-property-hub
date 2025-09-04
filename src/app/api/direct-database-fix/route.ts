import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Direct Database Fix API - No AI Credits Used
 * Performs complete system reset of article images
 */

// Singapore-specific image mappings (no AI required)
const SINGAPORE_IMAGE_MAP: Record<string, string> = {
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

function determineImageFromTitle(title: string): string {
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

export async function POST() {
  try {
    console.log('🚀 Starting Direct Database System Reset...');
    
    // Step 1: Audit current database state
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
    
    console.log(`📊 Found ${articles.length} published articles`);
    
    // Analyze current image diversity
    const imageFrequency: Record<string, number> = {};
    articles.forEach(article => {
      const baseUrl = article.featuredImage ? article.featuredImage.split('?')[0] : 'null';
      imageFrequency[baseUrl] = (imageFrequency[baseUrl] || 0) + 1;
    });
    
    console.log('📈 Current Image Distribution:', imageFrequency);
    
    // Step 2: Identify articles needing fixes
    const articlesToFix = [];
    const timestamp = Date.now();
    
    for (const article of articles) {
      const recommendedImage = determineImageFromTitle(article.title);
      const currentImage = article.featuredImage?.split('?')[0];
      const recommendedBase = recommendedImage.split('?')[0];
      
      if (currentImage !== recommendedBase) {
        articlesToFix.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          currentImage: article.featuredImage,
          recommendedImage: `${recommendedImage}&t=${timestamp}`
        });
      }
    }
    
    console.log(`🔧 ${articlesToFix.length} articles need image updates`);
    
    // Step 3: Update articles in database
    const updateResults = [];
    
    for (const article of articlesToFix) {
      try {
        await prisma.article.update({
          where: { id: article.id },
          data: { 
            featuredImage: article.recommendedImage 
          }
        });
        
        updateResults.push({
          id: article.id,
          title: article.title,
          success: true,
          oldImage: article.currentImage,
          newImage: article.recommendedImage,
          imageType: determineImageType(article.title)
        });
        
      } catch (error) {
        console.error(`Failed to update ${article.title}:`, error);
        updateResults.push({
          id: article.id,
          title: article.title,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Step 4: Validation
    const updatedArticles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        featuredImage: true
      }
    });
    
    const finalUniqueImages = new Set();
    updatedArticles.forEach(article => {
      if (article.featuredImage) {
        const baseUrl = article.featuredImage.split('?')[0];
        finalUniqueImages.add(baseUrl);
      }
    });
    
    const diversityRate = (finalUniqueImages.size / updatedArticles.length) * 100;
    const successCount = updateResults.filter(r => r.success).length;
    
    console.log('✅ Direct Database System Reset Complete');
    console.log(`📊 Final diversity: ${finalUniqueImages.size} unique images for ${updatedArticles.length} articles`);
    console.log(`📈 Diversity rate: ${diversityRate.toFixed(1)}%`);
    
    return NextResponse.json({
      success: true,
      message: 'Direct Database System Reset Complete - No AI Credits Used',
      summary: {
        totalArticles: articles.length,
        articlesUpdated: successCount,
        failedUpdates: updateResults.length - successCount,
        initialUniqueImages: Object.keys(imageFrequency).length,
        finalUniqueImages: finalUniqueImages.size,
        diversityRate: Math.round(diversityRate),
        zeroCreditUsage: true
      },
      updates: updateResults.filter(r => r.success),
      imageDistribution: {
        before: imageFrequency,
        after: Array.from(finalUniqueImages)
      }
    });
    
  } catch (error) {
    console.error('❌ Direct database fix failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Direct database system reset failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        zeroCreditUsage: true
      },
      { status: 500 }
    );
  }
}

function determineImageType(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('hdb')) return 'HDB Community Spaces';
  if (lowerTitle.includes('district 12')) return 'Toa Payoh District';
  if (lowerTitle.includes('district 2')) return 'CBD Financial District';
  if (lowerTitle.includes('national day')) return 'Singapore Flag';
  if (lowerTitle.includes('weekend')) return 'Weekend Properties';
  if (lowerTitle.includes('new launch') || lowerTitle.includes('bloomsbury')) return 'New Developments';
  if (lowerTitle.includes('cooling measures') || lowerTitle.includes('policy')) return 'Government Policy';
  
  return 'Singapore CBD Skyline';
}

export async function GET() {
  return NextResponse.json({
    message: 'Direct Database System Reset API',
    description: 'Complete system reset without using AI credits',
    usage: 'POST to execute database image fix',
    features: [
      'Direct database queries and updates',
      'Singapore-specific image mapping',
      'Zero Anthropic credit usage',
      'Complete validation and reporting'
    ]
  });
}