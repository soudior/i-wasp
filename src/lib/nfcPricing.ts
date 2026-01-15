/**
 * i-wasp Studio - NFC Cards Pricing Configuration
 * Currency: MAD (Dirham Marocain) primary, EUR secondary
 * Basé au Maroc, livraison mondiale
 */

export const NFC_PRICING = {
  currency: {
    primary: 'MAD',
    secondary: 'EUR',
    madToEur: 0.10, // 1 MAD ≈ 0.10 EUR (approximation)
  },

  // Tarifs cartes NFC individuelles et packs
  tiers: {
    SINGLE: {
      id: 'single',
      name: '1 Carte',
      subtitle: 'Test / Particulier',
      quantity: 1,
      priceMad: 249,
      pricePerCardMad: 249,
      savings: null,
      badge: null,
      features: [
        'Design personnalisé',
        'Inscription NFC unique',
        'Livraison 3-5 jours',
      ],
    },
    PACK_10: {
      id: 'pack_10',
      name: 'Pack Mini',
      subtitle: '10 Cartes',
      quantity: 10,
      priceMad: 1900,
      pricePerCardMad: 190,
      savings: 23,
      badge: 'Économie',
      features: [
        'Design personnalisé',
        'Inscription NFC unique',
        'Livraison 3-5 jours',
        '-23% vs tarif unitaire',
      ],
    },
    PACK_50: {
      id: 'pack_50',
      name: 'Pack Standard',
      subtitle: '50 Cartes',
      quantity: 50,
      priceMad: 4900,
      pricePerCardMad: 98,
      savings: 61,
      badge: '⭐ Populaire',
      features: [
        'Design personnalisé',
        'Inscription NFC unique',
        'Livraison 3-5 jours',
        '-61% vs tarif unitaire',
      ],
    },
    PACK_100: {
      id: 'pack_100',
      name: 'Volume Pro',
      subtitle: '100+ Cartes',
      quantity: 100,
      priceMad: 7900,
      pricePerCardMad: 79,
      savings: 68,
      badge: '🏆 Meilleur deal',
      features: [
        'Design personnalisé',
        'Inscription NFC unique',
        'Gravure laser GRATUITE',
        'Livraison 3-5 jours',
        '-68% vs tarif unitaire',
        'Support prioritaire',
      ],
    },
  },

  // Délais
  production: {
    standard: '5-7 jours',
    express: '3-4 jours',
  },
  shipping: {
    morocco: '3-5 jours',
    international: '7-14 jours',
  },

  // Options supplémentaires
  extras: {
    laserEngraving: {
      name: 'Gravure laser',
      priceMad: 500, // gratuit pour 100+ cartes
      freeFrom: 100,
    },
    expressProduction: {
      name: 'Production express',
      priceMad: 300,
    },
    customPackaging: {
      name: 'Packaging premium',
      priceMad: 200,
    },
  },
} as const;

export type NfcTierId = keyof typeof NFC_PRICING.tiers;
export type NfcTier = typeof NFC_PRICING.tiers[NfcTierId];

// Helpers
export function getNfcTierById(id: string): NfcTier | null {
  const tier = Object.values(NFC_PRICING.tiers).find(t => t.id === id);
  return tier || null;
}

export function formatPriceMad(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} DH`;
}

export function formatPriceEur(amountMad: number): string {
  const eur = Math.round(amountMad * NFC_PRICING.currency.madToEur);
  return `€${eur}`;
}

export function formatPriceBoth(amountMad: number): string {
  return `${formatPriceMad(amountMad)} (~${formatPriceEur(amountMad)})`;
}

export function calculateNfcPrice(quantity: number): { 
  total: number; 
  perCard: number; 
  savings: number | null;
  tier: NfcTier;
} {
  if (quantity >= 100) {
    return {
      total: NFC_PRICING.tiers.PACK_100.priceMad,
      perCard: NFC_PRICING.tiers.PACK_100.pricePerCardMad,
      savings: NFC_PRICING.tiers.PACK_100.savings,
      tier: NFC_PRICING.tiers.PACK_100,
    };
  }
  if (quantity >= 50) {
    return {
      total: NFC_PRICING.tiers.PACK_50.priceMad,
      perCard: NFC_PRICING.tiers.PACK_50.pricePerCardMad,
      savings: NFC_PRICING.tiers.PACK_50.savings,
      tier: NFC_PRICING.tiers.PACK_50,
    };
  }
  if (quantity >= 10) {
    return {
      total: NFC_PRICING.tiers.PACK_10.priceMad,
      perCard: NFC_PRICING.tiers.PACK_10.pricePerCardMad,
      savings: NFC_PRICING.tiers.PACK_10.savings,
      tier: NFC_PRICING.tiers.PACK_10,
    };
  }
  return {
    total: NFC_PRICING.tiers.SINGLE.priceMad * quantity,
    perCard: NFC_PRICING.tiers.SINGLE.pricePerCardMad,
    savings: null,
    tier: NFC_PRICING.tiers.SINGLE,
  };
}

// Liste des tiers pour affichage
export function getNfcTiersList(): NfcTier[] {
  return Object.values(NFC_PRICING.tiers);
}
