/**
 * NFCPhysicalCard - Template carte physique NFC premium
 * 
 * EXIGENCES:
 * - Couleur unie unique (palette au choix)
 * - Logo i-wasp CENTRÉ et bien visible
 * - Aucun texte (ni nom, ni titre, ni entreprise)
 * - Aspect objet réel / premium
 * - Rendu fidèle à une vraie carte imprimée
 */

import { useState } from "react";
import iwaspLogoWhite from "@/assets/iwasp-logo-white.png";
import iwaspLogoDark from "@/assets/iwasp-logo.png";

// Palette de couleurs disponibles pour la carte (3 palettes verrouillées)
export const cardColors = [
  { id: "black", name: "Noir", bg: "#0a0a0a", logoVariant: "white" as const },
  { id: "white", name: "Blanc", bg: "#fafafa", logoVariant: "dark" as const },
  { id: "gold", name: "Or", bg: "#c9a962", logoVariant: "dark" as const },
] as const;

export type CardColorId = typeof cardColors[number]["id"];

interface NFCPhysicalCardProps {
  colorId?: CardColorId;
  className?: string;
  showBack?: boolean;
  interactive?: boolean;
  onColorChange?: (colorId: CardColorId) => void;
}

// Dimensions carte CR80 (85.6mm x 53.98mm) - ratio 1.585
const CARD_RATIO = 1.585;

export function NFCPhysicalCard({ 
  colorId = "black",
  className = "",
  showBack = false,
  interactive = false,
  onColorChange,
}: NFCPhysicalCardProps) {
  const [selectedColor, setSelectedColor] = useState<CardColorId>(colorId);
  
  const color = cardColors.find(c => c.id === selectedColor) || cardColors[0];
  const logoSrc = color.logoVariant === "white" ? iwaspLogoWhite : iwaspLogoDark;

  const handleColorSelect = (id: CardColorId) => {
    setSelectedColor(id);
    onColorChange?.(id);
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Sélecteur de couleur (si interactif) */}
      {interactive && (
        <div className="flex justify-center gap-3">
          {cardColors.map((c) => (
            <button
              key={c.id}
              onClick={() => handleColorSelect(c.id)}
              className={`w-10 h-10 rounded-full transition-all shadow-md ${
                selectedColor === c.id 
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" 
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: c.bg }}
              title={c.name}
              aria-label={`Couleur ${c.name}`}
            />
          ))}
        </div>
      )}

      {/* Face avant - Carte premium */}
      <div 
        className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]"
        style={{
          aspectRatio: CARD_RATIO,
          backgroundColor: color.bg,
        }}
      >
        {/* Reflet premium en haut */}
        <div 
          className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
          style={{
            background: color.logoVariant === "white" 
              ? "linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%)"
              : "linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 100%)",
          }}
        />

        {/* Logo i-wasp CENTRÉ - Grande taille, bien visible */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img 
            src={logoSrc} 
            alt="i-wasp" 
            className="w-[55%] max-w-[180px] object-contain drop-shadow-lg"
            style={{
              filter: color.logoVariant === "white" 
                ? "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" 
                : "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
            }}
          />
        </div>

        {/* Indicateur NFC discret - Bas droite */}
        <div className="absolute bottom-4 right-4">
          <NFCIndicator light={color.logoVariant === "white"} />
        </div>

        {/* Ombre de profondeur en bas */}
        <div 
          className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
          }}
        />

        {/* Bordure subtile */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: color.logoVariant === "white" 
              ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
              : "inset 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        />
      </div>

      {/* Face arrière (optionnel) */}
      {showBack && (
        <div 
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            aspectRatio: CARD_RATIO,
            backgroundColor: color.bg,
          }}
        >
          {/* Zone NFC centrale */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${color.logoVariant === "white" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
              }}
            >
              <NFCIndicator light={color.logoVariant === "white"} size="lg" />
            </div>
          </div>

          {/* Badge i-wasp petit - Haut droite */}
          <div className="absolute top-3 right-3">
            <span 
              className="text-[10px] font-medium tracking-wider"
              style={{ 
                color: color.logoVariant === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" 
              }}
            >
              i-wasp
            </span>
          </div>

          {/* Effet surface */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// Indicateur NFC
function NFCIndicator({ light = false, size = "sm" }: { light?: boolean; size?: "sm" | "lg" }) {
  const iconSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  const color = light ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)";
  
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={`${iconSize}`}
      stroke={color}
      strokeWidth="1.5"
    >
      <path d="M6 12a6 6 0 0 0 6 6" strokeLinecap="round" />
      <path d="M6 6a12 12 0 0 0 0 12" strokeLinecap="round" />
      <path d="M12 18a6 6 0 0 0 6-6" strokeLinecap="round" />
      <path d="M18 6a12 12 0 0 1 0 12" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  );
}

// Export de prévisualisation avec dimensions
export function NFCPhysicalCardPreview({ 
  colorId = "black",
  width = 340,
  interactive = true,
}: { 
  colorId?: CardColorId;
  width?: number;
  interactive?: boolean;
}) {
  return (
    <div style={{ width }} className="mx-auto">
      <NFCPhysicalCard colorId={colorId} showBack interactive={interactive} />
      
      {/* Dimensions réelles */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Format CR80 · 85.6 × 54 mm
      </p>
    </div>
  );
}