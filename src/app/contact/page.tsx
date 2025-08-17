import { Metadata } from 'next'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'

export const metadata: Metadata = {
  title: 'Contact Singapore Property Hub | Get Expert Property Advice',
  description: 'Contact our property experts for personalized guidance on Singapore real estate. We\'re here to help with condos, landed properties, and commercial investments.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              Our property experts are ready to help you find your perfect property in Singapore
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and our property consultants will get back to you within 24 hours with personalized recommendations.
                </p>
                <LeadCaptureForm />
              </div>

              {/* Contact Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
                
                <div className="space-y-6">
                  {/* Office */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="text-2xl mr-3">🏢</span>
                      Office Location
                    </h3>
                    <p className="text-gray-600">
                      Singapore Property Hub<br />
                      1 Raffles Place<br />
                      One Raffles Place Tower 2<br />
                      Singapore 048616
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="text-2xl mr-3">📱</span>
                      Phone & WhatsApp
                    </h3>
                    <p className="text-gray-600">
                      <a href="tel:+6561234567" className="text-blue-600 hover:underline">
                        +65 6123 4567
                      </a><br />
                      <span className="text-sm">Mon-Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 4:00 PM</span>
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <span className="text-2xl mr-3">📧</span>
                      Email
                    </h3>
                    <p className="text-gray-600">
                      General Inquiries:<br />
                      <a href="mailto:info@singaporepropertyhub.sg" className="text-blue-600 hover:underline">
                        info@singaporepropertyhub.sg
                      </a><br /><br />
                      Property Listings:<br />
                      <a href="mailto:listings@singaporepropertyhub.sg" className="text-blue-600 hover:underline">
                        listings@singaporepropertyhub.sg
                      </a>
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
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a
                        href="https://facebook.com/singaporepropertyhub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com/singaporepropertyhub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
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

      {/* Map Section (Optional) */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
            <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Map integration coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">What types of properties do you specialize in?</h3>
                <p className="text-gray-600">
                  We specialize in condominiums, landed properties, HDB resale flats, and commercial properties including shophouses across Singapore.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">How quickly will I receive a response?</h3>
                <p className="text-gray-600">
                  Our team typically responds within 24 hours. For urgent inquiries, please call us directly at +65 6123 4567.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Do you charge any fees for your services?</h3>
                <p className="text-gray-600">
                  Our property consultation and recommendation services are free for buyers. We earn commissions from successful transactions.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Can you help with property financing?</h3>
                <p className="text-gray-600">
                  Yes, we work with trusted mortgage brokers and can help you secure the best financing options for your property purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}