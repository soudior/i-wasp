/**
 * OptimizedImage - Composant image avec lazy loading natif
 * 
 * Ajoute automatiquement loading="lazy" et decoding="async" pour de meilleures performances.
 */

import { forwardRef, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Désactiver le lazy loading pour les images above the fold */
  eager?: boolean;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ className, eager = false, alt = "", ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn(className)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...props}
      />
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
