import { Metadata } from 'next'
import Link from 'next/link'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'

export const metadata: Metadata = {
  title: 'Singapore Property Market Outlook 2024: What Buyers Need to Know | Singapore Property Hub',
  description: 'Comprehensive analysis of the Singapore property market trends, government policies, and investment opportunities for 2024.',
}

export default function Article() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop"
          alt="Singapore Property Market"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
            <div className="max-w-4xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">
                  Market Insights
                </span>
                <span className="text-blue-200">8 min read</span>
                <span className="text-blue-200">August 15, 2024</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Singapore Property Market Outlook 2024: What Buyers Need to Know
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-lg">Sarah Chen</h3>
                  <p className="text-gray-600 text-sm">Senior Property Market Analyst</p>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <p>The Singapore property market in 2024 presents a complex landscape of opportunities and challenges for both investors and homebuyers. With evolving government policies, changing market dynamics, and global economic uncertainties, understanding the current trends is crucial for making informed decisions.</p>

                <h2>Market Overview</h2>
                <p>Despite cooling measures and interest rate hikes, Singapore's property market has shown resilience throughout 2024. Private residential prices have stabilized, while HDB resale prices continue their upward trajectory, albeit at a slower pace.</p>

                <h2>Key Trends Shaping 2024</h2>
                <ul>
                  <li><strong>Cooling Measures Impact:</strong> The latest round of cooling measures has created a more balanced market</li>
                  <li><strong>Interest Rate Environment:</strong> Rising rates are affecting affordability and investment decisions</li>
                  <li><strong>Supply Pipeline:</strong> Increased upcoming supply in certain segments</li>
                  <li><strong>Foreign Investment:</strong> Continued interest from international buyers despite higher ABSD rates</li>
                </ul>

                <h2>Investment Opportunities</h2>
                <p>For savvy investors, 2024 offers selective opportunities in emerging districts and well-located resale properties. The key is identifying areas with strong fundamentals and growth potential.</p>

                <h2>Buyer's Strategy</h2>
                <p>First-time homebuyers should focus on affordability and long-term value. With the current market conditions, patient buyers may find better negotiating power and more options to choose from.</p>

                <p><em>This article provides general market insights. For personalized advice, consult with our property experts.</em></p>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">#MarketOutlook</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">#PropertyTrends</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">#Investment</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Contact Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Need Property Advice?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get personalized recommendations from our experts.
                  </p>
                  <LeadCaptureForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Articles */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </section>
    </div>
  )
}