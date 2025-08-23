const { execSync } = require('child_process');
const fs = require('fs');

// Core Web Vitals thresholds
const THRESHOLDS = {
  lcp: 2500,    // Largest Contentful Paint
  fid: 100,     // First Input Delay
  cls: 0.1,     // Cumulative Layout Shift
  fcp: 1800,    // First Contentful Paint
  ttfb: 600,    // Time to First Byte
};

console.log('🚀 Starting Core Web Vitals Performance Test...\n');

// Pages to test
const testPages = [
  { name: 'Homepage', url: 'http://localhost:3000' },
  { name: 'Condos Page', url: 'http://localhost:3000/condos' },
  { name: 'Districts Page', url: 'http://localhost:3000/districts' },
  { name: 'Article Page', url: 'http://localhost:3000/articles/singapore-property-market-outlook-2025' },
  { name: 'Contact Page', url: 'http://localhost:3000/contact' }
];

async function runLighthouseAudit(url, name) {
  console.log(`⚡ Testing ${name}...`);
  
  try {
    const reportPath = `./lighthouse-${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    // Run Lighthouse audit
    execSync(
      `npx lighthouse "${url}" --output=json --output-path="${reportPath}" --chrome-flags="--headless --no-sandbox" --only-categories=performance --quiet`,
      { stdio: 'inherit' }
    );

    // Read and parse results
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const metrics = report.audits;

    const results = {
      name,
      url,
      performance: report.categories.performance.score * 100,
      lcp: metrics['largest-contentful-paint'].numericValue,
      fid: metrics['max-potential-fid'].numericValue,
      cls: metrics['cumulative-layout-shift'].numericValue,
      fcp: metrics['first-contentful-paint'].numericValue,
      ttfb: metrics['server-response-time'].numericValue
    };

    // Clean up report file
    fs.unlinkSync(reportPath);

    return results;
  } catch (error) {
    console.error(`❌ Error testing ${name}:`, error.message);
    return null;
  }
}

function evaluateMetric(value, threshold, name, unit = 'ms') {
  const isGood = value <= threshold;
  const status = isGood ? '✅' : '❌';
  const color = isGood ? '\x1b[32m' : '\x1b[31m'; // Green or Red
  const reset = '\x1b[0m';
  
  if (unit === 'score') {
    console.log(`  ${status} ${name}: ${color}${value}/100${reset}`);
  } else {
    console.log(`  ${status} ${name}: ${color}${value}${unit}${reset} (threshold: ${threshold}${unit})`);
  }
  
  return isGood;
}

function generateReport(results) {
  console.log('\n📊 CORE WEB VITALS REPORT');
  console.log('=========================\n');

  let allPassed = true;
  let totalScore = 0;

  results.forEach(result => {
    if (!result) return;

    console.log(`📄 ${result.name}`);
    console.log(`🔗 ${result.url}`);
    console.log('');

    // Performance Score
    const scoreGood = evaluateMetric(result.performance, 90, 'Performance Score', '/100');
    
    // Core Web Vitals
    const lcpGood = evaluateMetric(result.lcp, THRESHOLDS.lcp, 'LCP (Largest Contentful Paint)');
    const fidGood = evaluateMetric(result.fid, THRESHOLDS.fid, 'FID (First Input Delay)');
    const clsGood = evaluateMetric(result.cls * 1000, THRESHOLDS.cls * 1000, 'CLS (Cumulative Layout Shift)', '');
    
    // Additional Metrics
    const fcpGood = evaluateMetric(result.fcp, THRESHOLDS.fcp, 'FCP (First Contentful Paint)');
    const ttfbGood = evaluateMetric(result.ttfb, THRESHOLDS.ttfb, 'TTFB (Time to First Byte)');

    const pageScore = [scoreGood, lcpGood, fidGood, clsGood, fcpGood, ttfbGood].filter(Boolean).length;
    totalScore += pageScore;

    if (pageScore < 6) allPassed = false;

    console.log('');
  });

  // Overall Summary
  console.log('🎯 SUMMARY');
  console.log('==========');
  console.log(`Total Pages Tested: ${results.filter(r => r).length}`);
  console.log(`Average Score: ${Math.round(totalScore / (results.filter(r => r).length * 6) * 100)}%`);
  console.log(`All Tests Passed: ${allPassed ? '✅ YES' : '❌ NO'}`);

  // Recommendations
  if (!allPassed) {
    console.log('\n💡 OPTIMIZATION RECOMMENDATIONS');
    console.log('===============================');
    console.log('• Optimize images with next/image and WebP format');
    console.log('• Enable text compression (Brotli/Gzip)');
    console.log('• Minimize JavaScript bundles');
    console.log('• Use font-display: swap for web fonts');
    console.log('• Implement proper caching headers');
    console.log('• Remove unused CSS and JavaScript');
    console.log('• Use CDN for static assets');
  }

  return allPassed;
}

async function runAllTests() {
  console.log('⏱️  Building application...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }

  console.log('🚀 Starting server...');
  const server = execSync('npm run start &', { stdio: 'pipe' });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 10000));

  const results = [];
  
  for (const page of testPages) {
    const result = await runLighthouseAudit(page.url, page.name);
    if (result) results.push(result);
    
    // Brief pause between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Stop server
  try {
    execSync('pkill -f "next start"');
  } catch (e) {
    // Server might already be stopped
  }

  const allPassed = generateReport(results);
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Check if server is already running
try {
  require('http').get('http://localhost:3000', (res) => {
    console.log('✅ Server already running, starting tests...');
    runAllTests();
  }).on('error', () => {
    console.log('📦 Starting fresh server for tests...');
    runAllTests();
  });
} catch (error) {
  runAllTests();
}