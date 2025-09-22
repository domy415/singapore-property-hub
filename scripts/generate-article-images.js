const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Create directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create distinct images for each article using SVG
const articleImages = [
  { 
    filename: 'singapore-cbd-skyline.jpg',
    title: 'CBD SKYLINE',
    subtitle: 'Market Analysis',
    color: '#1e40af',
    secondaryColor: '#3b82f6'
  },
  {
    filename: 'singapore-financial-district.jpg', 
    title: 'FINANCIAL DISTRICT',
    subtitle: 'Market Resilience',
    color: '#059669',
    secondaryColor: '#10b981'
  },
  {
    filename: 'marina-bay-sands.jpg',
    title: 'MARINA BAY',
    subtitle: 'Property Analysis',
    color: '#7c3aed',
    secondaryColor: '#a855f7'
  },
  {
    filename: 'hdb-flats.jpg',
    title: 'HDB HOUSING',
    subtitle: 'Public Housing Guide',
    color: '#dc2626',
    secondaryColor: '#ef4444'
  },
  {
    filename: 'singapore-parliament.jpg',
    title: 'GOVERNMENT POLICY',
    subtitle: 'Cooling Measures',
    color: '#ea580c',
    secondaryColor: '#f97316'
  },
  {
    filename: 'district-12.jpg',
    title: 'DISTRICT 12',
    subtitle: 'Balestier • Toa Payoh',
    color: '#0891b2',
    secondaryColor: '#06b6d4'
  },
  {
    filename: 'district-2.jpg',
    title: 'DISTRICT 2',
    subtitle: 'Anson • Tanjong Pagar',
    color: '#7c2d12',
    secondaryColor: '#9a3412'
  }
];

async function createImages() {
  console.log('🎨 Creating unique article images...\n');
  
  for (const img of articleImages) {
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${img.filename.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${img.color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${img.secondaryColor};stop-opacity:0.8" />
          </linearGradient>
          <linearGradient id="overlay${img.filename.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.7);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#grad${img.filename.replace(/[^a-zA-Z0-9]/g, '')})"/>
        <rect width="1200" height="630" fill="url(#overlay${img.filename.replace(/[^a-zA-Z0-9]/g, '')})"/>
        
        <!-- Title -->
        <text x="600" y="280" font-family="Arial Black, Arial, sans-serif" font-size="64" font-weight="900" fill="white" text-anchor="middle" opacity="0.95">
          ${img.title}
        </text>
        
        <!-- Subtitle -->
        <text x="600" y="330" font-family="Arial, sans-serif" font-size="28" font-weight="normal" fill="white" text-anchor="middle" opacity="0.8">
          ${img.subtitle}
        </text>
        
        <!-- Brand -->
        <text x="600" y="420" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">
          Singapore Property Hub
        </text>
        
        <!-- Decorative elements -->
        <circle cx="150" cy="150" r="80" fill="white" opacity="0.1"/>
        <circle cx="1050" cy="480" r="100" fill="white" opacity="0.08"/>
        <rect x="50" y="50" width="1100" height="530" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
      </svg>
    `;
    
    const outputPath = path.join(imagesDir, img.filename);
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ Created: ${img.filename}`);
  }
  
  // Create category defaults
  const categoryDefaults = [
    { name: 'singapore-cbd-default.jpg', title: 'MARKET INSIGHTS', subtitle: 'Expert Analysis', color: '#1e40af', secondaryColor: '#3b82f6' },
    { name: 'singapore-news-default.jpg', title: 'PROPERTY NEWS', subtitle: 'Latest Updates', color: '#dc2626', secondaryColor: '#ef4444' },
    { name: 'singapore-guide-default.jpg', title: 'BUYING GUIDE', subtitle: 'Expert Advice', color: '#059669', secondaryColor: '#10b981' },
    { name: 'singapore-default.jpg', title: 'SINGAPORE PROPERTY', subtitle: 'Real Estate Hub', color: '#6b7280', secondaryColor: '#9ca3af' }
  ];
  
  for (const def of categoryDefaults) {
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${def.name.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${def.color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${def.secondaryColor};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#grad${def.name.replace(/[^a-zA-Z0-9]/g, '')})"/>
        <text x="600" y="280" font-family="Arial Black, Arial, sans-serif" font-size="56" font-weight="900" fill="white" text-anchor="middle">
          ${def.title}
        </text>
        <text x="600" y="330" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle" opacity="0.8">
          ${def.subtitle}
        </text>
        <text x="600" y="420" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">
          Singapore Property Hub
        </text>
        <rect x="50" y="50" width="1100" height="530" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
      </svg>
    `;
    
    fs.writeFileSync(path.join(imagesDir, def.name), svg);
    console.log(`✅ Created default: ${def.name}`);
  }
  
  console.log('\n🎉 All article images created successfully!');
  console.log('Note: These are SVG files saved as .jpg for immediate use.');
  console.log('For production, consider using a proper image conversion tool.');
}

createImages().catch(console.error);