/**
 * AutoSaveIndicator - Visual indicator for auto-save status
 */

import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, Check, Loader2 } from "lucide-react";
import { SaveStatus, formatRelativeTime } from "@/hooks/useAutoSave";

interface AutoSaveIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
  className?: string;
}

export function AutoSaveIndicator({ 
  status, 
  lastSaved,
  className = "" 
}: AutoSaveIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      <AnimatePresence mode="wait">
        {status === "saving" && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Sauvegarde...</span>
          </motion.div>
        )}

        {status === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-green-600"
          >
            <Check className="h-3 w-3" />
            <span>Sauvegardé</span>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 text-destructive"
          >
            <CloudOff className="h-3 w-3" />
            <span>Erreur de sauvegarde</span>
          </motion.div>
        )}

        {status === "idle" && lastSaved && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <Cloud className="h-3 w-3" />
            <span>{formatRelativeTime(lastSaved)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
