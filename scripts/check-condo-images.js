#!/usr/bin/env node

/**
 * Targeted Condo Image Checker
 * 
 * Only checks specific files that handle condo images for stock photo violations.
 * Other files are allowed to use stock images for charts, graphs, etc.
 */

const fs = require('fs');
const path = require('path');

// ONLY these files are checked for stock photos
const CONDO_SPECIFIC_FILES = [
  'src/lib/condo-data.ts',
  'src/app/condos/page.tsx',
  'src/app/condos/[slug]/page.tsx',
  'src/components/CondoImageGallery.tsx',
  'src/data/condo-developer-images.ts'
];

// Forbidden stock photo domains for condo-specific files
const FORBIDDEN_DOMAINS = [
  'images.unsplash.com',
  'images.pexels.com',
  'stockphoto.com',
  'getty.com',
  'shutterstock.com'
];

// Allowed developer domains for condo images
const VERIFIED_DEVELOPER_DOMAINS = [
  'thegranddunman.sg',
  'continuum-condo.sg',
  'lentor-mansion.com.sg',
  'orchard-sophia.sg',
  'avenue-south.sg',
  'normanton-park.sg'
];

console.log('🔍 TARGETED CONDO IMAGE CHECKER');
console.log('=====================================');
console.log(`Checking ${CONDO_SPECIFIC_FILES.length} condo-specific files for stock images...`);
console.log('Other files are exempt from this check.\n');

let violationsFound = 0;
let filesChecked = 0;

for (const filePath of CONDO_SPECIFIC_FILES) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  filesChecked++;
  
  console.log(`📁 Checking: ${filePath}`);
  
  // Check for forbidden stock photo domains
  for (const domain of FORBIDDEN_DOMAINS) {
    if (content.includes(domain)) {
      violationsFound++;
      console.log(`❌ VIOLATION: Found ${domain} in ${filePath}`);
      
      // Extract the specific URL
      const regex = new RegExp(`https?://[^\\s'"]*${domain.replace('.', '\\.')}[^\\s'"]*`, 'g');
      const matches = content.match(regex);
      if (matches) {
        matches.forEach(url => {
          console.log(`   📸 Stock image URL: ${url}`);
        });
      }
    }
  }
  
  // Count verified developer images
  let developerImageCount = 0;
  for (const domain of VERIFIED_DEVELOPER_DOMAINS) {
    const regex = new RegExp(`https?://[^\\s'"]*${domain.replace('.', '\\.')}[^\\s'"]*`, 'g');
    const matches = content.match(regex);
    if (matches) {
      developerImageCount += matches.length;
    }
  }
  
  if (developerImageCount > 0) {
    console.log(`✅ Found ${developerImageCount} verified developer image(s)`);
  }
}

console.log('\n📊 SUMMARY');
console.log('==========');
console.log(`Files checked: ${filesChecked}/${CONDO_SPECIFIC_FILES.length}`);
console.log(`Violations found: ${violationsFound}`);

if (violationsFound > 0) {
  console.log('\n🚨 VIOLATIONS DETECTED');
  console.log('Replace stock images with verified developer images from:');
  VERIFIED_DEVELOPER_DOMAINS.forEach(domain => {
    console.log(`  • ${domain}`);
  });
  console.log('\nSee CONDO_IMAGES_RULES.md for detailed requirements.');
  process.exit(1);
} else {
  console.log('\n✅ ALL CONDO-SPECIFIC FILES COMPLIANT');
  console.log('No stock images found in condo-related components.');
  console.log('Other files are allowed to use stock images for charts/graphs.');
}