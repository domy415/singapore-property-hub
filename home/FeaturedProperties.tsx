export default function FeaturedProperties() {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover premium properties across Singapore's most sought-after districts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Luxury Condo in Orchard</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">S$2,800,000</p>
                <div className="flex justify-between text-gray-600 text-sm mb-4">
                  <span>3 beds</span>
                  <span>2 baths</span>
                  <span>1,200 sq ft</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Shophouse in Chinatown</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">S$4,500,000</p>
                <div className="flex justify-between text-gray-600 text-sm mb-4">
                  <span>4 beds</span>
                  <span>3 baths</span>
                  <span>2,100 sq ft</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Landed in Bukit Timah</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">S$6,200,000</p>
                <div className="flex justify-between text-gray-600 text-sm mb-4">
                  <span>5 beds</span>
                  <span>4 baths</span>
                  <span>3,500 sq ft</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
