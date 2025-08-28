const fetch = require('node-fetch');

const API_URL = 'https://singapore-property-hub.vercel.app/api/cron/daily-content';
const AUTH_TOKEN = 'singapore-property-cron-2024';

async function generateArticle(date) {
  console.log(`\nGenerating article for ${date}...`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Article generated successfully for ${date}`);
      console.log(`   Article ID: ${data.workflow?.articleId || data.articleId}`);
      console.log(`   Quality Score: ${data.workflow?.qualityScore || data.qualityScore}`);
    } else {
      console.log(`❌ Failed to generate article for ${date}:`, data.message || data.error);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Error generating article for ${date}:`, error.message);
    return null;
  }
}

async function generateMissingArticles() {
  console.log('Starting to generate missing articles...');
  console.log('='.repeat(50));
  
  // Missing dates based on the gap from Aug 23-27
  const missingDates = [
    '2025-08-23 (Saturday)',
    '2025-08-24 (Sunday)', 
    '2025-08-25 (Monday)',
    '2025-08-26 (Tuesday)',
    '2025-08-27 (Wednesday)'
  ];
  
  console.log(`Will generate ${missingDates.length} missing articles`);
  
  for (const date of missingDates) {
    await generateArticle(date);
    
    // Wait 5 seconds between generations to avoid rate limits
    if (missingDates.indexOf(date) < missingDates.length - 1) {
      console.log('   Waiting 5 seconds before next generation...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Missing article generation complete!');
  console.log('Check https://singapore-property-hub.vercel.app/articles to see all articles');
}

// Run the script
generateMissingArticles().catch(console.error);