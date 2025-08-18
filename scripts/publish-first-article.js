const fs = require('fs');
const path = require('path');

// Read the markdown article
const articlePath = path.join(__dirname, '../../singapore-property-market-outlook-2025.md');
const articleContent = fs.readFileSync(articlePath, 'utf-8');

// Parse the frontmatter and content
const lines = articleContent.split('\n');
const title = "Singapore Property Market Outlook 2025: Expert Analysis and Predictions";
const slug = "singapore-property-market-outlook-2025";

// Extract content after the frontmatter
const contentStartIndex = lines.findIndex(line => line.startsWith('## Introduction'));
const mainContent = lines.slice(contentStartIndex).join('\n');

// Convert markdown to HTML (basic conversion)
const convertMarkdownToHtml = (md) => {
  return md
    // Headers
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/# (.*)/g, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Lists
    .replace(/^\- (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    // Clean up
    .replace(/<p><h/g, '<h')
    .replace(/<\/h(\d)><\/p>/g, '</h$1>')
    .replace(/<p><ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>');
};

const articleData = {
  title: title,
  slug: slug,
  excerpt: "Expert analysis of Singapore's property market trends for 2025. Investment opportunities, price predictions, and insights from property experts.",
  content: convertMarkdownToHtml(mainContent),
  category: "MARKET_INSIGHTS",
  tags: ["Singapore Property", "Market Outlook", "2025 Trends", "Investment", "Real Estate"],
  featuredImage: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=800&fit=crop",
  authorEmail: "expert@singaporepropertyhub.sg",
  seoTitle: "Singapore Property Market Outlook 2025 | Expert Analysis",
  seoDescription: "Expert analysis of Singapore's property market trends for 2025. Investment opportunities, price predictions, and insights from property experts.",
  seoKeywords: ["Singapore property market", "2025 property trends", "real estate investment", "property prices Singapore"],
  publish: true
};

// Log the data that would be sent
console.log('Article Data to Publish:');
console.log('Title:', articleData.title);
console.log('Slug:', articleData.slug);
console.log('Category:', articleData.category);
console.log('Tags:', articleData.tags);
console.log('Content Length:', articleData.content.length, 'characters');
console.log('\nTo publish this article:');
console.log('1. Copy the article data above');
console.log('2. Make a POST request to: https://singapore-property-hub.vercel.app/api/articles');
console.log('3. Or use the publish-article.sh script');

// Write the data to a JSON file for easy access
fs.writeFileSync(
  path.join(__dirname, 'article-to-publish.json'),
  JSON.stringify(articleData, null, 2)
);

console.log('\nArticle data saved to: scripts/article-to-publish.json');