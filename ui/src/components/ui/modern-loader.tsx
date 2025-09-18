"use client";

import { motion } from "framer-motion";
import { cn } from "@brother-terminal/lib/utils";

interface ModernLoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dual-ring" | "dots";
  className?: string;
}

export const ModernLoader = ({ 
  size = "md", 
  variant = "spinner",
  className 
}: ModernLoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2"
  };

  if (variant === "spinner") {
    return (
      <motion.div
        className={cn(
          sizeClasses[size],
          "border-2 border-transparent border-t-current rounded-full",
          className
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (variant === "dual-ring") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <motion.div
          className={cn(sizeClasses[size], "border-2 border-border rounded-full")}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={cn(
            "absolute inset-0",
            sizeClasses[size], 
            "border-2 border-transparent border-t-primary rounded-full"
          )}
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className={cn(dotSizes[size], "bg-primary rounded-full")}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(dotSizes[size], "bg-current rounded-full")}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};