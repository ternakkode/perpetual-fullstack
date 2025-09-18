import { createClient } from 'contentful'

// Simple interface for blog posts
export interface BlogPostEntry {
  sys: { id: string }
  fields: {
    title: string
    slug: string
    excerpt?: string
    content: any
    featuredImage?: any
    author: string
    publishedDate: string
    tags?: string[]
  }
}

// Contentful client configuration
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
})

// Blog post service
export const contentfulService = {
  // Get all blog posts
  async getBlogPosts(limit = 10): Promise<BlogPostEntry[]> {
    try {
      const response = await client.getEntries({
        content_type: 'blog',
        limit,
        include: 2,
      })
      return response.items as any
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      throw new Error('Failed to fetch blog posts')
    }
  },

  // Get a single blog post by slug
  async getBlogPostBySlug(slug: string): Promise<BlogPostEntry | null> {
    try {
      const response = await client.getEntries({
        content_type: 'blog',
        'fields.slug': slug as any,
        include: 2,
        limit: 1,
      })
      return (response.items[0] as any) || null
    } catch (error) {
      console.error('Error fetching blog post:', error)
      throw new Error('Failed to fetch blog post')
    }
  },

  // Search blog posts
  async searchBlogPosts(query: string, limit = 10): Promise<BlogPostEntry[]> {
    try {
      const response = await client.getEntries({
        content_type: 'blog',
        query,
        limit,
        include: 2,
      })
      return response.items as any
    } catch (error) {
      console.error('Error searching blog posts:', error)
      throw new Error('Failed to search blog posts')
    }
  }
}

// Helper function to get image URL from Contentful asset
export const getImageUrl = (asset: any, width?: number): string => {
  if (!asset?.fields?.file?.url) return ''
  
  let url = asset.fields.file.url
  if (typeof url === 'string' && url.startsWith('//')) {
    url = `https:${url}`
  }
  
  return width && typeof url === 'string' ? `${url}?w=${width}&fm=webp&q=80` : url || ''
}

// Helper function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}