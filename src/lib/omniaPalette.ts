/**
 * i-wasp OMNIA EDITION — Design System
 * 
 * Positionnement : Luxe invisible, omniprésence digitale, prestige immatériel.
 * Philosophie : "L'Art de la Présence"
 * 
 * Style : Soie liquide, obsidienne, architecture Aman Hotels
 * Éthéré, silencieux, immatériel
 */

// ═══════════════════════════════════════════════════════════════════════════
// PALETTE OMNIA — Obsidienne, Champagne, Ivoire
// ═══════════════════════════════════════════════════════════════════════════

export const OMNIA = {
  // Core palette
  obsidienne: '#030303',           // Fond principal - Noir abyssal
  obsidienneDeep: '#000000',       // Noir absolu
  obsidienneElevated: '#0A0A0A',   // Surface élevée
  obsidienneSurface: '#111111',    // Cards et surfaces
  
  champagne: '#DCC7B0',            // Accent principal - Champagne sablé
  champagneLight: '#E8D9C7',       // Champagne clair
  champagneMuted: '#B8A48F',       // Champagne atténué
  champagneGlow: 'rgba(220, 199, 176, 0.03)', // Glow ultra-diffus
  
  ivoire: '#FDFCFB',               // Texte principal - Ivoire pur
  ivoireSoft: '#F5F4F2',           // Ivoire atténué
  ivoireMuted: '#E0DFDD',          // Ivoire subtil
  
  // Text hierarchy
  textPrimary: '#FDFCFB',
  textSecondary: 'rgba(253, 252, 251, 0.6)',
  textMuted: 'rgba(253, 252, 251, 0.4)',
  textSubtle: 'rgba(253, 252, 251, 0.2)',
  
  // Borders - Ultra-subtils
  border: 'rgba(255, 255, 255, 0.05)',
  borderHover: 'rgba(255, 255, 255, 0.08)',
  borderActive: 'rgba(220, 199, 176, 0.15)',
  
  // Glass Omnia
  glassBackground: 'rgba(255, 255, 255, 0.02)',
  glassBackdrop: 'blur(50px)',
  glassBorder: 'rgba(255, 255, 255, 0.05)',
  
  // Shadows & Glows
  shadowSoft: '0 4px 40px rgba(0, 0, 0, 0.4)',
  shadowElevated: '0 20px 80px rgba(0, 0, 0, 0.6)',
  glowChampagne: '0 0 80px rgba(220, 199, 176, 0.08)',
  glowChampagneIntense: '0 0 120px rgba(220, 199, 176, 0.15)',
  
  // Gradients
  gradientObsidienne: 'linear-gradient(180deg, #030303 0%, #000000 100%)',
  gradientChampagne: 'radial-gradient(ellipse at center, rgba(220, 199, 176, 0.03) 0%, transparent 70%)',
  gradientHero: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(220, 199, 176, 0.08) 0%, transparent 50%)',
  gradientCard: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
  
  // Typography
  fontDisplay: "'Tenor Sans', Georgia, serif",
  fontBody: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontTechnical: "'JetBrains Mono', monospace",
  
  // Spacing
  radiusOmnia: '4rem',
  radiusOmniaLg: '6rem',
  radiusFull: '9999px',
  
  // Animation timings
  durationSilk: '1.2s',
  durationLiquid: '1.8s',
  durationEthereal: '2.4s',
  easingSilk: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easingLiquid: 'cubic-bezier(0.16, 1, 0.3, 1)',
  
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CSS Variables pour Tailwind
// ═══════════════════════════════════════════════════════════════════════════

export const OMNIA_CSS_VARS = {
  '--omnia-obsidienne': '0 0% 1%',
  '--omnia-obsidienne-elevated': '0 0% 4%',
  '--omnia-obsidienne-surface': '0 0% 7%',
  '--omnia-champagne': '30 37% 72%',
  '--omnia-champagne-light': '30 35% 84%',
  '--omnia-ivoire': '30 25% 99%',
  '--omnia-ivoire-soft': '30 12% 96%',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Copywriting OMNIA
// ═══════════════════════════════════════════════════════════════════════════

export const OMNIA_COPY = {
  // Termes à utiliser
  terms: {
    buy: 'Acquérir',
    software: 'Infrastructure',
    nfc: 'Liaison',
    dashboard: 'Atelier',
    login: 'Synchronisation',
    user: 'Actif',
    profile: 'Aura',
    activate: 'Ignition',
    settings: 'Calibrage',
    analytics: 'Télémétrie',
    card: 'Calibre',
    heritage: 'Héritage',
  },
  
  // Headlines
  headlines: {
    manifeste: 'Dominez l\'Invisible',
    subline: 'L\'Art de la Présence',
    ignition: 'Initiez votre Héritage',
    aura: 'Votre Aura Digitale',
    atelier: 'L\'Atelier du Maître',
  },
  
  // Taglines
  taglines: {
    brand: 'i-wasp Omnia',
    philosophy: 'Présence. Héritage. Omniprésence.',
    footer: 'L\'Art de la Présence',
  },
} as const;

export type OmniaPalette = typeof OMNIA;
export type OmniaCopy = typeof OMNIA_COPY;

export default OMNIA;
