/**
 * LinkedCardPreview - Shows which digital card is linked to the order
 * Provides clarity and confirmation
 */

import { Link2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkedCardPreviewProps {
  cardName: string;
  cardSlug?: string;
  photoUrl?: string | null;
  title?: string | null;
  company?: string | null;
  className?: string;
}

export function LinkedCardPreview({ 
  cardName, 
  cardSlug,
  photoUrl,
  title,
  company,
  className 
}: LinkedCardPreviewProps) {
  return (
    <div className={cn("rounded-xl bg-primary/5 border border-primary/20 p-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Link2 size={12} className="text-primary" />
        </div>
        <p className="text-xs font-medium text-primary">Carte digitale liée</p>
      </div>

      {/* Card preview */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={cardName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{cardName}</p>
          {(title || company) && (
            <p className="text-xs text-muted-foreground truncate">
              {title}{title && company && " · "}{company}
            </p>
          )}
          {cardSlug && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              iwasp.me/c/{cardSlug}
            </p>
          )}
        </div>
      </div>

      {/* Info message */}
      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
        Cette carte NFC utilisera votre profil digital actuel. Toute modification sera automatiquement reflétée.
      </p>
    </div>
  );
}
