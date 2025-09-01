// Test script for Claude API migration
// This will test the basic functionality after migration

require('dotenv').config({ path: '.env.local' });

const { BasicArticleCreator } = require('./dist/services/basic-article-creator');

async function testBasicArticleCreator() {
  console.log('Testing BasicArticleCreator with Claude API...');
  
  try {
    const creator = new BasicArticleCreator();
    console.log('✓ BasicArticleCreator instance created');
    
    // Test article generation
    console.log('Generating test article...');
    const result = await creator.generateArticle('MARKET_INSIGHTS', 'Singapore Property Market Test 2025');
    
    console.log('✓ Article generation successful');
    console.log('Article Title:', result.title);
    console.log('Word Count:', result.content.split(' ').length);
    console.log('Category:', result.category);
    
    return true;
  } catch (error) {
    console.error('✗ BasicArticleCreator test failed:', error.message);
    return false;
  }
}

async function testArticleFactChecker() {
  console.log('\nTesting ArticleFactChecker with Claude API...');
  
  try {
    const { ArticleFactChecker } = require('./dist/services/article-fact-checker');
    const checker = new ArticleFactChecker();
    console.log('✓ ArticleFactChecker instance created');
    
    // Test fact checking
    const testContent = `
    Singapore's property market in 2025 continues to show resilience despite global economic uncertainties. 
    The ABSD rates for citizens remain at 17% for second properties, while the LTV limit is set at 75% for first properties.
    District 1 remains the most expensive district with average PSF rates exceeding $2,500.
    `;
    
    console.log('Running fact check...');
    const review = await checker.reviewArticle(
      'Singapore Property Market Update 2025',
      testContent,
      'MARKET_INSIGHTS'
    );
    
    console.log('✓ Fact checking successful');
    console.log('Quality Score:', review.qualityScore);
    console.log('Fact Check Passed:', review.factCheck.isAccurate);
    console.log('Issues Found:', review.factCheck.issues.length);
    
    return true;
  } catch (error) {
    console.error('✗ ArticleFactChecker test failed:', error.message);
    return false;
  }
}

async function testDistrictArticleCreator() {
  console.log('\nTesting DistrictArticleCreator with Claude API...');
  
  try {
    const { DistrictArticleCreator } = require('./dist/services/district-article-creator');
    const creator = new DistrictArticleCreator();
    console.log('✓ DistrictArticleCreator instance created');
    
    // Test district article generation
    console.log('Generating district article...');
    const result = await creator.generateDistrictArticle('District Guide: Orchard Area');
    
    console.log('✓ District article generation successful');
    console.log('Article Title:', result.title);
    console.log('Category:', result.category);
    
    return true;
  } catch (error) {
    console.error('✗ DistrictArticleCreator test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Claude API Migration Tests\n');
  
  const tests = [
    testBasicArticleCreator,
    testArticleFactChecker,
    testDistrictArticleCreator
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('Test execution error:', error);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🎯 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Claude API migration successful.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the error messages above.');
  }
}

// Run the tests
runAllTests().catch(console.error);