const https = require('https');

// Test configuration
const config = {
  domain: 'singapore-property-hub.vercel.app',
  testImages: [
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566275538930-52cf19ffd74a?w=1200&h=630&fit=crop&q=80'
  ],
  testScreenSizes: [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ]
};

class ImageTester {
  static async testImageUrl(url) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const req = https.request(url, { method: 'HEAD' }, (res) => {
        const responseTime = Date.now() - startTime;
        
        resolve({
          url,
          status: res.statusCode,
          statusText: res.statusMessage,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'],
          responseTime,
          success: res.statusCode === 200,
          isImage: res.headers['content-type']?.startsWith('image/')
        });
      });

      req.on('error', (error) => {
        resolve({
          url,
          success: false,
          error: error.message,
          responseTime: Date.now() - startTime
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          url,
          success: false,
          error: 'Timeout',
          responseTime: Date.now() - startTime
        });
      });

      req.end();
    });
  }

  static async testAPIEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve) => {
      const options = {
        hostname: config.domain,
        port: 443,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Image-Test-Suite/1.0'
        }
      };

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const startTime = Date.now();
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          
          try {
            const parsedData = JSON.parse(responseData);
            resolve({
              path,
              status: res.statusCode,
              responseTime,
              data: parsedData,
              success: res.statusCode >= 200 && res.statusCode < 300
            });
          } catch (error) {
            resolve({
              path,
              status: res.statusCode,
              responseTime,
              rawData: responseData,
              success: res.statusCode >= 200 && res.statusCode < 300,
              parseError: error.message
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({
          path,
          success: false,
          error: error.message,
          responseTime: Date.now() - startTime
        });
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  static async runComprehensiveTests() {
    console.log('🧪 Starting Comprehensive Image Loading Tests\n');
    
    const results = {
      imageUrls: [],
      apiEndpoints: [],
      performance: [],
      summary: {}
    };

    // 1. Test core image URLs
    console.log('1️⃣ Testing Core Image URLs...');
    for (const url of config.testImages) {
      const result = await this.testImageUrl(url);
      results.imageUrls.push(result);
      
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${url} (${result.responseTime}ms)`);
      
      if (!result.success) {
        console.log(`      Error: ${result.error || result.status}`);
      }
    }

    // 2. Test API endpoints
    console.log('\n2️⃣ Testing Image-Related API Endpoints...');
    const endpoints = [
      { path: '/api/comprehensive-image-fix', method: 'GET' },
      { path: '/api/comprehensive-image-fix', method: 'POST', data: { dryRun: true } },
      { path: '/api/test-image-finder', method: 'GET' },
      { path: '/api/update-article-image', method: 'POST', data: { 
        slug: 'test-slug', 
        imageUrl: config.testImages[0] 
      }}
    ];

    for (const endpoint of endpoints) {
      const result = await this.testAPIEndpoint(
        endpoint.path, 
        endpoint.method, 
        endpoint.data
      );
      results.apiEndpoints.push(result);
      
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${endpoint.method} ${endpoint.path} (${result.responseTime}ms)`);
      
      if (!result.success) {
        console.log(`      Error: ${result.error || `HTTP ${result.status}`}`);
      }
    }

    // 3. Performance analysis
    console.log('\n3️⃣ Performance Analysis...');
    const imagePerformance = results.imageUrls.filter(r => r.success);
    
    if (imagePerformance.length > 0) {
      const avgResponseTime = imagePerformance.reduce((sum, r) => sum + r.responseTime, 0) / imagePerformance.length;
      const maxResponseTime = Math.max(...imagePerformance.map(r => r.responseTime));
      const minResponseTime = Math.min(...imagePerformance.map(r => r.responseTime));
      
      results.performance = {
        avgResponseTime: Math.round(avgResponseTime),
        maxResponseTime,
        minResponseTime,
        totalImagesSuccessful: imagePerformance.length,
        totalImagesFailure: results.imageUrls.length - imagePerformance.length
      };
      
      console.log(`   📊 Average Response Time: ${results.performance.avgResponseTime}ms`);
      console.log(`   ⚡ Fastest: ${minResponseTime}ms`);
      console.log(`   🐌 Slowest: ${maxResponseTime}ms`);
      console.log(`   ✅ Success Rate: ${((imagePerformance.length / results.imageUrls.length) * 100).toFixed(1)}%`);
    }

    // 4. Generate recommendations
    console.log('\n4️⃣ Recommendations...');
    const recommendations = [];

    if (results.performance.avgResponseTime > 2000) {
      recommendations.push('⚠️  Average image load time is slow (>2s). Consider image optimization.');
    }

    const failedImages = results.imageUrls.filter(r => !r.success);
    if (failedImages.length > 0) {
      recommendations.push(`🔧 ${failedImages.length} image(s) failed to load. Run comprehensive image fix.`);
    }

    const slowApis = results.apiEndpoints.filter(r => r.success && r.responseTime > 3000);
    if (slowApis.length > 0) {
      recommendations.push('🚀 Some API endpoints are slow (>3s). Consider optimization.');
    }

    if (recommendations.length === 0) {
      recommendations.push('🎉 All tests passed! Image system is performing well.');
    }

    recommendations.forEach(rec => console.log(`   ${rec}`));

    // 5. Summary
    results.summary = {
      timestamp: new Date().toISOString(),
      imageTests: {
        total: results.imageUrls.length,
        successful: results.imageUrls.filter(r => r.success).length,
        failed: results.imageUrls.filter(r => !r.success).length
      },
      apiTests: {
        total: results.apiEndpoints.length,
        successful: results.apiEndpoints.filter(r => r.success).length,
        failed: results.apiEndpoints.filter(r => !r.success).length
      },
      recommendations: recommendations.length,
      overallHealth: (
        (results.imageUrls.filter(r => r.success).length / results.imageUrls.length +
         results.apiEndpoints.filter(r => r.success).length / results.apiEndpoints.length) / 2 * 100
      ).toFixed(1) + '%'
    };

    console.log('\n📈 Test Summary:');
    console.log(`   Overall Health: ${results.summary.overallHealth}`);
    console.log(`   Images: ${results.summary.imageTests.successful}/${results.summary.imageTests.total} successful`);
    console.log(`   APIs: ${results.summary.apiTests.successful}/${results.summary.apiTests.total} successful`);
    console.log(`   Recommendations: ${results.summary.recommendations}`);

    return results;
  }

  static async testMobileDeviceExperience() {
    console.log('\n📱 Testing Mobile Device Experience...');
    
    // Test mobile-optimized image URLs
    const mobileTests = config.testImages.map(url => {
      const mobileUrl = url.replace('w=1200&h=630', 'w=400&h=300&dpr=2');
      return this.testImageUrl(mobileUrl);
    });

    const results = await Promise.all(mobileTests);
    
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} Mobile Image ${index + 1} (${result.responseTime}ms)`);
    });

    const avgMobileTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length;
    console.log(`   📊 Average Mobile Load Time: ${Math.round(avgMobileTime)}ms`);
    
    return results;
  }
}

// Run comprehensive tests
async function runAllTests() {
  try {
    const testResults = await ImageTester.runComprehensiveTests();
    const mobileResults = await ImageTester.testMobileDeviceExperience();
    
    // Save results to file (optional)
    const fs = require('fs');
    const fullResults = {
      ...testResults,
      mobileTests: mobileResults,
      testConfig: config
    };
    
    fs.writeFileSync(
      'image-test-results.json', 
      JSON.stringify(fullResults, null, 2)
    );
    
    console.log('\n💾 Results saved to image-test-results.json');
    console.log('\n🎯 Run with: npm run test:images or node scripts/comprehensive-image-test.js');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = { ImageTester, config };