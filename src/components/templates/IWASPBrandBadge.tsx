/**
 * IWASP Brand Badge Component
 * The "IWasp )))" logo badge for card templates
 * 
 * Consistent branding across all IWASP NFC card templates
 * Position: ALWAYS top-right - FIXED
 */

import { cn } from "@/lib/utils";

interface IWASPBrandBadgeProps {
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Premium glass badge with "IWasp )))" branding
 * Used in all IWASP card templates for brand consistency
 */
export function IWASPBrandBadge({ 
  variant = "dark",
  className 
}: IWASPBrandBadgeProps) {
  const isDark = variant === "dark";
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        className
      )}
      style={{
        background: isDark 
          ? 'rgba(255, 255, 255, 0.06)' 
          : 'rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        padding: '0.625rem 1rem',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isDark 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
          : '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Brand Text "i-Wasp" */}
      <span 
        style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          letterSpacing: '0.05em', 
          color: isDark 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(0, 0, 0, 0.75)',
        }}
      >
        i-Wasp
      </span>
      
      {/* NFC Waves Icon ")))" */}
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'} 
        strokeWidth="2" 
        strokeLinecap="round"
      >
        <path d="M2 12a5 5 0 0 1 5-5" />
        <path d="M2 12a9 9 0 0 1 9-9" />
        <path d="M2 12a13 13 0 0 1 13-13" />
        <circle 
          cx="2" 
          cy="12" 
          r="2" 
          fill={isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'} 
        />
      </svg>
    </div>
  );
}

/**
 * Minimal version for smaller spaces
 */
export function IWASPBrandBadgeMinimal({ 
  variant = "dark",
  className 
}: IWASPBrandBadgeProps) {
  const isDark = variant === "dark";
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 opacity-50 hover:opacity-70 transition-opacity",
        className
      )}
    >
      <span 
        style={{ 
          fontSize: '9px', 
          fontWeight: 600, 
          letterSpacing: '0.05em', 
          color: isDark 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(0, 0, 0, 0.6)',
        }}
      >
        i-Wasp
      </span>
      <svg 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'} 
        strokeWidth="2" 
        strokeLinecap="round"
      >
        <path d="M2 12a5 5 0 0 1 5-5" />
        <path d="M2 12a9 9 0 0 1 9-9" />
        <path d="M2 12a13 13 0 0 1 13-13" />
        <circle 
          cx="2" 
          cy="12" 
          r="1.5" 
          fill={isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'} 
        />
      </svg>
    </div>
  );
}
