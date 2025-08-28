import { ArticleCategory } from '@prisma/client'
import OpenAI from 'openai'
import { ImageSelector } from './image-selector'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    // Select a random district
    const districts = Object.keys(SINGAPORE_DISTRICTS)
    const selectedDistrict = districts[Math.floor(Math.random() * districts.length)]
    const districtInfo = SINGAPORE_DISTRICTS[selectedDistrict as keyof typeof SINGAPORE_DISTRICTS]

    const prompt = `
Write a comprehensive neighborhood/district guide article about ${selectedDistrict} (${districtInfo.name}) in Singapore. 

IMPORTANT: This must be a SPECIFIC district guide, not generic property market analysis.

Article Requirements:
- Focus specifically on ${selectedDistrict} and its neighborhoods: ${districtInfo.name}
- Discuss SPECIFIC locations, MRT stations, schools, and amenities in this district
- Cover property types available in this specific district (HDB, condos, landed)
- Include SPECIFIC property developments and projects in this district
- Mention nearby shopping centers, food courts, and lifestyle amenities
- Discuss transport connectivity specific to this district
- Include school zones and educational institutions in this district
- Property price ranges specific to this district
- Who should consider living in this district (families, young professionals, etc.)

DO NOT write generic Singapore property market analysis. Focus entirely on this specific district.

Structure:
1. Introduction to ${selectedDistrict}
2. Location and Connectivity (specific MRT stations, bus routes)
3. Housing Options (specific to this district)
4. Lifestyle and Amenities (specific shopping centers, parks, food)
5. Schools and Education (specific schools in/near this district)
6. Property Market Analysis (prices, trends specific to this district)
7. Who Should Live Here
8. Future Developments (specific to this district)

Write 2000+ words with specific details about ${selectedDistrict}.

Format as JSON:
{
  "title": "District-specific title mentioning ${selectedDistrict}",
  "excerpt": "150-character summary about this specific district",
  "content": "Full district guide in markdown format with specific details about ${selectedDistrict}",
  "seoTitle": "SEO title about ${selectedDistrict} (60 chars max)",
  "seoDescription": "Meta description about living in ${selectedDistrict} (160 chars max)",
  "tags": ["district-${selectedDistrict.toLowerCase().replace(' ', '-')}", "neighborhood-guide", "singapore-districts", "${districtInfo.type.toLowerCase()}"]
}`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system", 
          content: "You are a Singapore property expert specializing in district guides. Write detailed, specific content about the requested district."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    })

    const articleData = JSON.parse(response.choices[0].message.content || '{}')

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