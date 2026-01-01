/**
 * SmartContinueButton - Disabled until form is valid
 * 
 * Features:
 * - Disabled when form is invalid
 * - Shows blocking message
 * - Premium animation
 * - Human-friendly feedback
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SmartContinueButtonProps {
  onClick: () => void;
  canProceed: boolean;
  blockingMessage?: string;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

export function SmartContinueButton({
  onClick,
  canProceed,
  blockingMessage,
  isLoading = false,
  children = "Continuer",
  className,
}: SmartContinueButtonProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      {/* Blocking message */}
      <AnimatePresence mode="wait">
        {!canProceed && blockingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{blockingMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <Button
        size="lg"
        onClick={onClick}
        disabled={!canProceed || isLoading}
        className={cn(
          "px-8 h-14 text-lg rounded-full transition-all duration-300",
          canProceed
            ? "bg-gradient-to-r from-primary to-amber-500 hover:shadow-lg hover:shadow-primary/25"
            : "bg-muted text-muted-foreground cursor-not-allowed",
          className
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            {children}
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </div>
  );
}

export default SmartContinueButton;
