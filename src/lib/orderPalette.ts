/** Palettes for new order profiles only; existing/custom client cards are untouched. */
export const ORDER_PALETTES = {
  signature: { name: 'Signature', backgroundColor: '#171727', accentColor: '#705021' },
  'dark-luxury': { name: 'Dark Luxury', backgroundColor: '#10100f', accentColor: '#806300' },
  executive: { name: 'Executive', backgroundColor: '#10263c', accentColor: '#2563a6' },
  boutique: { name: 'Boutique', backgroundColor: '#30251c', accentColor: '#805b32' },
} as const;
export function orderPalette(id: string | null) {
  const palette = ORDER_PALETTES[id as keyof typeof ORDER_PALETTES];
  if (!palette) return undefined;
  return { backgroundColor: palette.backgroundColor, accentColor: palette.accentColor,
    textColor: '#FFFFFF', secondaryTextColor: '#C7C7CC', theme: 'dark' as const };
}
