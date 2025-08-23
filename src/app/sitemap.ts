import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://singapore-property-hub.vercel.app'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/condos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/districts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  try {
    // Dynamic article pages
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    const articlePages = articles.map(article => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt || article.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // Singapore districts (1-28)
    const districtPages = Array.from({ length: 28 }, (_, i) => ({
      url: `${baseUrl}/districts/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Featured condos
    const condoPages = [
      'the-orchard-residences',
      'orchard-sophia', 
      'boulevard-vue',
      'the-scotts-tower',
      'grand-dunman',
      'lentor-mansion',
      'avenue-south-residence',
      'normanton-park'
    ].map(slug => ({
      url: `${baseUrl}/condos/${slug}/review-2025`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [
      ...staticPages,
      ...articlePages,
      ...districtPages,
      ...condoPages
    ]

  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if database is unavailable
    return staticPages
  }
}