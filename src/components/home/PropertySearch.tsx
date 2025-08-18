export default function PropertySearch() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Property</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search thousands of properties across Singapore with our advanced filtering system.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Types</option>
                <option>Condominium</option>
                <option>Landed Property</option>
                <option>HDB Resale</option>
                <option>Commercial</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Districts</option>
                <optgroup label="Core Central Region (CCR)">
                  <option value="D01">D01 - Raffles Place, Cecil, Marina</option>
                  <option value="D02">D02 - Anson Road, Tanjong Pagar</option>
                  <option value="D06">D06 - High Street, Beach Road</option>
                  <option value="D07">D07 - Middle Road, Golden Mile</option>
                  <option value="D08">D08 - Little India, Farrer Park</option>
                  <option value="D09">D09 - Orchard, Cairnhill, River Valley</option>
                  <option value="D10">D10 - Ardmore, Bukit Timah, Holland Road, Tanglin</option>
                  <option value="D11">D11 - Watten Estate, Novena, Thomson</option>
                </optgroup>
                <optgroup label="Rest of Central Region (RCR)">
                  <option value="D03">D03 - Bukit Merah, Queenstown, Tiong Bahru</option>
                  <option value="D04">D04 - Telok Blangah, HarbourFront</option>
                  <option value="D05">D05 - Pasir Panjang, Hong Leong Garden, Clementi</option>
                  <option value="D12">D12 - Balestier, Toa Payoh, Serangoon</option>
                  <option value="D13">D13 - Macpherson, Braddell, Potong Pasir</option>
                  <option value="D14">D14 - Geylang, Eunos, Aljunied</option>
                  <option value="D15">D15 - Katong, Joo Chiat, Amber Road</option>
                  <option value="D16">D16 - Bedok, Upper East Coast, Eastwood</option>
                  <option value="D17">D17 - Loyang, Changi</option>
                  <option value="D18">D18 - Tampines, Pasir Ris</option>
                  <option value="D19">D19 - Serangoon Garden, Hougang, Punggol</option>
                  <option value="D20">D20 - Bishan, Ang Mo Kio</option>
                  <option value="D21">D21 - Upper Bukit Timah, Clementi Park</option>
                </optgroup>
                <optgroup label="Outside Central Region (OCR)">
                  <option value="D22">D22 - Jurong, Tuas</option>
                  <option value="D23">D23 - Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang</option>
                  <option value="D24">D24 - Lim Chu Kang, Tengah</option>
                  <option value="D25">D25 - Kranji, Woodlands</option>
                  <option value="D26">D26 - Upper Thomson, Springleaf</option>
                  <option value="D27">D27 - Yishun, Sembawang</option>
                  <option value="D28">D28 - Seletar, Sengkang</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Any Price</option>
                <option>Under S$1M</option>
                <option>S$1M - S$2M</option>
                <option>S$2M - S$5M</option>
                <option>Above S$5M</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Any</option>
                <option>1 Bedroom</option>
                <option>2 Bedrooms</option>
                <option>3 Bedrooms</option>
                <option>4+ Bedrooms</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Search by location, property name, or keyword..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Search Properties
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}