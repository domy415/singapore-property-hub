import { ArticleCategory } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'
import { ImageSelector } from './image-selector'

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null

// Singapore Districts with detailed information
const SINGAPORE_DISTRICTS = {
  'District 1': { name: 'Raffles Place, Cecil, Marina, People\'s Park', type: 'CBD' },
  'District 2': { name: 'Anson, Tanjong Pagar', type: 'CBD' },
  'District 3': { name: 'Queenstown, Tiong Bahru', type: 'RCR' },
  'District 4': { name: 'Sentosa, HarbourFront', type: 'RCR' },
  'District 5': { name: 'Pasir Panjang, Hong Leong Garden, Clementi New Town', type: 'OCR' },
  'District 6': { name: 'High Street, Beach Road', type: 'CBD' },
  'District 7': { name: 'Middle Road, Golden Mile', type: 'CBD' },
  'District 8': { name: 'Little India', type: 'CBD' },
  'District 9': { name: 'Orchard, Cairnhill, River Valley', type: 'CCR' },
  'District 10': { name: 'Ardmore, Bukit Timah, Holland Road, Tanglin', type: 'CCR' },
  'District 11': { name: 'Watten Estate, Novena, Thomson', type: 'CCR' },
  'District 12': { name: 'Balestier, Toa Payoh, Serangoon', type: 'RCR' },
  'District 13': { name: 'Macpherson, Braddell', type: 'RCR' },
  'District 14': { name: 'Geylang, Eunos', type: 'RCR' },
  'District 15': { name: 'Katong, Joo Chiat, Amber Road', type: 'RCR' },
  'District 16': { name: 'Bedok, Upper East Coast, Eastwood, Kew Drive', type: 'OCR' },
  'District 17': { name: 'Loyang, Changi', type: 'OCR' },
  'District 18': { name: 'Tampines, Pasir Ris', type: 'OCR' },
  'District 19': { name: 'Serangoon Garden, Hougang, Punggol', type: 'OCR' },
  'District 20': { name: 'Bishan, Ang Mo Kio', type: 'RCR' },
  'District 21': { name: 'Upper Bukit Timah, Clementi Park, Ulu Pandan', type: 'OCR' },
  'District 22': { name: 'Jurong', type: 'OCR' },
  'District 23': { name: 'Hillview, Dairy Farm, Bukit Panjang, Choa Chu Kang', type: 'OCR' },
  'District 25': { name: 'Kranji, Woodgrove', type: 'OCR' },
  'District 26': { name: 'Upper Thomson, Springleaf', type: 'OCR' },
  'District 27': { name: 'Yishun, Sembawang', type: 'OCR' },
  'District 28': { name: 'Seletar', type: 'OCR' }
}

export class DistrictArticleCreator {
  
  async generateDistrictArticle(topicHint?: string): Promise<any> {
    if (!anthropic) {
      throw new Error('Anthropic Claude not configured')
    }

    // Select a random district
    const districts = Object.keys(SINGAPORE_DISTRICTS)
    const selectedDistrict = districts[Math.floor(Math.random() * districts.length)]
    const districtInfo = SINGAPORE_DISTRICTS[selectedDistrict as keyof typeof SINGAPORE_DISTRICTS]

    const prompt = `
Write a comprehensive district guide for ${selectedDistrict} (${districtInfo.name}) in Singapore as a local property expert for Business Times readers.

WRITING STYLE: Business Times editorial voice - authoritative, insider knowledge, analytical. Write as someone with decades of Singapore property expertise.

CRITICAL REQUIREMENTS:
- This is a SPECIFIC district guide with LOCAL EXPERTISE, not generic content
- Include a fascinating HISTORICAL PARAGRAPH about ${selectedDistrict}'s development and transformation
- Focus specifically on ${selectedDistrict} and its neighborhoods: ${districtInfo.name}
- AVOID phrases like "In conclusion", "To conclude", "In summary" 
- End with MARKET OUTLOOK or EXPERT INSIGHTS section instead

Article Structure:
1. District Overview with market context
2. HISTORICAL BACKGROUND - Brief but interesting history of ${selectedDistrict}'s development and transformation
3. Geographic Layout and Connectivity (specific MRT stations, transport networks)
4. Residential Property Landscape (specific developments, price analysis)
5. Lifestyle Infrastructure (shopping, dining, amenities with specific names)
6. Educational Ecosystem (schools, institutions specific to this district)
7. Investment Fundamentals (price trends, rental yields, target demographics)
8. MARKET OUTLOOK (future developments and expert insights - NOT conclusion)

SPECIFIC CONTENT REQUIREMENTS:
- Name actual MRT stations, shopping centers, schools, hospitals in ${selectedDistrict}
- Reference specific property developments and their price points
- Include actual street names and landmark locations
- Discuss transport connectivity with specific routes and travel times
- Historical context about how ${selectedDistrict} evolved into its current form
- Expert analysis of property market dynamics specific to this district
- Who should invest/live here based on district characteristics

Write 2000+ words with deep local knowledge about ${selectedDistrict}.

Format as JSON:
{
  "title": "District-specific title mentioning ${selectedDistrict}",
  "excerpt": "150-character summary about this specific district",
  "content": "Full district guide in markdown format with specific details about ${selectedDistrict}",
  "seoTitle": "SEO title about ${selectedDistrict} (60 chars max)",
  "seoDescription": "Meta description about living in ${selectedDistrict} (160 chars max)",
  "tags": ["district-${selectedDistrict.toLowerCase().replace(' ', '-')}", "neighborhood-guide", "singapore-districts", "${districtInfo.type.toLowerCase()}"]
}`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use Claude 3 Haiku for district content
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `<context>
You are a Singapore property expert specializing in district guides. Write detailed, specific content about the requested district with local expertise and market knowledge.
</context>

<task>
${prompt}
</task>

<requirements>
- Return valid JSON only in the exact format specified
- Include specific Singapore district details and local knowledge
- Write with Business Times editorial voice
- Ensure content is district-specific, not generic
</requirements>`
        }
      ],
      temperature: 0.7
    })

    const responseText = (response.content[0] as any).text
    
    // Clean the response text before parsing JSON
    const cleanedText = responseText
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\n/g, '\\n')           // Escape newlines
      .replace(/\r/g, '\\r')           // Escape carriage returns
      .replace(/\t/g, '\\t')           // Escape tabs
    
    const articleData = JSON.parse(cleanedText)

    return {
      ...articleData,
      category: ArticleCategory.NEIGHBORHOOD,
      keywords: articleData.tags,
      slug: this.createSlug(articleData.title),
      featuredImage: await ImageSelector.getUniqueImage(ArticleCategory.NEIGHBORHOOD),
    }
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100)
  }
}