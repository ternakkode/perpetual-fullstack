'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Calendar, User, ArrowRight } from 'lucide-react'
import { contentfulService, type BlogPostEntry, getImageUrl, formatDate } from '@/services/contentful'
import { Logo } from '@/components/ui/logo'

export default function BlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPostEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await contentfulService.getBlogPosts(20)
      setPosts(fetchedPosts)
    } catch (err) {
      setError('Failed to load blog posts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts()
      return
    }

    try {
      setLoading(true)
      const searchResults = await contentfulService.searchBlogPosts(searchQuery)
      setPosts(searchResults)
    } catch (err) {
      setError('Failed to search blog posts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "HyperConnect Blog",
    "description": "Insights, updates, and guides for the Hyperliquid ecosystem",
    "url": "https://hyperconnect.app/blog",
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

      {/* Header Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Subtle background pattern */}
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
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-3xl md:text-6xl font-black mb-6 text-white tracking-tight"
              >
                <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Hyperconnect
                </span> <br/>Updates & Insights
              </motion.h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Expert insights, trading strategies, and updates from the Hyperliquid ecosystem
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-20 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-400">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 mb-2">No articles found.</p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or check back later for new content.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {posts.map((post) => (
                <motion.article
                  key={post.sys.id}
                  variants={itemVariants}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Featured Image */}
                    {post.fields.featuredImage && (
                      <div className="md:w-80 h-48 md:h-auto overflow-hidden relative flex-shrink-0">
                        <img
                          src={getImageUrl(post.fields.featuredImage, 400)}
                          alt={post.fields.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    <div className="flex-1 p-8">
                      {/* Tags */}
                      {post.fields.tags && Array.isArray(post.fields.tags) && post.fields.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.fields.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-medium rounded-full border border-primary-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors duration-200 leading-tight">
                        <Link href={`/blog/${post.fields.slug}`}>
                          {post.fields.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      {post.fields.excerpt && (
                        <p className="text-gray-300 text-base mb-6 leading-relaxed line-clamp-3">
                          {post.fields.excerpt}
                        </p>
                      )}

                      {/* Meta info and Read more */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{post.fields.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.fields.publishedDate)}</span>
                          </div>
                        </div>

                        <Link
                          href={`/blog/${post.fields.slug}`}
                          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium group/link transition-colors duration-200"
                        >
                          Read article
                          <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}