import Hero from '@/components/home/Hero'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import LatestArticles from '@/components/home/LatestArticles'
import PropertySearch from '@/components/home/PropertySearch'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import LeadCaptureForm from '@/components/forms/LeadCaptureForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://singaporepropertyhub.sg',
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <WhyChooseUs />
      <LatestArticles />
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Expert Property Advice</h2>
            <p className="text-gray-600 mb-8">
              Connect with Singapore's top property experts for personalized guidance on your real estate journey.
            </p>
            <LeadCaptureForm />
          </div>
        </div>
      </section>
    </>
  )
}