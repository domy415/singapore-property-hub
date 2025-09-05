'use client'

import Head from 'next/head'

export default function WorldClassArticlePage() {
  return (
    <>
      <Head>
        <title>Singapore Property Market 2025: 8.2% Growth Amid Cooling Measures | Singapore Property Hub</title>
        <meta name="description" content="Expert analysis of Singapore's resilient property market with insights on HDB, private, and commercial segments. Interactive data visualizations and professional market intelligence." />
        <meta name="keywords" content="Singapore property, property market 2025, URA data, ABSD rates, property investment, market analysis" />
        <meta name="author" content="Property Insights Team" />
        <meta property="og:title" content="Singapore Property Market 2025: 8.2% Growth Amid Cooling Measures" />
        <meta property="og:description" content="Expert analysis of Singapore's resilient property market with insights on HDB, private, and commercial segments." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1920&h=1080&q=80" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Singapore Property Market 2025: 8.2% Growth Amid Cooling Measures" />
        <meta name="twitter:description" content="Expert analysis of Singapore's resilient property market with interactive data visualizations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://singapore-property-hub.vercel.app/articles/world-class-example" />
      </Head>
      {/* Progress Bar */}
      <div id="reading-progress" className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div id="progress-bar" className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-300 ease-out" style={{width: '0%'}}></div>
      </div>

      {/* Skip to Content Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1920&h=1080&q=80')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                MARKET INSIGHTS • 12 MIN READ • SEPTEMBER 3, 2025
              </div>
            </div>
            
            <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 tracking-tight">
              Singapore's Property Market:
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                +8.2% Growth
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-normal text-gray-200 mt-4">
                Despite Cooling Measures
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Expert analysis of Singapore's resilient property market with insights on policy impacts, 
              segment-specific trends, and strategic investment considerations for 2025.
            </p>
            
            {/* Hero Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="stat-card">
                <div className="text-3xl md:text-4xl font-bold text-green-400">+8.2%</div>
                <div className="text-sm text-gray-300">YoY Growth</div>
              </div>
              <div className="stat-card">
                <div className="text-3xl md:text-4xl font-bold text-blue-400">$1.2B</div>
                <div className="text-sm text-gray-300">Q3 Volume</div>
              </div>
              <div className="stat-card">
                <div className="text-3xl md:text-4xl font-bold text-orange-400">60%</div>
                <div className="text-sm text-gray-300">ABSD Rate</div>
              </div>
              <div className="stat-card">
                <div className="text-3xl md:text-4xl font-bold text-purple-400">23</div>
                <div className="text-sm text-gray-300">Districts</div>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-white">PT</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Property Insights Team</div>
                  <div className="text-sm text-gray-300">20+ Years Singapore Market Experience</div>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button className="share-btn bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full flex items-center transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
              <button className="share-btn bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-full flex items-center transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                WhatsApp
              </button>
              <button className="share-btn bg-gray-600 hover:bg-gray-700 p-3 rounded-full transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="relative bg-gray-50 min-h-screen">
        {/* Floating Table of Contents */}
        <nav id="toc" className="toc-container hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-72 z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Contents</h3>
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div id="toc-progress" className="h-full bg-blue-600 transition-all duration-300" style={{width: '0%'}}></div>
            </div>
          </div>
          <ul className="space-y-3">
            <li><a href="#executive-summary" className="toc-link block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200">Executive Summary</a></li>
            <li><a href="#market-dynamics" className="toc-link block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200">🏗️ Current Market Dynamics</a></li>
            <li><a href="#policy-impact" className="toc-link block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200">📊 Policy Impact Analysis</a></li>
            <li><a href="#segment-analysis" className="toc-link block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200">🏢 Segment-by-Segment Analysis</a></li>
            <li><a href="#data-insights" className="toc-link block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200">📈 Interactive Data Insights</a></li>
            <li><a href="#investment-outlook" className="toc-link block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200">💡 Investment Outlook</a></li>
            <li><a href="#risk-factors" className="toc-link block text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200">⚠️ Key Risk Factors</a></li>
          </ul>
        </nav>

        {/* Mobile TOC Toggle */}
        <button id="mobile-toc-toggle" className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl z-40 hover:bg-blue-700 transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile TOC Overlay */}
        <div id="mobile-toc" className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transform translate-y-full transition-transform duration-300" id="mobile-toc-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Table of Contents</h3>
              <button id="mobile-toc-close" className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-4">
              <li><a href="#executive-summary" className="mobile-toc-link block text-gray-600 hover:text-blue-600 py-3 text-lg">Executive Summary</a></li>
              <li><a href="#market-dynamics" className="mobile-toc-link block text-gray-600 hover:text-blue-600 py-3 text-lg">🏗️ Current Market Dynamics</a></li>
              <li><a href="#policy-impact" className="mobile-toc-link block text-gray-600 hover:text-blue-600 py-3 text-lg">📊 Policy Impact Analysis</a></li>
              <li><a href="#segment-analysis" className="mobile-toc-link block text-gray-600 hover:text-blue-600 py-3 text-lg">🏢 Segment-by-Segment Analysis</a></li>
              <li><a href="#data-insights" className="mobile-toc-link block text-gray-600 hover:text-blue-600 py-3 text-lg">📈 Interactive Data Insights</a></li>
              <li><a href="#investment-outlook" className="mobile-toc-link block text-gray-600 hover:text-blue-600 py-3 text-lg">💡 Investment Outlook</a></li>
              <li><a href="#risk-factors" className="mobile-toc-link block text-gray-600 hover:text-blue-600 py-3 text-lg">⚠️ Key Risk Factors</a></li>
            </ul>
          </div>
        </div>

        {/* Main Article Content */}
        <main id="main-content" className="lg:ml-80 lg:mr-8">
          <div className="max-w-4xl mx-auto px-4 py-12">

            {/* Executive Summary */}
            <section id="executive-summary" className="section-padding">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 mb-12 border border-blue-100 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Key Takeaways</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="key-takeaway flex items-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Resilient Growth</h3>
                      <p className="text-gray-700">Property prices rose 8.2% YoY despite multiple cooling measures, showing market fundamentals remain strong.</p>
                    </div>
                  </div>

                  <div className="key-takeaway flex items-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-2 8h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Policy Effectiveness</h3>
                      <p className="text-gray-700">ABSD increases to 60% have successfully moderated speculative activity without crashing the market.</p>
                    </div>
                  </div>

                  <div className="key-takeaway flex items-start">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">District Divergence</h3>
                      <p className="text-gray-700">Prime districts (9, 10, 11) outperformed with 12.5% growth, while OCR areas saw more modest 5.8% gains.</p>
                    </div>
                  </div>

                  <div className="key-takeaway flex items-start">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Investment Opportunity</h3>
                      <p className="text-gray-700">New launch condos in RCR districts offer optimal risk-reward profile for savvy investors in 2025.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Market Dynamics Section */}
            <section id="market-dynamics" className="section-padding">
              <div className="section-header mb-12">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🏗️</div>
                  <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900">Current Market Dynamics: Resilience Amid Shifting Tides</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full"></div>
              </div>

              <div className="prose-content">
                <p className="lead-paragraph text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                  The Singapore property market has demonstrated <span className="highlight font-semibold text-blue-600">remarkable resilience</span> 
                  in the face of global economic uncertainties and policy changes introduced by the government. 
                  Despite the challenges, we have witnessed sustained demand across various segments, driven by a combination of factors.
                </p>

                <div className="quick-stat-inline bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="stat-number text-4xl font-bold text-green-600">+8.2%</div>
                      <div className="stat-label text-gray-600">Year-over-Year Growth</div>
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  In the private residential market, the recent quarters have seen healthy sales volumes, particularly in the prime districts and new 
                  launch projects. The Millennials Market development in District 12 achieved remarkable success with over 85% units sold within 
                  the first weekend of launch, highlighting the continued appetite for well-located properties.
                </p>

                {/* Expandable Section */}
                <div className="expandable-section bg-gray-50 rounded-2xl p-6 mb-8">
                  <button className="expand-toggle flex items-center justify-between w-full text-left" data-target="market-details">
                    <h3 className="text-xl font-semibold text-gray-900">Detailed Market Analysis</h3>
                    <svg className="w-6 h-6 text-gray-500 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div id="market-details" className="expandable-content mt-4 hidden">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The strength in Singapore's property market can be attributed to several key factors. First, the limited land supply 
                      continues to underpin property values, with the government's measured approach to land releases maintaining scarcity. 
                      Second, Singapore's status as a regional financial hub has attracted significant foreign investment, particularly from 
                      neighboring countries experiencing political or economic uncertainty.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Supply Constraints</h4>
                        <p className="text-gray-600 text-sm">Government Land Sales programme remains conservative with only 12 sites released in H1 2025.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Foreign Investment</h4>
                        <p className="text-gray-600 text-sm">Non-resident purchases up 15% despite ABSD increases, showing confidence in long-term prospects.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pull Quote */}
                <blockquote className="pull-quote bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8 mb-8">
                  <div className="text-3xl md:text-4xl font-light italic leading-relaxed mb-4">
                    "Singapore's property market continues to defy global headwinds, supported by robust fundamentals and strategic policy management."
                  </div>
                  <footer className="text-blue-100">
                    — Property Insights Team Analysis
                  </footer>
                </blockquote>
              </div>
            </section>

            {/* Policy Impact Analysis */}
            <section id="policy-impact" className="section-padding">
              <div className="section-header mb-12">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">📊</div>
                  <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900">Policy Impact Analysis</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full"></div>
              </div>

              <div className="policy-timeline bg-white rounded-3xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">ABSD Evolution Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-red-500"></div>
                  <div className="space-y-6">
                    <div className="timeline-item relative pl-10">
                      <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2018</span>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900">Initial ABSD Introduction</h4>
                        <p className="text-gray-600 text-sm">Foreigners: 20%, Permanent Residents: 5%</p>
                      </div>
                    </div>
                    <div className="timeline-item relative pl-10">
                      <div className="absolute left-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2022</span>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900">First Major Increase</h4>
                        <p className="text-gray-600 text-sm">Foreigners: 30%, Permanent Residents: 17%</p>
                      </div>
                    </div>
                    <div className="timeline-item relative pl-10">
                      <div className="absolute left-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2024</span>
                      </div>
                      <div className="bg-red-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900">Latest Adjustment</h4>
                        <p className="text-gray-600 text-sm">Foreigners: 60%, Permanent Residents: 30%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="policy-card bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Positive Outcomes</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Reduced speculative foreign investment by 35%</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Improved housing affordability for locals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Maintained market stability during global uncertainty</span>
                    </li>
                  </ul>
                </div>

                <div className="policy-card bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Challenges</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Developer margins under pressure</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Reduced liquidity in luxury segment</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Potential talent attraction concerns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Segment Analysis */}
            <section id="segment-analysis" className="section-padding">
              <div className="section-header mb-12">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🏢</div>
                  <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900">Segment-by-Segment Analysis</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              </div>

              <div className="segment-cards grid lg:grid-cols-3 gap-8 mb-12">
                {/* HDB Segment */}
                <div className="segment-card bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h6m-6 4h6m-2 8h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">HDB Resale</h3>
                      <p className="text-blue-600 font-medium">Public Housing</p>
                    </div>
                  </div>
                  
                  <div className="stats-row flex justify-between items-center mb-6">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">+6.8%</div>
                      <div className="text-sm text-gray-600">Price Growth</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">18,450</div>
                      <div className="text-sm text-gray-600">Transactions</div>
                    </div>
                  </div>

                  <div className="quick-take bg-blue-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Take</h4>
                    <p className="text-blue-800 text-sm">Steady demand supported by government grants and upgrading trends in mature estates.</p>
                  </div>

                  <div className="segment-highlights">
                    <h5 className="font-semibold text-gray-900 mb-3">Key Highlights</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">4-room flats leading growth</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Mature estates outperforming</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Enhanced CPF grants boost demand</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Private Condo Segment */}
                <div className="segment-card bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Private Condos</h3>
                      <p className="text-green-600 font-medium">Premium Segment</p>
                    </div>
                  </div>
                  
                  <div className="stats-row flex justify-between items-center mb-6">
                    <div>
                      <div className="text-3xl font-bold text-green-600">+12.5%</div>
                      <div className="text-sm text-gray-600">Price Growth</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">8,750</div>
                      <div className="text-sm text-gray-600">Transactions</div>
                    </div>
                  </div>

                  <div className="quick-take bg-green-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-green-900 mb-2">💡 Quick Take</h4>
                    <p className="text-green-800 text-sm">New launches driving growth, particularly in RCR districts with strong connectivity.</p>
                  </div>

                  <div className="segment-highlights">
                    <h5 className="font-semibold text-gray-900 mb-3">Key Highlights</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">CCR leading price growth</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">New launch absorption 85%+</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Foreign buyer interest remains</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Landed Property Segment */}
                <div className="segment-card bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Landed Property</h3>
                      <p className="text-purple-600 font-medium">Ultra-Premium</p>
                    </div>
                  </div>
                  
                  <div className="stats-row flex justify-between items-center mb-6">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">+15.2%</div>
                      <div className="text-sm text-gray-600">Price Growth</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">2,180</div>
                      <div className="text-sm text-gray-600">Transactions</div>
                    </div>
                  </div>

                  <div className="quick-take bg-purple-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-purple-900 mb-2">💡 Quick Take</h4>
                    <p className="text-purple-800 text-sm">Supply scarcity driving strong appreciation in traditional good class bungalow areas.</p>
                  </div>

                  <div className="segment-highlights">
                    <h5 className="font-semibold text-gray-900 mb-3">Key Highlights</h5>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">GCB areas leading growth</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Record million-dollar transactions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Ultra-HNW demand strong</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Data Insights */}
            <section id="data-insights" className="section-padding">
              <div className="section-header mb-12">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">📈</div>
                  <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900">Interactive Data Insights</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              </div>

              {/* Chart Container */}
              <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Price Trends by Segment</h3>
                  <div className="chart-controls flex space-x-2">
                    <button className="chart-btn active bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">6M</button>
                    <button className="chart-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">1Y</button>
                    <button className="chart-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">3Y</button>
                  </div>
                </div>
                
                {/* Simplified Chart Representation */}
                <div className="chart-container h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 flex items-end justify-between">
                  <div className="chart-bar flex flex-col items-center">
                    <div className="w-12 bg-blue-500 rounded-t-lg mb-2" style={{height: '60%'}}></div>
                    <span className="text-sm text-gray-600">HDB</span>
                    <span className="text-sm font-bold text-blue-600">+6.8%</span>
                  </div>
                  <div className="chart-bar flex flex-col items-center">
                    <div className="w-12 bg-green-500 rounded-t-lg mb-2" style={{height: '80%'}}></div>
                    <span className="text-sm text-gray-600">Private</span>
                    <span className="text-sm font-bold text-green-600">+12.5%</span>
                  </div>
                  <div className="chart-bar flex flex-col items-center">
                    <div className="w-12 bg-purple-500 rounded-t-lg mb-2" style={{height: '95%'}}></div>
                    <span className="text-sm text-gray-600">Landed</span>
                    <span className="text-sm font-bold text-purple-600">+15.2%</span>
                  </div>
                  <div className="chart-bar flex flex-col items-center">
                    <div className="w-12 bg-orange-500 rounded-t-lg mb-2" style={{height: '40%'}}></div>
                    <span className="text-sm text-gray-600">Commercial</span>
                    <span className="text-sm font-bold text-orange-600">+3.1%</span>
                  </div>
                </div>

                <div className="chart-legend flex justify-center space-x-6 mt-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">HDB Resale</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Private Condos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Landed Properties</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Commercial</span>
                  </div>
                </div>
              </div>

              {/* District Heat Map */}
              <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">District Performance Heat Map</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {Array.from({length: 28}, (_, i) => {
                    const district = i + 1;
                    const performance = Math.random();
                    let bgColor = 'bg-gray-100';
                    let textColor = 'text-gray-600';
                    
                    if (performance > 0.8) {
                      bgColor = 'bg-red-500';
                      textColor = 'text-white';
                    } else if (performance > 0.6) {
                      bgColor = 'bg-orange-400';
                      textColor = 'text-white';
                    } else if (performance > 0.4) {
                      bgColor = 'bg-yellow-400';
                      textColor = 'text-gray-900';
                    } else if (performance > 0.2) {
                      bgColor = 'bg-green-400';
                      textColor = 'text-white';
                    }
                    
                    return (
                      <div key={district} className={`district-cell ${bgColor} ${textColor} aspect-square rounded-lg flex flex-col items-center justify-center p-2 hover:scale-110 transition-transform duration-200 cursor-pointer`}>
                        <div className="font-bold text-xs">{district}</div>
                        <div className="text-xs">{(performance * 20).toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-gray-600">Price Growth (YoY)</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">0%</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                      <div className="w-4 h-4 bg-orange-400 rounded"></div>
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                    </div>
                    <span className="text-xs text-gray-500">20%+</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Property Highlight Cards */}
            <section className="section-padding">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Featured Property Developments</h3>
              <div className="property-showcase grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                
                {/* Property Card 1 */}
                <div className="property-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="property-image h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      New Launch
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-2xl font-bold">The Landmark</div>
                      <div className="text-sm opacity-90">District 9 • 450 Units</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">From $2.8M</div>
                        <div className="text-sm text-gray-600">Starting Price</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">85%</div>
                        <div className="text-sm text-gray-600">Sold</div>
                      </div>
                    </div>
                    <div className="property-features">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Unit Mix</span>
                        <span>1-4 Bedrooms</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>TOP</span>
                        <span>Q2 2027</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>Developer</span>
                        <span>City Developments</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Property Card 2 */}
                <div className="property-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="property-image h-48 bg-gradient-to-br from-green-400 to-green-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Hot Selling
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-2xl font-bold">Marina Heights</div>
                      <div className="text-sm opacity-90">District 1 • 280 Units</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">From $3.5M</div>
                        <div className="text-sm text-gray-600">Starting Price</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">92%</div>
                        <div className="text-sm text-gray-600">Sold</div>
                      </div>
                    </div>
                    <div className="property-features">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Unit Mix</span>
                        <span>2-5 Bedrooms</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>TOP</span>
                        <span>Q4 2026</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>Developer</span>
                        <span>GuocolLand</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Property Card 3 */}
                <div className="property-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="property-image h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Coming Soon
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-2xl font-bold">Orchard Residences</div>
                      <div className="text-sm opacity-90">District 10 • 320 Units</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">From $4.2M</div>
                        <div className="text-sm text-gray-600">Est. Price</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">VIP</div>
                        <div className="text-sm text-gray-600">Preview</div>
                      </div>
                    </div>
                    <div className="property-features">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Unit Mix</span>
                        <span>2-4 Bedrooms</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Launch</span>
                        <span>Q1 2025</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>Developer</span>
                        <span>Capitaland</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                      Register Interest
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Investment Outlook & Risk Factors - Final sections */}
            <section id="investment-outlook" className="section-padding">
              <div className="section-header mb-12">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">💡</div>
                  <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900">Investment Outlook 2025</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full"></div>
              </div>

              <div className="outlook-grid grid md:grid-cols-2 gap-8 mb-12">
                <div className="outlook-card bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Strategic Opportunities</h3>
                  <div className="space-y-4">
                    <div className="opportunity-item bg-white rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2">RCR New Launches</h4>
                      <p className="text-gray-700 text-sm">Prime opportunity with upcoming MRT connectivity improvements.</p>
                    </div>
                    <div className="opportunity-item bg-white rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Mature Estate HDB</h4>
                      <p className="text-gray-700 text-sm">Solid rental yields and government upgrade programs support growth.</p>
                    </div>
                    <div className="opportunity-item bg-white rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Commercial REITs</h4>
                      <p className="text-gray-700 text-sm">Recovery play with improving office occupancy rates.</p>
                    </div>
                  </div>
                </div>

                <div className="outlook-card bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Market Projections</h3>
                  <div className="projections-grid grid grid-cols-2 gap-4">
                    <div className="projection-item text-center">
                      <div className="text-3xl font-bold text-blue-600">+5-8%</div>
                      <div className="text-sm text-gray-600">Overall Price Growth</div>
                    </div>
                    <div className="projection-item text-center">
                      <div className="text-3xl font-bold text-green-600">3.2-3.8%</div>
                      <div className="text-sm text-gray-600">Rental Yields</div>
                    </div>
                    <div className="projection-item text-center">
                      <div className="text-3xl font-bold text-orange-600">12-15</div>
                      <div className="text-sm text-gray-600">New Launches</div>
                    </div>
                    <div className="projection-item text-center">
                      <div className="text-3xl font-bold text-purple-600">18-22K</div>
                      <div className="text-sm text-gray-600">HDB Transactions</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="risk-factors" className="section-padding">
              <div className="section-header mb-12">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">⚠️</div>
                  <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900">Key Risk Factors</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"></div>
              </div>

              <div className="risk-assessment bg-white rounded-3xl p-8 shadow-lg">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="risk-category">
                    <div className="risk-header flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Economic Risks</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Global recession impact on demand</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Rising interest rates affecting affordability</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Employment market deterioration</span>
                      </li>
                    </ul>
                  </div>

                  <div className="risk-category">
                    <div className="risk-header flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Policy Risks</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Further ABSD increases</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">New supply release acceleration</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">LTV ratio tightening</span>
                      </li>
                    </ul>
                  </div>

                  <div className="risk-category">
                    <div className="risk-header flex items-center mb-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Market Risks</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Oversupply in certain segments</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Construction delays and cost inflation</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">Geopolitical tensions affecting investment</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter Signup & Related Articles */}
            <section className="section-padding">
              <div className="newsletter-cta bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl p-12 text-white text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Stay Ahead of the Market</h3>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Get exclusive property insights, market updates, and investment opportunities delivered weekly.
                </p>
                <div className="max-w-md mx-auto flex">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-1 px-6 py-4 rounded-l-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-r-2xl font-semibold hover:bg-gray-100 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-blue-200 mt-4">No spam. Unsubscribe anytime.</p>
              </div>

              <div className="related-articles">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Related Articles</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  
                  <article className="related-article bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="article-image h-48 bg-gradient-to-br from-indigo-400 to-purple-600 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm opacity-90 mb-2">MARKET ANALYSIS</div>
                        <h4 className="text-xl font-bold">Q3 2025 URA Data Analysis</h4>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        Deep dive into the latest URA quarterly data with segment-specific insights and forward-looking projections.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>5 min read</span>
                        <span className="mx-2">•</span>
                        <span>Sep 1, 2025</span>
                      </div>
                    </div>
                  </article>

                  <article className="related-article bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="article-image h-48 bg-gradient-to-br from-green-400 to-teal-600 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm opacity-90 mb-2">INVESTMENT GUIDE</div>
                        <h4 className="text-xl font-bold">New Launch Strategy 2025</h4>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        Strategic guide to evaluating and investing in Singapore's new condominium launches with risk assessment framework.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>8 min read</span>
                        <span className="mx-2">•</span>
                        <span>Aug 28, 2025</span>
                      </div>
                    </div>
                  </article>

                  <article className="related-article bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="article-image h-48 bg-gradient-to-br from-orange-400 to-red-600 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm opacity-90 mb-2">POLICY UPDATE</div>
                        <h4 className="text-xl font-bold">ABSD Impact Assessment</h4>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        Comprehensive analysis of the latest ABSD changes and their impact on different buyer segments and market dynamics.
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>6 min read</span>
                        <span className="mx-2">•</span>
                        <span>Aug 25, 2025</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* Custom Styles */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .stat-card {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .share-btn {
          backdrop-filter: blur(10px);
        }

        .section-padding {
          scroll-margin-top: 100px;
          margin-bottom: 4rem;
        }

        .section-title {
          line-height: 1.2;
        }

        .lead-paragraph {
          font-weight: 400;
          line-height: 1.7;
        }

        .highlight {
          position: relative;
        }

        .highlight::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #3B82F6, #10B981);
          opacity: 0.3;
          border-radius: 2px;
        }

        .key-takeaway {
          transition: transform 0.3s ease;
        }

        .key-takeaway:hover {
          transform: translateY(-2px);
        }

        .prose-content {
          max-width: none;
          line-height: 1.8;
        }

        .prose-content p {
          margin-bottom: 1.5rem;
        }

        .expandable-content {
          overflow: hidden;
          transition: max-height 0.5s ease-out;
        }

        .pull-quote {
          position: relative;
          overflow: hidden;
        }

        .pull-quote::before {
          content: '"';
          position: absolute;
          top: -20px;
          left: 20px;
          font-size: 8rem;
          opacity: 0.2;
          font-family: serif;
        }

        .toc-link.active {
          background-color: #EBF8FF;
          color: #2563EB;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .hero-title {
            font-size: clamp(2rem, 8vw, 4rem);
          }
        }

        /* Animation Classes */
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .counter {
          transition: all 0.3s ease;
        }

        /* Tooltip Styles */
        .tooltip {
          position: relative;
        }

        .tooltip-content {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #1F2937;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1000;
        }

        .tooltip-content::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #1F2937;
        }

        .tooltip:hover .tooltip-content {
          opacity: 1;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Reading Progress
          window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            document.getElementById('progress-bar').style.width = progress + '%';
            document.getElementById('toc-progress').style.width = progress + '%';
          });

          // Smooth Scroll for TOC Links
          document.querySelectorAll('.toc-link, .mobile-toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const target = document.querySelector(link.getAttribute('href'));
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              // Close mobile TOC if open
              document.getElementById('mobile-toc').classList.add('hidden');
              document.getElementById('mobile-toc-content').style.transform = 'translateY(100%)';
            });
          });

          // Active Section Highlighting
          const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
          };

          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Remove active class from all links
                document.querySelectorAll('.toc-link').forEach(link => {
                  link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(\`[href="#\${entry.target.id}"]\`);
                if (activeLink) {
                  activeLink.classList.add('active');
                }
              }
            });
          }, observerOptions);

          // Observe all sections
          document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
          });

          // Mobile TOC Toggle
          document.getElementById('mobile-toc-toggle').addEventListener('click', () => {
            const mobileToC = document.getElementById('mobile-toc');
            const mobileToCContent = document.getElementById('mobile-toc-content');
            
            mobileToC.classList.remove('hidden');
            setTimeout(() => {
              mobileToCContent.style.transform = 'translateY(0)';
            }, 10);
          });

          document.getElementById('mobile-toc-close').addEventListener('click', () => {
            const mobileToC = document.getElementById('mobile-toc');
            const mobileToCContent = document.getElementById('mobile-toc-content');
            
            mobileToCContent.style.transform = 'translateY(100%)';
            setTimeout(() => {
              mobileToC.classList.add('hidden');
            }, 300);
          });

          // Click outside to close mobile TOC
          document.getElementById('mobile-toc').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
              document.getElementById('mobile-toc-close').click();
            }
          });

          // Expandable Sections
          document.querySelectorAll('.expand-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
              const targetId = toggle.dataset.target;
              const content = document.getElementById(targetId);
              const icon = toggle.querySelector('svg');
              
              if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
              } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
              }
            });
          });

          // Fade in animations on scroll
          const fadeElements = document.querySelectorAll('.key-takeaway, .stat-card');
          const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
              }
            });
          }, { threshold: 0.1 });

          fadeElements.forEach(el => {
            fadeObserver.observe(el);
          });

          // Number counter animation
          function animateCounter(element, target) {
            let current = 0;
            const increment = target / 60; // 60 frames for smooth animation
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              element.textContent = Math.floor(current).toLocaleString();
            }, 16);
          }

          // Trigger counter animation when stat cards come into view
          const statNumbers = document.querySelectorAll('.stat-number');
          const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const text = entry.target.textContent;
                const numbers = text.match(/\\d+/g);
                if (numbers) {
                  const target = parseInt(numbers[0]);
                  if (target < 100) {
                    animateCounter(entry.target, target);
                  }
                }
              }
            });
          }, { threshold: 0.5 });

          statNumbers.forEach(stat => {
            if (stat.textContent.includes('%') || stat.textContent.match(/^\\d+$/)) {
              statObserver.observe(stat);
            }
          });

          // Share buttons functionality
          document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const text = btn.textContent.trim();
              const url = window.location.href;
              const title = document.title;
              
              if (text.includes('LinkedIn')) {
                window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`, '_blank', 'width=600,height=400');
              } else if (text.includes('WhatsApp')) {
                window.open(\`https://wa.me/?text=\${encodeURIComponent(title + ' ' + url)}\`, '_blank');
              } else {
                // Generic share
                if (navigator.share) {
                  navigator.share({
                    title: title,
                    url: url
                  });
                } else {
                  // Fallback - copy to clipboard
                  navigator.clipboard.writeText(url).then(() => {
                    btn.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="5 13l4 4L19 7"></path></svg>Copied!';
                    setTimeout(() => {
                      btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>';
                    }, 2000);
                  });
                }
              }
            });
          });

          // Chart Controls Functionality
          document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              // Remove active class from all buttons
              document.querySelectorAll('.chart-btn').forEach(b => {
                b.classList.remove('active', 'bg-blue-600', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
              });
              
              // Add active class to clicked button
              btn.classList.add('active', 'bg-blue-600', 'text-white');
              btn.classList.remove('bg-gray-200', 'text-gray-700');
              
              // Animate chart bars (simple example)
              const chartBars = document.querySelectorAll('.chart-bar > div');
              chartBars.forEach(bar => {
                bar.style.transform = 'scaleY(0)';
                setTimeout(() => {
                  bar.style.transition = 'transform 0.8s ease-out';
                  bar.style.transform = 'scaleY(1)';
                }, 100);
              });
            });
          });

          // District Heat Map Tooltips
          document.querySelectorAll('.district-cell').forEach(cell => {
            const district = cell.querySelector('div').textContent;
            const growth = cell.querySelector('div:last-child').textContent;
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none opacity-0 transition-opacity duration-200 z-50';
            tooltip.innerHTML = \`District \${district}<br/>Growth: \${growth}\`;
            cell.style.position = 'relative';
            cell.appendChild(tooltip);
            
            cell.addEventListener('mouseenter', () => {
              tooltip.style.opacity = '1';
              tooltip.style.transform = 'translateY(-100%) translateX(-50%)';
              tooltip.style.left = '50%';
              tooltip.style.bottom = '100%';
            });
            
            cell.addEventListener('mouseleave', () => {
              tooltip.style.opacity = '0';
            });
          });

          // Newsletter Signup
          const newsletterBtn = document.querySelector('.newsletter-cta button');
          const newsletterInput = document.querySelector('.newsletter-cta input');
          
          if (newsletterBtn && newsletterInput) {
            newsletterBtn.addEventListener('click', (e) => {
              e.preventDefault();
              const email = newsletterInput.value;
              
              if (email && email.includes('@')) {
                // Simulate successful signup
                newsletterBtn.innerHTML = '✓ Subscribed!';
                newsletterBtn.style.backgroundColor = '#10b981';
                newsletterInput.value = '';
                
                setTimeout(() => {
                  newsletterBtn.innerHTML = 'Subscribe';
                  newsletterBtn.style.backgroundColor = '';
                }, 3000);
              } else {
                // Show validation error
                newsletterInput.style.borderColor = '#ef4444';
                newsletterInput.placeholder = 'Please enter a valid email';
                
                setTimeout(() => {
                  newsletterInput.style.borderColor = '';
                  newsletterInput.placeholder = 'Your email address';
                }, 2000);
              }
            });
          }

          // Analytics Tracking (placeholder)
          function trackEvent(category, action, label) {
            console.log(\`Analytics: \${category} - \${action} - \${label}\`);
          }

          // Track scroll depth
          let maxScroll = 0;
          window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
              maxScroll = scrollPercent;
              if (maxScroll % 25 === 0) {
                trackEvent('Engagement', 'Scroll Depth', \`\${maxScroll}%\`);
              }
            }
          });

          console.log('🚀 World-class article page initialized successfully!');
        `
      }} />
    </>
  )
}