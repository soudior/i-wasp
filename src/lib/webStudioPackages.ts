/**
 * i-wasp Web Studio - Packages Configuration (MAD pricing)
 * 3 tiers: Basic, Pro, Enterprise
 * Basé au Maroc, livraison mondiale
 */

export const WEB_STUDIO_PACKAGES = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    badge: '🚀 Portfolio/Vitrine',
    tagline: 'Pour démarrer',
    description: 'Site vitrine professionnel pour présenter votre activité.',
    priceMad: 2000,
    priceEur: 200,
    stripe_price_id: 'price_1SpKRXIvyaABH94u3XFnG4qg', // À mettre à jour
    stripe_product_id: 'prod_TmuG5HE5p4MFRj',
    pages: 'Jusqu\'à 5 pages',
    maxPages: 5,
    delivery: '5-7 jours',
    deliveryIcon: '⚡',
    isInstant: false,
    features: [
      'Design responsive',
      'Formulaire contact',
      'Hébergement inclus',
      'Optimisation SEO de base',
      'Support technique',
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
    name: 'Pro',
    badge: '⭐ E-commerce/Booking',
    tagline: 'Le plus populaire',
    description: 'Site complet avec fonctionnalités avancées pour développer votre business.',
    priceMad: 5000,
    priceEur: 500,
    stripe_price_id: 'price_1SpKRqIvyaABH94uKQIXaEIW', // À mettre à jour
    stripe_product_id: 'prod_TmuGoD257oDhrS',
    pages: 'Jusqu\'à 10 pages',
    maxPages: 10,
    delivery: '7-10 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      'Tout Basic +',
      'Galerie avancée',
      'Système réservation/paiement',
      'SEO optimisé',
      'Blog intégré',
      'Intégration réseaux sociaux',
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
    name: 'Enterprise',
    badge: '👑 CRM complet',
    tagline: 'Solution sur-mesure',
    description: 'Solution complète avec CRM intégré et support premium pour les entreprises.',
    priceMad: 10000,
    priceEur: 1000,
    stripe_price_id: 'price_1SpKS3IvyaABH94ujjmo6jDb', // À mettre à jour
    stripe_product_id: 'prod_TmuGjPyWT6Gle4',
    pages: 'Illimité',
    maxPages: 999,
    delivery: '10-14 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      'Tout Pro +',
      'CRM intégré',
      'Analytics avancé',
      'Formations équipe',
      'Support 1 an inclus',
      'Personnalisation complète',
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
  priceMad: 500,
  priceEur: 50,
  name: 'Maintenance mensuelle',
  features: [
    'Mises à jour de sécurité',
    'Corrections de bugs',
    'Modifications mineures (2h/mois)',
    'Support technique prioritaire',
    'Sauvegardes mensuelles',
  ],
};

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
