const https = require('https');

console.log('Testing Article Generation via API...\n');

const options = {
  hostname: 'singapore-property-hub.vercel.app',
  path: '/api/content/create-article',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ Article Generated Successfully!\n');
        console.log('Title:', result.article.title);
        console.log('Slug:', result.article.slug);
        console.log('Category:', result.article.category);
        console.log('Status:', result.article.status);
        console.log('ID:', result.article.id);
        console.log('\nView article at:');
        console.log(`https://singapore-property-hub.vercel.app/articles/${result.article.slug}`);
      } else {
        console.log('❌ Failed to generate article');
        console.log('Error:', result.error);
        if (result.details) {
          console.log('Details:', result.details);
        }
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

console.log('Sending request to generate article...');
console.log('This may take 30-60 seconds...\n');

// Send empty body to use default topic selection
req.write('{}');
req.end();