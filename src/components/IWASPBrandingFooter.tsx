/**
 * IWASP Global Branding Footer
 * 
 * RÈGLE GLOBALE: Affiché sur TOUTES les cartes publiques (business, personne, Airbnb, Booking, staff)
 * 
 * - Visible, discret, non intrusif
 * - Présent sur TOUTES les pages publiques (anciens et nouveaux clients, tous templates)
 * - Ne peut être modifié par un client standard
 * - Aucune mention lovable.app en production
 * 
 * Exception UNIQUE:
 * - Peut être désactivé pour les offres White-label
 * - Désactivation possible uniquement par l'administrateur (hideBranding prop)
 */

import { cn } from "@/lib/utils";

interface IWASPBrandingFooterProps {
  /**
   * Hide branding - ONLY for white-label admin-assigned cards
   * Default: false (branding always visible)
   */
  hideBranding?: boolean;
  
  /**
   * Visual variant for different backgrounds
   */
  variant?: "dark" | "light";
  
  /**
   * Additional styling
   */
  className?: string;
}

/**
 * Global branding footer for all public card pages
 * Displays "Powered by i-Wasp.com" at the bottom
 */
export function IWASPBrandingFooter({
  hideBranding = false,
  variant = "light",
  className,
}: IWASPBrandingFooterProps) {
  // Only hide for white-label (admin-controlled)
  if (hideBranding) {
    return null;
  }

  const isDark = variant === "dark";

  return (
    <footer
      className={cn(
        "w-full text-center py-6 mt-auto",
        className
      )}
    >
      <a
        href="https://i-wasp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 transition-opacity hover:opacity-100"
        style={{
          opacity: 0.6,
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: isDark ? "#d4af37" : "#1D1D1F",
          }}
        >
          i-wasp.com
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
          }}
        >
          CORPORATION
        </span>
      </a>
    </footer>
  );
}

/**
 * Compact inline version for templates with custom footer styling
 */
export function IWASPBrandingInline({
  hideBranding = false,
  variant = "dark",
  className,
}: IWASPBrandingFooterProps) {
  if (hideBranding) {
    return null;
  }

  const isDark = variant === "dark";

  return (
    <div className={cn("text-center", className)}>
      <a
        href="https://i-wasp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1"
        style={{
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: isDark ? "#d4af37" : "#1D1D1F",
          }}
        >
          i-wasp.com
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.35)",
          }}
        >
          CORPORATION
        </span>
      </a>
    </div>
  );
}

export default IWASPBrandingFooter;
