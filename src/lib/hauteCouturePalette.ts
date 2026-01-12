/**
 * i-WASP HAUTE COUTURE DIGITALE PALETTE
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Style: Quiet Luxury, Haute Couture Digitale, Minimalisme extrême
 * Motif: Nid d'abeille (hexagonal) ultra-subtil
 * 
 * PALETTE HAUTE COUTURE:
 * - Silk (fond):         #FBFBFA (blanc cassé doux)
 * - Jet Black (texte):   #080808 (noir profond)
 * - Sanded Gold:         #AF8E56 (or mat, pas brillant)
 * - Mist:                #9A9A98 (gris secondaire)
 * - Whisper:             #E8E8E6 (gris très léger)
 * ═══════════════════════════════════════════════════════════════════════
 */

export const COUTURE = {
  // Backgrounds - Silk & Warm Whites
  silk: "#FBFBFA",
  silkWarm: "#F8F7F4",
  silkPure: "#FFFFFF",
  
  // Primary - Jet Black
  jet: "#080808",
  jetSoft: "#1A1A1A",
  jetMuted: "#2D2D2D",
  
  // Accent - Sanded Gold (matte, not shiny)
  gold: "#AF8E56",
  goldLight: "#C4A672",
  goldMuted: "#D4C4A8",
  goldSubtle: "rgba(175, 142, 86, 0.12)",
  
  // Text hierarchy
  text: "#080808",
  textSecondary: "#5A5A58",
  textMuted: "#9A9A98",
  textSubtle: "#BDBDBB",
  
  // Surfaces
  surface: "#FBFBFA",
  surfaceElevated: "#FFFFFF",
  surfaceMuted: "#F5F5F3",
  
  // Borders - Ultra subtle
  border: "rgba(8, 8, 8, 0.06)",
  borderHover: "rgba(8, 8, 8, 0.12)",
  borderActive: "rgba(175, 142, 86, 0.4)",
  borderGold: "rgba(175, 142, 86, 0.25)",
  
  // Honeycomb pattern colors
  honeycomb: "rgba(8, 8, 8, 0.03)",
  honeycombDot: "rgba(175, 142, 86, 0.4)",
  
  // Status colors
  success: "#4A7C59",
  successBg: "rgba(74, 124, 89, 0.08)",
  error: "#8B4049",
  errorBg: "rgba(139, 64, 73, 0.08)",
  
  // Shadows - Very subtle
  shadowXs: "0 1px 2px rgba(8, 8, 8, 0.03)",
  shadowSm: "0 2px 8px rgba(8, 8, 8, 0.04)",
  shadowMd: "0 4px 16px rgba(8, 8, 8, 0.05)",
  shadowLg: "0 8px 32px rgba(8, 8, 8, 0.06)",
  shadowCard: "0 2px 12px rgba(8, 8, 8, 0.04)",
  shadowElevated: "0 12px 40px rgba(8, 8, 8, 0.08)",
  
  // Glass/Blur effects
  glass: "rgba(251, 251, 250, 0.85)",
  glassBorder: "rgba(8, 8, 8, 0.04)",
} as const;

// CSS-in-JS styles for inputs
export const coutureInputStyles = {
  backgroundColor: COUTURE.surfaceElevated,
  borderColor: COUTURE.border,
  color: COUTURE.text,
  borderRadius: "0px", // Angles droits comme demandé
};

// Classes Tailwind for consistent usage
export const coutureClasses = {
  card: "bg-couture-silk border border-couture-border",
  cardHover: "hover:border-couture-border-hover transition-all duration-1000",
  input: "bg-white border-couture-border text-couture-jet placeholder:text-couture-muted focus:border-couture-gold",
  button: "bg-couture-jet text-couture-silk hover:bg-couture-jet-soft font-medium",
  buttonGold: "bg-couture-gold text-couture-silk hover:bg-couture-gold-light font-medium",
  buttonGhost: "bg-transparent border border-couture-border text-couture-jet hover:bg-couture-surface-muted hover:border-couture-border-hover",
};

// Animation timings - SLOW luxury (1s minimum)
export const coutureTimings = {
  fast: "600ms",
  normal: "1000ms",
  slow: "1500ms",
  slower: "2000ms",
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  easingLuxury: "cubic-bezier(0.22, 1, 0.36, 1)",
};

// Typography
export const coutureTypography = {
  // Titles: Ultra-light, wide letter-spacing
  titleTracking: "0.5em",
  titleWeight: "200", // Extra-Light
  
  // Body: Clean, readable
  bodyTracking: "0.02em",
  bodyWeight: "400",
  
  // Accent: Serif italic for keywords
  accentStyle: "italic",
};
