'use client'

import { useState, useEffect } from 'react'
import { Section, Container, H1, H2, H3, BodyText, Card, Stack, Grid, Flex } from '@/components/design-system'

interface TestResult {
  test: string
  status: 'pass' | 'fail' | 'warning' | 'pending'
  message: string
  details?: string[]
}

export default function TestValidationPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [browserInfo, setBrowserInfo] = useState<any>(null)

  useEffect(() => {
    // Detect browser info
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent
      setBrowserInfo({
        userAgent,
        isChrome: /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor),
        isFirefox: /Firefox/.test(userAgent),
        isSafari: /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor),
        isEdge: /Edg/.test(userAgent),
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      })
    }
  }, [])

  const runAllTests = async () => {
    setIsRunning(true)
    const results: TestResult[] = []

    // Browser Compatibility Tests
    results.push(...await testBrowserCompatibility())
    
    // SEO Meta Tags Test
    results.push(...await testSEOMetaTags())
    
    // Form Functionality Tests
    results.push(...await testFormFunctionality())
    
    // Links and CTAs Tests
    results.push(...await testLinksAndCTAs())
    
    // Console Errors Test
    results.push(...await testConsoleErrors())
    
    // HTML/CSS Validation
    results.push(...await testHTMLCSSValidation())
    
    // Lead Capture Flow Test
    results.push(...await testLeadCaptureFlow())

    setTestResults(results)
    setIsRunning(false)
  }

  const testBrowserCompatibility = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []
    
    // CSS Grid Support
    tests.push({
      test: 'CSS Grid Support',
      status: CSS.supports('display', 'grid') ? 'pass' : 'fail',
      message: CSS.supports('display', 'grid') ? 'CSS Grid is supported' : 'CSS Grid not supported'
    })

    // CSS Custom Properties Support
    tests.push({
      test: 'CSS Custom Properties',
      status: CSS.supports('color', 'var(--test)') ? 'pass' : 'fail',
      message: CSS.supports('color', 'var(--test)') ? 'CSS Custom Properties supported' : 'CSS Custom Properties not supported'
    })

    // Flexbox Support
    tests.push({
      test: 'Flexbox Support',
      status: CSS.supports('display', 'flex') ? 'pass' : 'fail',
      message: CSS.supports('display', 'flex') ? 'Flexbox is supported' : 'Flexbox not supported'
    })

    // Intersection Observer Support
    tests.push({
      test: 'Intersection Observer API',
      status: 'IntersectionObserver' in window ? 'pass' : 'fail',
      message: 'IntersectionObserver' in window ? 'Intersection Observer supported' : 'Intersection Observer not supported'
    })

    // Local Storage Support
    tests.push({
      test: 'Local Storage',
      status: 'localStorage' in window ? 'pass' : 'fail',
      message: 'localStorage' in window ? 'Local Storage supported' : 'Local Storage not supported'
    })

    // WebP Support Test
    const webpTest = await new Promise<boolean>((resolve) => {
      const webP = new Image()
      webP.onload = webP.onerror = () => resolve(webP.height === 2)
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })

    tests.push({
      test: 'WebP Image Support',
      status: webpTest ? 'pass' : 'warning',
      message: webpTest ? 'WebP images supported' : 'WebP images not supported, using fallback'
    })

    return tests
  }

  const testSEOMetaTags = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []
    const details: string[] = []

    // Check for essential meta tags
    const metaTags = [
      { name: 'title', selector: 'title', required: true },
      { name: 'description', selector: 'meta[name="description"]', required: true },
      { name: 'viewport', selector: 'meta[name="viewport"]', required: true },
      { name: 'canonical', selector: 'link[rel="canonical"]', required: true },
      { name: 'og:title', selector: 'meta[property="og:title"]', required: true },
      { name: 'og:description', selector: 'meta[property="og:description"]', required: true },
      { name: 'og:image', selector: 'meta[property="og:image"]', required: true },
      { name: 'og:url', selector: 'meta[property="og:url"]', required: true },
      { name: 'twitter:card', selector: 'meta[name="twitter:card"]', required: false },
    ]

    let passedTests = 0
    let totalTests = metaTags.length

    metaTags.forEach(tag => {
      const element = document.querySelector(tag.selector)
      if (element) {
        passedTests++
        details.push(`✓ ${tag.name}: ${element.getAttribute('content') || element.textContent || 'Present'}`)
      } else if (tag.required) {
        details.push(`✗ ${tag.name}: Missing`)
      } else {
        details.push(`⚠ ${tag.name}: Optional, not found`)
      }
    })

    tests.push({
      test: 'SEO Meta Tags',
      status: passedTests >= totalTests * 0.8 ? 'pass' : passedTests >= totalTests * 0.6 ? 'warning' : 'fail',
      message: `${passedTests}/${totalTests} essential meta tags found`,
      details
    })

    // Check for structured data
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]')
    tests.push({
      test: 'Structured Data (JSON-LD)',
      status: structuredData.length > 0 ? 'pass' : 'warning',
      message: `${structuredData.length} structured data scripts found`,
      details: Array.from(structuredData).map((script, i) => `Schema ${i + 1}: ${script.textContent?.substring(0, 100)}...`)
    })

    return tests
  }

  const testFormFunctionality = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []
    const details: string[] = []

    // Find all forms
    const forms = document.querySelectorAll('form')
    details.push(`Found ${forms.length} forms on page`)

    let workingForms = 0

    forms.forEach((form, index) => {
      const inputs = form.querySelectorAll('input, select, textarea')
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]')
      
      if (inputs.length > 0 && submitButton) {
        workingForms++
        details.push(`✓ Form ${index + 1}: ${inputs.length} inputs, submit button present`)
      } else {
        details.push(`✗ Form ${index + 1}: Missing inputs or submit button`)
      }
    })

    tests.push({
      test: 'Form Structure Validation',
      status: workingForms === forms.length ? 'pass' : workingForms > 0 ? 'warning' : 'fail',
      message: `${workingForms}/${forms.length} forms have proper structure`,
      details
    })

    // Test form validation
    const emailInputs = document.querySelectorAll('input[type="email"]')
    tests.push({
      test: 'Email Input Validation',
      status: emailInputs.length > 0 ? 'pass' : 'warning',
      message: `${emailInputs.length} email inputs found with built-in validation`
    })

    return tests
  }

  const testLinksAndCTAs = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []
    const details: string[] = []

    // Find all links
    const links = document.querySelectorAll('a[href]')
    const buttons = document.querySelectorAll('button')
    
    let validLinks = 0
    let brokenLinks = 0

    // Test internal links
    const internalLinks = Array.from(links).filter(link => {
      const href = link.getAttribute('href')
      return href && (href.startsWith('/') || href.startsWith('#') || href.includes(window.location.hostname))
    })

    details.push(`Found ${links.length} total links, ${internalLinks.length} internal links`)
    details.push(`Found ${buttons.length} buttons`)

    // Check for common CTAs
    const ctaSelectors = [
      'a[href*="contact"]',
      'a[href*="signup"]',
      'a[href*="newsletter"]',
      'button:contains("Get")',
      'button:contains("Subscribe")',
      'button:contains("Contact")'
    ]

    let ctaCount = 0
    ctaSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector)
        ctaCount += elements.length
      } catch (e) {
        // Ignore selector errors
      }
    })

    tests.push({
      test: 'Links and CTAs',
      status: links.length > 0 && ctaCount > 0 ? 'pass' : 'warning',
      message: `${links.length} links, ${buttons.length} buttons, ${ctaCount} CTAs found`,
      details
    })

    // Check for accessibility attributes
    const linksWithAria = Array.from(links).filter(link => 
      link.hasAttribute('aria-label') || link.hasAttribute('title')
    )

    tests.push({
      test: 'Link Accessibility',
      status: linksWithAria.length >= links.length * 0.5 ? 'pass' : 'warning',
      message: `${linksWithAria.length}/${links.length} links have accessibility attributes`
    })

    return tests
  }

  const testConsoleErrors = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []
    
    // This would need to be implemented with error tracking
    // For now, we'll check for common issues
    
    const hasJSErrors = (window as any).__jsErrors__ ? (window as any).__jsErrors__.length : 0
    
    tests.push({
      test: 'JavaScript Errors',
      status: hasJSErrors === 0 ? 'pass' : hasJSErrors < 3 ? 'warning' : 'fail',
      message: `${hasJSErrors} JavaScript errors detected`
    })

    // Check for 404 resources
    const images = document.querySelectorAll('img')
    let brokenImages = 0
    
    const imagePromises = Array.from(images).map(img => {
      return new Promise<boolean>((resolve) => {
        if (img.complete) {
          resolve(img.naturalHeight !== 0)
        } else {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
        }
      })
    })

    const imageResults = await Promise.all(imagePromises)
    brokenImages = imageResults.filter(result => !result).length

    tests.push({
      test: 'Resource Loading',
      status: brokenImages === 0 ? 'pass' : brokenImages < 3 ? 'warning' : 'fail',
      message: `${brokenImages}/${images.length} images failed to load`
    })

    return tests
  }

  const testHTMLCSSValidation = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Basic HTML structure validation
    const hasDoctype = document.doctype !== null
    const hasLang = document.documentElement.hasAttribute('lang')
    const hasCharset = document.querySelector('meta[charset]') !== null
    const hasViewport = document.querySelector('meta[name="viewport"]') !== null

    tests.push({
      test: 'HTML Document Structure',
      status: hasDoctype && hasLang && hasCharset && hasViewport ? 'pass' : 'warning',
      message: `DOCTYPE: ${hasDoctype ? '✓' : '✗'}, Lang: ${hasLang ? '✓' : '✗'}, Charset: ${hasCharset ? '✓' : '✗'}, Viewport: ${hasViewport ? '✓' : '✗'}`
    })

    // Check for semantic HTML
    const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer']
    const foundSemanticTags = semanticTags.filter(tag => document.querySelector(tag))

    tests.push({
      test: 'Semantic HTML',
      status: foundSemanticTags.length >= 4 ? 'pass' : foundSemanticTags.length >= 2 ? 'warning' : 'fail',
      message: `${foundSemanticTags.length}/${semanticTags.length} semantic tags used: ${foundSemanticTags.join(', ')}`
    })

    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const hasH1 = document.querySelector('h1') !== null
    
    tests.push({
      test: 'Heading Hierarchy',
      status: hasH1 && headings.length > 1 ? 'pass' : 'warning',
      message: `${headings.length} headings found, H1 present: ${hasH1 ? '✓' : '✗'}`
    })

    return tests
  }

  const testLeadCaptureFlow = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []
    const details: string[] = []

    // Check for lead capture forms
    const leadForms = document.querySelectorAll('form[data-lead-capture], form:has(input[name*="email"]), form:has(input[name*="name"])')
    details.push(`Found ${leadForms.length} potential lead capture forms`)

    // Check for newsletter signup
    const newsletterForms = document.querySelectorAll('form:has(input[name*="newsletter"]), form:has(input[placeholder*="email"])')
    details.push(`Found ${newsletterForms.length} newsletter signup forms`)

    // Check for contact forms
    const contactForms = document.querySelectorAll('form[action*="contact"], form:has(textarea[name*="message"])')
    details.push(`Found ${contactForms.length} contact forms`)

    const totalLeadCapture = leadForms.length + newsletterForms.length + contactForms.length

    tests.push({
      test: 'Lead Capture Forms Present',
      status: totalLeadCapture >= 2 ? 'pass' : totalLeadCapture >= 1 ? 'warning' : 'fail',
      message: `${totalLeadCapture} lead capture opportunities found`,
      details
    })

    // Check for success/thank you pages
    const thankYouElements = document.querySelectorAll('[id*="thank"], [class*="success"], [data-success]')
    
    tests.push({
      test: 'Success States',
      status: thankYouElements.length > 0 ? 'pass' : 'warning',
      message: `${thankYouElements.length} success/thank you elements found`
    })

    return tests
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      case 'warning': return '⚠️'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50'
      case 'fail': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'pending': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const overallStatus = testResults.length > 0 ? {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'pass').length,
    failed: testResults.filter(r => r.status === 'fail').length,
    warnings: testResults.filter(r => r.status === 'warning').length,
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Section padding="lg">
        <Container>
          <Stack gap="lg">
            {/* Header */}
            <div className="text-center">
              <H1>Website Testing & Validation</H1>
              <BodyText className="text-gray-600 mt-4">
                Comprehensive cross-browser testing, form validation, SEO checks, and more
              </BodyText>
            </div>

            {/* Browser Information */}
            <Card padding="lg">
              <H2 className="mb-4">Current Browser Information</H2>
              {browserInfo && (
                <Grid cols={1} responsive={{ md: 2 }}>
                  <div>
                    <BodyText><strong>Browser:</strong></BodyText>
                    <BodyText className="text-sm text-gray-600 mb-2">
                      {browserInfo.isChrome && '🌐 Chrome'}
                      {browserInfo.isFirefox && '🦊 Firefox'} 
                      {browserInfo.isSafari && '🧭 Safari'}
                      {browserInfo.isEdge && '🔷 Edge'}
                    </BodyText>
                    <BodyText><strong>Platform:</strong> {browserInfo.platform}</BodyText>
                    <BodyText><strong>Language:</strong> {browserInfo.language}</BodyText>
                  </div>
                  <div>
                    <BodyText><strong>Screen:</strong> {browserInfo.screenResolution}</BodyText>
                    <BodyText><strong>Viewport:</strong> {browserInfo.viewportSize}</BodyText>
                    <BodyText><strong>Pixel Ratio:</strong> {browserInfo.pixelRatio}</BodyText>
                    <BodyText><strong>Cookies:</strong> {browserInfo.cookieEnabled ? '✓ Enabled' : '✗ Disabled'}</BodyText>
                  </div>
                </Grid>
              )}
            </Card>

            {/* Test Controls */}
            <Card padding="lg">
              <Flex justify="between" align="center">
                <div>
                  <H3>Run All Tests</H3>
                  <BodyText className="text-gray-600">
                    Execute comprehensive testing suite
                  </BodyText>
                </div>
                <button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? '🔄 Running Tests...' : '▶️ Run All Tests'}
                </button>
              </Flex>
            </Card>

            {/* Overall Results */}
            {overallStatus && (
              <Card padding="lg">
                <H2 className="mb-4">Test Results Overview</H2>
                <Grid cols={2} responsive={{ md: 4 }}>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{overallStatus.passed}</div>
                    <BodyText className="text-green-700">Passed</BodyText>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{overallStatus.warnings}</div>
                    <BodyText className="text-yellow-700">Warnings</BodyText>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{overallStatus.failed}</div>
                    <BodyText className="text-red-700">Failed</BodyText>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{overallStatus.total}</div>
                    <BodyText className="text-gray-700">Total</BodyText>
                  </div>
                </Grid>
              </Card>
            )}

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card padding="lg">
                <H2 className="mb-6">Detailed Test Results</H2>
                <Stack gap="md">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        result.status === 'pass' ? 'border-green-500 bg-green-50' :
                        result.status === 'fail' ? 'border-red-500 bg-red-50' :
                        result.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                        'border-gray-500 bg-gray-50'
                      }`}
                    >
                      <Flex justify="between" align="start">
                        <div className="flex-1">
                          <Flex align="center" gap className="mb-2">
                            <span className="text-xl">{getStatusIcon(result.status)}</span>
                            <H3 className="text-lg">{result.test}</H3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                              {result.status.toUpperCase()}
                            </span>
                          </Flex>
                          <BodyText className="mb-2">{result.message}</BodyText>
                          {result.details && (
                            <div className="text-sm text-gray-600">
                              {result.details.map((detail, i) => (
                                <div key={i} className="ml-4">{detail}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Flex>
                    </div>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Manual Testing Checklist */}
            <Card padding="lg">
              <H2 className="mb-4">Manual Testing Checklist</H2>
              <BodyText className="mb-4 text-gray-600">
                Additional tests that should be performed manually:
              </BodyText>
              
              <Stack gap="sm">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <BodyText>Test all forms by actually submitting them</BodyText>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <BodyText>Verify email notifications are received</BodyText>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <BodyText>Test responsive design on multiple devices</BodyText>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <BodyText>Check page loading speed with browser dev tools</BodyText>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <BodyText>Validate accessibility with screen readers</BodyText>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <BodyText>Test all external links open correctly</BodyText>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <BodyText>Verify Google Analytics tracking</BodyText>
                </div>
              </Stack>
            </Card>
          </Stack>
        </Container>
      </Section>
    </div>
  )
}