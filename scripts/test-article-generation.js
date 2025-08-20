require('dotenv').config();
const { BasicArticleCreator } = require('../src/services/basic-article-creator');

async function testArticleGeneration() {
  console.log('Testing Article Generation System...\n');
  
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY not found in environment variables');
    return;
  }
  
  console.log('✅ OpenAI API key found');
  
  try {
    const creator = new BasicArticleCreator();
    
    // Test topics
    const testTopics = [
      'New Launch: The Continuum at Thiam Siew Avenue',
      'Singapore Property Market Outlook Q4 2025',
      'Best Districts for Property Investment in 2025'
    ];
    
    console.log('\nGenerating test article...');
    console.log('Topic:', testTopics[0]);
    console.log('\nThis may take 30-60 seconds...\n');
    
    const article = await creator.generateArticle(testTopics[0]);
    
    console.log('✅ Article Generated Successfully!\n');
    console.log('Title:', article.title);
    console.log('Slug:', article.slug);
    console.log('Category:', article.category);
    console.log('Word Count:', article.content.split(' ').length);
    console.log('Tags:', article.tags.join(', '));
    console.log('\nExcerpt:');
    console.log(article.excerpt);
    console.log('\nFirst 500 characters of content:');
    console.log(article.content.substring(0, 500) + '...');
    
    // Save to file for review
    const fs = require('fs');
    const filename = `test-article-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(article, null, 2));
    console.log(`\n✅ Full article saved to: ${filename}`);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
  }
}

testArticleGeneration();