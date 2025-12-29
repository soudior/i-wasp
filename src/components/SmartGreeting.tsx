/**
 * Smart Greeting Component
 * Shows personalized greeting based on context
 * Subtle, elegant animation
 */

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon, Sun, ArrowLeft } from "lucide-react";
import { SmartContext } from "@/hooks/useSmartContext";

interface SmartGreetingProps {
  context: SmartContext;
  className?: string;
}

export function SmartGreeting({ context, className = "" }: SmartGreetingProps) {
  const { greeting, isReturningVisitor, isNight, contextMode } = context;
  
  // Don't show for first-time visitors in default mode (let them focus on the card)
  if (!isReturningVisitor && contextMode === "default") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex items-center justify-center gap-2 py-3 px-4 ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="flex items-center gap-2"
        >
          {isReturningVisitor ? (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Sparkles size={14} className="text-amber-400/60" />
            </motion.div>
          ) : isNight ? (
            <Moon size={14} className="text-blue-400/60" />
          ) : (
            <Sun size={14} className="text-amber-400/60" />
          )}
          
          <span className="text-[13px] font-light text-foreground/60">
            {greeting}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Context badge for hotel/event modes
export function ContextBadge({ context }: { context: SmartContext }) {
  const { contextMode, showWifi, showConcierge } = context;
  
  if (contextMode === "default") return null;

  const badges: { label: string; icon: React.ReactNode }[] = [];
  
  if (contextMode === "hotel") {
    badges.push({ label: "Mode Hôtel", icon: <span className="text-xs">🏨</span> });
  } else if (contextMode === "event") {
    badges.push({ label: "Mode Événement", icon: <span className="text-xs">🎪</span> });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center justify-center gap-2 mb-4"
    >
      {badges.map((badge, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-[11px] text-foreground/50"
        >
          {badge.icon}
          {badge.label}
        </span>
      ))}
    </motion.div>
  );
}
