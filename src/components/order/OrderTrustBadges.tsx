/**
 * OrderTrustBadges - Pre-payment reassurance badges
 * Shows key benefits to reduce friction
 */

import { Smartphone, Zap, RefreshCw, Truck } from "lucide-react";

const badges = [
  {
    icon: Smartphone,
    text: "Compatible iPhone & Android",
  },
  {
    icon: Zap,
    text: "Aucune application requise",
  },
  {
    icon: RefreshCw,
    text: "Modifiable après achat",
  },
  {
    icon: Truck,
    text: "Livraison rapide",
  },
];

interface OrderTrustBadgesProps {
  compact?: boolean;
}

export function OrderTrustBadges({ compact = false }: OrderTrustBadgesProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <div 
            key={index}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/70 text-xs text-muted-foreground"
          >
            <badge.icon size={12} className="text-primary" />
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-secondary/50 p-4">
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <badge.icon size={14} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-tight">{badge.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
