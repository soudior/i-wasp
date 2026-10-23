/**
 * i-wasp Studio - NFC Cards Pricing Configuration
 *
 * Grille officielle. Ne pas la recalculer avec un taux.
 * L'offre de lancement (src/lib/launchOffer.ts) remplace temporairement
 * le prix de la Professionnelle et ajoute le Pack DUO.
 * - Essentielle: 29 € / 199 DH
 * - Professionnelle: 49 € / 349 DH
 * - Prestige: 79 € / 599 DH
 * - Pack TEAM (5): 119 € / 1299 DH
 */

import { isLaunchOfferActive, LAUNCH_OFFER } from "./launchOffer";

export const PRO_SUBSCRIPTION = {
  yearlyEur: 49,
  monthlyEur: 4.99,
  yearlyMad: 349,
  monthlyMad: 39,
} as const;

export const NFC_PRICING = {
  currency: {
    primary: 'EUR',
    secondary: 'MAD',
  },

  // Tarifs cartes NFC individuelles
  cards: {
    ESSENTIELLE: {
      id: 'essentielle',
      name: 'Essentielle',
      subtitle: 'Carte PVC classique',
      priceEur: 29,
      priceMad: 199,
      proTrialMonths: 3,
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
      priceEur: 49,
      priceMad: 349,
      proTrialMonths: 3,
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
      priceEur: 79,
      priceMad: 599,
      proTrialMonths: 3,
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
      priceEur: 119,
      priceMad: 1299,
      pricePerCardEur: 23.80,
      pricePerCardMad: 259.80,
      badge: '👥 Équipe',
      features: [
        '5 cartes Professionnelle',
        'Design unifié équipe',
        'Logos imprimés',
        'Gestion centralisée',
        'Livraison offerte',
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
      priceMad: 199,
      pricePerCardMad: 199,
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

/** Prix catalogue tel qu'affiché : MAD au Maroc, EUR partout ailleurs. */
export function formatCatalogAmount(eur: number, mad: number, currency: string): string {
  if (currency === "MAD") {
    return `${Math.round(mad).toLocaleString("fr-FR")} DH`;
  }
  if (Number.isInteger(eur)) return `${eur.toLocaleString("fr-FR")} €`;
  return `${eur.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

const KNOWN_CENT_PAIRS: Array<{ mad: number; eur: number }> = [
  { mad: NFC_PRICING.cards.ESSENTIELLE.priceMad, eur: NFC_PRICING.cards.ESSENTIELLE.priceEur },
  { mad: NFC_PRICING.cards.PROFESSIONNELLE.priceMad, eur: NFC_PRICING.cards.PROFESSIONNELLE.priceEur },
  { mad: NFC_PRICING.cards.PRESTIGE.priceMad, eur: NFC_PRICING.cards.PRESTIGE.priceEur },
  { mad: NFC_PRICING.cards.PACK_TEAM.priceMad, eur: NFC_PRICING.cards.PACK_TEAM.priceEur },
  { mad: LAUNCH_OFFER.professionnelle.priceMad, eur: LAUNCH_OFFER.professionnelle.priceEur },
  { mad: LAUNCH_OFFER.duo.priceMad, eur: LAUNCH_OFFER.duo.priceEur },
  { mad: LAUNCH_OFFER.team.priceMad, eur: LAUNCH_OFFER.team.priceEur },
  { mad: NFC_PRICING.extras.laserEngraving.priceMad, eur: NFC_PRICING.extras.laserEngraving.priceEur },
  { mad: NFC_PRICING.extras.expressProduction.priceMad, eur: NFC_PRICING.extras.expressProduction.priceEur },
  { mad: NFC_PRICING.extras.customPackaging.priceMad, eur: NFC_PRICING.extras.customPackaging.priceEur },
];

/** Affiche un montant stocké en centimes MAD s'il appartient à la grille. Jamais de DH dans la vue euro. */
export function formatMadCents(cents: number, currency: string): string {
  const mad = Math.round(cents / 100);
  const known = KNOWN_CENT_PAIRS.find((pair) => pair.mad === mad);
  if (known) return formatCatalogAmount(known.eur, known.mad, currency);
  if (currency === "MAD") return `${mad.toLocaleString("fr-FR")} DH`;
  return "";
}

export function formatPriceMad(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} DH`;
}

/** Économie réelle du Pack TEAM contre le prix unitaire courant de la Professionnelle. */
export function packTeamSavingsPercent(currency: "EUR" | "MAD", now: Date = new Date()): number | null {
  const launch = isLaunchOfferActive(now);
  const unit = currency === "MAD"
    ? (launch ? LAUNCH_OFFER.professionnelle.priceMad : NFC_PRICING.cards.PROFESSIONNELLE.priceMad)
    : (launch ? LAUNCH_OFFER.professionnelle.priceEur : NFC_PRICING.cards.PROFESSIONNELLE.priceEur);
  const pack = currency === "MAD"
    ? (launch ? LAUNCH_OFFER.team.priceMad : NFC_PRICING.cards.PACK_TEAM.priceMad)
    : (launch ? LAUNCH_OFFER.team.priceEur : NFC_PRICING.cards.PACK_TEAM.priceEur);
  const full = unit * NFC_PRICING.cards.PACK_TEAM.quantity;
  if (pack >= full) return null;
  return Math.round((1 - pack / full) * 100);
}

/** Prix affiché d'une carte : l'offre de lancement remplace le tarif catalogue tant qu'elle est active. */
export function cardDisplayPrice(productId: string, priceEur: number, priceMad: number, now: Date = new Date()): {
  priceEur: number;
  priceMad: number;
  compareEur?: number;
  compareMad?: number;
} {
  if (isLaunchOfferActive(now)) {
    if (productId === "carte-executive") {
      const o = LAUNCH_OFFER.professionnelle;
      return { priceEur: o.priceEur, priceMad: o.priceMad, compareEur: o.compareEur, compareMad: o.compareMad };
    }
    if (productId === "pack-team") {
      const o = LAUNCH_OFFER.team;
      return { priceEur: o.priceEur, priceMad: o.priceMad, compareEur: o.compareEur, compareMad: o.compareMad };
    }
  }
  return { priceEur, priceMad };
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
