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
        <div className="flex justify-center gap-6">
          {cardColors.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleColorSelect(c.id)}
                className={`
                  relative w-12 h-12 rounded-full transition-all duration-300 ease-out
                  shadow-lg hover:shadow-xl
                  before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300
                  before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0
                  hover:before:opacity-100
                  after:absolute after:-inset-1 after:rounded-full after:transition-all after:duration-300
                  after:bg-gradient-to-br after:from-white/20 after:to-transparent after:opacity-0 after:-z-10 after:blur-sm
                  hover:after:opacity-60
                  ${selectedColor === c.id 
                    ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-background scale-110 shadow-amber-500/30" 
                    : "hover:scale-110 hover:-translate-y-1"
                  }
                `}
                style={{ 
                  backgroundColor: c.bg,
                  boxShadow: selectedColor === c.id 
                    ? `0 8px 24px -4px ${c.bg}60, 0 4px 12px -2px rgba(0,0,0,0.3)`
                    : `0 4px 12px -2px ${c.bg}40, 0 2px 6px -1px rgba(0,0,0,0.2)`
                }}
                title={c.name}
                aria-label={`Couleur ${c.name}`}
              >
                {/* Inner glow effect */}
                <span 
                  className={`
                    absolute inset-1 rounded-full transition-opacity duration-300
                    ${selectedColor === c.id ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${c.logoVariant === 'white' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'}, transparent 60%)`,
                  }}
                />
                {/* Check mark for selected */}
                {selectedColor === c.id && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg 
                      className={`w-5 h-5 ${c.logoVariant === 'white' ? 'text-white' : 'text-gray-800'} drop-shadow-sm`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
              {/* Color name label */}
              <span 
                className={`
                  text-[11px] font-medium uppercase tracking-wider transition-all duration-300
                  ${selectedColor === c.id ? 'text-amber-400' : 'text-muted-foreground'}
                `}
              >
                {c.name}
              </span>
            </div>
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