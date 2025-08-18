import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Singapore Property Hub | Property Enthusiasts Sharing Insights',
  description: 'Learn about Singapore Property Hub - passionate property enthusiasts helping buyers make informed decisions in Singapore\'s real estate market.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Singapore Property Hub
            </h1>
            <p className="text-xl text-gray-600">
              Passionate property enthusiasts sharing insights to help you make informed decisions
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  We are a group of passionate property enthusiasts in Singapore who love sharing insights, analysis, and guidance to help fellow Singaporeans navigate the property market with confidence. Our mission is to democratize property knowledge and make expert insights accessible to everyone.
                </p>
                <p className="text-gray-600">
                  Through in-depth analysis, honest reviews, and data-driven insights, we aim to help buyers make informed decisions in Singapore's dynamic real estate market. We're not agents - we're enthusiasts who genuinely want to help.
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </div>
                    <p className="ml-3 text-gray-700">Daily new launch reviews and analysis</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </div>
                    <p className="ml-3 text-gray-700">Unbiased market insights and trends</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </div>
                    <p className="ml-3 text-gray-700">Honest pros & cons assessments</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      ✓
                    </div>
                    <p className="ml-3 text-gray-700">Educational buying guides and tips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Why Choose Singapore Property Hub?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold mb-3">Extensive Portfolio</h3>
                <p className="text-gray-600">
                  Access thousands of properties across Singapore, from luxury condos to commercial shophouses, all in one platform.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">Market Intelligence</h3>
                <p className="text-gray-600">
                  Stay ahead with AI-powered market analysis, price trends, and investment insights tailored to your needs.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
                <p className="text-gray-600">
                  Our team of experienced property consultants provides personalized guidance throughout your property journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Focus Areas */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Expertise
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Residential Properties</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Luxury Condominiums</li>
                  <li>• Executive Condominiums (EC)</li>
                  <li>• Landed Properties</li>
                  <li>• HDB Resale Flats</li>
                </ul>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Commercial Properties</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Shophouses</li>
                  <li>• Office Spaces</li>
                  <li>• Retail Units</li>
                  <li>• Industrial Properties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Let our experts help you navigate Singapore's property market with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}