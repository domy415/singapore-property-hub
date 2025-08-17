export default function WhyChooseUs() {
  const features = [
    {
      icon: "🏠",
      title: "Expert Market Knowledge",
      description: "20+ years of experience in Singapore's property market with deep insights into every district and development."
    },
    {
      icon: "💰",
      title: "Best Price Guarantee",
      description: "We negotiate the best deals for our clients and ensure you get maximum value for your investment."
    },
    {
      icon: "⚡",
      title: "Fast & Efficient Service",
      description: "Quick property searches, instant responses, and streamlined processes to save you time."
    },
    {
      icon: "📊",
      title: "Data-Driven Insights",
      description: "Advanced analytics and market data to help you make informed property investment decisions."
    },
    {
      icon: "🤝",
      title: "Personalized Support",
      description: "Dedicated property consultants who understand your unique needs and preferences."
    },
    {
      icon: "🔒",
      title: "Secure Transactions",
      description: "Full legal support and secure transaction processes for complete peace of mind."
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Singapore Property Hub</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're not just another property portal. We're your trusted partner in finding the perfect property in Singapore.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="/about" className="btn-secondary inline-block">
            Learn More About Us
          </a>
        </div>
      </div>
    </section>
  )
}