const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Import the image selector (we'll recreate the logic here to avoid import issues)
const PROPERTY_IMAGES = {
  'MARKET_INSIGHTS': [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565618506-c9ef1c10e35e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600664356348-10686526af36?w=1200&h=630&fit=crop&q=80',
  ],
  'BUYING_GUIDE': [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558036117-15d82a90b9e0?w=1200&h=630&fit=crop&q=80',
  ],
  'NEIGHBORHOOD': [
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609924211018-5526c55bad5b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547030872-e66986265f2a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527066579998-dbbae57b9ca2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=1200&h=630&fit=crop&q=80',
  ]
};

async function fixArticleImages() {
  try {
    console.log('Starting article image fix...');
    
    // Get all articles ordered by creation date (oldest first)
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, category: true, featuredImage: true, createdAt: true }
    });

    console.log(`Found ${articles.length} articles to process`);

    const usedImages = new Set();
    let updatedCount = 0;

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const category = article.category;
      
      // Get available images for this category
      const categoryImages = PROPERTY_IMAGES[category] || PROPERTY_IMAGES['MARKET_INSIGHTS'];
      
      // Filter out already used images
      const availableImages = categoryImages.filter(img => !usedImages.has(img));
      
      // If all images used, reset and use full pool
      const imagesToSelect = availableImages.length > 0 ? availableImages : categoryImages;
      
      // Select random image
      const newImage = imagesToSelect[Math.floor(Math.random() * imagesToSelect.length)];
      
      // Update article if image is different
      if (article.featuredImage !== newImage) {
        await prisma.article.update({
          where: { id: article.id },
          data: { featuredImage: newImage }
        });
        
        console.log(`✅ Updated: ${article.title.substring(0, 50)}... -> ${newImage.split('/').pop()?.split('?')[0]}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped: ${article.title.substring(0, 50)}... (already has unique image)`);
      }
      
      // Track this image
      usedImages.add(newImage);
      
      // Reset tracking if we've used too many
      if (usedImages.size > 15) {
        usedImages.clear();
        console.log('🔄 Reset image tracking pool');
      }
    }

    console.log(`\n✅ Image fix completed!`);
    console.log(`📊 Articles processed: ${articles.length}`);
    console.log(`🔄 Articles updated: ${updatedCount}`);
    console.log(`⏭️  Articles unchanged: ${articles.length - updatedCount}`);

  } catch (error) {
    console.error('❌ Error fixing article images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixArticleImages();