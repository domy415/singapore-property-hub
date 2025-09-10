export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-+/, '')        // Remove leading hyphens
    .replace(/-+$/, '')        // Remove trailing hyphens
    .slice(0, 60);            // Limit to 60 characters
}

// When saving articles, ensure full URL is stored
export function generateArticleUrl(title: string, type: string = 'articles'): string {
  const slug = generateSlug(title);
  return `/${type}/${slug}`;
}