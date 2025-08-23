'use client'

import { BreadcrumbSchema, PropertySchema } from './SchemaMarkup'
import { generateMetadata } from '@/lib/metadata'
import { generateDistrictSEO } from '@/lib/seo'
import { Metadata } from 'next'

interface DistrictSEOProps {
  district: {
    number: number
    name: string
    region: 'CCR' | 'RCR' | 'OCR'
    description?: string
  }
  topCondos?: Array<{
    name: string
    developer: string
    completionYear: string
    priceFrom: string
    rating: number
  }>
  breadcrumbs?: Array<{ name: string; url?: string }>
}

export default function DistrictSEO({ district, topCondos = [], breadcrumbs = [] }: DistrictSEOProps) {
  const defaultBreadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Districts', url: '/districts' },
    { name: `District ${district.number}` }
  ]

  const breadcrumbItems = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs

  // Generate a place schema for the district
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `District ${district.number} - ${district.name}`,
    "description": district.description || `Property investment guide for District ${district.number} (${district.name}), Singapore. Comprehensive analysis of condos, amenities, schools, and transportation.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": district.name,
      "addressRegion": district.region,
      "addressCountry": "Singapore"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": "SG"
    },
    "containedInPlace": {
      "@type": "City",
      "name": "Singapore"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "District Number",
        "value": district.number.toString()
      },
      {
        "@type": "PropertyValue", 
        "name": "Region",
        "value": district.region
      }
    ]
  }

  return (
    <>
      {/* Place Schema for District */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeSchema)
        }}
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Property schemas for top condos */}
      {topCondos.slice(0, 3).map((condo, index) => (
        <PropertySchema
          key={index}
          name={condo.name}
          address={`District ${district.number}, Singapore`}
          district={district.number}
          developer={condo.developer}
          completionYear={condo.completionYear}
          priceFrom={condo.priceFrom}
          rating={condo.rating}
          description={`${condo.name} is a premium condominium development by ${condo.developer} located in District ${district.number}, ${district.name}.`}
        />
      ))}
    </>
  )
}

// Helper function to generate district metadata
export function generateDistrictMetadata(district: {
  number: number
  name: string
  region: 'CCR' | 'RCR' | 'OCR'
}): Metadata {
  const seoConfig = generateDistrictSEO(district)
  return generateMetadata(seoConfig)
}