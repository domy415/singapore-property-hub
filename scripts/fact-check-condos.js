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

// Check for DQI scores
const dqiMatches = content.match(/dqiScore:\s*(\d+)/g);
const ratingMatches = content.match(/rating:\s*([\d.]+)/g);

if (!dqiMatches || dqiMatches.length === 0) {
  console.error('❌ No DQI scores found - all condos must have DQI scoring');
  errors++;
} else {
  // Verify rating matches DQI score
  let mismatchCount = 0;
  dqiMatches.forEach((match, index) => {
    const dqiScore = parseInt(match.split(':')[1]);
    if (ratingMatches && ratingMatches[index]) {
      const rating = parseFloat(ratingMatches[index].split(':')[1]);
      const expectedRating = Math.round((dqiScore / 20) * 10) / 10;
      
      if (Math.abs(rating - expectedRating) > 0.1) {
        console.error(`❌ Rating mismatch: DQI ${dqiScore} should equal ${expectedRating} stars, not ${rating}`);
        errors++;
        mismatchCount++;
      }
    }
  });
  
  if (mismatchCount === 0 && dqiMatches.length > 0) {
    console.log(`✅ All ${dqiMatches.length} condos have valid DQI scores with matching ratings`);
  }
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

// Check for DQI compliance fields
if (!content.includes('dqiScore')) {
  console.error('❌ Missing DQI scores - all condos must use DQI scoring system');
  errors++;
}

if (!content.includes('dqiBreakdown')) {
  console.error('❌ Missing DQI breakdown - all condos must have detailed scoring');
  errors++;
}

if (!content.includes('scoreSource')) {
  console.error('❌ Missing score source - all DQI scores must be attributed');
  errors++;
}

console.log(`\n📊 FACT CHECK SUMMARY:`);
console.log(`   ✅ Data sources: ${content.includes('dataSource') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Last updated dates: ${content.includes('lastUpdated') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Current PSF data: ${content.includes('currentPSF') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Sales percentages: ${content.includes('soldPercentage') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ DQI scoring: ${content.includes('dqiScore') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ DQI breakdowns: ${content.includes('dqiBreakdown') ? 'FOUND' : 'MISSING'}`);
console.log(`   ✅ Score attribution: ${content.includes('scoreSource') ? 'FOUND' : 'MISSING'}`);

if (errors > 0) {
  console.error(`\n❌ FACT CHECK FAILED: ${errors} issues found`);
  console.log('\nRequired fixes:');
  console.log('1. Add data sources for all metrics');
  console.log('2. All ratings must come from DQI scoring (rating = DQI/20)');
  console.log('3. Include all required fields with verified data');
  console.log('4. Add soldPercentage and lastUpdated for all properties');
  console.log('5. Each condo must have dqiScore, dqiBreakdown, and scoreSource');
  process.exit(1);
} else {
  console.log('\n✅ All condo data appears to have proper citations and structure');
  console.log('✅ DQI scoring system properly implemented');
  console.log('✅ FACT CHECK PASSED - Build can proceed');
}