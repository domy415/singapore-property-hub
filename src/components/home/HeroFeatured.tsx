'use client'

import Link from 'next/link'
import { HeroText, BodyLarge, BodyText, Container, Section, Grid, Flex, Stack } from '@/components/design-system'

interface FeaturedArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage: string
  category: string
  publishedAt: Date
  readTime: string
}

interface HeroFeaturedProps {
  article: FeaturedArticle
}

export default function HeroFeatured({ article }: HeroFeaturedProps) {
  const handleFreeReport = () => {
    // Scroll to newsletter signup section for lead capture
    const newsletterSection = document.getElementById('newsletter-signup')
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="relative min-h-[700px] w-full overflow-hidden hero-gradient">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Main Content */}
      <div className="relative">
        <Section padding="lg">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Main Headline */}
            <HeroText className="text-white mb-8 leading-tight tracking-tight">
              Singapore's Most Trusted{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Condo Investment Guide
              </span>
            </HeroText>
            
            {/* Subheadline */}
            <BodyLarge className="text-white/90 mb-12 max-w-3xl mx-auto">
              Expert analysis and personalized reports for smart property decisions. 
              Get exclusive insights on Singapore's best condo investments.
            </BodyLarge>
          
            {/* CTA Buttons */}
            <Flex direction="col" justify="center" align="center" gap className="sm:flex-row mb-16">
              <button 
                onClick={handleFreeReport}
                className="btn-gold text-lg px-10 py-5 inline-flex items-center gap-3 shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 0a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
                Get Free Condo Report
              </button>
              
              <Link 
                href="/condos"
                className="btn-outline-white text-lg px-10 py-5 inline-flex items-center gap-3"
              >
                Browse Latest Reviews
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Flex>
            
            {/* Trust Indicators */}
            <Grid cols={2} responsive={{ md: 4 }} className="max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">250+</div>
                <BodyText className="text-white/80">Expert Reviews</BodyText>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">50K+</div>
                <BodyText className="text-white/80">Monthly Readers</BodyText>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">180+</div>
                <BodyText className="text-white/80">Projects Covered</BodyText>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">15+</div>
                <BodyText className="text-white/80">Years Experience</BodyText>
              </div>
            </Grid>
          </div>
        </Section>
      </div>
      
      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16 fill-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
      
      {/* Featured Article Badge */}
      <div className="absolute top-8 right-8 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
          <BodyText className="text-white/90 font-medium" as="div">
            Latest: {article.category}
          </BodyText>
        </div>
      </div>
    </section>
  )
}