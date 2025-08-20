import { marked } from 'marked'

// Configure marked options for better formatting
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // Use GitHub Flavored Markdown
})

export function markdownToHtml(markdown: string): string {
  return marked(markdown)
}