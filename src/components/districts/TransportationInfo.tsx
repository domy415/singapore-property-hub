interface MRTStation {
  name: string
  line: string
  distance: string
  walkingTime: string
}

interface BusService {
  number: string
  description: string
  frequency: string
}

interface TransportationInfoProps {
  mrtStations: MRTStation[]
  busServices: BusService[]
  highways: string[]
  className?: string
}

export default function TransportationInfo({ 
  mrtStations, 
  busServices, 
  highways, 
  className = "" 
}: TransportationInfoProps) {
  const getLineColor = (line: string) => {
    const colors = {
      'North-South': 'bg-red-500',
      'East-West': 'bg-green-500',
      'Circle': 'bg-yellow-500',
      'Downtown': 'bg-blue-500',
      'Thomson-East Coast': 'bg-orange-500',
      'North East': 'bg-purple-500'
    }
    return colors[line as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Transportation
        </h3>
      </div>

      <div className="p-6">
        {/* MRT Stations */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            MRT Stations
          </h4>
          
          <div className="space-y-3">
            {mrtStations.map((station, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getLineColor(station.line)}`}></div>
                    <div>
                      <h5 className="font-semibold text-primary">{station.name}</h5>
                      <p className="text-sm text-secondary">{station.line} Line</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{station.distance}</div>
                    <div className="text-sm text-secondary">{station.walkingTime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bus Services */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Bus Services
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {busServices.map((bus, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {bus.number}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-primary font-medium">{bus.description}</p>
                    <p className="text-xs text-secondary">Every {bus.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highways & Expressways */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Major Highways
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {highways.map((highway, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium border border-green-200">
                {highway}
              </span>
            ))}
          </div>
        </div>

        {/* Transportation Score */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
          <div className="text-center">
            <h4 className="text-lg font-bold text-primary mb-2">Transportation Score</h4>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="text-4xl font-bold text-orange-600">9.1</div>
              <div className="text-secondary">/ 10</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-red-600">MRT Access</div>
                <div className="text-red-700 font-bold">9.5</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">Bus Network</div>
                <div className="text-blue-700 font-bold">8.8</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">Car Access</div>
                <div className="text-green-700 font-bold">9.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Destinations */}
        <div className="mt-6">
          <h4 className="text-lg font-bold text-primary mb-4">Key Destinations</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">CBD</div>
              <div className="text-blue-600 font-bold">15 mins</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">Airport</div>
              <div className="text-blue-600 font-bold">25 mins</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">Orchard</div>
              <div className="text-blue-600 font-bold">12 mins</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">Marina Bay</div>
              <div className="text-blue-600 font-bold">18 mins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}