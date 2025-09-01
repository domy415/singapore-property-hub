require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
  try {
    const articles = await prisma.article.findMany({
      select: { id: true, title: true, featuredImage: true, category: true },
      orderBy: { publishedAt: 'desc' },
      take: 15
    });
    
    console.log('=== Current Article Images Analysis ===\n');
    articles.forEach((article, i) => {
      console.log(`${i+1}. ${article.title}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Image: ${article.featuredImage || 'No image'}`);
      
      // Analyze if image matches content
      const title = article.title.toLowerCase();
      const image = article.featuredImage || '';
      
      let contentType = 'Unknown';
      if (title.includes('district 12') || title.includes('toa payoh') || title.includes('balestier')) {
        contentType = 'District 12/HDB Area';
      } else if (title.includes('district 2') || title.includes('cbd') || title.includes('tanjong pagar')) {
        contentType = 'District 2/CBD';
      } else if (title.includes('national day') || title.includes('celebrating')) {
        contentType = 'National Day/Celebration';
      } else if (title.includes('market') || title.includes('navigating')) {
        contentType = 'Market Analysis';
      } else if (title.includes('condo') || title.includes('condominium')) {
        contentType = 'Condo Review';
      }
      
      console.log(`   Content Type: ${contentType}`);
      
      // Check if image is appropriate
      let imageMatch = 'Unknown';
      if (image.includes('zIp4YexPPhQ')) {
        imageMatch = 'HDB/Toa Payoh';
      } else if (image.includes('1567360425618')) {
        imageMatch = 'CBD Skyline';
      } else if (image.includes('1533628635777')) {
        imageMatch = 'Marina Bay/Celebration';
      } else if (image.includes('ugr4n5X4YjI')) {
        imageMatch = 'Marina Bay Skyline';
      } else {
        imageMatch = 'Generic/Other';
      }
      
      console.log(`   Image Type: ${imageMatch}`);
      
      // Check if they match
      const isAppropriate = 
        (contentType.includes('District 12') && imageMatch.includes('HDB')) ||
        (contentType.includes('District 2') && imageMatch.includes('CBD')) ||
        (contentType.includes('National Day') && imageMatch.includes('Marina Bay')) ||
        (contentType.includes('Market Analysis') && imageMatch.includes('Marina Bay')) ||
        (contentType.includes('Condo') && imageMatch.includes('Marina Bay'));
      
      console.log(`   Match: ${isAppropriate ? '✅ GOOD' : '❌ NEEDS FIX'}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkImages();