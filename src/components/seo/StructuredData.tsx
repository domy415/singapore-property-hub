import Script from 'next/script'

interface StructuredDataProps {
  type?: 'website' | 'article' | 'organization'
  data?: any
}

export default function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    }

    switch (type) {
      case 'organization':
        return {
          ...baseData,
          '@type': 'Organization',
          name: 'Singapore Property Hub',
          url: 'https://singapore-property-hub.vercel.app',
          logo: 'https://singapore-property-hub.vercel.app/logo.png',
          description: 'Expert property guides and market insights for Singapore real estate',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'SG',
            addressLocality: 'Singapore'
          },
          sameAs: [
            'https://linkedin.com/company/singapore-property-hub',
            'https://facebook.com/singaporepropertyhub',
            'https://twitter.com/sg_property_hub'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            url: 'https://singapore-property-hub.vercel.app/contact'
          }
        }

      case 'article':
        return {
          ...baseData,
          '@type': 'Article',
          headline: data?.title,
          description: data?.excerpt,
          image: data?.featuredImage || 'https://singapore-property-hub.vercel.app/og-image.jpg',
          author: {
            '@type': 'Person',
            name: data?.author?.name || 'Singapore Property Expert',
            url: 'https://singapore-property-hub.vercel.app/about'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Singapore Property Hub',
            logo: {
              '@type': 'ImageObject',
              url: 'https://singapore-property-hub.vercel.app/logo.png'
            }
          },
          datePublished: data?.publishedAt,
          dateModified: data?.updatedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://singapore-property-hub.vercel.app/articles/${data?.slug}`
          },
          keywords: data?.tags?.join(', '),
          articleSection: data?.category,
          inLanguage: 'en-SG'
        }

      case 'website':
      default:
        return {
          ...baseData,
          '@type': 'WebSite',
          name: 'Singapore Property Hub',
          url: 'https://singapore-property-hub.vercel.app',
          description: 'Your trusted source for Singapore property market insights, buying guides, investment tips, and expert real estate advice.',
          publisher: {
            '@type': 'Organization',
            name: 'Singapore Property Hub'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://singapore-property-hub.vercel.app/articles?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          },
          inLanguage: 'en-SG',
          copyrightYear: new Date().getFullYear(),
          copyrightHolder: {
            '@type': 'Organization',
            name: 'Singapore Property Hub'
          }
        }
    }
  }

  const structuredData = getStructuredData()

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}