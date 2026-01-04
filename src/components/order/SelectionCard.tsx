/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SELECTION CARD — VERROUILLÉ
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Carte de sélection optimisée mobile-first:
 * - Un seul tap = sélection immédiate
 * - Feedback visuel instantané
 * - Zone tactile large
 * - Design Cupertino premium
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  image?: string;
  badge?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children?: ReactNode;
  className?: string;
  size?: "compact" | "default" | "large";
}

export function SelectionCard({
  id,
  title,
  subtitle,
  description,
  icon,
  image,
  badge,
  isSelected,
  onSelect,
  children,
  className,
  size = "default",
}: SelectionCardProps) {
  
  const handleClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onSelect(id);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        // Base
        "relative w-full text-left rounded-2xl border-2 overflow-hidden",
        "transition-all duration-200",
        "touch-manipulation select-none",
        "-webkit-tap-highlight-color-transparent",
        
        // Size variants
        size === "compact" && "p-4",
        size === "default" && "p-5",
        size === "large" && "p-6",
        
        // Selection state
        isSelected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-border bg-card hover:border-primary/50 hover:shadow-md",
        
        className
      )}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {/* Selection checkmark */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10"
        >
          <Check size={14} className="text-primary-foreground" strokeWidth={3} />
        </motion.div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold z-10">
          {badge}
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="relative aspect-[16/10] -mx-5 -mt-5 mb-4 overflow-hidden bg-secondary">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        {icon && !image && (
          <div className={cn(
            "flex-shrink-0 rounded-xl flex items-center justify-center",
            size === "compact" && "w-10 h-10",
            size === "default" && "w-12 h-12",
            size === "large" && "w-14 h-14",
            isSelected ? "bg-primary/20" : "bg-primary/10"
          )}>
            <div className={cn(
              "text-primary",
              size === "compact" && "[&>svg]:w-5 [&>svg]:h-5",
              size === "default" && "[&>svg]:w-6 [&>svg]:h-6",
              size === "large" && "[&>svg]:w-7 [&>svg]:h-7",
            )}>
              {icon}
            </div>
          </div>
        )}

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold",
            size === "compact" && "text-base",
            size === "default" && "text-lg",
            size === "large" && "text-xl",
          )}>
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-sm text-primary mt-0.5">
              {subtitle}
            </p>
          )}
          
          {description && (
            <p className={cn(
              "text-muted-foreground mt-1",
              size === "compact" && "text-xs",
              size === "default" && "text-sm",
              size === "large" && "text-sm",
            )}>
              {description}
            </p>
          )}
          
          {/* Custom children content */}
          {children}
        </div>
      </div>
    </motion.button>
  );
}

export default SelectionCard;
