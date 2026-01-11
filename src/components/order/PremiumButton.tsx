/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PREMIUM BUTTON — VERROUILLÉ
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Bouton optimisé pour tunnel premium mobile-first:
 * - Un seul tap = action immédiate
 * - Feedback visuel instantané (scale + haptic)
 * - Zone tactile large (min 56px)
 * - Pas de double-tap / pas de délai
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { forwardRef, useState, useCallback } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  showArrow?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg" | "xl";
  fullWidth?: boolean;
}

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      children,
      className,
      isLoading = false,
      isSuccess = false,
      showArrow = true,
      variant = "primary",
      size = "lg",
      fullWidth = true,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);

    // Prevent double-tap with instant lock
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (hasClicked || isLoading || disabled) {
          e.preventDefault();
          return;
        }

        setHasClicked(true);
        
        // Haptic feedback (if available)
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        // Call original onClick
        onClick?.(e as any);

        // Reset lock after short delay (for re-enabling if needed)
        setTimeout(() => setHasClicked(false), 1000);
      },
      [hasClicked, isLoading, disabled, onClick]
    );

    const baseStyles = cn(
      // Base styles - VERROUILLÉ
      "relative inline-flex items-center justify-center gap-2",
      "font-semibold text-center",
      "rounded-full", // Pill shape for luxury
      "transition-all duration-200",
      "touch-manipulation", // Disable 300ms delay
      "select-none", // Prevent text selection
      "-webkit-tap-highlight-color-transparent", // Remove iOS tap highlight
      "active:scale-[0.98]", // Instant feedback
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-gold/50",
      
      // Sizes
      size === "default" && "h-12 px-6 text-base",
      size === "lg" && "h-14 px-8 text-lg",
      size === "xl" && "h-16 px-10 text-xl",
      
      // Width
      fullWidth && "w-full",
      
      // Variants using design system
      variant === "primary" && [
        "bg-gradient-to-r from-soft-gold to-copper",
        "text-deep-black",
        "shadow-lg shadow-soft-gold/25",
        "hover:shadow-xl hover:shadow-soft-gold/30",
        "hover:brightness-110",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      ],
      variant === "secondary" && [
        "bg-anthracite",
        "text-off-white",
        "border border-anthracite-light",
        "hover:bg-anthracite-light",
      ],
      variant === "ghost" && [
        "bg-transparent",
        "text-off-white",
        "hover:bg-anthracite/50",
      ],
      
      className
    );

    return (
      <motion.button
        ref={ref}
        className={baseStyles}
        disabled={disabled || isLoading || hasClicked}
        onClick={handleClick}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        whileTap={{ scale: 0.98 }}
        animate={{
          scale: isPressed ? 0.98 : 1,
        }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {/* Loading State */}
        {isLoading && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}

        {/* Success State */}
        {isSuccess && !isLoading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="h-5 w-5" />
          </motion.div>
        )}

        {/* Children (label) */}
        {!isLoading && !isSuccess && children}

        {/* Arrow indicator */}
        {showArrow && !isLoading && !isSuccess && variant === "primary" && (
          <ArrowRight className="h-5 w-5" />
        )}
      </motion.button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export default PremiumButton;
