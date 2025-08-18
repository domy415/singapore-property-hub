// Manual trigger for daily article generation
const https = require('https');

const PROD_URL = 'https://singapore-property-hub.vercel.app';
const CRON_SECRET = process.env.CRON_SECRET || 'singapore-property-cron-2024';

function triggerDailyContent() {
  const options = {
    hostname: 'singapore-property-hub.vercel.app',
    path: '/api/cron/daily-content',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CRON_SECRET}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const result = JSON.parse(data);
        if (res.statusCode === 200 && result.success) {
          resolve(result);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function main() {
  console.log('🚀 Triggering Daily Article Generation...\n');
  
  try {
    const result = await triggerDailyContent();
    
    console.log('✅ SUCCESS! Article generated.\n');
    console.log('Article ID:', result.articleId);
    console.log('Timestamp:', result.timestamp);
    console.log('\n📝 View your new article at:');
    console.log(`${PROD_URL}/articles`);
    
    if (result.articleId) {
      console.log('\n🔗 Direct link will be available once article is indexed');
    }
    
  } catch (error) {
    console.log('❌ ERROR: Failed to generate article.\n');
    console.log('Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure CRON_SECRET is set in Vercel environment variables');
    console.log('2. Check that OpenAI API key is valid');
    console.log('3. Verify the API endpoint is deployed');
    console.log('4. Check Vercel function logs for details');
  }
}

console.log('Daily Article Generator - Manual Trigger\n');
console.log('This will generate one article immediately.\n');

if (CRON_SECRET === 'singapore-property-cron-2024') {
  console.log('⚠️  WARNING: Using default CRON_SECRET');
  console.log('For production, set a secure secret in Vercel.\n');
}

main();