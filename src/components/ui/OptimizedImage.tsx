/**
 * OptimizedImage - Lazy loading image with blur placeholder
 * Premium loading experience for mobile performance
 */

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  blurColor?: string;
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  aspectRatio = "16/10",
  blurColor = "rgba(30, 20, 15, 0.8)",
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before visible
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      {/* Blur Placeholder */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
        style={{
          background: blurColor,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Shimmer Effect */}
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255,255,255,0.05) 50%,
              transparent 100%
            )`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>

      {/* Actual Image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Add shimmer keyframes via style tag */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
