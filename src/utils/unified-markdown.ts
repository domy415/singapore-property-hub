import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'

/**
 * Professional markdown to HTML converter using Unified ecosystem
 * Ensures proper heading separation and semantic HTML structure
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  try {
    // Pre-process markdown to fix common issues BEFORE parsing
    let processedMarkdown = markdown
      // Ensure proper spacing after headings (critical fix)
      .replace(/^(#{1,6})\s*(.+?)([A-Z][^\n]*)/gm, '$1 $2\n\n$3')
      // Fix specific merged patterns we know about
      .replace(/^(#{1,6}\s+[^#\n]+)([A-Z][a-z])/gm, '$1\n\n$2')
      // Ensure double line breaks between sections
      .replace(/([.!?])([A-Z][a-z])/g, '$1\n\n$2')
      // Clean up multiple newlines but preserve intentional breaks
      .replace(/\n{4,}/g, '\n\n\n')
      // Remove any remaining markdown bold syntax that shouldn't be there
      .replace(/\*\*/g, '')
      
    const result = await unified()
      .use(remarkParse) // Parse markdown to AST
      .use(remarkRehype, { 
        allowDangerousHtml: false // Security: don't allow raw HTML
      }) // Convert to HTML AST
      .use(rehypeSanitize) // Sanitize to prevent XSS
      .use(rehypeStringify) // Convert to HTML string
      .process(processedMarkdown)

    let html = String(result)
    
    // Post-process HTML for better styling and accessibility
    html = html
      // Add semantic classes to headings
      .replace(/<h1>/g, '<h1 class="article-h1">')
      .replace(/<h2>/g, '<h2 class="article-h2">')  
      .replace(/<h3>/g, '<h3 class="article-h3">')
      .replace(/<h4>/g, '<h4 class="article-h4">')
      .replace(/<h5>/g, '<h5 class="article-h5">')
      .replace(/<h6>/g, '<h6 class="article-h6">')
      
      // Add classes to paragraphs for consistent styling
      .replace(/<p>/g, '<p class="article-paragraph">')
      
      // Add classes to lists
      .replace(/<ul>/g, '<ul class="article-list">')
      .replace(/<ol>/g, '<ol class="article-list">')
      .replace(/<li>/g, '<li class="article-list-item">')
      
      // Style blockquotes
      .replace(/<blockquote>/g, '<blockquote class="article-blockquote">')
      
      // Add classes for better code styling
      .replace(/<code>/g, '<code class="article-code">')
      .replace(/<pre>/g, '<pre class="article-pre">')
      
      // Clean up any empty paragraphs
      .replace(/<p class="article-paragraph">\s*<\/p>/g, '')

    return html

  } catch (error) {
    console.error('Error processing markdown:', error)
    // Fallback: return sanitized version of original markdown
    return markdown.replace(/[<>&"']/g, (match) => {
      const htmlEscapes: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
      }
      return htmlEscapes[match]
    })
  }
}

/**
 * Extract reading time from markdown content
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

/**
 * Extract excerpt from markdown content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\*\*/g, '') // Remove bold syntax
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
    
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  // Find the last complete sentence within the limit
  const excerpt = plainText.substring(0, maxLength)
  const lastSentenceEnd = Math.max(
    excerpt.lastIndexOf('.'),
    excerpt.lastIndexOf('!'),
    excerpt.lastIndexOf('?')
  )
  
  if (lastSentenceEnd > maxLength * 0.5) {
    return excerpt.substring(0, lastSentenceEnd + 1).trim()
  }
  
  // If no sentence end found, cut at last word
  const lastSpace = excerpt.lastIndexOf(' ')
  return lastSpace > 0 ? excerpt.substring(0, lastSpace).trim() + '...' : excerpt + '...'
}