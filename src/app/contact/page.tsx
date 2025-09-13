import { Metadata } from 'next'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'

export const metadata: Metadata = {
  title: 'Contact Singapore Property Hub | Connect with Property Enthusiasts',
  description: 'Reach out to our property enthusiasts for insights and guidance on Singapore real estate. We\'re here to help you make informed property decisions.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              We'd love to hear from you and help with any property questions or insights you need
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you within 24 hours with insights and helpful guidance.
                </p>
                <LeadCaptureForm />
              </div>

              {/* Contact Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Reach Us</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="text-2xl mr-3">📧</span>
                      Email Us
                    </h3>
                    <p className="text-gray-600">
                      We'd love to hear from you!<br />
                      <a href="mailto:hello@singaporepropertyhub.sg" className="text-blue-600 hover:underline">
                        hello@singaporepropertyhub.sg
                      </a><br /><br />
                      <span className="text-sm">We typically respond within 24 hours</span>
                    </p>
                  </div>

                  {/* About Our Team */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="text-2xl mr-3">👥</span>
                      Our Community
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We're a community of property enthusiasts who are passionate about sharing knowledge and helping fellow Singaporeans make informed property decisions. While we don't have a physical office, we're always here to help via email with insights, analysis, and guidance.
                    </p>
                  </div>

                  {/* Social Media */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a
                        href="https://linkedin.com/company/singapore-property-hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a
                        href="https://facebook.com/singaporepropertyhub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com/singaporepropertyhub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">What kind of insights do you provide?</h3>
                <p className="text-gray-600">
                  We share analysis on new launch condos, market trends, buying guides, developer profiles, and location deep dives. We focus on honest, unbiased insights to help you make informed decisions.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Are you property agents?</h3>
                <p className="text-gray-600">
                  No, we're not agents. We're property enthusiasts in Singapore who love sharing knowledge and analysis. We don't earn commissions or sell properties - we just want to help fellow Singaporeans make informed decisions.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">How quickly will I receive a response?</h3>
                <p className="text-gray-600">
                  We typically respond to emails within 24 hours. We love hearing from fellow property enthusiasts and are happy to share insights and guidance.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Can you recommend specific properties to buy?</h3>
                <p className="text-gray-600">
                  We share analysis and insights about different developments and market trends, but we don't make specific investment recommendations. Our goal is to provide you with the information you need to make your own informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}