const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateArticleImage() {
  try {
    const slug = 'navigating-the-waves-of-singapore-s-property-market-an-expert-analysis';
    const newImage = 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80';
    
    const article = await prisma.article.findUnique({
      where: { slug }
    });
    
    if (!article) {
      console.log('Article not found');
      return;
    }
    
    console.log('Current image:', article.featuredImage);
    
    const updated = await prisma.article.update({
      where: { slug },
      data: { 
        featuredImage: newImage,
        updatedAt: new Date()
      }
    });
    
    console.log('Updated to:', updated.featuredImage);
    console.log('Article updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateArticleImage();