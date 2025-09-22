const fs = require('fs');
const path = require('path');

async function repairAllArticles() {
  console.log('🔧 ARTICLE REPAIR SCRIPT');
  console.log('========================\n');
  
  // Load articles from database check file
  const articlesPath = path.join(__dirname, '../database-articles-check.json');
  
  if (!fs.existsSync(articlesPath)) {
    console.error('❌ Articles file not found:', articlesPath);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  let articles = data.articles || [];
  
  let fixed = 0;
  let deleted = 0;
  let imagesFixed = 0;
  
  articles = articles.filter(article => {
    // Fix content formatting
    if (article.content) {
      const originalContent = article.content;
      
      // Fix excessive line breaks
      article.content = article.content
        .replace(/\n\n+/g, '\n\n') // Replace multiple line breaks with double
        .replace(/##\s+\w+\n\n\w+/g, (match) => match.replace(/\n\n/g, ' ')) // Fix broken headers
        .replace(/\n\n#\s+/g, '\n\n## ') // Fix header levels
        .replace(/([a-z])\n\n([A-Z])/g, '$1 $2'); // Fix broken sentences
      
      if (originalContent !== article.content) {
        fixed++;
        console.log(`  ✅ Fixed formatting for: ${article.slug}`);
      }
    }
    
    // Check content validity
    if (!article.content || article.content.length < 500) {
      console.log(`  ❌ Deleting empty/short article: ${article.slug}`);
      deleted++;
      return false; // Remove from array
    }
    
    // Fix images - remove timestamp parameters and use proper Unsplash URLs
    if (article.featuredImage) {
      const originalImage = article.featuredImage;
      
      // If it's a local image with timestamp, replace with category-appropriate Unsplash image
      if (article.featuredImage.includes('?t=') || article.featuredImage.startsWith('/images/')) {
        // Map categories to appropriate Unsplash images
        const categoryImages = {
          'MARKET_INSIGHTS': 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80', // Singapore CBD
          'BUYING_GUIDE': 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&h=630&q=80', // HDB flats
          'PROPERTY_NEWS': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&q=80', // Modern building
          'NEW_LAUNCH_REVIEW': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&q=80' // Modern condo
        };
        
        article.featuredImage = categoryImages[article.category] || categoryImages['MARKET_INSIGHTS'];
        imagesFixed++;
        console.log(`  🖼️ Fixed image for: ${article.slug}`);
      }
    }
    
    return true; // Keep in array
  });
  
  // Save repaired articles back to the file
  data.articles = articles;
  data.total = articles.length;
  
  fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
  
  console.log('\n📊 REPAIR SUMMARY:');
  console.log(`  Content fixed: ${fixed}`);
  console.log(`  Articles deleted: ${deleted}`);
  console.log(`  Images fixed: ${imagesFixed}`);
  console.log(`  Total remaining: ${articles.length}`);
  
  // Also create a backup
  const backupPath = path.join(__dirname, `../database-articles-backup-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
  console.log(`\n💾 Backup saved to: ${path.basename(backupPath)}`);
}

// Run the repair
repairAllArticles().catch(console.error);