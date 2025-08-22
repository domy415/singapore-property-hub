import { prisma } from '@/lib/prisma'
import { ArticleStatus } from '@prisma/client'

// Cache for article availability to avoid repeated database queries
let availabilityCache: {
  categories: Set<string>
  tags: Set<string>
  timestamp: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getArticleAvailability() {
  // Return cached data if available and not expired
  if (availabilityCache && Date.now() - availabilityCache.timestamp < CACHE_DURATION) {
    return availabilityCache
  }

  try {
    // Fetch all published articles to check categories and tags
    const articles = await prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED
      },
      select: {
        category: true,
        tags: true
      }
    })

    // Extract unique categories and tags
    const categories = new Set<string>()
    const tags = new Set<string>()

    articles.forEach(article => {
      if (article.category) {
        categories.add(article.category.toLowerCase())
      }
      article.tags.forEach(tag => {
        tags.add(tag.toLowerCase())
      })
    })

    // Update cache
    availabilityCache = {
      categories,
      tags,
      timestamp: Date.now()
    }

    return availabilityCache
  } catch (error) {
    console.error('Error fetching article availability:', error)
    // Return empty sets on error
    return {
      categories: new Set<string>(),
      tags: new Set<string>(),
      timestamp: Date.now()
    }
  }
}

// Helper function to check if a category has articles
export function hasCategoryArticles(category: string, availability: { categories: Set<string> }): boolean {
  return availability.categories.has(category.toLowerCase())
}

// Helper function to check if a tag has articles
export function hasTagArticles(tag: string, availability: { tags: Set<string> }): boolean {
  return availability.tags.has(tag.toLowerCase())
}