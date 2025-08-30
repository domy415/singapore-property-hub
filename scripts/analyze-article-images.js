const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeArticleImages() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        featuredImage: true,
        slug: true,
        content: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Total published articles: ${articles.length}\n`);
    
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Current Image: ${article.featuredImage}`);
      
      // Extract key topics from title
      const titleLower = article.title.toLowerCase();
      let context = '';
      
      if (titleLower.includes('district')) {
        const districtMatch = titleLower.match(/district (\d+)/);
        if (districtMatch) context += `District ${districtMatch[1]} `;
      }
      
      if (titleLower.includes('toa payoh')) context += 'Toa Payoh ';
      if (titleLower.includes('marina bay')) context += 'Marina Bay ';
      if (titleLower.includes('orchard')) context += 'Orchard ';
      if (titleLower.includes('bugis')) context += 'Bugis ';
      if (titleLower.includes('chinatown')) context += 'Chinatown ';
      if (titleLower.includes('hdb')) context += 'HDB ';
      if (titleLower.includes('condo')) context += 'Condo ';
      if (titleLower.includes('national day')) context += 'National Day ';
      
      if (context) {
        console.log(`   Context: ${context.trim()}`);
      }
      
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeArticleImages();