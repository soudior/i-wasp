/**
 * ValidationSummary - Shows what's missing before user can proceed
 * 
 * Features:
 * - Clear list of missing/invalid items
 * - Premium design
 * - Smooth animations
 */

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationItem {
  key: string;
  label: string;
  isValid: boolean;
  message?: string;
}

interface ValidationSummaryProps {
  items: ValidationItem[];
  className?: string;
}

export function ValidationSummary({ items, className }: ValidationSummaryProps) {
  const invalidItems = items.filter((item) => !item.isValid);
  const allValid = invalidItems.length === 0;

  if (allValid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
            Pour continuer, complétez :
          </p>
          <ul className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {invalidItems.map((item) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {item.message || item.label}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Compact validation checklist
 */
interface ValidationChecklistProps {
  items: ValidationItem[];
  className?: string;
}

export function ValidationChecklist({ items, className }: ValidationChecklistProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <motion.div
          key={item.key}
          className={cn(
            "flex items-center gap-2 text-sm transition-colors",
            item.isValid
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground"
          )}
          animate={{ opacity: item.isValid ? 1 : 0.7 }}
        >
          {item.isValid ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-current" />
          )}
          <span className={item.isValid ? "line-through" : ""}>{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default ValidationSummary;
