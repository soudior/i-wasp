/**
 * RestoreDraftBanner - Banner to restore saved draft
 */

import { motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/hooks/useAutoSave";

interface RestoreDraftBannerProps {
  lastSaved: Date | null;
  onRestore: () => void;
  onDismiss: () => void;
}

export function RestoreDraftBanner({ 
  lastSaved, 
  onRestore, 
  onDismiss 
}: RestoreDraftBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <RotateCcw className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Brouillon trouvé</p>
            <p className="text-xs text-muted-foreground">
              Dernière sauvegarde : {formatRelativeTime(lastSaved)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDismiss}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Ignorer
          </Button>
          <Button 
            size="sm" 
            onClick={onRestore}
            className="h-8"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Restaurer
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
