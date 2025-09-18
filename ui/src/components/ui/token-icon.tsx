"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@brother-terminal/lib/utils";

// Simplified - no variants needed for plain images

interface TokenIconProps {
  className?: string;
  size?: string;
  symbol: string;
  lazyLoad?: boolean;
  lazyLoadOffset?: string;
}

const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const TokenIcon = ({
  className = "",
  size = "16",
  symbol,
  lazyLoad = true,
  lazyLoadOffset = "200px",
}: TokenIconProps) => {
  const [imageExists, setImageExists] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const iconRef = useRef<HTMLImageElement>(null);

  const dimensions = parseInt(size);
  const fallbackLetter = symbol ? symbol.charAt(0).toUpperCase() : "?";

  const processedSymbol = symbol.startsWith("k")
    ? symbol.slice(1).toUpperCase()
    : symbol.toUpperCase();

  const iconUrl = `https://res.cloudinary.com/dxgjl20yb/image/upload/f_webp,q_auto/icons/${processedSymbol}.webp`;

  useEffect(() => {
    setImageExists(null);
  }, [symbol]);

  useEffect(() => {
    if (!isVisible) return;

    const verifyImage = async () => {
      const exists = await checkImageExists(iconUrl);
      setImageExists(exists);
    };

    verifyImage();
  }, [iconUrl, isVisible]);

  useEffect(() => {
    if (!lazyLoad || !iconRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Disconnect once visible
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: lazyLoadOffset,
        threshold: 0.1,
      }
    );

    observer.observe(iconRef.current);

    return () => {
      observer.disconnect();
    };
  }, [lazyLoad, lazyLoadOffset]);

  const handleImageError = () => {
    console.log(`Image failed to load at render time: ${iconUrl}`);
    setImageExists(false);
  };

  return (
    <>
      {isVisible && imageExists !== false && (
        <img
          ref={iconRef}
          alt={`${symbol} icon`}
          className={cn("object-cover rounded-full overflow-hidden flex-shrink-0", className)}
          style={{ width: `${dimensions}px`, height: `${dimensions}px` }}
          src={iconUrl}
          onError={handleImageError}
        />
      )}
      {(!isVisible || imageExists === false) && (
        <div
          ref={iconRef}
          className={cn("flex items-center justify-center bg-gray-100 text-gray-600 font-medium rounded-full flex-shrink-0", className)}
          style={{ 
            width: `${dimensions}px`, 
            height: `${dimensions}px`,
            fontSize: `${dimensions * 0.6}px`
          }}
        >
          {fallbackLetter}
        </div>
      )}
    </>
  );
};

export default TokenIcon;
