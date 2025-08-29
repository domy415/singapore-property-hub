import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMPREHENSIVE_IMAGE_MAP: Record<string, { url: string; description: string }> = {
  // National Day specific matches
  "celebrating national day": {
    url: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80",
    description: "Marina Bay Singapore National Day celebration"
  },
  "national day": {
    url: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80",
    description: "Marina Bay Singapore National Day celebration"
  },
  
  // District-specific matches
  "ultimate guide to living in district 12": {
    url: "https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80",
    description: "Authentic Toa Payoh HDB blocks in Singapore"
  },
  "district 12": {
    url: "https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80",
    description: "Authentic Toa Payoh HDB blocks in Singapore"
  },
  "toa payoh": {
    url: "https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80",
    description: "Authentic Toa Payoh HDB blocks in Singapore"
  },
  "balestier": {
    url: "https://images.unsplash.com/photo-zIp4YexPPhQ?w=1200&h=630&q=80",
    description: "Authentic Toa Payoh HDB blocks in Singapore"
  },
  
  "ultimate guide to living in district 2": {
    url: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80",
    description: "Singapore CBD and Marina Bay skyline"
  },
  "district 2": {
    url: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80",
    description: "Singapore CBD and Marina Bay skyline"
  },
  "tanjong pagar": {
    url: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80",
    description: "Singapore CBD and Marina Bay skyline"
  },
  "anson": {
    url: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80",
    description: "Singapore CBD and Marina Bay skyline"
  },
  
  // Market navigation and analysis
  "navigating the waves": {
    url: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80",
    description: "Singapore Marina Bay skyline"
  },
  "navigating singapore's property": {
    url: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80",
    description: "Singapore Marina Bay skyline"
  },
  "independence planning": {
    url: "https://images.unsplash.com/photo-ugr4n5X4YjI?w=1200&h=630&q=80",
    description: "Singapore Marina Bay twilight view"
  },
  
  // HDB specific
  "hdb vs private": {
    url: "https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80",
    description: "Singapore HDB flats and private condominiums comparison"
  },
  "hdb": {
    url: "https://images.unsplash.com/photo-kNzqXxlvmE4?w=1200&h=630&q=80",
    description: "Singapore HDB development"
  },
  
  // Market and policy updates
  "cooling measures": {
    url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80",
    description: "Singapore CBD financial district"
  },
  "property market trends": {
    url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80",
    description: "Singapore property market skyline"
  },
  
  // Property news
  "bloomsbury residences": {
    url: "https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=1200&h=630&fit=crop&q=80",
    description: "Modern Singapore condominium"
  },
  
  // Weekend and market insights
  "weekend property": {
    url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&h=630&fit=crop&q=80",
    description: "Singapore residential neighborhood"
  },
  "unlocking the potential": {
    url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80",
    description: "Singapore property investment opportunities"
  },
  
  // General fallbacks
  "market": {
    url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80",
    description: "Singapore property market analysis"
  },
  "singapore": {
    url: "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&fit=crop&q=80",
    description: "Singapore city skyline"
  }
};

async function findBestImage(title: string) {
  const lowerTitle = title.toLowerCase();
  
  // Find the best matching keyword (longer matches get priority)
  let bestMatch = null;
  let bestMatchLength = 0;
  
  for (const [keyword, imageData] of Object.entries(COMPREHENSIVE_IMAGE_MAP)) {
    if (lowerTitle.includes(keyword) && keyword.length > bestMatchLength) {
      bestMatch = imageData;
      bestMatchLength = keyword.length;
    }
  }
  
  // Fallback to Singapore skyline if no match
  if (!bestMatch) {
    bestMatch = COMPREHENSIVE_IMAGE_MAP.singapore;
  }
  
  return bestMatch;
}

export async function updateArticleImages() {
  try {
    console.log('Starting comprehensive article image update...');
    
    // Get all articles
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        featuredImage: true
      }
    });
    
    console.log(`Found ${articles.length} articles to process`);
    
    let updatedCount = 0;
    const timestamp = Date.now();
    
    for (const article of articles) {
      const bestImage = await findBestImage(article.title);
      
      // Add cache busting parameter with consistent timestamp
      const imageUrlWithCacheBust = `${bestImage.url}&cb=${timestamp}`;
      
      if (!article.featuredImage || !article.featuredImage.includes(bestImage.url.split('?')[0])) {
        await prisma.article.update({
          where: { id: article.id },
          data: { 
            featuredImage: imageUrlWithCacheBust,
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ Updated: ${article.title}`);
        console.log(`   New image: ${bestImage.description}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped: ${article.title} (already has correct image)`);
      }
    }
    
    console.log(`\nUpdate complete! ${updatedCount} articles updated.`);
    return { success: true, updated: updatedCount, total: articles.length };
    
  } catch (error) {
    console.error('Error updating article images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  updateArticleImages()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}