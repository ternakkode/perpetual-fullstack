"use client";

import { useCallback, useRef, useState } from "react";
import html2canvas from "html2canvas";

interface UseToImageOptions {
  quality?: number;
  format?: "png" | "jpeg";
  onSuccess?: (dataUrl: string) => void;
  onError?: (error: Error) => void;
}

interface UseToImageState {
  isLoading: boolean;
  error: Error | null;
}

export const useToImage = (options: UseToImageOptions = {}) => {
  const {
    quality = 0.8,
    format = "png",
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UseToImageState>({
    isLoading: false,
    error: null,
  });

  const elementRef = useRef<HTMLElement>(null);

  const generateImage = useCallback(async () => {
    if (!elementRef.current) {
      const error = new Error("No element reference found");
      setState({ isLoading: false, error });
      onError?.(error);
      return;
    }

    setState({ isLoading: true, error: null });

    try {
      const canvas = await html2canvas(elementRef.current, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        scale: 2, // For better quality
      });

      const dataUrl = canvas.toDataURL(`image/${format}`, quality);
      
      setState({ isLoading: false, error: null });
      onSuccess?.(dataUrl);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      setState({ isLoading: false, error: err });
      onError?.(err);
    }
  }, [quality, format, onSuccess, onError]);

  return [state, generateImage, elementRef] as const;
};