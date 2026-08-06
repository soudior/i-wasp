// Configuration globale des tests (vitest + jsdom)

// matchMedia n'est pas implémenté par jsdom : stub minimal pour les hooks
// qui l'utilisent (useReducedMotion, use-mobile, etc.).
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
