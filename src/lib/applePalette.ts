/**
 * IWASP - Apple/Cupertino Design System
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Style: Apple Human Interface Guidelines (Cupertino)
 * Philosophy: Minimal, airy, high-end, calm, professional
 * 
 * PALETTE:
 * - Background:      #F5F5F7 (Apple light gray)
 * - Cards/Surfaces:  #FFFFFF (pure white)
 * - Primary text:    #1D1D1F (Apple dark)
 * - Secondary text:  #86868B (Apple gray)
 * - Accent:          #007AFF (Apple blue - only one accent)
 * ═══════════════════════════════════════════════════════════════════════
 */

export const APPLE = {
  // Backgrounds
  background: "#F5F5F7",
  backgroundPure: "#FFFFFF",
  backgroundSubtle: "#FAFAFA",
  
  // Cards & Surfaces
  card: "#FFFFFF",
  cardHover: "#FAFAFA",
  cardElevated: "#FFFFFF",
  
  // Primary Accent - Apple Blue (ONLY accent color)
  accent: "#007AFF",
  accentHover: "#0066CC",
  accentLight: "#E5F1FF",
  accentSubtle: "rgba(0, 122, 255, 0.08)",
  
  // Text hierarchy
  text: "#1D1D1F",
  textSecondary: "#86868B",
  textMuted: "#8E8E93",
  textSubtle: "#AEAEB2",
  
  // Borders - Ultra subtle
  border: "rgba(0, 0, 0, 0.08)",
  borderHover: "rgba(0, 0, 0, 0.12)",
  borderActive: "rgba(0, 122, 255, 0.5)",
  
  // Status colors
  success: "#34C759",
  successBg: "rgba(52, 199, 89, 0.1)",
  error: "#FF3B30",
  errorBg: "rgba(255, 59, 48, 0.1)",
  warning: "#FF9500",
  warningBg: "rgba(255, 149, 0, 0.1)",
  
  // Shadows - Apple-style subtle elevation
  shadowXs: "0 1px 2px rgba(0, 0, 0, 0.04)",
  shadowSm: "0 2px 8px rgba(0, 0, 0, 0.06)",
  shadowMd: "0 4px 16px rgba(0, 0, 0, 0.08)",
  shadowLg: "0 8px 32px rgba(0, 0, 0, 0.1)",
  shadowCard: "0 2px 12px rgba(0, 0, 0, 0.05)",
  shadowElevated: "0 12px 40px rgba(0, 0, 0, 0.12)",
  
  // Radii - Apple style rounded
  radiusSm: "8px",
  radiusMd: "12px",
  radiusLg: "16px",
  radiusXl: "24px",
  radiusFull: "9999px",
} as const;

// Typography following San Francisco style
export const appleTypography = {
  // Titles: Bold, tight tracking
  title: {
    weight: "600",
    tracking: "-0.02em",
  },
  
  // Headlines: Semibold
  headline: {
    weight: "600",
    tracking: "-0.01em",
  },
  
  // Body: Regular, readable
  body: {
    weight: "400",
    tracking: "0",
  },
  
  // Caption: Small, muted
  caption: {
    weight: "400",
    tracking: "0.01em",
  },
} as const;

// Animation timings - Smooth Apple-style
export const appleTimings = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  easingSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

// Component styles
export const appleStyles = {
  card: {
    backgroundColor: APPLE.card,
    borderRadius: APPLE.radiusLg,
    boxShadow: APPLE.shadowCard,
    border: `1px solid ${APPLE.border}`,
  },
  button: {
    primary: {
      backgroundColor: APPLE.accent,
      color: "#FFFFFF",
      borderRadius: APPLE.radiusMd,
      fontWeight: "600",
    },
    secondary: {
      backgroundColor: APPLE.backgroundSubtle,
      color: APPLE.text,
      borderRadius: APPLE.radiusMd,
      fontWeight: "500",
    },
  },
  input: {
    backgroundColor: APPLE.backgroundPure,
    border: `1px solid ${APPLE.border}`,
    borderRadius: APPLE.radiusMd,
    color: APPLE.text,
  },
} as const;
