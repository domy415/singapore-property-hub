export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Dream Property in Singapore
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Expert insights on condominiums, landed properties, and commercial shophouses. 
          Get the best deals with Singapore's premier property portal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/properties" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Browse Properties
          </a>
          <a href="/contact" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Get Expert Advice
          </a>
        </div>
      </div>
    </section>
  )
}