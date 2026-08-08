/**
 * Design system — Accueil i-wasp
 * Identité unique : luxe technologique sombre.
 * Le clair n'est utilisé que comme contraste éditorial maîtrisé (panneaux ivoire
 * insérés dans un fond sombre), jamais comme second thème indépendant.
 */

export const HOME = {
  // Fonds sombres (identité principale)
  bg: "#030303",
  bgElevated: "#0A0A0A",
  bgCard: "rgba(255,255,255,0.03)",
  // Texte
  text: "#FDFCFB",
  textMuted: "rgba(253,252,251,0.60)",
  textFaint: "rgba(253,252,251,0.38)",
  // Accent signature (champagne)
  accent: "#DCC7B0",
  accentSoft: "rgba(220,199,176,0.12)",
  accentBorder: "rgba(220,199,176,0.20)",
  // Bordures
  border: "rgba(255,255,255,0.06)",
  // Contraste éditorial (panneau clair sur fond sombre)
  ivory: "#F7F5F2",
  ivoryText: "#0A0A0A",
  ivoryMuted: "rgba(10,10,10,0.55)",
} as const;

/**
 * Variantes d'animation « reveal » élégantes et légères.
 * Passer `reduce=true` (prefers-reduced-motion / appareil peu puissant) pour
 * un simple fondu, sans translation.
 */
export function reveal(reduce: boolean) {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };
}

export function staggerParent(reduce: boolean) {
  return {
    visible: { transition: { staggerChildren: reduce ? 0.04 : 0.1 } },
  };
}
