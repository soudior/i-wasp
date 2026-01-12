/**
 * IWASP LUXE MAX PALETTE
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Style: Ultra-luxe, minimaliste, sombre et futuriste
 * Inspiré: Marques de luxe et SaaS premium
 * 
 * PALETTE LUXE MAX:
 * - Blue Night (fond):     #020819
 * - Surface elevated:      #0A1020
 * - Card surface:          #0F1628
 * - Cyan accent:           #4DF3FF
 * - Off-white text:        #E8ECF4
 * - Silver secondary:      #8A9AB4
 * ═══════════════════════════════════════════════════════════════════════
 */

export const STEALTH = {
  // Backgrounds - Deep blue-black night
  bg: "#020819",
  bgCard: "#0A1020",
  bgCardHover: "#0F1628",
  bgInput: "#0A1020",
  bgElevated: "#0F1628",
  
  // Legacy aliases for compatibility
  noir: "#020819",
  noirElevated: "#0A1020",
  
  // Borders - Subtle cyan tints
  border: "rgba(77, 243, 255, 0.08)",
  borderHover: "rgba(77, 243, 255, 0.15)",
  borderActive: "rgba(77, 243, 255, 0.3)",
  
  // Text - Off-white and silver hierarchy
  text: "#E8ECF4",
  textSecondary: "#8A9AB4",
  textMuted: "#5A6A84",
  
  // Legacy text aliases
  titanium: "#8A9AB4",
  platinum: "#E8ECF4",
  
  // Accent - Cyan electric
  accent: "#4DF3FF",
  accentHover: "#7DF7FF",
  accentMuted: "rgba(77, 243, 255, 0.12)",
  accentDark: "#2ED3E0",
  
  // Legacy accent
  emeraldGlow: "rgba(77, 243, 255, 0.15)",
  
  // Status colors
  success: "#4ADE80",
  successBg: "rgba(74, 222, 128, 0.1)",
  error: "#F87171",
  errorBg: "rgba(248, 113, 113, 0.1)",
  warning: "#FBBF24",
  warningBg: "rgba(251, 191, 36, 0.1)",
  
  // Gradients - Subtle halos
  gradientAccent: "linear-gradient(135deg, #4DF3FF, #2ED3E0)",
  gradientCard: "linear-gradient(180deg, #0A1020 0%, #0F1628 100%)",
  gradientHalo: "radial-gradient(ellipse at center, rgba(77, 243, 255, 0.08) 0%, transparent 70%)",
  
  // Shadows - Deep with cyan glow
  shadow: "0 4px 24px rgba(2, 8, 25, 0.6)",
  shadowLg: "0 12px 48px rgba(2, 8, 25, 0.8)",
  shadowCard: "0 8px 32px rgba(2, 8, 25, 0.5)",
  glow: "0 0 40px rgba(77, 243, 255, 0.15)",
  glowIntense: "0 0 60px rgba(77, 243, 255, 0.25)",
  glowSubtle: "0 0 20px rgba(77, 243, 255, 0.08)",
} as const;

// CSS-in-JS styles pour les inputs
export const stealthInputStyles = {
  backgroundColor: STEALTH.bgInput,
  borderColor: STEALTH.border,
  color: STEALTH.text,
  borderRadius: "12px",
};

// Classes Tailwind pour usage cohérent
export const stealthClasses = {
  card: "bg-[#0A1020] border border-[rgba(77,243,255,0.08)] rounded-2xl",
  cardHover: "hover:border-[rgba(77,243,255,0.2)] hover:shadow-[0_0_30px_rgba(77,243,255,0.1)]",
  input: "bg-[#0A1020] border-[rgba(77,243,255,0.15)] text-[#E8ECF4] placeholder:text-[#5A6A84] rounded-xl focus:border-[#4DF3FF] focus:ring-[#4DF3FF]/20",
  button: "bg-[#4DF3FF] text-[#020819] hover:bg-[#7DF7FF] font-semibold rounded-full shadow-[0_0_20px_rgba(77,243,255,0.3)]",
  buttonGhost: "bg-transparent border border-[rgba(77,243,255,0.2)] text-[#E8ECF4] hover:bg-[rgba(77,243,255,0.08)] hover:border-[#4DF3FF]",
  buttonOutline: "bg-transparent border-2 border-[#4DF3FF] text-[#4DF3FF] hover:bg-[rgba(77,243,255,0.1)]",
};

// Animation timings
export const luxeTimings = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
};
