"use client";

import { motion } from "framer-motion";

interface ChartLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ChartLoader = ({ 
  message = "Loading chart data...", 
  size = "md",
  className = ""
}: ChartLoaderProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2"
  };

  const glowSizes = {
    sm: ["0 0 10px rgba(0, 212, 170, 0.3)", "0 0 20px rgba(0, 212, 170, 0.6)", "0 0 10px rgba(0, 212, 170, 0.3)"],
    md: ["0 0 15px rgba(0, 212, 170, 0.3)", "0 0 30px rgba(0, 212, 170, 0.6)", "0 0 15px rgba(0, 212, 170, 0.3)"],
    lg: ["0 0 20px rgba(0, 212, 170, 0.3)", "0 0 40px rgba(0, 212, 170, 0.6)", "0 0 20px rgba(0, 212, 170, 0.3)"]
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} border-2 border-gray-700 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-transparent border-t-[#00d4aa] rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className={`${dotSizes[size]} bg-[#00d4aa] rounded-full`}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full opacity-20`}
          animate={{ 
            boxShadow: glowSizes[size]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      {/* Loading message */}
      {message && (
        <motion.p 
          className="mt-4 text-sm text-gray-400 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};