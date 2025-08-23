import Link from 'next/link'

export const metadata = {
  title: 'Property Tools & Calculators - Singapore Property Hub',
  description: 'Essential property tools and calculators for Singapore property investors and buyers. Calculate affordability, rental yield, and more.',
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <div className="gradient-bg text-on-dark">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Property Tools & Calculators</h1>
            <p className="text-xl text-white opacity-90 leading-relaxed">
              Essential tools and calculators to help you make informed property investment decisions in Singapore.
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Affordability Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Affordability Calculator</h3>
            <p className="text-secondary mb-4">Calculate how much property you can afford based on your income and financial situation.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">Coming Soon</p>
            </div>
            <button disabled className="w-full bg-gray-300 text-secondary py-2 px-4 rounded-lg font-medium cursor-not-allowed">
              Launch Calculator
            </button>
          </div>

          {/* Rental Yield Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Rental Yield Calculator</h3>
            <p className="text-secondary mb-4">Calculate potential rental returns and investment yields for your property investment.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">Coming Soon</p>
            </div>
            <button disabled className="w-full bg-gray-300 text-secondary py-2 px-4 rounded-lg font-medium cursor-not-allowed">
              Launch Calculator
            </button>
          </div>

          {/* Loan Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Mortgage Calculator</h3>
            <p className="text-secondary mb-4">Calculate monthly mortgage payments, interest costs, and loan comparisons.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">Coming Soon</p>
            </div>
            <button disabled className="w-full bg-gray-300 text-secondary py-2 px-4 rounded-lg font-medium cursor-not-allowed">
              Launch Calculator
            </button>
          </div>

          {/* ABSD Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">ABSD Calculator</h3>
            <p className="text-secondary mb-4">Calculate Additional Buyer's Stamp Duty (ABSD) for your property purchase.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">Coming Soon</p>
            </div>
            <button disabled className="w-full bg-gray-300 text-secondary py-2 px-4 rounded-lg font-medium cursor-not-allowed">
              Launch Calculator
            </button>
          </div>

          {/* Property Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Property Comparison</h3>
            <p className="text-secondary mb-4">Compare multiple properties side-by-side with key metrics and features.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">Coming Soon</p>
            </div>
            <button disabled className="w-full bg-gray-300 text-secondary py-2 px-4 rounded-lg font-medium cursor-not-allowed">
              Launch Tool
            </button>
          </div>

          {/* Investment Analyzer */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Investment Analyzer</h3>
            <p className="text-secondary mb-4">Comprehensive analysis tool for property investment potential and returns.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">Coming Soon</p>
            </div>
            <button disabled className="w-full bg-gray-300 text-secondary py-2 px-4 rounded-lg font-medium cursor-not-allowed">
              Launch Analyzer
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Need Personalized Analysis?</h2>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">
            While our tools are under development, our property experts can provide personalized calculations and analysis for your specific situation.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Expert Analysis
          </Link>
        </div>
      </div>
    </div>
  )
}