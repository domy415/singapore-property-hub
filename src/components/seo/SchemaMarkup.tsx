'use client'

interface SchemaMarkupProps {
  schema: object | object[]
  className?: string
}

export default function SchemaMarkup({ schema, className = "" }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(schema) ? schema : [schema])
      }}
    />
  )
}

// Specific schema components for reusability
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Singapore Property Hub",
    "url": "https://singapore-property-hub.vercel.app",
    "description": "Singapore's most trusted property investment guide with expert insights and comprehensive market analysis.",
    "logo": "https://singapore-property-hub.vercel.app/images/logo.png",
    "sameAs": [
      "https://linkedin.com/company/singapore-property-hub"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@singaporepropertyhub.sg",
      "contactType": "customer service"
    },
    "foundingDate": "2025",
    "founders": [
      {
        "@type": "Organization",
        "name": "Singapore Property Hub Team"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Singapore"
    },
    "knowsAbout": [
      "Singapore Real Estate",
      "Property Investment",
      "Condominium Analysis",
      "Market Research",
      "District Analysis"
    ]
  }

  return <SchemaMarkup schema={schema} />
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Singapore Property Hub",
    "url": "https://singapore-property-hub.vercel.app",
    "description": "Singapore's most trusted property investment guide",
    "publisher": {
      "@type": "Organization",
      "name": "Singapore Property Hub"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://singapore-property-hub.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return <SchemaMarkup schema={schema} />
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url?: string }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `https://singapore-property-hub.vercel.app${item.url}` : undefined
    }))
  }

  return <SchemaMarkup schema={schema} />
}

interface ArticleSchemaProps {
  title: string
  description: string
  content: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author?: string
  image?: string
  category?: string
}

export function ArticleSchema({
  title,
  description,
  content,
  slug,
  publishedAt,
  updatedAt,
  author = "Singapore Property Hub Team",
  image,
  category = "Property Analysis"
}: ArticleSchemaProps) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "articleBody": content,
    "url": `https://singapore-property-hub.vercel.app/articles/${slug}`,
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt,
    "author": {
      "@type": "Organization", 
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Singapore Property Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://singapore-property-hub.vercel.app/images/logo.png",
        "width": 200,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://singapore-property-hub.vercel.app/articles/${slug}`
    },
    "articleSection": category,
    "keywords": [
      "Singapore Property",
      "Real Estate",
      "Investment Analysis", 
      "Property Market",
      category
    ]
  }

  if (image) {
    schema.image = {
      "@type": "ImageObject",
      "url": `https://singapore-property-hub.vercel.app${image}`,
      "width": 1200,
      "height": 630
    }
  }

  return <SchemaMarkup schema={schema} />
}

interface PropertySchemaProps {
  name: string
  address: string
  district: number
  developer: string
  completionYear: string
  priceFrom: string
  rating: number
  description: string
  images?: string[]
}

export function PropertySchema({
  name,
  address,
  district,
  developer,
  completionYear,
  priceFrom,
  rating,
  description,
  images = []
}: PropertySchemaProps) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": name,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": `District ${district}`,
      "addressCountry": "Singapore"
    },
    "developer": {
      "@type": "Organization",
      "name": developer
    },
    "yearBuilt": completionYear,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": priceFrom,
      "priceCurrency": "SGD",
      "availability": "https://schema.org/InStock"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "MRT Access",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Swimming Pool",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Gym",
        "value": true
      }
    ]
  }

  if (images.length > 0) {
    schema.image = images.map(img => ({
      "@type": "ImageObject",
      "url": `https://singapore-property-hub.vercel.app${img}`,
      "width": 1200,
      "height": 800
    }))
  }

  return <SchemaMarkup schema={schema} />
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return <SchemaMarkup schema={schema} />
}