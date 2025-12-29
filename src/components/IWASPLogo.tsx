/**
 * IWASP Official Logo Component
 * Screen = Print | Zero compromise.
 * 
 * This logo is ALWAYS positioned top-right on all cards.
 * Size and position are FIXED and cannot be modified by clients.
 */

interface IWASPLogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

export function IWASPLogo({ 
  className = "", 
  variant = "dark",
  size = "md" 
}: IWASPLogoProps) {
  const sizeClasses = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6"
  };

  const colorClass = variant === "light" 
    ? "text-foreground" 
    : "text-foreground/80";

  return (
    <div className={`flex items-center gap-1 ${colorClass} ${className}`}>
      {/* IWasp text with stylized I */}
      <svg 
        viewBox="0 0 100 24" 
        className={sizeClasses[size]}
        fill="currentColor"
      >
        {/* Stylized I with antenna */}
        <path d="M2 4 L2 20 M0 4 L4 4 M0 20 L4 20" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        {/* Antenna dot */}
        <circle cx="2" cy="1" r="1.2" fill="currentColor" />
        
        {/* W */}
        <path d="M10 4 L14 20 L18 8 L22 20 L26 4" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* a */}
        <path d="M32 10 Q32 8 36 8 Q40 8 40 12 L40 20 M40 14 Q40 12 36 12 Q32 12 32 16 Q32 20 36 20 Q40 20 40 16" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* s */}
        <path d="M52 10 Q52 8 48 8 Q44 8 44 11 Q44 14 48 14 Q52 14 52 17 Q52 20 48 20 Q44 20 44 18" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* p */}
        <path d="M56 8 L56 24 M56 14 Q56 8 62 8 Q68 8 68 14 Q68 20 62 20 Q56 20 56 14" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* NFC waves */}
      <svg 
        viewBox="0 0 24 24" 
        className={sizeClasses[size]}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      >
        <path d="M2 12a5 5 0 0 1 5-5" />
        <path d="M2 12a9 9 0 0 1 9-9" />
        <path d="M2 12a13 13 0 0 1 13-13" />
        <circle cx="2" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * Simple text + waves version for fallback
 */
export function IWASPLogoSimple({ 
  className = "", 
  variant = "dark",
  size = "md" 
}: IWASPLogoProps) {
  const textSizes = {
    sm: "text-[8px]",
    md: "text-[10px]",
    lg: "text-[12px]"
  };

  const waveSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const colorClass = variant === "light" 
    ? "text-foreground" 
    : "text-foreground/70";

  return (
    <div className={`flex items-center gap-1.5 ${colorClass} ${className}`}>
      <span className={`${textSizes[size]} font-semibold tracking-[0.15em] uppercase`}>
        IWasp
      </span>
      <svg 
        width={waveSizes[size]} 
        height={waveSizes[size]} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      >
        <path d="M2 12a5 5 0 0 1 5-5" />
        <path d="M2 12a9 9 0 0 1 9-9" />
        <path d="M2 12a13 13 0 0 1 13-13" />
        <circle cx="2" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
