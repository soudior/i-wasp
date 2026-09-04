/**
 * i-wasp Web Studio - Packages Configuration (MAD pricing)
 * 3 tiers: Basic, Pro, Enterprise
 * Basé au Maroc, livraison mondiale
 */

export const WEB_STUDIO_PACKAGES = {
  BASIC: {
    id: 'basic',
    name: 'Lancement',
    badge: '🚀 Site vitrine',
    tagline: 'Pour lancer votre présence en ligne',
    description: 'Une vitrine premium, rapide et prête à convertir vos premiers visiteurs.',
    priceMad: 2000,
    priceEur: 200,
    stripe_price_id: 'price_1SpKRXIvyaABH94u3XFnG4qg', // À mettre à jour
    stripe_product_id: 'prod_TmuG5HE5p4MFRj',
    pages: 'Jusqu\'à 5 pages',
    maxPages: 5,
    delivery: '5 à 7 jours',
    deliveryIcon: '⚡',
    isInstant: false,
    features: [
      'Design premium responsive',
      'Jusqu’à 5 pages',
      'Formulaire de contact',
      'SEO essentiel et Google indexing',
      'Hébergement offert 12 mois',
      '1 série de retouches incluse',
    ],
    color: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    }
  },
  PRO: {
    id: 'pro',
    name: 'Croissance',
    badge: '⭐ Business & conversion',
    tagline: 'Le meilleur rapport valeur / prix',
    description: 'Un site commercial complet pour générer des prospects, réservations ou ventes.',
    priceMad: 5000,
    priceEur: 500,
    stripe_price_id: 'price_1SpKRqIvyaABH94uKQIXaEIW', // À mettre à jour
    stripe_product_id: 'prod_TmuGoD257oDhrS',
    pages: 'Jusqu\'à 10 pages',
    maxPages: 10,
    delivery: '7 à 10 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      'Tout Lancement +',
      'Jusqu’à 10 pages',
      'Réservation ou paiement en ligne',
      'SEO avancé et analytics',
      'Blog ou catalogue intégré',
      'Automatisation des demandes clients',
      '2 séries de retouches incluses',
    ],
    color: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      accent: 'text-blue-600',
      button: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Signature',
    badge: '👑 Sur-mesure & automatisation',
    tagline: 'Pour dominer votre marché',
    description: 'Une plateforme sur mesure avec automatisations, CRM et accompagnement prioritaire.',
    priceMad: 10000,
    priceEur: 1000,
    stripe_price_id: 'price_1SpKS3IvyaABH94ujjmo6jDb', // À mettre à jour
    stripe_product_id: 'prod_TmuGjPyWT6Gle4',
    pages: 'Illimité',
    maxPages: 999,
    delivery: '10 à 14 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      'Tout Croissance +',
      'Pages et parcours sur mesure',
      'CRM et automatisations intégrés',
      'Dashboard analytics avancé',
      'Formation de votre équipe',
      'Support prioritaire 12 mois',
      '3 séries de retouches incluses',
    ],
    color: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      accent: 'text-amber-600',
      button: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600',
    }
  },
} as const;

// Maintenance mensuelle optionnelle
export const WEB_MAINTENANCE = {
  monthly: {
    priceMad: 500,
    priceEur: 50,
    name: 'Maintenance mensuelle',
  },
  yearly: {
    priceMad: 5000, // 2 mois gratuits (10 mois au lieu de 12)
    priceEur: 500,
    name: 'Maintenance annuelle',
    discount: '2 mois offerts',
    discountPercent: 17,
  },
  features: [
    'Mises à jour de sécurité',
    'Corrections de bugs',
    'Modifications mineures (2h/mois)',
    'Support technique prioritaire',
    'Sauvegardes mensuelles',
  ],
};

// Annual discount for packages (20% off)
export const ANNUAL_DISCOUNT_PERCENT = 20;

export function getAnnualPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT_PERCENT / 100));
}

export type WebStudioPackageKey = keyof typeof WEB_STUDIO_PACKAGES;
export type WebStudioPackage = typeof WEB_STUDIO_PACKAGES[WebStudioPackageKey];

export const AVAILABLE_PAGES = [
  { id: 'accueil', label: 'Accueil', required: true },
  { id: 'apropos', label: 'À propos' },
  { id: 'services', label: 'Services / Offres' },
  { id: 'portfolio', label: 'Portfolio / Réalisations' },
  { id: 'contact', label: 'Contact' },
  { id: 'blog', label: 'Blog (optionnel)' },
  { id: 'faq', label: 'FAQ' },
  { id: 'temoignages', label: 'Témoignages / Avis clients' },
  { id: 'shop', label: 'Shop / E-commerce (optionnel)' },
  { id: 'autre', label: 'Autre' },
];

export const BUSINESS_SECTORS = [
  { id: 'restaurant', label: 'Restauration / Café' },
  { id: 'beaute', label: 'Salon de beauté / Coiffure' },
  { id: 'commerce', label: 'Commerce / E-commerce' },
  { id: 'services', label: 'Services (plombier, électricien, etc.)' },
  { id: 'professionnel', label: 'Professionnel (avocat, comptable, etc.)' },
  { id: 'coaching', label: 'Coaching / Formation' },
  { id: 'immobilier', label: 'Immobilier' },
  { id: 'sante', label: 'Santé / Bien-être' },
  { id: 'tech', label: 'Technologie / SaaS' },
  { id: 'autre', label: 'Autre' },
];

export function getPackageById(id: string): WebStudioPackage | null {
  const key = Object.keys(WEB_STUDIO_PACKAGES).find(
    k => WEB_STUDIO_PACKAGES[k as WebStudioPackageKey].id === id
  ) as WebStudioPackageKey | undefined;
  return key ? WEB_STUDIO_PACKAGES[key] : null;
}

export function getMaxPages(packageId: string): number {
  switch (packageId) {
    case 'basic': return 5;
    case 'pro': return 10;
    case 'enterprise': return 999;
    default: return 5;
  }
}
