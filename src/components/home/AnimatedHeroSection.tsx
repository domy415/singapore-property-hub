'use client'

import { useParallax, useScrollProgress } from '@/hooks/useScrollAnimation'
import AnimatedButton from '@/components/ui/AnimatedButton'
import { cn } from '@/lib/utils'

export default function AnimatedHeroSection() {
  const { ref: parallaxRef, offset } = useParallax(0.5)
  const scrollProgress = useScrollProgress()

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section
        ref={parallaxRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${offset * 0.5}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
            </div>
          </div>
          
          {/* Animated dots pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                animation: 'drift 20s linear infinite'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">
              Singapore's Most
            </span>{' '}
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Trusted
            </span>
            <br />
            <span 
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-fade-in-up" 
              style={{ animationDelay: '0.4s' }}
            >
              Property Guide
            </span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            Expert insights, comprehensive analysis, and personalized recommendations 
            for your property investment journey
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            <AnimatedButton
              variant="primary"
              size="lg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              className="bg-yellow-500 hover:bg-yellow-400 text-black"
            >
              Explore Properties
            </AnimatedButton>

            <AnimatedButton
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-900"
            >
              Get Expert Advice
            </AnimatedButton>
          </div>

          {/* Trust Indicators with staggered animation */}
          <div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            style={{ animationDelay: '1s' }}
          >
            {[
              { number: '76+', label: 'Active Leads' },
              { number: '150+', label: 'Properties' },
              { number: '28', label: 'Districts' },
              { number: '4.8', label: 'Rating' }
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${1 + index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Floating elements for depth */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-float-delayed" />
      </section>

      <style jsx>{`
        @keyframes drift {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(50px, 50px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </>
  )
}