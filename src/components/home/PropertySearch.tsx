export default function PropertySearch() {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Property</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search thousands of properties across Singapore.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg">
                  <option>All Types</option>
                  <option>Condominium</option>
                  <option>Landed Property</option>
                  <option>HDB Resale</option>
                  <option>Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg">
                  <option>All Districts</option>
                  <option>District 1 (Boat Quay)</option>
                  <option>District 9 (Orchard)</option>
                  <option>District 10 (Bukit Timah)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg">
                  <option>Any Price</option>
                  <option>Under S$1M</option>
                  <option>S$1M - S$2M</option>
                  <option>S$2M - S$5M</option>
                  <option>Above S$5M</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg">
                  <option>Any</option>
                  <option>1 Bedroom</option>
                  <option>2 Bedrooms</option>
                  <option>3 Bedrooms</option>
                  <option>4+ Bedrooms</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by location or keyword..."
                className="flex-1 p-3 border border-gray-300 rounded-lg"
              />
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold">
                Search Properties
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }
