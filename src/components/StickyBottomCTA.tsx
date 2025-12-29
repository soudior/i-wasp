/**
 * Sticky Bottom CTA Component
 * 
 * iOS-style fixed bottom action button.
 * Features:
 * - Safe area padding
 * - Loading states
 * - Disabled states with proper feedback
 * - Glassmorphism background
 */

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyBottomCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "chrome" | "destructive";
  className?: string;
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  show?: boolean;
}

export function StickyBottomCTA({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "chrome",
  className,
  secondaryAction,
  show = true,
}: StickyBottomCTAProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ 
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)" // Account for tab bar
      }}
    >
      {/* Glassmorphism background with gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />
      
      <div className="relative px-4 py-3 flex flex-col gap-2">
        {secondaryAction && (
          <Button
            variant="ghost"
            size="lg"
            onClick={secondaryAction.onClick}
            className="w-full h-12 text-muted-foreground"
          >
            {secondaryAction.label}
          </Button>
        )}
        
        <motion.div
          whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            variant={variant}
            size="lg"
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
              "w-full h-14 text-base font-semibold rounded-2xl",
              "shadow-lg shadow-background/50",
              className
            )}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              children
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
