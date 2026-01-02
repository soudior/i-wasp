/**
 * NFCValueProposition - Benefits of physical NFC card before CTA
 */

import { Infinity, TreePine, RefreshCw } from "lucide-react";
import nfcCardImage from "@/assets/cards/card-black-matte.webp";

const benefits = [
  {
    icon: Infinity,
    text: "Partage illimité",
  },
  {
    icon: TreePine,
    text: "Zéro papier",
  },
  {
    icon: RefreshCw,
    text: "Mettez à jour vos infos à tout moment",
  },
];

export function NFCValueProposition() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 p-5 border border-border/50">
      {/* Card visual */}
      <div className="flex justify-center mb-5">
        <div className="relative">
          <img 
            src={nfcCardImage} 
            alt="Carte NFC IWASP" 
            className="w-48 h-auto rounded-xl shadow-2xl"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span className="text-xs font-bold text-primary-foreground">NFC</span>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <benefit.icon size={16} className="text-primary" />
            </div>
            <p className="text-sm text-foreground">{benefit.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
