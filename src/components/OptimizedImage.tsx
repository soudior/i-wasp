import { useState, useRef, useEffect } from "react";

/**
 * OptimizedImage - Image optimisée avec lazy loading natif
 * 
 * Fonctionnalités :
 * - loading="lazy" natif
 * - Placeholder skeleton pendant le chargement
 * - Fade-in smooth à l'apparition
 * - Fallback si erreur de chargement
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // Si true, pas de lazy loading (images above the fold)
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  aspectRatio,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  }[objectFit];

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <span className="text-zinc-500 text-sm">Image indisponible</span>
        </div>
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full ${objectFitClass} transition-opacity duration-300 ${
          isLoaded && !hasError ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default OptimizedImage;
