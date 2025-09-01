const https = require('https');

function getArticles() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: '/api/articles',
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

getArticles().then(articles => {
  console.log('📊 Current articles in database:');
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Image: ${article.featuredImage || 'No image'}`);
    console.log('');
  });
}).catch(console.error);