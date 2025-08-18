import Hero from '@/components/home/Hero'
import LatestArticles from '@/components/home/LatestArticles'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Singapore Property Hub - Expert Property Guides & Market Insights',
  description: 'Your trusted source for Singapore property market insights, buying guides, investment tips, and expert real estate advice. Get the latest property trends and analysis.',
  keywords: 'Singapore property, real estate Singapore, property investment, buying guide, market insights, property trends',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg',
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Market Insights Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Singapore Property Market Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay ahead with expert analysis, market trends, and data-driven insights about Singapore's dynamic property landscape.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Trends</h3>
              <p className="text-gray-600">Latest property price movements, supply dynamics, and future projections for all districts.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Investment Guide</h3>
              <p className="text-gray-600">Expert strategies for property investment, ROI calculations, and portfolio building.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Buying Tips</h3>
              <p className="text-gray-600">Step-by-step guides for first-time buyers and seasoned investors alike.</p>
            </div>
          </div>
        </div>
      </section>

      <LatestArticles />
      <WhyChooseUs />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Expert Property Advice</h2>
            <p className="text-gray-600 mb-8">
              Whether you're buying your first home or expanding your investment portfolio, our experts provide personalized guidance tailored to your needs.
            </p>
            <LeadCaptureForm />
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your Trusted Singapore Property Resource</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Singapore Property Hub is your comprehensive guide to navigating Singapore's dynamic real estate market. 
                From understanding the latest cooling measures to identifying emerging property hotspots, we provide 
                data-driven insights that empower your property decisions.
              </p>
              <p className="text-gray-600 mb-4">
                Our expert team analyzes market trends across all 28 districts, from the Core Central Region (CCR) 
                to the Outside Central Region (OCR), bringing you actionable intelligence on property prices, rental 
                yields, and investment opportunities.
              </p>
              <p className="text-gray-600">
                Whether you're exploring condominiums in Orchard, landed properties in Bukit Timah, or HDB options 
                in mature estates, our comprehensive guides and market analysis help you make informed decisions 
                aligned with your property goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}