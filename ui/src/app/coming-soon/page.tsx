'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation'

export default function ComingSoonPage() {
   const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-bold">Coming Soon</h1>
        <p className="text-xl text-gray-400">This feature is under development.</p>
        {/* Enhanced CTA buttons */}
        <motion.div
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
      </div>
    </div>
  );
}