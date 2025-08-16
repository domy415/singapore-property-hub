export default function FeaturedProperties() {
  const featuredProperties = [
    {
      id: 1,
      title: "Luxury Condo in Orchard Road",
      price: "S$2,800,000",
      beds: 3,
      baths: 2,
      area: "1,200 sq ft",
      image: "/api/placeholder/400/300",
      district: "District 9"
    },
    {
      id: 2,
      title: "Modern Shophouse in Chinatown",
      price: "S$4,500,000",
      beds: 4,
      baths: 3,
      area: "2,100 sq ft",
      image: "/api/placeholder/400/300",
      district: "District 1"
    },
    {
      id: 3,
      title: "Landed Terrace in Bukit Timah",
      price: "S$6,200,000",
      beds: 5,
      baths: 4,
      area: "3,500 sq ft",
      image: "/api/placeholder/400/300",
      district: "District 11"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties across Singapore's most sought-after districts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-300 relative">
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {property.district}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-4">{property.price}</p>
                <div className="flex justify-between text-gray-600 text-sm mb-4">
                  <span>{property.beds} beds</span>
                  <span>{property.baths} baths</span>
                  <span>{property.area}</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="/properties" className="btn-primary inline-block">
            View All Properties
          </a>
        </div>
      </div>
    </section>
  )
}