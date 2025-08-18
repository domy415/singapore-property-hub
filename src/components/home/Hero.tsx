export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Trusted Singapore Property Expert
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Expert market insights, buying guides, and investment strategies for Singapore's dynamic real estate landscape. 
          Make informed property decisions with data-driven analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/articles" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Explore Property Guides
          </a>
          <a href="/contact" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Get Expert Consultation
          </a>
        </div>
      </div>
    </section>
  )
}