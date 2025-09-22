// Clean database-articles-check.json to remove image URLs
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../database-articles-check.json');

if (!fs.existsSync(dataPath)) {
  console.log('❌ database-articles-check.json not found');
  process.exit(1);
}

console.log('🔍 Reading database-articles-check.json...');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let cleanedCount = 0;

// Remove all image URLs from articles - they should come from centralized system
data.articles = data.articles.map(article => {
  let wasCleaned = false;
  
  // Remove featuredImage field
  if (article.featuredImage) {
    delete article.featuredImage;
    wasCleaned = true;
  }
  
  // Remove any other image fields that might exist
  if (article.image) {
    delete article.image;
    wasCleaned = true;
  }
  
  if (article.thumbnail) {
    delete article.thumbnail;
    wasCleaned = true;
  }
  
  if (wasCleaned) {
    cleanedCount++;
  }
  
  return article;
});

// Write cleaned data back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`✅ Cleaned database - removed image URLs from ${cleanedCount} articles`);
console.log('📝 All images now come from centralized lib/image-constants.ts');
console.log('🚫 DO NOT add image URLs back to database - use getArticleImage() function');