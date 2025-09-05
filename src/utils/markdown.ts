import { marked } from 'marked'

// Configure marked options for better formatting
marked.setOptions({
  breaks: false, // Don't convert single line breaks to <br>
  gfm: true, // Use GitHub Flavored Markdown
  pedantic: false,
})

export function markdownToHtml(markdown: string): string {
  // Pre-process markdown to ensure proper spacing and heading separation
  let processedMarkdown = markdown
    // CRITICAL FIX: Separate merged headings and text (most common pattern)
    .replace(/^(#{1,6}\s+[^\n]+)([A-Z][^\n]*)/gm, '$1\n\n$2')
    // Fix merged H1 titles with following text
    .replace(/^#\s+(.+?)([A-Z][a-z])/gm, '# $1\n\n$2')
    // Fix merged H2 headings with following text  
    .replace(/^##\s+(.+?)([A-Z][a-z])/gm, '## $1\n\n$2')
    // Fix merged H3 headings with following text
    .replace(/^###\s+(.+?)([A-Z][a-z])/gm, '### $1\n\n$2')
    // Fix sentences ending without space before new sentences
    .replace(/([.!?])([A-Z])/g, '$1\n\n$2')
    // Fix merged sections ending with punctuation followed by headers
    .replace(/([.!?\)])\s*(#{1,6}\s)/gm, '$1\n\n$2')
    // Ensure proper spacing after ALL headers
    .replace(/^(#{1,6}\s+.+)$/gm, '$1\n\n')
    // Fix colon-ended headings merged with text (like "Market Dynamics:The Singapore")
    .replace(/^(#{1,6}\s+[^\n]+:)([A-Z])/gm, '$1\n\n$2')
    // Add breaks between distinct topics/sections
    .replace(/(Singapore|The|In|With|Despite|However|Additionally|Furthermore|Moreover)\s+([A-Z][^.!?]*[.!?])\s*([A-Z])/g, '$1 $2\n\n$3')
    // Ensure proper paragraph breaks in long text blocks
    .replace(/([.!?])\s+([A-Z][a-z]{2,})/g, '$1\n\n$2')
    // Fix lists with proper spacing
    .replace(/^(\s*[-*+]\s+.+)$/gm, '\n$1')
    // Add spacing before and after code blocks
    .replace(/```/g, '\n```\n')
    // Clean up excessive newlines (more than 3 in a row)
    .replace(/\n{4,}/g, '\n\n\n')
  
  // Parse markdown to HTML
  let html = marked.parse(processedMarkdown) as string
  
  // Post-process HTML for better formatting and spacing
  html = html
    // Add proper CSS classes to headings for spacing
    .replace(/<h1>/g, '<h1 class="article-title text-4xl font-bold mb-8 mt-12 pb-4 border-b border-gray-200 text-gray-900">')
    .replace(/<h2>/g, '<h2 class="section-header text-3xl font-semibold mb-6 mt-12 pb-2 border-b border-gray-200 text-gray-800">')
    .replace(/<h3>/g, '<h3 class="subsection-header text-2xl font-semibold mb-4 mt-10 text-gray-800">')
    .replace(/<h4>/g, '<h4 class="text-xl font-semibold mb-3 mt-8 text-gray-800">')
    // Ensure paragraphs have proper spacing and readability
    .replace(/<p>/g, '<p class="article-paragraph mb-6 text-lg leading-relaxed font-normal text-gray-700">')
    // Style the first paragraph differently (introduction)
    .replace(/<p class="article-paragraph mb-6 text-lg leading-relaxed font-normal text-gray-700">([^<]*(?:<[^>]*>[^<]*)*?)<\/p>/, '<p class="intro-paragraph mb-8 text-xl leading-relaxed font-medium text-gray-800">$1</p>')
    // Add proper spacing to lists
    .replace(/<ul>/g, '<ul class="article-list mb-8 space-y-4 pl-6">')
    .replace(/<ol>/g, '<ol class="article-list mb-8 space-y-4 pl-6">')
    .replace(/<li>/g, '<li class="mb-2 text-lg leading-relaxed text-gray-700">')
    // Style blockquotes with better visual appeal
    .replace(/<blockquote>/g, '<blockquote class="article-quote border-l-4 border-blue-500 pl-8 py-6 my-10 italic text-gray-600 bg-blue-50 rounded-r-lg">')
    // Add infographic placeholders
    .replace(/\[INFOGRAPHIC:([^\]]+)\]/g, '<div class="infographic-placeholder my-12 p-8 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"><div class="text-4xl mb-4">📊</div><p class="text-gray-700 font-semibold text-xl">Infographic: $1</p><p class="text-sm text-gray-500 mt-3">Visual content will be displayed here</p></div>')
    // Fix bold text with proper styling
    .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">')
    // Clean up any empty paragraphs
    .replace(/<p class="[^"]*">\s*<\/p>/g, '')
    // Ensure proper spacing around sections
    .replace(/(<\/h[1-6]>)\s*(<p)/g, '$1\n$2')
  
  // Final cleanup - remove excessive whitespace but preserve intentional spacing
  html = html
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
  
  return html
}