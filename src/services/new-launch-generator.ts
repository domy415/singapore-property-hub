import { prisma } from '@/lib/prisma'
import { ArticleCategory, ArticleStatus } from '@prisma/client'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface NewLaunchData {
  title: string
  developer: string
  location: string
  district: number
  tenure: 'Freehold' | '99-year leasehold' | '103-year leasehold' | '999-year leasehold'
  totalUnits: number
  unitMix: string
  launchDate: string
  expectedTop: string
  priceRange: string
  siteArea: string
  nearestMrt: string
  amenities: string[]
}

// Sample recent launches for variety (you can update this list)
const recentLaunches: NewLaunchData[] = [
  {
    title: "The Orie",
    developer: "CDL, Frasers Property, Sekisui House",
    location: "Lorong 1 Toa Payoh",
    district: 12,
    tenure: "99-year leasehold",
    totalUnits: 777,
    unitMix: "1- to 5-bedroom configurations",
    launchDate: "January 2025",
    expectedTop: "Q4 2028",
    priceRange: "$2,100 - $2,800 PSF",
    siteArea: "354,670 sqft",
    nearestMrt: "Toa Payoh MRT (5 minutes walk)",
    amenities: ["50m lap pool", "Sky garden", "Co-working space", "Children's playground", "Fitness pavilion"]
  },
  {
    title: "ELTA",
    developer: "Hong Leong Holdings",
    location: "Clementi Avenue 1",
    district: 5,
    tenure: "99-year leasehold",
    totalUnits: 501,
    unitMix: "1- to 4-bedroom units",
    launchDate: "February 2025",
    expectedTop: "Q1 2029",
    priceRange: "$2,250 - $2,950 PSF",
    siteArea: "268,456 sqft",
    nearestMrt: "Clementi MRT (8 minutes walk)",
    amenities: ["Infinity pool", "BBQ pavilion", "Fitness corner", "Yoga deck", "Sky lounge"]
  },
  {
    title: "Lentor Central Residences",
    developer: "Hong Leong Holdings, GuocoLand, CSC Land Group",
    location: "Lentor Central",
    district: 26,
    tenure: "99-year leasehold",
    totalUnits: 477,
    unitMix: "2- to 5-bedroom layouts",
    launchDate: "March 2025",
    expectedTop: "Q2 2029",
    priceRange: "$1,980 - $2,480 PSF",
    siteArea: "312,890 sqft",
    nearestMrt: "Lentor MRT (3 minutes walk)",
    amenities: ["Resort-style pool", "Tennis court", "Function hall", "Children's playground", "Outdoor fitness"]
  },
  {
    title: "Bloomsbury Residences",
    developer: "Qingjian Realty, Foresea Holdings, ZACD, SXT",
    location: "Media Circle",
    district: 5,
    tenure: "99-year leasehold",
    totalUnits: 358,
    unitMix: "1- to 4-bedroom apartments",
    launchDate: "April 2025",
    expectedTop: "Q3 2029",
    priceRange: "$2,350 - $3,100 PSF",
    siteArea: "198,765 sqft",
    nearestMrt: "one-north MRT (6 minutes walk)",
    amenities: ["Rooftop pool", "Sky garden", "Study pods", "Gym", "Outdoor dining"]
  },
  {
    title: "One Marina Gardens",
    developer: "Kingsford Development",
    location: "Marina Bay",
    district: 1,
    tenure: "99-year leasehold",
    totalUnits: 937,
    unitMix: "Studio to 4-bedroom units",
    launchDate: "April 2025",
    expectedTop: "Q4 2029",
    priceRange: "$2,800 - $4,200 PSF",
    siteArea: "445,123 sqft",
    nearestMrt: "Bayfront MRT (4 minutes walk)",
    amenities: ["Marina-facing pool", "Sky bridge", "Business lounge", "Concierge", "Retail podium"]
  }
]

const expertCommentaries = {
  propertyLimBrothers: [
    "The key to new launch success in 2025 is location accessibility and future growth potential",
    "With cooling measures in place, developers are focusing on value-driven launches rather than premium pricing",
    "Districts with upcoming infrastructure improvements present the best investment opportunities",
    "New launches in mature estates offer better rental yields due to established amenities"
  ],
  stackedHomes: [
    "The gap between new launch and resale prices continues to narrow in popular districts",
    "Buyers should focus on developments with unique selling propositions rather than just pricing",
    "Transit-oriented developments remain the most resilient in terms of capital appreciation",
    "Consider the total development timeline and potential market conditions at completion"
  ]
}

export class NewLaunchGenerator {
  private authorId: string = 'singapore-property-expert'

  async generateNewLaunchArticle(): Promise<string | null> {
    if (!openai) {
      console.log('OpenAI not configured - skipping new launch article generation')
      return null
    }

    try {
      // Get a random launch to feature
      const launchData = this.getRandomLaunch()
      const article = await this.generateArticle(launchData)
      const savedArticle = await this.saveArticle(article)
      return savedArticle.id
    } catch (error) {
      console.error('Error generating new launch article:', error)
      throw error
    }
  }

  private getRandomLaunch(): NewLaunchData {
    const randomIndex = Math.floor(Math.random() * recentLaunches.length)
    return recentLaunches[randomIndex]
  }

  private async generateArticle(launchData: NewLaunchData) {
    if (!openai) {
      throw new Error('OpenAI API key not configured')
    }
    
    const currentDate = new Date().toLocaleDateString('en-SG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    const plbComment = expertCommentaries.propertyLimBrothers[Math.floor(Math.random() * expertCommentaries.propertyLimBrothers.length)]
    const stackedComment = expertCommentaries.stackedHomes[Math.floor(Math.random() * expertCommentaries.stackedHomes.length)]
    
    const prompt = `You are Singapore's most experienced property analyst writing for Singapore Property Hub, a platform run by passionate property enthusiasts. Write a comprehensive review of "${launchData.title}" - a new condo launch in Singapore.

Current date: ${currentDate}
Context: We are property enthusiasts (not agents) sharing honest insights to help fellow Singaporeans make informed decisions.

Launch Details:
- Project: ${launchData.title}
- Developer: ${launchData.developer}
- Location: ${launchData.location}, District ${launchData.district}
- Tenure: ${launchData.tenure}
- Total Units: ${launchData.totalUnits}
- Unit Mix: ${launchData.unitMix}
- Launch Date: ${launchData.launchDate}
- Expected TOP: ${launchData.expectedTop}
- Price Range: ${launchData.priceRange}
- Site Area: ${launchData.siteArea}
- Nearest MRT: ${launchData.nearestMrt}
- Key Amenities: ${launchData.amenities.join(', ')}

Requirements:
1. Length: 2000-2500 words
2. Use the exact article structure template provided
3. Include detailed pros/cons analysis with specific points
4. Provide realistic rental yield and investment analysis
5. Compare with 2-3 similar recent launches
6. Include expert commentary quotes (use the ones provided below)
7. Give an overall rating out of 5 stars with justification
8. Write as property enthusiasts sharing honest insights

Expert Commentary to Include:
- PropertyLimBrothers insight: "${plbComment}"
- Stacked Homes analysis: "${stackedComment}"

Structure the article with these exact sections:
1. Quick Facts table
2. Development Overview
3. Location Analysis (Connectivity & Amenities)
4. Developer Profile
5. Unit Mix & Pricing table
6. Facilities & Features
7. Expert Commentary (with the quotes provided)
8. Pros & Cons Analysis (5 pros, 5 potential concerns)
9. Investment Perspective (rental yield, capital appreciation)
10. Comparison with Recent Launches
11. Our Assessment (rating and target buyer profile)
12. Key Takeaways

Format the response as JSON with:
{
  "title": "SEO-optimized title including project name and 2025",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 150-word excerpt",
  "content": "Full article content in HTML format with proper headings and structure",
  "category": "PROPERTY_NEWS",
  "tags": ["new launch", "condo review", "District X", "developer name", "investment analysis"],
  "seoTitle": "SEO title under 60 characters",
  "seoDescription": "SEO description under 160 characters with key benefits",
  "seoKeywords": ["project name", "singapore new launch", "condo review", "district X property"],
  "featuredImage": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop"
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated from OpenAI')
    }

    try {
      return JSON.parse(content)
    } catch (error) {
      console.error('Failed to parse OpenAI response as JSON:', error)
      throw new Error('Invalid JSON response from OpenAI')
    }
  }

  private async saveArticle(articleData: any) {
    // Find or create author
    let author = await prisma.author.findUnique({
      where: { email: 'expert@singaporepropertyhub.sg' }
    })

    if (!author) {
      author = await prisma.author.create({
        data: {
          email: 'expert@singaporepropertyhub.sg',
          name: 'Singapore Property Hub Team',
          bio: 'Passionate property enthusiasts sharing honest insights and analysis to help fellow Singaporeans make informed real estate decisions.'
        }
      })
    }

    // Create and save the article
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: ArticleCategory.PROPERTY_NEWS,
        tags: articleData.tags,
        featuredImage: articleData.featuredImage,
        authorId: author.id,
        seoTitle: articleData.seoTitle,
        seoDescription: articleData.seoDescription,
        seoKeywords: articleData.seoKeywords,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date()
      },
      include: {
        author: true
      }
    })

    return article
  }
}