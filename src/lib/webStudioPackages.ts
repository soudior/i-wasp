/**
 * Web Studio Packages Configuration (MAD pricing)
 * 3 tiers: Starter, Standard, Premium
 */

export const WEB_STUDIO_PACKAGES = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    badge: '🚀 ESSENTIEL',
    description: 'Pour démarrer votre présence en ligne avec un site simple et efficace.',
    priceMad: 2000,
    priceEur: 200,
    stripe_price_id: 'price_1SpKRXIvyaABH94u3XFnG4qg', // À mettre à jour avec le nouveau prix Stripe
    stripe_product_id: 'prod_TmuG5HE5p4MFRj',
    pages: '1-3 PAGES',
    delivery: '3-5 jours',
    deliveryIcon: '⚡',
    isInstant: false,
    features: [
      'Design responsive',
      'Hébergement inclus',
      'Formulaire de contact',
      'Optimisation SEO de base',
    ],
    color: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    }
  },
  STANDARD: {
    id: 'standard',
    name: 'Standard',
    badge: '⭐ RECOMMANDÉ',
    description: 'Pour une présence professionnelle complète avec toutes les fonctionnalités essentielles.',
    priceMad: 5000,
    priceEur: 500,
    stripe_price_id: 'price_1SpKRqIvyaABH94uKQIXaEIW', // À mettre à jour avec le nouveau prix Stripe
    stripe_product_id: 'prod_TmuGoD257oDhrS',
    pages: '4-6 PAGES',
    delivery: '5-7 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      'Tout Starter +',
      'Galerie photos',
      'Intégration réseaux sociaux',
      'Blog intégré',
      'Analytics avancés',
    ],
    color: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      accent: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    badge: '👑 PREMIUM',
    description: 'Solution complète sur-mesure pour les projets ambitieux.',
    priceMad: 10000,
    priceEur: 1000,
    stripe_price_id: 'price_1SpKS3IvyaABH94ujjmo6jDb', // À mettre à jour avec le nouveau prix Stripe
    stripe_product_id: 'prod_TmuGjPyWT6Gle4',
    pages: '7-10 PAGES',
    delivery: '7-14 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      'Tout Standard +',
      'Design premium',
      'Animations avancées',
      'CMS personnalisé',
      'E-commerce (optionnel)',
      'Support prioritaire',
    ],
    color: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      accent: 'text-amber-500',
      button: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600',
    }
  },
} as const;

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
    case 'starter': return 3;
    case 'standard': return 6;
    case 'premium': return 10;
    default: return 3;
  }
}
