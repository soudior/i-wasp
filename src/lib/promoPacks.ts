/**
 * i-wasp Studio - Packs Promo (Fusion Cartes NFC + Sites Web)
 * Offres groupées avec réductions significatives
 * Basé au Maroc, livraison mondiale
 */

import { WEB_STUDIO_PACKAGES } from './webStudioPackages';
import { NFC_PRICING } from './nfcPricing';

export const PROMO_PACKS = {
  BUSINESS: {
    id: 'business',
    name: 'Pack Business',
    badge: '🚀 Starter',
    tagline: 'Idéal: Freelancers, PME, Startups',
    description: 'Lancez votre présence digitale complète avec site web + cartes NFC professionnelles.',
    
    // Contenu du pack
    includes: {
      website: {
        type: 'basic',
        name: 'Site Basic',
        valueMad: 2000,
      },
      nfcCards: {
        quantity: 50,
        name: '50 Cartes NFC Standard',
        valueMad: 4900,
      },
      maintenance: null,
    },
    
    // Prix
    valueTotal: 6900, // 2000 + 4900
    priceMad: 5900,
    savingsMad: 1000,
    savingsPercent: 14,
    
    // Stripe (à mettre à jour)
    stripe_price_id: 'price_pack_business',
    stripe_product_id: 'prod_pack_business',
    
    features: [
      'Site responsive jusqu\'à 3 pages',
      '50 cartes NFC personnalisées',
      'Design professionnel',
      'Formulaire contact intégré',
      'Inscription NFC unique',
      'Livraison 10-15 jours',
    ],
    
    color: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
  },
  
  PREMIUM: {
    id: 'premium',
    name: 'Pack Premium',
    badge: '⭐ Best Value',
    tagline: 'Idéal: Agences, Leaders, Réseaux',
    description: 'Solution complète avec site pro, cartes volume et maintenance incluse pendant 1 an.',
    
    // Contenu du pack
    includes: {
      website: {
        type: 'standard',
        name: 'Site Pro',
        valueMad: 5000,
      },
      nfcCards: {
        quantity: 100,
        name: '100 Cartes NFC Volume',
        valueMad: 7900,
      },
      maintenance: {
        months: 12,
        name: 'Maintenance 1 an',
        valueMad: 6000, // 500 DH x 12
      },
    },
    
    // Prix
    valueTotal: 18900, // 5000 + 7900 + 6000
    priceMad: 12900,
    savingsMad: 6000,
    savingsPercent: 32,
    
    // Stripe (à mettre à jour)
    stripe_price_id: 'price_pack_premium',
    stripe_product_id: 'prod_pack_premium',
    
    features: [
      'Site Pro jusqu\'à 6 pages',
      '100 cartes NFC avec gravure laser',
      'Galerie photos avancée',
      'Système réservation/paiement',
      'SEO optimisé',
      '12 mois maintenance incluse',
      'Support prioritaire',
      'Livraison 10-15 jours',
    ],
    
    color: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      accent: 'text-blue-600',
      button: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
    },
  },
  
  CUSTOM: {
    id: 'custom',
    name: 'Pack Custom',
    badge: '👑 Sur Mesure',
    tagline: 'Pour projets uniques',
    description: 'Solution entièrement personnalisée selon vos besoins spécifiques. Devis gratuit.',
    
    // Contenu variable
    includes: {
      website: null,
      nfcCards: null,
      maintenance: null,
    },
    
    // Prix sur devis
    valueTotal: null,
    priceMad: null,
    savingsMad: null,
    savingsPercent: null,
    
    // Stripe - non applicable (devis)
    stripe_price_id: null,
    stripe_product_id: null,
    
    features: [
      'Site Enterprise complet',
      'Volume cartes illimité',
      'CRM intégré',
      'Analytics avancé',
      'Formation équipe',
      'Support dédié',
      'Devis sous 24h',
    ],
    
    color: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      accent: 'text-amber-600',
      button: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600',
    },
  },
} as const;

export type PromoPackId = keyof typeof PROMO_PACKS;
export type PromoPack = typeof PROMO_PACKS[PromoPackId];

// Maintenance mensuelle optionnelle
export const MONTHLY_MAINTENANCE = {
  priceMad: 500,
  priceEur: 50,
  features: [
    'Mises à jour de sécurité',
    'Corrections de bugs',
    'Modifications mineures',
    'Support technique',
    'Sauvegardes mensuelles',
  ],
};

// Helpers
export function getPromoPackById(id: string): PromoPack | null {
  const pack = Object.values(PROMO_PACKS).find(p => p.id === id);
  return pack || null;
}

export function getPromoPacksList(): PromoPack[] {
  return Object.values(PROMO_PACKS);
}

export function formatPackSavings(pack: PromoPack): string | null {
  if (!pack.savingsMad) return null;
  return `Économie: ${pack.savingsMad.toLocaleString('fr-FR')} DH (-${pack.savingsPercent}%)`;
}
