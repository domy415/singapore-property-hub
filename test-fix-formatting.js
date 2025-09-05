const https = require('https');

function makeAPIRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'singapore-property-hub.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          console.log('Raw response:', responseData.substring(0, 500));
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testFixFormatting() {
  const targetSlug = "singapore-s-property-market-poised-for-continued-growth-amid-evolving-regulatory-landscape";
  
  try {
    console.log('🔍 Step 1: Analyzing article formatting issues...');
    
    const analysisResult = await makeAPIRequest(`/api/fix-article-formatting?slug=${encodeURIComponent(targetSlug)}`);
    
    if (analysisResult.error) {
      console.log(`❌ Analysis failed: ${analysisResult.error}`);
      return;
    }
    
    console.log('✅ Analysis complete!');
    console.log(`\nArticle: "${analysisResult.article.title}"`);
    console.log(`Slug: ${analysisResult.article.slug}`);
    console.log(`Content length: ${analysisResult.analysis.contentLength} characters`);
    console.log(`Has issues: ${analysisResult.hasIssues}`);
    
    if (analysisResult.analysis.issues.length > 0) {
      console.log(`\n🚨 Found ${analysisResult.analysis.issues.length} types of formatting issues:`);
      
      analysisResult.analysis.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.type.toUpperCase()}`);
        
        if (issue.count) {
          console.log(`   Count: ${issue.count}`);
        }
        
        if (issue.examples) {
          console.log('   Examples:');
          issue.examples.forEach((example, exIndex) => {
            if (typeof example === 'string') {
              console.log(`     ${exIndex + 1}. "${example}"`);
            } else if (example.heading && example.mergedText) {
              console.log(`     ${exIndex + 1}. Heading: "${example.heading}" merged with: "${example.mergedText}..."`);
            } else {
              console.log(`     ${exIndex + 1}. ${JSON.stringify(example)}`);
            }
          });
        }
        
        if (issue.patterns) {
          console.log('   Problematic patterns found:');
          issue.patterns.forEach((pattern, pIndex) => {
            console.log(`     ${pIndex + 1}. "${pattern}"`);
          });
        }
      });
    } else {
      console.log('\n✅ No formatting issues found!');
      return;
    }
    
    console.log('\n🔧 Step 2: Running dry-run fix...');
    
    const dryRunResult = await makeAPIRequest('/api/fix-article-formatting', 'POST', {
      slug: targetSlug,
      dryRun: true
    });
    
    if (dryRunResult.error) {
      console.log(`❌ Dry run failed: ${dryRunResult.error}`);
      return;
    }
    
    console.log('✅ Dry run complete!');
    console.log(`\nFixes that would be applied: ${dryRunResult.analysis.fixesApplied.length}`);
    
    if (dryRunResult.analysis.fixesApplied.length > 0) {
      dryRunResult.analysis.fixesApplied.forEach((fix, index) => {
        console.log(`\n${index + 1}. ${fix.type.toUpperCase()}`);
        
        if (fix.count) {
          console.log(`   Count: ${fix.count}`);
        }
        
        if (fix.pattern && fix.replacement) {
          console.log(`   Pattern: "${fix.pattern}"`);
          console.log(`   Fix: "${fix.replacement}"`);
        }
        
        if (fix.examples) {
          console.log('   Examples:');
          fix.examples.forEach((example, exIndex) => {
            console.log(`     ${exIndex + 1}. Original: "${example.original}"`);
            console.log(`         Fixed: "${example.fixed}"`);
          });
        }
      });
      
      console.log('\n📖 Content Preview Comparison:');
      console.log('\nORIGINAL (first 500 chars):');
      console.log('-'.repeat(60));
      console.log(dryRunResult.preview.original);
      console.log('-'.repeat(60));
      
      console.log('\nFIXED (first 500 chars):');
      console.log('-'.repeat(60));
      console.log(dryRunResult.preview.fixed);
      console.log('-'.repeat(60));
    }
    
    if (!dryRunResult.analysis.hasChanges) {
      console.log('\n✅ No changes needed - article is already properly formatted!');
      return;
    }
    
    // Ask user if they want to apply the fixes (simulated - auto-apply for testing)
    console.log('\n🚀 Step 3: Applying fixes to the article...');
    
    const applyResult = await makeAPIRequest('/api/fix-article-formatting', 'POST', {
      slug: targetSlug,
      dryRun: false
    });
    
    if (applyResult.error) {
      console.log(`❌ Fix application failed: ${applyResult.error}`);
      return;
    }
    
    console.log('✅ Fixes applied successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Original content length: ${applyResult.changes.originalLength} characters`);
    console.log(`   Fixed content length: ${applyResult.changes.fixedLength} characters`);
    console.log(`   Changes made: ${applyResult.changes.hasChanges ? 'YES' : 'NO'}`);
    console.log(`   Number of fix types applied: ${applyResult.changes.fixesApplied.length}`);
    
    console.log('\n🎉 Article formatting has been fixed!');
    console.log(`Visit: https://singapore-property-hub.vercel.app/articles/${targetSlug}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFixFormatting();