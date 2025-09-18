'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Target, TrendingUp, Bot } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Brother Terminal",
    "description": "Professional trading terminal powered by Hyperliquid with AI and advanced automation",
    "url": "https://brotherterminal.app",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Brother Terminal"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />


      {/* Mouse follower effect */}
      <div 
        className="fixed pointer-events-none z-0 w-96 h-96 rounded-full opacity-20 blur-3xl bg-gradient-radial from-primary/30 to-transparent transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Simplified background to match rest of content */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/5 to-transparent"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center"
        >
          {/* Enhanced badge with animation */}
          <motion.div 
            variants={itemVariants}
            className="relative inline-flex items-center px-6 py-3 rounded-lg bg-card border border-border text-foreground text-sm font-medium mb-12 group hover:bg-accent transition-all duration-500 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span>AI-Powered Terminal with Advanced Triggers</span>
          </motion.div>
          
          {/* Enhanced title with more dynamic effects */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-[0.9] max-w-5xl mx-auto"
          >
            <motion.span 
              className="block text-foreground relative"
              variants={itemVariants}
            >
              <span className="relative z-10">Brother Terminal</span>
              <motion.div
                animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-foreground/10 to-transparent rounded-lg blur-xl"
              ></motion.div>
            </motion.span>
            <motion.span 
              className="block relative"
              variants={itemVariants}
            >
              <motion.div
                animate={{ 
                  background: [
                    'linear-gradient(45deg, rgba(240,255,0,0.3), rgba(240,255,0,0.1))',
                    'linear-gradient(45deg, rgba(240,255,0,0.1), rgba(240,255,0,0.3))'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 rounded-lg blur-2xl"
              ></motion.div>
            </motion.span>
          </motion.h1>
          
          {/* Enhanced description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-normal relative"
          >
            <span className="relative z-10">
              Professional trading terminal powered by <span className="text-primary font-medium">Hyperliquid</span> with advanced AI automation and intelligent execution. 
              Experience sophisticated DCA strategies, AI-driven insights, volume/OI triggered orders, and automated risk management.
            </span>
            <motion.div
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-lg blur-sm"
            ></motion.div>
          </motion.p>

          {/* Value propositions with icons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-4xl mx-auto flex-wrap"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border backdrop-blur-sm hover:border-primary/50 hover:text-foreground transition-all duration-300"
            >
              <Bot className="w-4 h-4 text-primary" />
              <span>AI Assistant</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border backdrop-blur-sm hover:border-primary/50 hover:text-foreground transition-all duration-300"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span>Smart DCA</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border backdrop-blur-sm hover:border-primary/50 hover:text-foreground transition-all duration-300"
            >
              <Target className="w-4 h-4 text-primary" />
              <span>Volume/OI Triggers</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border backdrop-blur-sm hover:border-primary/50 hover:text-foreground transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>TWAP Execution</span>
            </motion.div>
          </motion.div>
          
          
          {/* Enhanced CTA buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button 
              onClick={() => router.push('/trade')}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 30px rgba(240, 255, 0, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent skew-x-12"
              ></motion.div>
              <span className="relative z-10">Launch App</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </motion.button>
          </motion.div>

        </motion.div>
      </section>

    </div>
  )
}