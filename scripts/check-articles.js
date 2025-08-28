const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkArticles() {
  try {
    console.log('Checking articles in database...');
    
    const articles = await prisma.article.findMany({
      where: { 
        status: 'PUBLISHED' 
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        publishedAt: true,
        createdAt: true
      }
    });
    
    console.log(`\nFound ${articles.length} published articles:`);
    
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Published: ${article.publishedAt || article.createdAt}`);
      console.log(`   URL: /articles/${article.slug}`);
      console.log('');
    });

    if (articles.length === 0) {
      console.log('⚠️  No published articles found in database');
      console.log('The homepage will fall back to showing placeholder content');
    }
    
  } catch (error) {
    console.error('❌ Error checking articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkArticles();