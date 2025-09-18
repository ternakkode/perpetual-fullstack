"use client";

import { motion } from "framer-motion";

export const AppLoader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 border-4 border-border rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 w-16 h-16 rounded-full opacity-20"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(240, 255, 0, 0.3)",
              "0 0 40px rgba(240, 255, 0, 0.6)",
              "0 0 20px rgba(240, 255, 0, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};
