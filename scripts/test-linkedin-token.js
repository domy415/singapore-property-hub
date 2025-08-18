// Test LinkedIn Token Configuration
// Run this after adding your token to test if it works

const https = require('https');

// Replace these with your actual values for testing
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

function testLinkedInToken(token) {
  const options = {
    hostname: 'api.linkedin.com',
    path: '/v2/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
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
        if (res.statusCode === 200) {
          const profile = JSON.parse(data);
          resolve(profile);
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
  console.log('LinkedIn Token Tester\n');
  
  if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
    console.log('Please edit this file and replace YOUR_ACCESS_TOKEN_HERE with your actual token.');
    console.log('\nTo get your token:');
    console.log('1. Visit: https://www.linkedin.com/developers/tools/oauth/token-generator');
    console.log('2. Select your app');
    console.log('3. Check: w_member_social and r_liteprofile');
    console.log('4. Generate token');
    console.log('5. Copy and paste it into this file');
    return;
  }

  try {
    console.log('Testing LinkedIn token...\n');
    const profile = await testLinkedInToken(ACCESS_TOKEN);
    
    console.log('✅ SUCCESS! Token is valid.\n');
    console.log('Your LinkedIn Profile:');
    console.log('Person ID:', profile.id);
    
    if (profile.firstName && profile.firstName.localized) {
      const firstName = Object.values(profile.firstName.localized)[0];
      console.log('Name:', firstName);
    }
    
    console.log('\n📝 Add these to Vercel Environment Variables:');
    console.log(`LINKEDIN_ACCESS_TOKEN = ${ACCESS_TOKEN}`);
    console.log(`LINKEDIN_PERSON_ID = ${profile.id}`);
    
    console.log('\n🔗 Vercel Dashboard:');
    console.log('https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
    
  } catch (error) {
    console.log('❌ ERROR: Token test failed.\n');
    console.log('Error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Token is invalid or expired');
    console.log('2. Missing required scopes (w_member_social, r_liteprofile)');
    console.log('3. Network connection issues');
  }
}

main();