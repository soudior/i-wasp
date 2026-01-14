/**
 * Web Studio Packages Configuration (MAD pricing)
 * 3 tiers: Starter (instant), Pro (3-5 days), Elite (7 days)
 */

export const WEB_STUDIO_PACKAGES = {
  STARTER: {
    id: 'starter',
    name: 'Pack Starter',
    badge: '🔥 INSTANTANÉ',
    description: 'Une page landing professionnelle, créée par IA en quelques minutes. Parfait pour présenter votre business.',
    priceMad: 790,
    priceEur: 79,
    stripe_price_id: 'price_1SpKRXIvyaABH94u3XFnG4qg',
    stripe_product_id: 'prod_TmuG5HE5p4MFRj',
    pages: '1 page landing',
    delivery: '5-10 minutes',
    deliveryIcon: '⚡',
    isInstant: true,
    features: [
      '1 page landing',
      'Design IA automatique',
      'Contenu IA généré',
      'Mobile responsive',
      'Sous-domaine gratuit',
    ],
    color: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pack Pro',
    badge: '⭐ POPULAIRE',
    description: '3 à 5 pages pour un site complet : Accueil, Services, À propos, Contact…',
    priceMad: 1490,
    priceEur: 149,
    stripe_price_id: 'price_1SpKRqIvyaABH94uKQIXaEIW',
    stripe_product_id: 'prod_TmuGoD257oDhrS',
    pages: '3-5 pages',
    delivery: '3-5 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      '3–5 pages au choix',
      'Design IA premium',
      'Contenu IA optimisé',
      'Formulaire de contact',
      'Mobile responsive',
      'Hébergement inclus',
    ],
    color: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      accent: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
    }
  },
  ELITE: {
    id: 'elite',
    name: 'Pack Elite',
    badge: '👑 PREMIUM',
    description: '5 à 10 pages complètes + fonctionnalités avancées pour un site professionnel haut de gamme.',
    priceMad: 2290,
    priceEur: 229,
    stripe_price_id: 'price_1SpKS3IvyaABH94ujjmo6jDb',
    stripe_product_id: 'prod_TmuGjPyWT6Gle4',
    pages: '5-10 pages',
    delivery: '7 jours',
    deliveryIcon: '📅',
    isInstant: false,
    features: [
      '5–10 pages complètes',
      'Design IA ultra-premium',
      'Contenu complet et optimisé',
      'Formulaire avancé',
      'WhatsApp intégré',
      'Blog / actualités',
      'Mobile responsive',
      'Hébergement inclus',
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
    case 'starter': return 1;
    case 'pro': return 5;
    case 'elite': return 10;
    default: return 1;
  }
}
