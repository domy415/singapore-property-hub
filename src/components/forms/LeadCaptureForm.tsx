 export default function LeadCaptureForm() {
    return (
      <form className="bg-white p-6 rounded-lg shadow-lg border max-w-lg mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">Get Expert Property Advice</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="+65 9123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Interest
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="">Select type</option>
              <option value="condo">Condominium</option>
              <option value="landed">Landed Property</option>
              <option value="hdb">HDB Resale</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tell us about your property needs
          </label>
          <textarea
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Budget, preferred location, timeline, or any specific requirements..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
        >
          Get Free Consultation
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          * We respect your privacy and will never share your information.
        </p>
      </form>
    )
  }
