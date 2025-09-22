const fs = require('fs');
const path = require('path');

console.log('🔍 DEPLOYMENT VERIFICATION');
console.log('=========================\n');

// Check articles
const articlesPath = path.join(__dirname, '../database-articles-check.json');
if (!fs.existsSync(articlesPath)) {
  console.error('❌ Articles database file not found');
  process.exit(1);
}

const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

let issues = [];

console.log('📋 Checking articles...');

// Check each article
articles.articles.forEach((article, index) => {
  console.log(`  Checking article ${index + 1}: ${article.title.substring(0, 50)}...`);
  
  // Check image path
  if (article.featuredImage?.includes('&t=')) {
    issues.push(`Article "${article.title}" has timestamp in image path`);
  }
  
  if (article.featuredImage?.includes('unsplash')) {
    issues.push(`Article "${article.title}" uses Unsplash image`);
  }
  
  if (!article.featuredImage?.startsWith('/images/')) {
    issues.push(`Article "${article.title}" doesn't use local image path`);
  }
  
  // Check content
  if (!article.content || article.content.length < 500) {
    issues.push(`Article "${article.title}" has insufficient content`);
  }
  
  if (article.content?.includes('\n\n\n')) {
    issues.push(`Article "${article.title}" has formatting issues`);
  }
});

// Check images exist
console.log('\n📋 Checking required images...');
const imagesDir = path.join(__dirname, '../public/images');
const requiredImages = new Set(
  articles.articles
    .map(a => a.featuredImage?.split('/').pop()?.split('&')[0])
    .filter(Boolean)
);

let imagesFound = 0;
requiredImages.forEach(imageName => {
  const imagePath = path.join(imagesDir, imageName);
  if (fs.existsSync(imagePath)) {
    console.log(`  ✅ Found: ${imageName}`);
    imagesFound++;
  } else {
    issues.push(`Missing image: ${imageName}`);
    console.log(`  ❌ Missing: ${imageName}`);
  }
});

// Check articles page component
console.log('\n📋 Checking articles page component...');
const articlesPagePath = path.join(__dirname, '../src/app/articles/page.tsx');
if (fs.existsSync(articlesPagePath)) {
  const articlesPageContent = fs.readFileSync(articlesPagePath, 'utf-8');
  
  if (articlesPageContent.includes('getArticleImage')) {
    console.log('  ✅ Articles page has proper image handling function');
  } else {
    issues.push('Articles page missing getArticleImage function');
  }
  
  if (articlesPageContent.includes('unsplash.com')) {
    console.log('  ❌ Found Unsplash reference in articles page');
    issues.push('Articles page still has Unsplash fallback');
  } else {
    console.log('  ✅ No Unsplash references found in articles page');
  }
  
  if (articlesPageContent.includes('cb=${Date.now()}')) {
    issues.push('Articles page still has cache-busting parameters');
  }
} else {
  issues.push('Articles page component not found');
}

// Check Prisma configuration
console.log('\n📋 Checking Prisma configuration...');
const prismaPath = path.join(__dirname, '../src/lib/prisma.ts');
if (fs.existsSync(prismaPath)) {
  const prismaContent = fs.readFileSync(prismaPath, 'utf-8');
  
  if (prismaContent.includes('globalForPrisma')) {
    console.log('  ✅ Prisma has proper global instance handling');
  } else {
    issues.push('Prisma missing global instance handling');
  }
  
  if (prismaContent.includes('prisma.$connect()')) {
    issues.push('Prisma has problematic top-level connect call');
  }
} else {
  issues.push('Prisma configuration file not found');
}

// Report
console.log('\n📊 VERIFICATION SUMMARY');
console.log('=======================');

if (issues.length === 0) {
  console.log('🎉 ALL CHECKS PASSED! No issues found.');
} else {
  console.log(`❌ Found ${issues.length} issues:\n`);
  issues.forEach(issue => console.log(`  - ${issue}`));
}

console.log(`\n📈 Statistics:`);
console.log(`  Total articles: ${articles.articles.length}`);
console.log(`  Required images: ${requiredImages.size}`);
console.log(`  Images found: ${imagesFound}`);
console.log(`  Issues found: ${issues.length}`);

if (issues.length === 0) {
  console.log('\n✅ READY FOR DEPLOYMENT!');
  console.log('All fixes have been applied successfully.');
  console.log('You can now commit and push the changes.');
} else {
  console.log('\n⚠️  FIX REQUIRED!');
  console.log('Please address the issues above before deploying.');
}