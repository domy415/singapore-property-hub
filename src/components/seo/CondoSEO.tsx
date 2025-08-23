'use client'

import { BreadcrumbSchema, PropertySchema, FAQSchema } from './SchemaMarkup'
import { generateMetadata } from '@/lib/metadata'
import { generateCondoSEO } from '@/lib/seo'
import { Metadata } from 'next'

interface CondoSEOProps {
  condo: {
    name: string
    district: number
    developer: string
    completionYear: string
    priceFrom: string
    rating: number
    description: string
    address?: string
    images?: string[]
    units?: number
    tenure?: string
  }
  breadcrumbs?: Array<{ name: string; url?: string }>
  faqs?: Array<{ question: string; answer: string }>
}

export default function CondoSEO({ condo, breadcrumbs = [], faqs = [] }: CondoSEOProps) {
  const slug = condo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  
  const defaultBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Condos', url: '/condos' },
    { name: condo.name }
  ]

  const breadcrumbItems = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs

  // Generate comprehensive property schema
  const residentialComplexSchema: any = {
    "@context": "https://schema.org",
    "@type": "Residence",
    "name": condo.name,
    "description": condo.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": `District ${condo.district}`,
      "addressCountry": "Singapore"
    },
    "developer": {
      "@type": "Organization",
      "name": condo.developer
    },
    "yearBuilt": condo.completionYear,
    "numberOfRooms": condo.units,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": condo.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "50"
    },
    "offers": {
      "@type": "Offer",
      "price": condo.priceFrom,
      "priceCurrency": "SGD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Swimming Pool",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Fitness Center",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "24-hour Security",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking",
        "value": true
      }
    ],
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Tenure",
        "value": condo.tenure || "99-year leasehold"
      },
      {
        "@type": "PropertyValue",
        "name": "District",
        "value": condo.district.toString()
      }
    ]
  }

  if (condo.images && condo.images.length > 0) {
    residentialComplexSchema.image = condo.images.map(img => ({
      "@type": "ImageObject",
      "url": `https://singapore-property-hub.vercel.app${img}`,
      "width": 1200,
      "height": 800
    }))
  }

  return (
    <>
      {/* Residential Complex Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(residentialComplexSchema)
        }}
      />

      {/* Property Schema */}
      <PropertySchema
        name={condo.name}
        address={condo.address || `District ${condo.district}, Singapore`}
        district={condo.district}
        developer={condo.developer}
        completionYear={condo.completionYear}
        priceFrom={condo.priceFrom}
        rating={condo.rating}
        description={condo.description}
        images={condo.images}
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* FAQ Schema (if FAQs provided) */}
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
    </>
  )
}

// Helper function to generate condo metadata
export function generateCondoMetadata(condo: {
  name: string
  district: number
  developer: string
  completionYear: string
}): Metadata {
  const seoConfig = generateCondoSEO(condo)
  return generateMetadata(seoConfig)
}