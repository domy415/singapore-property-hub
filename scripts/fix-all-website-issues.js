const fs = require('fs');
const path = require('path');

console.log('🔧 COMPREHENSIVE WEBSITE FIXES');
console.log('===============================\n');

// PART 1: Fix database articles images
console.log('📋 PART 1: Fixing database articles images...');

const articlesPath = path.join(__dirname, '../database-articles-check.json');
if (!fs.existsSync(articlesPath)) {
  console.error('❌ Database articles file not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
let articles = data.articles || [];

// Create mapping of categories to proper local images
const categoryImageMap = {
  'MARKET_INSIGHTS': '/images/singapore-cbd-skyline-default.jpg',
  'PROPERTY_NEWS': '/images/singapore-news-default.jpg', 
  'BUYING_GUIDE': '/images/singapore-guide-default.jpg',
  'NEW_LAUNCH_REVIEW': '/images/singapore-condo-default.jpg',
  'INVESTMENT': '/images/singapore-investment-default.jpg',
  'NEIGHBORHOOD': '/images/singapore-neighborhood-default.jpg'
};

let imagesFix = 0;
let contentFixed = 0;

articles.forEach(article => {
  // Fix featured images - replace Unsplash with local images
  if (article.featuredImage && article.featuredImage.includes('unsplash.com')) {
    const categoryImage = categoryImageMap[article.category] || '/images/singapore-default.jpg';
    article.featuredImage = categoryImage;
    imagesFix++;
    console.log(`  ✅ Fixed image for: ${article.title.substring(0, 50)}...`);
  }
  
  // Fix broken image paths with timestamps
  if (article.featuredImage && article.featuredImage.includes('&t=')) {
    article.featuredImage = article.featuredImage.split('&t=')[0];
    imagesFix++;
    console.log(`  🔧 Removed timestamp from: ${article.title.substring(0, 50)}...`);
  }
  
  // Fix malformed content
  if (article.content) {
    const originalContent = article.content;
    
    // Fix broken headers with random line breaks
    article.content = article.content
      .replace(/##\s+(\w+)\s*\n\s*\n\s*(\w+)/g, '## $1 $2')
      .replace(/###\s+(\w+)\s*\n\s*\n\s*(\w+)/g, '### $1 $2')
      .replace(/#\s+(\w+)\s*\n\s*\n\s*#/g, '## $1')
      // Fix paragraphs split mid-word
      .replace(/(\w+)\n\n(\w+)/g, '$1 $2')
      // Fix excessive line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Fix standalone words that should be part of headers
      .replace(/\n\n(\w+)\n\n##/g, '\n\n## $1');
    
    if (originalContent !== article.content) {
      contentFixed++;
      console.log(`  📝 Fixed content formatting for: ${article.title.substring(0, 50)}...`);
    }
  }
});

// Save updated articles
data.articles = articles;
fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));

console.log(`\n📊 Database fixes completed:`);
console.log(`  Images fixed: ${imagesFix}`);
console.log(`  Content formatting fixed: ${contentFixed}`);

// PART 2: Create default images
console.log('\n📋 PART 2: Creating default image files...');

const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create placeholder SVG images for each category
const createSVGImage = (category, width = 1200, height = 630) => {
  const colors = {
    'singapore-cbd-skyline-default': '#0066CC',
    'singapore-news-default': '#00AA44', 
    'singapore-guide-default': '#FF6600',
    'singapore-condo-default': '#9933CC',
    'singapore-investment-default': '#CC3300',
    'singapore-neighborhood-default': '#666666',
    'singapore-default': '#333333'
  };
  
  const color = colors[category] || '#333333';
  const title = category.replace('-default', '').replace(/-/g, ' ').toUpperCase();
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${color}"/>
  <rect x="50" y="50" width="${width-100}" height="${height-100}" fill="none" stroke="white" stroke-width="2"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">SINGAPORE PROPERTY HUB</text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">${title}</text>
  <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle">${width} × ${height}</text>
</svg>`;
};

const imageFiles = [
  'singapore-cbd-skyline-default.jpg',
  'singapore-news-default.jpg',
  'singapore-guide-default.jpg', 
  'singapore-condo-default.jpg',
  'singapore-investment-default.jpg',
  'singapore-neighborhood-default.jpg',
  'singapore-default.jpg'
];

let imagesCreated = 0;

imageFiles.forEach(fileName => {
  const imagePath = path.join(imagesDir, fileName);
  const category = fileName.replace('.jpg', '');
  
  if (!fs.existsSync(imagePath)) {
    // Create SVG version for now (will be converted to JPG later)
    const svgPath = path.join(imagesDir, fileName.replace('.jpg', '.svg'));
    const svgContent = createSVGImage(category);
    fs.writeFileSync(svgPath, svgContent);
    
    // Copy SVG as JPG for immediate use
    fs.writeFileSync(imagePath, svgContent);
    imagesCreated++;
    console.log(`  ✅ Created: ${fileName}`);
  }
});

console.log(`\n📊 Default images created: ${imagesCreated}`);

// PART 3: Fix articles page component
console.log('\n📋 PART 3: Updating articles page component...');

const articlesPagePath = path.join(__dirname, '../src/app/articles/page.tsx');
const articlesPageContent = fs.readFileSync(articlesPagePath, 'utf-8');

// Fix the image handling logic
const fixedArticlesPageContent = articlesPageContent
  .replace(
    /image: article\.featuredImage \? `\$\{article\.featuredImage\}\$\{article\.featuredImage\.includes\('\?'\) \? '&' : '\?'\}cb=\$\{Date\.now\(\)\}` : 'https:\/\/images\.unsplash\.com\/[^']*'/,
    "image: getArticleImage(article)"
  );

// Add the helper function if it doesn't exist
if (!fixedArticlesPageContent.includes('getArticleImage')) {
  const helperFunction = `
// Helper function to get appropriate image for article
function getArticleImage(article: any): string {
  // If article has a local image, use it
  if (article.featuredImage && article.featuredImage.startsWith('/images/')) {
    return article.featuredImage;
  }
  
  // Map categories to local default images
  const categoryDefaults: Record<string, string> = {
    'MARKET_INSIGHTS': '/images/singapore-cbd-skyline-default.jpg',
    'PROPERTY_NEWS': '/images/singapore-news-default.jpg',
    'BUYING_GUIDE': '/images/singapore-guide-default.jpg', 
    'NEW_LAUNCH_REVIEW': '/images/singapore-condo-default.jpg',
    'INVESTMENT': '/images/singapore-investment-default.jpg',
    'NEIGHBORHOOD': '/images/singapore-neighborhood-default.jpg'
  };
  
  return categoryDefaults[article.category] || '/images/singapore-default.jpg';
}
`;
  
  const insertPoint = fixedArticlesPageContent.indexOf('async function getArticles()');
  const updatedContent = fixedArticlesPageContent.slice(0, insertPoint) + 
                         helperFunction + '\n' + 
                         fixedArticlesPageContent.slice(insertPoint);
  
  fs.writeFileSync(articlesPagePath, updatedContent);
  console.log('  ✅ Updated articles page component with proper image handling');
} else {
  console.log('  ℹ️ Articles page component already has image handling function');
}

// PART 4: Update Prisma configuration
console.log('\n📋 PART 4: Checking Prisma configuration...');

const prismaPath = path.join(__dirname, '../src/lib/prisma.ts');
if (fs.existsSync(prismaPath)) {
  const prismaContent = fs.readFileSync(prismaPath, 'utf-8');
  
  // Check if it has proper production handling
  if (!prismaContent.includes('globalForPrisma') || prismaContent.includes('prisma.$connect()')) {
    const fixedPrismaContent = `import { PrismaClient } from '@prisma/client';

// Fix for production - use global instance to prevent multiple connections
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Don't call connect in module scope - let it connect on first use
`;
    
    fs.writeFileSync(prismaPath, fixedPrismaContent);
    console.log('  ✅ Fixed Prisma configuration for production');
  } else {
    console.log('  ℹ️ Prisma configuration looks correct');
  }
} else {
  console.log('  ⚠️ Prisma configuration file not found');
}

console.log('\n🎉 ALL FIXES COMPLETED!');
console.log('======================');
console.log(`✅ Database articles: ${imagesFix} images fixed, ${contentFixed} content fixed`);
console.log(`✅ Default images: ${imagesCreated} created`);
console.log(`✅ Articles page: Updated with proper image handling`);
console.log(`✅ Prisma: Configuration checked/fixed`);
console.log('\nNext steps:');
console.log('1. Run: npm run build (to test the fixes)');
console.log('2. Commit and push changes');
console.log('3. Verify deployment');