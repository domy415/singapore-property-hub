import { marked } from 'marked'

// Configure marked options for better formatting
marked.setOptions({
  breaks: false, // Don't convert single line breaks to <br>
  gfm: true, // Use GitHub Flavored Markdown
  pedantic: false,
})

export function markdownToHtml(markdown: string): string {
  // Pre-process markdown to ensure proper spacing
  let processedMarkdown = markdown
    // Fix the issue where title and first paragraph merge
    .replace(/^#\s+(.+)\n([A-Z])/gm, '# $1\n\n$2')
    // Ensure double line breaks between different content blocks
    .replace(/([.!?])([A-Z])/g, '$1\n\n$2')
    // Fix merged sections with ### headers
    .replace(/([.!?])(#{2,6}\s)/gm, '$1\n\n$2')
    // Add spacing after headers
    .replace(/^(#{1,6}\s+.+)$/gm, '$1\n')
    // Ensure lists have proper spacing
    .replace(/^(\s*[-*+]\s+.+)$/gm, '\n$1')
    // Add spacing before and after code blocks
    .replace(/```/g, '\n```\n')
  
  // Parse markdown to HTML
  let html = marked.parse(processedMarkdown) as string
  
  // Post-process HTML for better formatting
  html = html
    // Ensure paragraphs have proper spacing and font weight
    .replace(/<p>/g, '<p class="mb-6 font-normal">')
    // Add spacing to lists
    .replace(/<ul>/g, '<ul class="mb-6 space-y-3">')
    .replace(/<ol>/g, '<ol class="mb-6 space-y-3">')
    // Style blockquotes
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-6 italic my-8">')
    // Add infographic placeholders
    .replace(/\[INFOGRAPHIC:([^\]]+)\]/g, '<div class="my-10 p-8 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"><div class="text-3xl mb-3">📊</div><p class="text-gray-700 font-semibold text-lg">Infographic: $1</p><p class="text-sm text-gray-500 mt-2">Visual content will be displayed here</p></div>')
    // Fix any remaining bold text issues
    .replace(/<strong>/g, '<strong class="font-semibold">')
  
  return html
}