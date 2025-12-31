/**
 * NFCEducation - Quick micro-UX explaining how NFC works
 */

import { Smartphone, Zap, CheckCircle } from "lucide-react";

export function NFCEducation() {
  return (
    <div className="rounded-2xl bg-secondary/50 p-4">
      <p className="text-xs font-medium text-foreground mb-3">Comment ça marche ?</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Smartphone size={16} className="text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Fonctionne sur iPhone et Android</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Aucune application requise</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle size={16} className="text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Il suffit de taper la carte</p>
        </div>
      </div>
    </div>
  );
}
