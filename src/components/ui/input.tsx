/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INPUT — COMPOSANT MOBILE-FIRST
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Optimisations :
 * - Font-size 16px pour éviter le zoom iOS
 * - Touch manipulation pour réponse instantanée
 * - Hauteur minimum 44px (standard Apple HIG)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-xl border border-input bg-background px-4 py-3 ring-offset-background",
          // Typography - 16px to prevent iOS zoom
          "text-base placeholder:text-muted-foreground",
          // Focus states
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Mobile optimization - VERROUILLÉ
          "touch-manipulation",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
