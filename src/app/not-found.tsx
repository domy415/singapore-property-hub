import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-6">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-secondary mb-4">404</h1>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-secondary mb-6 leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
            <Link 
              href="/condos"
              className="inline-block border-2 border-gray-300 text-primary px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:text-blue-600 transition-colors"
            >
              Browse Condos
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-secondary mb-4">Looking for something specific? Try these popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/articles" className="text-blue-600 hover:text-blue-700 transition-colors">
                Latest Articles
              </Link>
              <Link href="/condos" className="text-blue-600 hover:text-blue-700 transition-colors">
                Condo Reviews
              </Link>
              <Link href="/tools" className="text-blue-600 hover:text-blue-700 transition-colors">
                Property Tools
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-primary mb-2">Can't find what you're looking for?</h3>
            <p className="text-secondary mb-4">Get in touch with our team for personalized property advice and information.</p>
            <Link 
              href="/contact"
              className="inline-block bg-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}