/**
 * NFCPhysicalCard - Template carte physique NFC automatique
 * 
 * Génération automatique basée sur:
 * - Logo client (couleurs extraites)
 * - Badge i-wasp fixe en haut à droite
 * - Aucun texte, nom, icône ou mention marketing
 * 
 * La carte est un objet fonctionnel, pas un support de communication.
 */

import { useEffect, useState } from "react";
import { extractColorsFromLogo, type ColorPalette } from "@/lib/adaptiveTemplateEngine";

interface NFCPhysicalCardProps {
  logoUrl?: string;
  className?: string;
  showBack?: boolean;
}

// Dimensions carte CR80 (85.6mm x 53.98mm) - ratio 1.585
const CARD_RATIO = 1.585;

export function NFCPhysicalCard({ 
  logoUrl, 
  className = "",
  showBack = false 
}: NFCPhysicalCardProps) {
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extraction des couleurs du logo client
  useEffect(() => {
    if (!logoUrl) {
      // Palette par défaut si pas de logo
      setPalette({
        primary: "0 0% 15%",
        secondary: "0 0% 25%",
        accent: "0 0% 95%",
        background: "0 0% 8%",
        foreground: "0 0% 98%",
      });
      return;
    }

    setIsLoading(true);
    extractColorsFromLogo(logoUrl)
      .then(setPalette)
      .catch(() => {
        // Fallback palette
        setPalette({
          primary: "0 0% 15%",
          secondary: "0 0% 25%",
          accent: "0 0% 95%",
          background: "0 0% 8%",
          foreground: "0 0% 98%",
        });
      })
      .finally(() => setIsLoading(false));
  }, [logoUrl]);

  const primaryColor = palette ? `hsl(${palette.primary})` : "hsl(0, 0%, 15%)";
  const backgroundColor = palette ? `hsl(${palette.background})` : "hsl(0, 0%, 8%)";
  const foregroundColor = palette ? `hsl(${palette.foreground})` : "hsl(0, 0%, 98%)";

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Face avant */}
      <div 
        className="relative rounded-xl overflow-hidden shadow-2xl"
        style={{
          aspectRatio: CARD_RATIO,
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor} 100%)`,
        }}
      >
        {/* Badge i-wasp - Position fixe haut droite */}
        <div className="absolute top-3 right-3 z-10">
          <IWASPCardBadge color={foregroundColor} />
        </div>

        {/* Logo client - Centré */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="" 
              className="max-w-[60%] max-h-[50%] object-contain opacity-95"
              crossOrigin="anonymous"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-full border-2 opacity-30"
              style={{ borderColor: foregroundColor }}
            />
          )}
        </div>

        {/* Indicateur NFC - Discret, bas droite */}
        <div className="absolute bottom-3 right-3">
          <NFCIndicator color={foregroundColor} />
        </div>

        {/* Effet de surface premium */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Face arrière (optionnel) */}
      {showBack && (
        <div 
          className="relative rounded-xl overflow-hidden shadow-2xl"
          style={{
            aspectRatio: CARD_RATIO,
            background: primaryColor,
          }}
        >
          {/* Zone NFC */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-12 h-12 rounded-full border opacity-20"
              style={{ borderColor: foregroundColor }}
            />
          </div>

          {/* Badge i-wasp dos */}
          <div className="absolute top-3 right-3">
            <IWASPCardBadge color={foregroundColor} small />
          </div>

          {/* Effet surface */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// Badge i-wasp pour carte physique
function IWASPCardBadge({ color, small = false }: { color: string; small?: boolean }) {
  const size = small ? "text-[8px]" : "text-[10px]";
  
  return (
    <div 
      className={`flex items-center gap-1 ${size} font-medium tracking-wide opacity-70`}
      style={{ color }}
    >
      <span>i-wasp</span>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className={small ? "w-2.5 h-2.5" : "w-3 h-3"}
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M8.5 12.5a4 4 0 0 1 0-5.5" strokeLinecap="round" />
        <path d="M5.5 15a7 7 0 0 1 0-10" strokeLinecap="round" />
        <path d="M15.5 12.5a4 4 0 0 0 0-5.5" strokeLinecap="round" />
        <path d="M18.5 15a7 7 0 0 0 0-10" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Indicateur NFC discret
function NFCIndicator({ color }: { color: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className="w-4 h-4 opacity-40"
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

// Export de prévisualisation avec dimensions réelles
export function NFCPhysicalCardPreview({ 
  logoUrl,
  width = 340, // ~4x taille réelle pour preview
}: { 
  logoUrl?: string;
  width?: number;
}) {
  return (
    <div style={{ width }} className="mx-auto">
      <NFCPhysicalCard logoUrl={logoUrl} showBack />
      
      {/* Dimensions réelles */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Format CR80 · 85.6 × 54 mm
      </p>
    </div>
  );
}