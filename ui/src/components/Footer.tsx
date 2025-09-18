'use client'

import { motion } from 'framer-motion'
import { Twitter, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold text-foreground mb-4"
            >
              Brother Terminal
            </motion.div>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              Professional trading terminal powered by Hyperliquid with AI and advanced automation
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://x.com/hyperconnect_hl" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent hover:border-primary/20 transition-all duration-200"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="https://hlconnect.xyz" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent hover:border-primary/20 transition-all duration-200"
              >
                <Globe className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="md:text-right">
            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookie-policy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-muted-foreground text-sm">
                © 2025 Brother Terminal. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Built for</span>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-primary font-medium"
              >
                Hyperliquid
              </motion.div>
              <span>ecosystem</span>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}