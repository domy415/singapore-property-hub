const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkArticleImages() {
  try {
    console.log('Checking article images...\n');
    
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        slug: true,
        category: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    console.log(`Found ${articles.length} articles:\n`);
    
    let sameImageCount = 0;
    let uniqueImages = new Set();
    
    articles.forEach((article, index) => {
      const imageUrl = article.imageUrl || 'No image';
      uniqueImages.add(imageUrl);
      
      console.log(`${index + 1}. ${article.title.substring(0, 60)}...`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Image: ${imageUrl}`);
      console.log(`   Created: ${article.createdAt.toISOString().split('T')[0]}`);
      console.log('');
    });

    console.log(`\nSUMMARY:`);
    console.log(`Total articles: ${articles.length}`);
    console.log(`Unique images: ${uniqueImages.size}`);
    console.log(`Articles with same image: ${articles.length - uniqueImages.size}`);
    
    if (uniqueImages.size === 1) {
      console.log('\n🚨 PROBLEM: All articles are using the SAME image!');
    } else if (uniqueImages.size < articles.length / 2) {
      console.log('\n⚠️  WARNING: Many articles are sharing images');
    } else {
      console.log('\n✅ GOOD: Articles have diverse images');
    }
    
  } catch (error) {
    console.error('Error checking images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticleImages();