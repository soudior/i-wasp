/**
 * i-WASP LOGO OFFICIEL — SIGNATURE VERROUILLÉE
 * 
 * Ce logo est la référence absolue pour toute la plateforme.
 * - Toujours noir sur fond blanc
 * - Mêmes proportions que sur la carte physique
 * - Positionnement discret et premium
 * 
 * NE PAS MODIFIER sans validation design.
 */

interface IWASPLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWaves?: boolean;
  variant?: "dark" | "light"; // Pour compatibilité - ignoré (toujours foreground)
}

const sizeConfig = {
  xs: { text: "text-xs", height: "h-3", gap: "gap-0.5" },
  sm: { text: "text-sm", height: "h-4", gap: "gap-1" },
  md: { text: "text-base", height: "h-5", gap: "gap-1.5" },
  lg: { text: "text-lg", height: "h-6", gap: "gap-2" },
  xl: { text: "text-xl", height: "h-7", gap: "gap-2" },
};

export function IWASPLogo({ 
  className = "", 
  size = "md",
  showWaves = true
}: IWASPLogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center ${config.gap} ${className}`}>
      {/* Logo texte i-Wasp */}
      <span 
        className={`${config.text} font-semibold tracking-tight text-foreground`}
        style={{ letterSpacing: '-0.02em' }}
      >
        i-Wasp
      </span>
      
      {/* Ondes NFC ))) */}
      {showWaves && (
        <svg 
          viewBox="0 0 24 24" 
          className={`${config.height} text-foreground`}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        >
          <path d="M5 12a4 4 0 0 1 4-4" />
          <path d="M5 12a8 8 0 0 1 8-8" />
          <path d="M5 12a12 12 0 0 1 12-12" />
          <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      )}
    </div>
  );
}

/**
 * Logo compact pour espaces restreints (footer, badges)
 */
export function IWASPLogoCompact({ 
  className = "", 
  size = "sm" 
}: Omit<IWASPLogoProps, 'showWaves'>) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center ${config.gap} ${className}`}>
      <span 
        className={`${config.text} font-semibold tracking-tight text-foreground`}
        style={{ letterSpacing: '-0.02em' }}
      >
        i-Wasp
      </span>
      <svg 
        viewBox="0 0 16 16" 
        className={config.height}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      >
        <path d="M3 8a3 3 0 0 1 3-3" />
        <path d="M3 8a6 6 0 0 1 6-6" />
        <path d="M3 8a9 9 0 0 1 9-9" />
        <circle cx="3" cy="8" r="1" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}

/**
 * Badge logo pour cartes et templates clients
 * Positionnement: toujours en haut à droite
 */
export function IWASPBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1 text-muted-foreground ${className}`}>
      <span className="text-[10px] font-medium tracking-widest uppercase">
        Powered by
      </span>
      <IWASPLogoCompact size="xs" />
    </div>
  );
}

/**
 * Alias pour compatibilité avec l'ancien code
 */
export const IWASPLogoSimple = IWASPLogoCompact;
