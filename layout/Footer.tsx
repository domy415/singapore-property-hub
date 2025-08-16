export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Singapore Property Hub</h3>
            <p className="text-gray-400">
              Your trusted partner for Singapore real estate. Expert insights, premium listings, and personalized service.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/properties?type=condo" className="hover:text-white">Condominiums</a></li>
              <li><a href="/properties?type=landed" className="hover:text-white">Landed Properties</a></li>
              <li><a href="/properties?type=hdb" className="hover:text-white">HDB Resale</a></li>
              <li><a href="/properties?type=commercial" className="hover:text-white">Commercial Shophouses</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/articles" className="hover:text-white">Market Insights</a></li>
              <li><a href="/articles?category=buying-guide" className="hover:text-white">Buying Guide</a></li>
              <li><a href="/articles?category=investment" className="hover:text-white">Investment Tips</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 expert@singaporepropertyhub.sg</p>
              <p>📞 +65 9123 4567</p>
              <p>📍 Singapore, Central Business District</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Singapore Property Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}