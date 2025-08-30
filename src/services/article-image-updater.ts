/**
 * Article Image Updater Service
 * Allows individual article images to be updated based on Singapore Property Image Finder agent recommendations
 */

export interface UpdateArticleImageParams {
  slug: string;
  imageUrl: string;
}

export interface UpdateArticleImageResponse {
  success: boolean;
  message: string;
  article?: {
    id: string;
    title: string;
    slug: string;
    oldImage: string;
    newImage: string;
    updatedAt: Date;
  };
  error?: string;
}

export class ArticleImageUpdater {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  }

  /**
   * Update a single article's featured image
   * @param params - The slug and new image URL
   * @returns Promise with the update result
   */
  async updateArticleImage(params: UpdateArticleImageParams): Promise<UpdateArticleImageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/update-article-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Failed to update article image:', error);
      return {
        success: false,
        message: 'Failed to update article image',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update multiple articles with their respective images
   * @param updates - Array of article updates
   * @returns Promise with all update results
   */
  async updateMultipleArticles(
    updates: UpdateArticleImageParams[]
  ): Promise<UpdateArticleImageResponse[]> {
    const results = await Promise.allSettled(
      updates.map(update => this.updateArticleImage(update))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          message: `Failed to update article: ${updates[index].slug}`,
          error: result.reason?.message || 'Unknown error',
        };
      }
    });
  }

  /**
   * Validate image URL format
   * @param imageUrl - The image URL to validate
   * @returns boolean indicating if the URL is valid
   */
  static isValidImageUrl(imageUrl: string): boolean {
    try {
      const url = new URL(imageUrl);
      // Check if it's a supported image service
      const supportedHosts = ['images.unsplash.com', 'source.unsplash.com', 'picsum.photos'];
      return supportedHosts.some(host => url.hostname.includes(host));
    } catch {
      return false;
    }
  }

  /**
   * Add cache-busting parameter to image URL
   * @param imageUrl - The original image URL
   * @returns Image URL with cache-busting parameter
   */
  static addCacheBusting(imageUrl: string): string {
    try {
      const url = new URL(imageUrl);
      url.searchParams.set('t', Date.now().toString());
      return url.toString();
    } catch {
      return imageUrl;
    }
  }
}

// Export a default instance
export const articleImageUpdater = new ArticleImageUpdater();