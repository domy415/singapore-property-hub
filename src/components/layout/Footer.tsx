export default function Footer() {
  return (
    <footer className="bg-navy text-on-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">SP</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Singapore Property Hub</h3>
                <p className="text-white opacity-90 text-sm">Property Enthusiasts Sharing Insights</p>
              </div>
            </div>
            <p className="text-white opacity-80 mb-6 max-w-md">
              Passionate property enthusiasts sharing honest insights, reviews, and analysis to help 
              fellow Singaporeans make informed real estate decisions.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/singaporepropertyhub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Content Categories</h4>
            <ul className="space-y-3 text-white opacity-80">
              <li><a href="/articles?category=new-launches" className="hover:opacity-100 transition-opacity">New Launches</a></li>
              <li><a href="/articles?category=market-analysis" className="hover:opacity-100 transition-opacity">Market Analysis</a></li>
              <li><a href="/articles?category=investment" className="hover:opacity-100 transition-opacity">Investment Insights</a></li>
              <li><a href="/articles?category=location-guides" className="hover:opacity-100 transition-opacity">Location Guides</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Resources</h4>
            <ul className="space-y-3 text-white opacity-80">
              <li><a href="/articles" className="hover:opacity-100 transition-opacity">Market Insights</a></li>
              <li><a href="/articles?category=buying-guide" className="hover:opacity-100 transition-opacity">Buying Guide</a></li>
              <li><a href="/articles?category=investment" className="hover:opacity-100 transition-opacity">Investment Tips</a></li>
              <li><a href="/about" className="hover:opacity-100 transition-opacity">About Us</a></li>
              <li><a href="/contact" className="hover:opacity-100 transition-opacity">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-12 pt-8">
          {/* CEA License & Disclaimer */}
          <div className="mb-6 p-4 bg-white bg-opacity-10 rounded-lg">
            <p className="text-white opacity-90 text-sm mb-2">
              <strong>Important Disclaimer:</strong> Singapore Property Hub is operated by property enthusiasts for educational and informational purposes only.
            </p>
            <p className="text-white opacity-90 text-sm mb-2">
              We are <strong>not licensed real estate agents</strong>. All content, reviews, and analysis are based on publicly available information and personal opinions. 
              For professional property advice, please consult a licensed real estate salesperson.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white opacity-80 text-sm">
              <p>&copy; 2025 Singapore Property Hub. All rights reserved.</p>
              <p className="mt-1">Educational content by property enthusiasts, not licensed agents.</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-white opacity-80 hover:opacity-100 text-sm transition-opacity">Privacy Policy</a>
              <a href="/terms" className="text-white opacity-80 hover:opacity-100 text-sm transition-opacity">Terms of Service</a>
              <a href="/sitemap.xml" className="text-white opacity-80 hover:opacity-100 text-sm transition-opacity">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}