interface Amenity {
  name: string
  icon: React.ReactNode
  count?: number
  description: string
}

interface LifestyleAmenitiesProps {
  amenities: Amenity[]
  className?: string
}

export default function LifestyleAmenities({ amenities, className = "" }: LifestyleAmenitiesProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Lifestyle & Amenities
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="group">
              <div className="bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-md">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                      {amenity.icon}
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-primary text-sm mb-1">{amenity.name}</h4>
                  
                  {amenity.count && (
                    <div className="text-xs text-blue-600 font-medium mb-2">
                      {amenity.count}+ locations
                    </div>
                  )}
                  
                  <p className="text-xs text-secondary leading-relaxed">{amenity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lifestyle Score */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="text-center">
            <h4 className="text-lg font-bold text-primary mb-2">Lifestyle Score</h4>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="text-4xl font-bold text-blue-600">8.7</div>
              <div className="text-secondary">/ 10</div>
            </div>
            
            {/* Score Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">Dining</div>
                <div className="text-green-700 font-bold">9.2</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">Shopping</div>
                <div className="text-blue-700 font-bold">8.5</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">Entertainment</div>
                <div className="text-purple-700 font-bold">8.1</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">Recreation</div>
                <div className="text-orange-700 font-bold">9.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}