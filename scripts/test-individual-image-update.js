const https = require('https');

async function testIndividualImageUpdate() {
  const data = JSON.stringify({
    slug: 'navigating-the-waves-of-singapore-s-property-market-an-expert-analysis',
    imageUrl: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80'
  });

  const options = {
    hostname: 'singapore-property-hub.vercel.app',
    port: 443,
    path: '/api/update-article-image',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          console.log('Update Result:', JSON.stringify(result, null, 2));
          resolve(result);
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the test
console.log('Testing individual article image update...');
testIndividualImageUpdate()
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Test failed:', error));