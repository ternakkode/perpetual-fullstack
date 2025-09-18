'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { ArrowLeft, Calendar, User, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'
import { contentfulService, type BlogPostEntry, getImageUrl, formatDate } from '@/services/contentful'
import { Logo } from '@/components/ui/logo'

// Rich text rendering options
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => <strong className="font-semibold text-white">{text}</strong>,
    [MARKS.ITALIC]: (text: any) => <em className="italic text-gray-300">{text}</em>,
    [MARKS.CODE]: (text: any) => <code className="bg-primary-500/20 text-primary-300 px-3 py-1.5 rounded-md text-sm font-mono border border-primary-500/30 font-medium">{text}</code>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_: any, children: any) => <p className="mb-8 leading-[1.75] text-gray-200 text-lg font-light tracking-wide">{children}</p>,
    [BLOCKS.HEADING_1]: (_: any, children: any) => <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-16 text-white leading-tight tracking-tight">{children}</h1>,
    [BLOCKS.HEADING_2]: (_: any, children: any) => <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-12 text-white leading-tight tracking-tight">{children}</h2>,
    [BLOCKS.HEADING_3]: (_: any, children: any) => <h3 className="text-2xl md:text-3xl font-semibold mb-5 mt-10 text-white leading-tight">{children}</h3>,
    [BLOCKS.HEADING_4]: (_: any, children: any) => <h4 className="text-xl md:text-2xl font-semibold mb-4 mt-8 text-white leading-tight">{children}</h4>,
    [BLOCKS.UL_LIST]: (_: any, children: any) => <ul className="list-none mb-8 space-y-3 text-gray-200">{children}</ul>,
    [BLOCKS.OL_LIST]: (_: any, children: any) => <ol className="list-none counter-reset-list mb-8 space-y-3 text-gray-200">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (_: any, children: any) => <li className="relative pl-8 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-primary-400 before:font-bold before:text-lg">{children}</li>,
    [BLOCKS.QUOTE]: (_: any, children: any) => (
      <blockquote className="border-l-4 border-primary-500 pl-8 pr-6 italic my-10 text-gray-300 bg-primary-500/10 py-6 rounded-r-xl text-lg font-light leading-relaxed">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-12 border-gray-600/50 border-t-2" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const asset = node.data.target
      if (asset?.fields?.file?.contentType?.includes('image')) {
        return (
          <div className="my-12">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={getImageUrl(asset, 1000)}
                alt={asset.fields.title || ''}
                className="w-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            {asset.fields.description && (
              <p className="text-sm text-gray-400 mt-4 text-center italic font-light">
                {asset.fields.description}
              </p>
            )}
          </div>
        )
      }
      return null
    },
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a 
        href={node.data.uri} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary-400 hover:text-primary-300 underline decoration-primary-400/50 underline-offset-4 transition-all duration-200 hover:decoration-primary-300"
      >
        {children}
      </a>
    ),
  },
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPostEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    if (slug) {
      fetchPost(slug)
    }
  }, [slug])

  const fetchPost = async (postSlug: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const fetchedPost = await contentfulService.getBlogPostBySlug(postSlug)
      
      if (!fetchedPost) {
        setError('Blog post not found')
        return
      }

      setPost(fetchedPost)
    } catch (err) {
      setError('Failed to load blog post')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href
    const title = post?.fields.title || 'HyperConnect Blog Post'
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          // Note: Toast functionality would need to be implemented
          console.log('Link copied to clipboard!')
        } catch (err) {
          console.error('Failed to copy link:', err)
        }
        break
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white font-display overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    router.push('/blog')
    return null
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.fields.title,
    "description": post.fields.excerpt || "",
    "author": {
      "@type": "Person",
      "name": post.fields.author
    },
    "datePublished": post.fields.publishedDate,
    "publisher": {
      "@type": "Organization",
      "name": "HyperConnect"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Launch Button */}
      <div className="fixed top-6 right-6 z-50">
        <motion.button
          onClick={() => router.push('/trade')}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 30px rgba(240, 255, 0, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all duration-200 overflow-hidden"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent skew-x-12"
          ></motion.div>
          <span className="relative z-10">Launch App</span>
        </motion.button>
      </div>

      {/* Article Content */}
      <article className="relative pt-32 pb-16">
        {/* Subtle background pattern - same as BlogPage */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(94,179,163,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(94,179,163,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-500/3 to-transparent"></div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Featured Image */}
          {post.fields.featuredImage && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="aspect-video overflow-hidden rounded-xl relative">
                <img
                  src={getImageUrl(post.fields.featuredImage, 1200)}
                  alt={post.fields.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </motion.div>
          )}

          {/* Article Header */}
          <div className="mb-12">
            {/* Tags */}
            {post.fields.tags && Array.isArray(post.fields.tags) && post.fields.tags.length > 0 && (
              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
                {post.fields.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-400/20 border border-primary-500/30 text-primary-200 text-sm font-medium rounded-full backdrop-blur-sm hover:from-primary-500/30 hover:to-primary-400/30 hover:border-primary-400/50 transition-all duration-500"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight relative"
            >
              <span className="relative z-10">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  {post.fields.title}
                </span>
              </span>
              <motion.div
                animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg blur-xl"
              ></motion.div>
            </motion.h1>

            {/* Excerpt */}
            {post.fields.excerpt && (
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-200 mb-16 leading-relaxed font-light relative max-w-3xl tracking-wide"
              >
                <span className="relative z-10">{post.fields.excerpt}</span>
                <motion.div
                  animate={{ opacity: [0, 0.05, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-lg blur-sm"
                ></motion.div>
              </motion.p>
            )}

            {/* Meta information */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 text-gray-500 mb-8"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.fields.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.fields.publishedDate)}</span>
              </div>
            </motion.div>

            {/* Share buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              <span className="text-sm font-medium text-gray-400">Share:</span>
              <motion.button
                onClick={() => handleShare('twitter')}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm hover:border-primary-500/30 hover:text-primary-300 transition-all duration-300"
              >
                <Twitter className="h-4 w-4 text-primary-400" />
                Twitter
              </motion.button>
              <motion.button
                onClick={() => handleShare('linkedin')}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm hover:border-primary-500/30 hover:text-primary-300 transition-all duration-300"
              >
                <Linkedin className="h-4 w-4 text-primary-400" />
                LinkedIn
              </motion.button>
              <motion.button
                onClick={() => handleShare('copy')}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm hover:border-primary-500/30 hover:text-primary-300 transition-all duration-300"
              >
                <LinkIcon className="h-4 w-4 text-primary-400" />
                Copy Link
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <hr className="border-gray-600/50 border-t-2 mb-16" />
            </motion.div>
          </div>

          {/* Article Content */}
          <motion.div 
            variants={itemVariants}
            className="max-w-none"
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: '1.75',
              fontSize: '1.125rem'
            }}
          >
            <div className="selection:bg-primary-500/30 selection:text-white">
              {post.fields.content && typeof post.fields.content === 'object' && documentToReactComponents(post.fields.content, richTextOptions)}
            </div>
          </motion.div>

          {/* Article Footer */}
          <motion.div 
            variants={itemVariants}
            className="mt-20 pt-10 border-t border-gray-600/50 border-t-2"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-gray-400 text-sm">Written by</p>
                <p className="text-white font-medium">{post.fields.author}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Published on</p>
                <p className="text-white font-medium">{formatDate(post.fields.publishedDate)}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </article>
    </div>
  )
}