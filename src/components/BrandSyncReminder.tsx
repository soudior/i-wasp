/**
 * BrandSyncReminder - Rappel dashboard synchronisation Brand Assets
 */

import { motion } from "framer-motion";
import { useBrand } from "@/contexts/BrandContext";
import { Link } from "react-router-dom";
import { CheckCircle2, Link2, ExternalLink } from "lucide-react";

export function BrandSyncReminder() {
  const { hasAllPrintAssets } = useBrand();

  return (
    <motion.div
      className="bg-primary/10 border border-primary/30 rounded-xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/20">
          <Link2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm">
              Identité physique & digitale synchronisées
            </p>
            {hasAllPrintAssets && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Toute modification passe par Brand Assets. Aucune autre logique de marque autorisée.
          </p>
          <Link 
            to="/brand-assets"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Gérer Brand Assets
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
