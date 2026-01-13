/**
 * i-WASP STUDIO DESIGN SYSTEM
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Système de design centralisé pour i-wasp/studio
 * Style: Luxe minimaliste, noir profond, accents or mat & cyan
 * 
 * USAGE:
 * import { STUDIO } from '@/lib/studioDesignSystem';
 * 
 * <div style={{ background: STUDIO.colors.bg }}>
 * <p className={STUDIO.classes.textPrimary}>
 * ═══════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════
// COULEURS
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_COLORS = {
  // Backgrounds - Noir profond
  bg: "#0A0A0A",
  bgSurface: "#141414",
  bgElevated: "#1A1A1A",
  bgHover: "#1F1F1F",
  bgInput: "#0F0F0F",
  
  // Texte - Crème & Gris
  text: "#F6F5F2",
  textSecondary: "#9B9B9B",
  textMuted: "#5A5A5A",
  textDisabled: "#3A3A3A",
  
  // Bordures - Subtiles
  border: "rgba(255, 255, 255, 0.06)",
  borderHover: "rgba(255, 255, 255, 0.12)",
  borderActive: "rgba(255, 255, 255, 0.20)",
  borderGold: "rgba(175, 142, 86, 0.30)",
  borderCyan: "rgba(77, 243, 255, 0.30)",
  
  // Accent Or Mat (Premium/CTA)
  gold: "#AF8E56",
  goldLight: "#C4A672",
  goldMuted: "#8A7245",
  goldSubtle: "rgba(175, 142, 86, 0.12)",
  goldGlow: "rgba(175, 142, 86, 0.15)",
  
  // Accent Cyan (Interactif/Tech)
  cyan: "#4DF3FF",
  cyanLight: "#7DF7FF",
  cyanMuted: "#2ED3E0",
  cyanSubtle: "rgba(77, 243, 255, 0.12)",
  cyanGlow: "rgba(77, 243, 255, 0.15)",
  
  // Status
  success: "#4ADE80",
  successBg: "rgba(74, 222, 128, 0.10)",
  error: "#F87171",
  errorBg: "rgba(248, 113, 113, 0.10)",
  warning: "#FBBF24",
  warningBg: "rgba(251, 191, 36, 0.10)",
  info: "#60A5FA",
  infoBg: "rgba(96, 165, 250, 0.10)",
} as const;

// ═══════════════════════════════════════════════════════════════════════
// TYPOGRAPHIE
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_TYPOGRAPHY = {
  // Font Families
  fonts: {
    display: "'Cinzel', serif",
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    accent: "'Playfair Display', serif",
  },
  
  // Font Weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Font Sizes (rem)
  sizes: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
    "6xl": "3.75rem",   // 60px
    "7xl": "4.5rem",    // 72px
  },
  
  // Letter Spacing
  tracking: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
    display: "0.3em",   // Pour titres Cinzel
    luxury: "0.2em",    // Pour sous-titres
  },
  
  // Line Heights
  leading: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════
// ESPACEMENTS
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_SPACING = {
  // Base unit: 4px
  px: "1px",
  0: "0",
  0.5: "0.125rem",  // 2px
  1: "0.25rem",     // 4px
  1.5: "0.375rem",  // 6px
  2: "0.5rem",      // 8px
  2.5: "0.625rem",  // 10px
  3: "0.75rem",     // 12px
  4: "1rem",        // 16px
  5: "1.25rem",     // 20px
  6: "1.5rem",      // 24px
  8: "2rem",        // 32px
  10: "2.5rem",     // 40px
  12: "3rem",       // 48px
  16: "4rem",       // 64px
  20: "5rem",       // 80px
  24: "6rem",       // 96px
  32: "8rem",       // 128px
} as const;

// ═══════════════════════════════════════════════════════════════════════
// BORDURES & RADIUS
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_BORDERS = {
  // Border Radius - Angles droits pour le luxe
  radius: {
    none: "0",
    sm: "2px",
    md: "4px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    full: "9999px",
  },
  
  // Border Widths
  width: {
    0: "0",
    1: "1px",
    2: "2px",
    4: "4px",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════
// OMBRES & EFFETS
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_EFFECTS = {
  // Shadows
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.5)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.6)",
    card: "0 2px 12px rgba(0, 0, 0, 0.4)",
    elevated: "0 12px 40px rgba(0, 0, 0, 0.6)",
    inner: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  
  // Glows
  glows: {
    gold: "0 0 30px rgba(175, 142, 86, 0.15)",
    goldIntense: "0 0 50px rgba(175, 142, 86, 0.25)",
    cyan: "0 0 30px rgba(77, 243, 255, 0.15)",
    cyanIntense: "0 0 50px rgba(77, 243, 255, 0.25)",
    white: "0 0 20px rgba(255, 255, 255, 0.08)",
  },
  
  // Backdrop Blur
  blur: {
    none: "blur(0)",
    sm: "blur(4px)",
    md: "blur(8px)",
    lg: "blur(16px)",
    xl: "blur(24px)",
  },
  
  // Opacity
  opacity: {
    0: "0",
    5: "0.05",
    10: "0.10",
    20: "0.20",
    25: "0.25",
    30: "0.30",
    40: "0.40",
    50: "0.50",
    60: "0.60",
    70: "0.70",
    75: "0.75",
    80: "0.80",
    90: "0.90",
    95: "0.95",
    100: "1",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════
// ANIMATIONS & TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_MOTION = {
  // Durées - Lentes pour le luxe
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
    luxury: "1000ms",
    glacial: "1500ms",
  },
  
  // Easing
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  },
  
  // Delay
  delay: {
    none: "0ms",
    short: "75ms",
    medium: "150ms",
    long: "300ms",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_BREAKPOINTS = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ═══════════════════════════════════════════════════════════════════════
// Z-INDEX
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_ZINDEX = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  fixed: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  tooltip: 80,
  toast: 90,
  max: 100,
} as const;

// ═══════════════════════════════════════════════════════════════════════
// CLASSES TAILWIND PRÉ-DÉFINIES
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO_CLASSES = {
  // Backgrounds
  bgPrimary: "bg-[#0A0A0A]",
  bgSurface: "bg-[#141414]",
  bgElevated: "bg-[#1A1A1A]",
  bgHover: "hover:bg-[#1F1F1F]",
  
  // Text
  textPrimary: "text-[#F6F5F2]",
  textSecondary: "text-[#9B9B9B]",
  textMuted: "text-[#5A5A5A]",
  textGold: "text-[#AF8E56]",
  textCyan: "text-[#4DF3FF]",
  
  // Borders
  border: "border border-white/[0.06]",
  borderHover: "hover:border-white/[0.12]",
  borderGold: "border border-[#AF8E56]/30",
  borderCyan: "border border-[#4DF3FF]/30",
  
  // Cards
  card: "bg-[#141414] border border-white/[0.06]",
  cardHover: "hover:border-white/[0.12] hover:bg-[#1A1A1A] transition-all duration-300",
  cardElevated: "bg-[#1A1A1A] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
  
  // Buttons
  btnPrimary: "bg-[#AF8E56] text-[#0A0A0A] hover:bg-[#C4A672] font-medium transition-all duration-300",
  btnSecondary: "bg-transparent border border-white/[0.12] text-[#F6F5F2] hover:bg-white/[0.06] hover:border-white/[0.20] transition-all duration-300",
  btnGhost: "bg-transparent text-[#9B9B9B] hover:text-[#F6F5F2] hover:bg-white/[0.04] transition-all duration-300",
  btnCyan: "bg-[#4DF3FF] text-[#0A0A0A] hover:bg-[#7DF7FF] font-medium transition-all duration-300",
  
  // Inputs
  input: "bg-[#0F0F0F] border border-white/[0.08] text-[#F6F5F2] placeholder:text-[#5A5A5A] focus:border-[#AF8E56] focus:ring-1 focus:ring-[#AF8E56]/20 transition-all duration-300",
  
  // Typography
  displayTitle: "font-display font-light tracking-[0.3em] text-[#F6F5F2]",
  heading: "font-sans font-medium tracking-wide text-[#F6F5F2]",
  body: "font-sans font-normal text-[#F6F5F2]",
  caption: "font-sans text-sm text-[#9B9B9B]",
  
  // Effects
  glowGold: "shadow-[0_0_30px_rgba(175,142,86,0.15)]",
  glowCyan: "shadow-[0_0_30px_rgba(77,243,255,0.15)]",
  
  // Layout
  container: "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-16 sm:py-24",
} as const;

// ═══════════════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

export const STUDIO = {
  colors: STUDIO_COLORS,
  typography: STUDIO_TYPOGRAPHY,
  spacing: STUDIO_SPACING,
  borders: STUDIO_BORDERS,
  effects: STUDIO_EFFECTS,
  motion: STUDIO_MOTION,
  breakpoints: STUDIO_BREAKPOINTS,
  zIndex: STUDIO_ZINDEX,
  classes: STUDIO_CLASSES,
} as const;

// Type exports pour TypeScript
export type StudioColors = typeof STUDIO_COLORS;
export type StudioTypography = typeof STUDIO_TYPOGRAPHY;
export type StudioSpacing = typeof STUDIO_SPACING;
export type StudioBorders = typeof STUDIO_BORDERS;
export type StudioEffects = typeof STUDIO_EFFECTS;
export type StudioMotion = typeof STUDIO_MOTION;
export type StudioBreakpoints = typeof STUDIO_BREAKPOINTS;
export type StudioZIndex = typeof STUDIO_ZINDEX;
export type StudioClasses = typeof STUDIO_CLASSES;

export default STUDIO;
