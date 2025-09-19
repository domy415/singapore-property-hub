const fs = require('fs');
const path = require('path');

console.log('🔍 CONDO DATA FACT CHECKER');
console.log('==========================');

const condoDataPath = path.join(__dirname, '../src/lib/condo-data.ts');
const content = fs.readFileSync(condoDataPath, 'utf-8');

let errors = 0;

// Check for missing data sources
if (!content.includes('dataSource')) {
  console.error('❌ No data sources found in condo-data.ts');
  errors++;
}

// Check for arbitrary ratings without sources
const ratingMatches = content.match(/rating:\s*[\d.]+/g);
if (ratingMatches && !content.includes('ratingSource')) {
  console.error('❌ Found ratings without sources - likely arbitrary');
  console.error(`   Found: ${ratingMatches.join(', ')}`);
  errors++;
}

// Check for required fields
const requiredFields = ['tenure', 'currentPSF', 'developer', 'totalUnits'];
requiredFields.forEach(field => {
  if (!content.includes(field)) {
    console.error(`❌ Missing required field: ${field}`);
    errors++;
  }
});

// Check for fact-checking compliance fields
const factCheckFields = ['dataSource', 'lastUpdated', 'soldPercentage'];
factCheckFields.forEach(field => {
  if (!content.includes(field)) {
    console.error(`❌ Missing fact-checking field: ${field}`);
    errors++;
  }
});

// Check for old reviewCount references
if (content.includes('reviewCount')) {
  console.error('❌ Found reviewCount references - these should be removed');
  errors++;
}

// Check for "Pending actual reviews" instead of arbitrary ratings
const pendingReviewsCount = (content.match(/Pending actual reviews/g) || []).length;
const numericRatingCount = (content.match(/rating:\s*[\d.]+/g) || []).length;

if (numericRatingCount > 0) {
  console.error(`❌ Found ${numericRatingCount} arbitrary numeric ratings`);
  console.error('   All ratings should be "Pending actual reviews"');
  errors++;
}

console.log(`\n📊 FACT CHECK SUMMARY:`);
console.log(`   ✅ Data sources: ${content.includes('dataSource') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Last updated dates: ${content.includes('lastUpdated') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Current PSF data: ${content.includes('currentPSF') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Sales percentages: ${content.includes('soldPercentage') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Proper rating format: ${pendingReviewsCount} condos with "Pending actual reviews"`);

if (errors > 0) {
  console.error(`\n❌ FACT CHECK FAILED: ${errors} issues found`);
  console.log('\nRequired fixes:');
  console.log('1. Add data sources for all metrics');
  console.log('2. Remove arbitrary ratings or replace with "Pending actual reviews"');
  console.log('3. Include all required fields with verified data');
  console.log('4. Add soldPercentage and lastUpdated for all properties');
  process.exit(1);
} else {
  console.log('\n✅ All condo data appears to have proper citations and structure');
  console.log('✅ FACT CHECK PASSED - Build can proceed');
}