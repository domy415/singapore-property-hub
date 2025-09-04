import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Singapore-specific image mappings
const imageMapping = {
  // HDB articles
  hdb: 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80',
  
  // District specific
  district_12: 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80',
  district_2: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80',
  
  // National Day/Celebrations
  national_day: 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80',
  
  // Weekend/Market articles
  weekend_market: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80',
  
  // New Launch/Property News
  new_launch: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80',
  
  // Government/Policy articles
  government: 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80',
  
  // Default Market Insights
  default: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80'
};

/**
 * Determine appropriate image URL based on article content
 */
function getImageForArticle(article: any) {
  const title = article.title.toLowerCase();
  const content = article.content.toLowerCase();
  const tags = article.tags ? article.tags.map((tag: string) => tag.toLowerCase()) : [];
  const allText = `${title} ${content} ${tags.join(' ')}`;

  // HDB articles
  if (allText.includes('hdb') || allText.includes('private property') || 
      allText.includes('public housing') || allText.includes('housing board')) {
    return imageMapping.hdb;
  }

  // District-specific articles
  if (allText.includes('district 12') || allText.includes('balestier') || 
      allText.includes('toa payoh') || allText.includes('serangoon')) {
    return imageMapping.district_12;
  }

  if (allText.includes('district 2') || allText.includes('anson') || 
      allText.includes('tanjong pagar') || allText.includes('raffles place')) {
    return imageMapping.district_2;
  }

  // National Day/Celebrations
  if (allText.includes('national day') || allText.includes('celebrating') || 
      allText.includes('singapore day') || allText.includes('ndp')) {
    return imageMapping.national_day;
  }

  // Weekend/Market articles
  if (allText.includes('weekend') || allText.includes('market update') || 
      allText.includes('weekly') || allText.includes('market trends')) {
    return imageMapping.weekend_market;
  }

  // New Launch/Property News
  if (allText.includes('new launch') || allText.includes('property news') || 
      allText.includes('upcoming') || allText.includes('preview')) {
    return imageMapping.new_launch;
  }

  // Government/Policy articles
  if (allText.includes('government') || allText.includes('policy') || 
      allText.includes('ura') || allText.includes('cooling measures') ||
      allText.includes('stamp duty') || allText.includes('regulation')) {
    return imageMapping.government;
  }

  // Default for all other articles
  return imageMapping.default;
}

export async function GET() {
  try {
    console.log('🔍 Starting database image update process...');

    // Step 1: Query current state
    console.log('📊 Step 1: Querying current articles...');
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        tags: true,
        featuredImage: true,
        status: true,
        publishedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${articles.length} articles in database`);

    // Analyze current state
    const urlCounts: Record<string, number> = {};
    let identicalUrls = 0;
    
    articles.forEach(article => {
      const imageUrl = article.featuredImage || 'No image';
      if (imageUrl !== 'No image') {
        urlCounts[imageUrl] = (urlCounts[imageUrl] || 0) + 1;
      }
    });

    Object.values(urlCounts).forEach(count => {
      if (count > 1) identicalUrls += count;
    });

    // Step 2: Update articles with appropriate images
    console.log('🔄 Step 2: Updating articles with Singapore-specific images...');

    let updatedCount = 0;
    const updates = [];

    for (const article of articles) {
      const currentImage = article.featuredImage;
      const newImage = getImageForArticle(article);
      
      if (currentImage !== newImage) {
        updates.push({
          id: article.id,
          title: article.title,
          currentImage,
          newImage
        });

        await prisma.article.update({
          where: { id: article.id },
          data: { featuredImage: newImage }
        });
        
        updatedCount++;
        console.log(`✅ Updated: ${article.title.substring(0, 50)}...`);
      }
    }

    // Step 3: Verify updates
    console.log('✅ Step 3: Verifying updates...');
    
    const updatedArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        featuredImage: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const newUrlCounts: Record<string, number> = {};
    updatedArticles.forEach(article => {
      const imageUrl = article.featuredImage || 'No image';
      newUrlCounts[imageUrl] = (newUrlCounts[imageUrl] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalArticles: articles.length,
        updatedArticles: updatedCount,
        skippedArticles: articles.length - updatedCount,
        previouslyIdenticalUrls: identicalUrls,
        beforeUpdate: urlCounts,
        afterUpdate: newUrlCounts
      },
      updates: updates,
      message: 'Database image URLs updated successfully!'
    });

  } catch (error) {
    console.error('❌ Error updating article images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update article images',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  // Allow both GET and POST for flexibility
  return GET();
}