/**
 * i-wasp Studio - NFC Cards Pricing Configuration
 * Currency: EUR primary, MAD secondary (11 DH ≈ 1€)
 * 
 * Tarifs cartes physiques:
 * - Essentielle: 29,90€ (329 DH)
 * - Professionnelle: 49,90€ (549 DH)
 * - Prestige: 89,90€ (989 DH)
 * - Pack TEAM (5): 199€ (2189 DH)
 */

export const NFC_PRICING = {
  currency: {
    primary: 'EUR',
    secondary: 'MAD',
    eurToMad: 11, // 1 EUR ≈ 11 MAD
  },

  // Tarifs cartes NFC individuelles
  cards: {
    ESSENTIELLE: {
      id: 'essentielle',
      name: 'Essentielle',
      subtitle: 'Carte PVC classique',
      priceEur: 29.90,
      priceMad: 329,
      badge: null,
      features: [
        'Carte PVC haute qualité',
        'Puce NFC intégrée',
        'Design personnalisé',
        'Profil digital inclus',
        'Livraison 5-7 jours',
      ],
    },
    PROFESSIONNELLE: {
      id: 'professionnelle',
      name: 'Professionnelle',
      subtitle: 'Carte PVC premium',
      priceEur: 49.90,
      priceMad: 549,
      badge: '⭐ Populaire',
      features: [
        'Tout Essentielle +',
        'Finition mate ou brillante',
        'Logo imprimé',
        'QR Code au dos',
        'Livraison 3-5 jours',
      ],
    },
    PRESTIGE: {
      id: 'prestige',
      name: 'Prestige',
      subtitle: 'Carte métal premium',
      priceEur: 89.90,
      priceMad: 989,
      badge: '🏆 Premium',
      features: [
        'Carte métal brossé',
        'Gravure laser',
        'Logo gravé',
        'Packaging premium',
        'Livraison express 2-3 jours',
        'Support prioritaire',
      ],
    },
    PACK_TEAM: {
      id: 'pack_team',
      name: 'Pack TEAM',
      subtitle: '5 cartes pour équipe',
      quantity: 5,
      priceEur: 199,
      priceMad: 2189,
      pricePerCardEur: 39.80,
      pricePerCardMad: 437.80,
      savings: 20, // -20% vs tarif unitaire Professionnelle
      badge: '👥 Équipe',
      features: [
        '5 cartes Professionnelle',
        'Design unifié équipe',
        'Logos imprimés',
        'Gestion centralisée',
        'Livraison 3-5 jours',
        '-20% vs tarif unitaire',
      ],
    },
  },

  // Packs volume pour entreprises
  packs: {
    PACK_10: {
      id: 'pack_10',
      name: 'Pack 10',
      subtitle: '10 Cartes',
      quantity: 10,
      priceEur: 350,
      priceMad: 3850,
      pricePerCardEur: 35,
      pricePerCardMad: 385,
      savings: 30, // -30% vs tarif unitaire
      badge: 'Économie',
      features: [
        '10 cartes Professionnelle',
        'Design personnalisé',
        'Logos imprimés',
        'Livraison 3-5 jours',
        '-30% vs tarif unitaire',
      ],
    },
    PACK_25: {
      id: 'pack_25',
      name: 'Pack 25',
      subtitle: '25 Cartes',
      quantity: 25,
      priceEur: 750,
      priceMad: 8250,
      pricePerCardEur: 30,
      pricePerCardMad: 330,
      savings: 40, // -40% vs tarif unitaire
      badge: '⭐ Populaire',
      features: [
        '25 cartes Professionnelle',
        'Design personnalisé',
        'Logos imprimés',
        'Livraison 3-5 jours',
        '-40% vs tarif unitaire',
      ],
    },
    PACK_50: {
      id: 'pack_50',
      name: 'Pack 50',
      subtitle: '50 Cartes',
      quantity: 50,
      priceEur: 1250,
      priceMad: 13750,
      pricePerCardEur: 25,
      pricePerCardMad: 275,
      savings: 50, // -50% vs tarif unitaire
      badge: '🏆 Meilleur deal',
      features: [
        '50 cartes Professionnelle',
        'Design premium',
        'Logos imprimés',
        'Gravure laser incluse',
        'Livraison 3-5 jours',
        '-50% vs tarif unitaire',
        'Support prioritaire',
      ],
    },
    PACK_100: {
      id: 'pack_100',
      name: 'Pack 100+',
      subtitle: 'Sur devis',
      quantity: 100,
      priceEur: null, // Sur devis
      priceMad: null,
      pricePerCardEur: null,
      pricePerCardMad: null,
      savings: 60, // Jusqu'à -60%
      badge: '🎯 Enterprise',
      features: [
        'Cartes illimitées',
        'Tarifs dégressifs',
        'Design sur-mesure',
        'Gravure laser',
        'Packaging premium',
        'Manager dédié',
      ],
    },
  },

  // LEGACY: tiers for backward compatibility
  tiers: {
    SINGLE: {
      id: 'single',
      name: 'Essentielle',
      subtitle: 'Carte PVC classique',
      quantity: 1,
      priceMad: 329,
      pricePerCardMad: 329,
      savings: null,
      badge: null,
      features: [
        'Carte PVC haute qualité',
        'Puce NFC intégrée',
        'Design personnalisé',
        'Profil digital inclus',
        'Livraison 5-7 jours',
      ],
    },
  },

  // Délais
  production: {
    standard: '5-7 jours',
    express: '2-3 jours',
  },
  shipping: {
    morocco: '2-3 jours',
    europe: '5-7 jours',
    international: '7-14 jours',
  },

  // Options supplémentaires
  extras: {
    laserEngraving: {
      name: 'Gravure laser',
      priceEur: 15,
      priceMad: 165,
      freeFrom: 50, // Gratuit à partir de 50 cartes
    },
    expressProduction: {
      name: 'Production express',
      priceEur: 20,
      priceMad: 220,
    },
    customPackaging: {
      name: 'Packaging premium',
      priceEur: 10,
      priceMad: 110,
    },
  },
} as const;

export type NfcCardId = keyof typeof NFC_PRICING.cards;
export type NfcCard = typeof NFC_PRICING.cards[NfcCardId];
export type NfcPackId = keyof typeof NFC_PRICING.packs;
export type NfcPack = typeof NFC_PRICING.packs[NfcPackId];

// Helpers
export function getNfcCardById(id: string): NfcCard | null {
  const card = Object.values(NFC_PRICING.cards).find(c => c.id === id);
  return card || null;
}

export function getNfcPackById(id: string): NfcPack | null {
  const pack = Object.values(NFC_PRICING.packs).find(p => p.id === id);
  return pack || null;
}

export function formatPriceEur(amount: number): string {
  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')}€`;
}

export function formatPriceMad(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} DH`;
}

export function formatPriceBoth(amountEur: number): string {
  const amountMad = Math.round(amountEur * NFC_PRICING.currency.eurToMad);
  return `${formatPriceEur(amountEur)} (${formatPriceMad(amountMad)})`;
}

// Liste des cartes pour affichage
export function getNfcCardsList(): NfcCard[] {
  return Object.values(NFC_PRICING.cards);
}

// Liste des packs pour affichage
export function getNfcPacksList(): NfcPack[] {
  return Object.values(NFC_PRICING.packs);
}

// ============================================
// LEGACY COMPATIBILITY - Anciennes fonctions
// ============================================

// Legacy tiers (mapping vers cards)
export const legacyTiers = {
  SINGLE: {
    id: 'single',
    name: '1 Carte',
    subtitle: 'Essentielle',
    quantity: 1,
    priceMad: NFC_PRICING.cards.ESSENTIELLE.priceMad,
    pricePerCardMad: NFC_PRICING.cards.ESSENTIELLE.priceMad,
    savings: null,
    badge: null,
    features: NFC_PRICING.cards.ESSENTIELLE.features,
  },
};

export function getNfcTiersList() {
  return [
    {
      id: 'essentielle',
      name: 'Essentielle',
      subtitle: 'Carte PVC classique',
      quantity: 1,
      priceMad: NFC_PRICING.cards.ESSENTIELLE.priceMad,
      pricePerCardMad: NFC_PRICING.cards.ESSENTIELLE.priceMad,
      savings: null,
      badge: null,
      features: NFC_PRICING.cards.ESSENTIELLE.features,
    },
    {
      id: 'professionnelle',
      name: 'Professionnelle',
      subtitle: 'Carte PVC premium',
      quantity: 1,
      priceMad: NFC_PRICING.cards.PROFESSIONNELLE.priceMad,
      pricePerCardMad: NFC_PRICING.cards.PROFESSIONNELLE.priceMad,
      savings: null,
      badge: NFC_PRICING.cards.PROFESSIONNELLE.badge,
      features: NFC_PRICING.cards.PROFESSIONNELLE.features,
    },
    {
      id: 'prestige',
      name: 'Prestige',
      subtitle: 'Carte métal premium',
      quantity: 1,
      priceMad: NFC_PRICING.cards.PRESTIGE.priceMad,
      pricePerCardMad: NFC_PRICING.cards.PRESTIGE.priceMad,
      savings: null,
      badge: NFC_PRICING.cards.PRESTIGE.badge,
      features: NFC_PRICING.cards.PRESTIGE.features,
    },
  ];
}

export function getNfcTierById(id: string) {
  const tiers = getNfcTiersList();
  return tiers.find(t => t.id === id) || null;
}
