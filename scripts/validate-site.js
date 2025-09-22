// Validate all site links and pages
const https = require('https');

const baseUrl = 'https://singapore-property-hub.vercel.app';

const pages = [
  '/',
  '/articles',
  '/articles/singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape',
  '/condos',
  '/condos/grand-dunman',
  '/condos/the-continuum',
  '/condos/normanton-park',
  '/condos/lentor-mansion',
  '/condos/avenue-south-residence',
  '/condos/orchard-sophia',
  '/news',
  '/about',
  '/contact',
  '/privacy',
  '/terms'
];

console.log('🔍 Validating website links...\n');

let successCount = 0;
let errorCount = 0;
let totalChecked = 0;

function checkUrl(path) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${path}`;
    
    const req = https.get(url, (res) => {
      totalChecked++;
      
      if (res.statusCode === 200) {
        console.log(`✅ OK: ${path}`);
        successCount++;
      } else if (res.statusCode === 404) {
        console.error(`❌ 404 Error: ${path}`);
        errorCount++;
      } else {
        console.log(`⚠️ ${res.statusCode}: ${path}`);
        if (res.statusCode >= 400) {
          errorCount++;
        } else {
          successCount++;
        }
      }
      
      resolve();
    });
    
    req.on('error', (error) => {
      totalChecked++;
      console.error(`❌ Error: ${path} - ${error.message}`);
      errorCount++;
      resolve();
    });
    
    req.setTimeout(10000, () => {
      totalChecked++;
      console.error(`❌ Timeout: ${path}`);
      errorCount++;
      req.destroy();
      resolve();
    });
  });
}

async function validateAll() {
  const promises = pages.map(page => checkUrl(page));
  await Promise.all(promises);
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`Total pages checked: ${totalChecked}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log(`\n🎉 All pages are working correctly!`);
  } else {
    console.log(`\n⚠️ ${errorCount} pages need attention.`);
  }
}

validateAll().catch(console.error);