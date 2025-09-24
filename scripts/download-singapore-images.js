const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const dirs = [
  'public/property-images',
  'public/property-images/condos',
  'public/property-images/hdb',
  'public/property-images/districts',
  'public/property-images/government',
  'public/property-images/misc'
];

console.log('📁 Creating directories...');
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Singapore property images from free sources (Pexels, Pixabay, Unsplash)
const images = {
  // HDB Estate Images (Real Singapore HDB blocks)
  'hdb/punggol-hdb-waterfront.jpg': 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'hdb/toa-payoh-hdb-town.jpg': 'https://images.pexels.com/photos/2835436/pexels-photo-2835436.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'hdb/singapore-hdb-blocks.jpg': 'https://images.pexels.com/photos/3288102/pexels-photo-3288102.png?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'hdb/mature-hdb-estate.jpg': 'https://images.pexels.com/photos/6136105/pexels-photo-6136105.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  
  // Singapore Skyline & CBD (Marina Bay, Financial District)
  'misc/singapore-marina-bay-skyline.jpg': 'https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'misc/marina-bay-sands-night.jpg': 'https://images.pexels.com/photos/2538107/pexels-photo-2538107.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'misc/singapore-cbd-buildings.jpg': 'https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'misc/singapore-skyline-day.jpg': 'https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'misc/singapore-river-view.jpg': 'https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  
  // Singapore Districts & Neighborhoods
  'districts/orchard-road-shopping.jpg': 'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'districts/tanjong-pagar-cbd.jpg': 'https://images.pexels.com/photos/3573389/pexels-photo-3573389.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'districts/singapore-chinatown.jpg': 'https://images.pexels.com/photos/3063998/pexels-photo-3063998.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'districts/little-india-singapore.jpg': 'https://images.pexels.com/photos/3640767/pexels-photo-3640767.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  
  // Modern Condominiums & Private Housing
  'condos/modern-singapore-condo.jpg': 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'condos/luxury-condo-singapore.jpg': 'https://images.pexels.com/photos/3288100/pexels-photo-3288100.png?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'condos/high-rise-residential.jpg': 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'condos/waterfront-condo.jpg': 'https://images.pexels.com/photos/6284228/pexels-photo-6284228.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  
  // Government Buildings & Landmarks
  'government/singapore-parliament.jpg': 'https://images.pexels.com/photos/3009792/pexels-photo-3009792.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'government/singapore-city-hall.jpg': 'https://images.pexels.com/photos/3573350/pexels-photo-3573350.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'government/singapore-merlion.jpg': 'https://images.pexels.com/photos/2901131/pexels-photo-2901131.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  
  // National Day & Singapore Culture
  'misc/singapore-flag-celebration.jpg': 'https://images.pexels.com/photos/3573392/pexels-photo-3573392.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'misc/singapore-national-day.jpg': 'https://images.pexels.com/photos/6043920/pexels-photo-6043920.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  
  // Property Investment & Business
  'misc/singapore-business-district.jpg': 'https://images.pexels.com/photos/3152127/pexels-photo-3152127.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  'misc/property-investment.jpg': 'https://images.pexels.com/photos/2901220/pexels-photo-2901220.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop'
};

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete incomplete file
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

// Download all images with progress tracking
async function downloadAllImages() {
  console.log(`🚀 Starting download of ${Object.keys(images).length} Singapore property images...`);
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  for (const [filename, url] of Object.entries(images)) {
    const filepath = path.join('public/property-images', filename);
    
    try {
      console.log(`⬇️  Downloading: ${filename}`);
      await downloadImage(url, filepath);
      console.log(`✅ Success: ${filename}`);
      results.success++;
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}`);
      results.failed++;
      results.errors.push({ filename, error: error.message });
    }
  }
  
  // Summary
  console.log('\n📊 Download Summary:');
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Failed Downloads:');
    results.errors.forEach(({ filename, error }) => {
      console.log(`   ${filename}: ${error}`);
    });
  }
  
  if (results.success > 0) {
    console.log('\n🎉 Images successfully downloaded to public/property-images/');
    console.log('📂 Directory structure:');
    console.log('   public/property-images/');
    console.log('   ├── hdb/           (HDB estate photos)');
    console.log('   ├── condos/        (Private condominiums)');
    console.log('   ├── districts/     (Singapore neighborhoods)');
    console.log('   ├── government/    (Official buildings)');
    console.log('   └── misc/          (Skyline, landmarks, misc)');
  }
}

// Start the download process
downloadAllImages().catch(console.error);