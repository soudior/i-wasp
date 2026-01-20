/**
 * IWASP SaaS Plans Configuration
 * New tiered pricing: FREE (0€), PRO (12€/mois), BUSINESS (39€/mois)
 * Currency: EUR primary, MAD secondary (11 DH = 1€)
 */

// Stripe Product and Price IDs - SaaS Monthly Subscriptions
// Note: These need to be created in Stripe Dashboard
export const SAAS_STRIPE_PRODUCTS = {
  PRO_MONTHLY: {
    product_id: 'prod_pro_monthly',
    price_id: 'price_pro_monthly', // TODO: Replace with actual Stripe price ID
    name: 'IWASP Pro - Mensuel',
    priceEur: 1200, // cents (12€)
    priceMad: 13200, // centimes (132 DH)
    currency: 'eur',
    interval: 'month' as const,
  },
  PRO_ANNUAL: {
    product_id: 'prod_pro_annual',
    price_id: 'price_pro_annual', // TODO: Replace with actual Stripe price ID
    name: 'IWASP Pro - Annuel',
    priceEur: 10800, // cents (108€)
    priceMad: 118800, // centimes (1188 DH)
    currency: 'eur',
    interval: 'year' as const,
    savingsPercent: 25, // 2 mois offerts
  },
  BUSINESS_MONTHLY: {
    product_id: 'prod_business_monthly',
    price_id: 'price_business_monthly', // TODO: Replace with actual Stripe price ID
    name: 'IWASP Business - Mensuel',
    priceEur: 3900, // cents (39€)
    priceMad: 42900, // centimes (429 DH)
    currency: 'eur',
    interval: 'month' as const,
  },
  BUSINESS_ANNUAL: {
    product_id: 'prod_business_annual',
    price_id: 'price_business_annual', // TODO: Replace with actual Stripe price ID
    name: 'IWASP Business - Annuel',
    priceEur: 35100, // cents (351€)
    priceMad: 386100, // centimes (3861 DH)
    currency: 'eur',
    interval: 'year' as const,
    savingsPercent: 25, // 3 mois offerts
  },
} as const;

// Legacy products (for backward compatibility)
export const LEGACY_STRIPE_PRODUCTS = {
  GOLD_MONTHLY: {
    product_id: 'prod_TkashOgkZlDDzm',
    price_id: 'price_1Sn5gvIvyaABH94uT3RkeEbz',
    name: 'IWASP Gold - Mensuel',
    price: 290, // cents (2.90€)
    currency: 'eur',
    interval: 'month' as const,
  },
  GOLD_ANNUAL: {
    product_id: 'prod_TkasPk75rM1k69',
    price_id: 'price_1Sn5h7IvyaABH94uTfkCq0zL',
    name: 'IWASP Gold - Annuel',
    price: 2300, // cents (23€)
    currency: 'eur',
    interval: 'year' as const,
  },
} as const;

// SaaS Plan Types
export type SaaSPlanId = 'free' | 'pro' | 'business';

// Plan configuration with features and limits
export const SAAS_PLANS = {
  FREE: {
    id: 'free' as SaaSPlanId,
    name: 'Free',
    tagline: 'Lancer',
    description: 'Idéal pour tester votre première identité digitale et commencer à partager votre profil en quelques minutes.',
    priceEur: 0,
    priceMad: 0,
    priceEurAnnual: 0,
    priceMadAnnual: 0,
    interval: null,
    isPopular: false,
    
    included: [
      '1 vCard digitale professionnelle',
      '1 mini-site auto-généré',
      '100 visites / mois',
      'QR code automatique',
      'Liens réseaux sociaux (limités)',
      'Analytics basiques',
    ],
    
    excluded: [
      'Générateur IA',
      'Stories',
      'Collections',
      'Notifications push',
      'Domaine personnalisé',
      'White-label',
    ],
    
    features: {
      vcard: true,
      qrCode: true,
      nfc: true,
      sitePersonnalise: false,
      collections: false,
      stories: false,
      pushNotifications: false,
      analyticsIA: false,
      whiteLabel: false,
      api: false,
      visitesIllimitees: false,
      templatesStandard: true,
      templatesPremium: false,
    },
    
    limits: {
      vcards: 1,
      visites: 100,
      stories: 0,
      pushNotifications: 0,
      socialLinks: 3,
    },
  },
  
  PRO: {
    id: 'pro' as SaaSPlanId,
    name: 'Pro',
    tagline: 'Professionnel',
    description: 'Pour les pros qui veulent une identité digitale complète, élégante et optimisée par l\'IA.',
    priceEur: 12,
    priceMad: 132,
    priceEurAnnual: 108, // 9€/mois équivalent
    priceMadAnnual: 1188,
    interval: 'month' as const,
    isPopular: true, // ⭐ LE PLUS POPULAIRE
    stripe: {
      monthly: SAAS_STRIPE_PRODUCTS.PRO_MONTHLY,
      annual: SAAS_STRIPE_PRODUCTS.PRO_ANNUAL,
    },
    
    included: [
      'vCards et mini-sites illimités',
      'Visites illimitées',
      'Générateur IA (bio, pitch, contenus)',
      'Templates premium & personnalisation',
      'Collections & Stories dynamiques',
      'Notifications push (1 000/mois)',
      'Analytics avancés (origine, clics, conversion)',
      'Branding quasi-invisible',
      'Support prioritaire par email',
    ],
    
    excluded: [
      'White-label complet',
      'API complète',
      'Domaine personnalisé',
    ],
    
    features: {
      vcard: true,
      qrCode: true,
      nfc: true,
      sitePersonnalise: true,
      collections: true,
      stories: true,
      pushNotifications: true,
      analyticsIA: true,
      whiteLabel: false,
      api: false,
      visitesIllimitees: true,
      templatesStandard: true,
      templatesPremium: true,
    },
    
    limits: {
      vcards: -1, // illimité
      visites: -1, // illimité
      stories: 20,
      pushNotifications: 1000,
      socialLinks: -1, // illimité
    },
  },
  
  BUSINESS: {
    id: 'business' as SaaSPlanId,
    name: 'Business',
    tagline: 'Équipe & Agence',
    description: 'Centralisez et pilotez l\'identité digitale de toute votre équipe au même endroit.',
    priceEur: 39,
    priceMad: 429,
    priceEurAnnual: 374, // ~32€/mois équivalent (384€/an)
    priceMadAnnual: 4114,
    interval: 'month' as const,
    isPopular: false,
    stripe: {
      monthly: SAAS_STRIPE_PRODUCTS.BUSINESS_MONTHLY,
      annual: SAAS_STRIPE_PRODUCTS.BUSINESS_ANNUAL,
    },
    
    included: [
      'Tout ce qui est inclus dans Pro',
      'Jusqu\'à 5 comptes utilisateurs',
      'Gestion d\'équipe (rôles, droits)',
      'Templates & ressources partagées',
      'Stories & notifications illimitées',
      'Domaines personnalisés',
      'Reporting avancé par équipe',
      'Support prioritaire & onboarding',
      'White-label complet',
      'API complète',
    ],
    
    excluded: [],
    
    features: {
      vcard: true,
      qrCode: true,
      nfc: true,
      sitePersonnalise: true,
      collections: true,
      stories: true,
      pushNotifications: true,
      analyticsIA: true,
      whiteLabel: true,
      api: true,
      visitesIllimitees: true,
      templatesStandard: true,
      templatesPremium: true,
      domainePersonnalise: true,
      equipe: true,
    },
    
    limits: {
      vcards: -1, // illimité
      visites: -1, // illimité
      stories: -1, // illimité
      pushNotifications: -1, // illimité
      socialLinks: -1, // illimité
      teamMembers: 5, // inclus
    },
  },
} as const;

// Helper functions
export type SaaSPlan = typeof SAAS_PLANS[keyof typeof SAAS_PLANS];

export const getSaaSPlan = (planId: SaaSPlanId): SaaSPlan => {
  switch (planId) {
    case 'pro':
      return SAAS_PLANS.PRO;
    case 'business':
      return SAAS_PLANS.BUSINESS;
    default:
      return SAAS_PLANS.FREE;
  }
};

export const getSaaSPlanByProductId = (productId: string): SaaSPlan | null => {
  if (productId === SAAS_STRIPE_PRODUCTS.PRO_MONTHLY.product_id ||
      productId === SAAS_STRIPE_PRODUCTS.PRO_ANNUAL.product_id) {
    return SAAS_PLANS.PRO;
  }
  if (productId === SAAS_STRIPE_PRODUCTS.BUSINESS_MONTHLY.product_id ||
      productId === SAAS_STRIPE_PRODUCTS.BUSINESS_ANNUAL.product_id) {
    return SAAS_PLANS.BUSINESS;
  }
  // Legacy Gold plans map to Pro
  if (productId === LEGACY_STRIPE_PRODUCTS.GOLD_MONTHLY.product_id ||
      productId === LEGACY_STRIPE_PRODUCTS.GOLD_ANNUAL.product_id) {
    return SAAS_PLANS.PRO;
  }
  return null;
};

export const getSaaSPriceId = (planId: SaaSPlanId, annual: boolean = false): string | null => {
  switch (planId) {
    case 'pro':
      return annual 
        ? SAAS_STRIPE_PRODUCTS.PRO_ANNUAL.price_id 
        : SAAS_STRIPE_PRODUCTS.PRO_MONTHLY.price_id;
    case 'business':
      return annual 
        ? SAAS_STRIPE_PRODUCTS.BUSINESS_ANNUAL.price_id 
        : SAAS_STRIPE_PRODUCTS.BUSINESS_MONTHLY.price_id;
    default:
      return null;
  }
};

export const formatSaaSPrice = (priceEur: number, currency: 'eur' | 'mad' = 'eur'): string => {
  if (currency === 'mad') {
    const priceMad = priceEur * 11; // Conversion approximative
    return `${priceMad.toLocaleString('fr-FR')} DH`;
  }
  return `${priceEur}€`;
};

export const isPremiumPlan = (planId: SaaSPlanId): boolean => {
  return planId === 'pro' || planId === 'business';
};

export const isBusinessPlan = (planId: SaaSPlanId): boolean => {
  return planId === 'business';
};

// Feature comparison for pricing page
export const SAAS_FEATURE_COMPARISON = [
  {
    category: 'Profil Digital',
    features: [
      { name: 'vCard digitale professionnelle', free: '1', pro: 'Illimité', business: 'Illimité' },
      { name: 'Mini-site auto-généré', free: '1', pro: 'Illimité', business: 'Illimité' },
      { name: 'QR Code automatique', free: true, pro: true, business: true },
      { name: 'Technologie NFC', free: true, pro: true, business: true },
      { name: 'Visites / mois', free: '100', pro: 'Illimité', business: 'Illimité' },
    ],
  },
  {
    category: 'IA & Personnalisation',
    features: [
      { name: 'Générateur IA (bio, pitch)', free: false, pro: true, business: true },
      { name: 'Templates premium', free: false, pro: true, business: true },
      { name: 'Personnalisation couleurs & typos', free: false, pro: true, business: true },
    ],
  },
  {
    category: 'Contenu Dynamique',
    features: [
      { name: 'Collections (services, produits)', free: false, pro: 'Illimité', business: 'Illimité' },
      { name: 'Stories dynamiques', free: false, pro: '20 actives', business: 'Illimité' },
      { name: 'Notifications push / mois', free: false, pro: '1 000', business: 'Illimité' },
    ],
  },
  {
    category: 'Analytics',
    features: [
      { name: 'Analytics basiques', free: true, pro: true, business: true },
      { name: 'Origine visiteurs & clics', free: false, pro: true, business: true },
      { name: 'Taux de conversion', free: false, pro: true, business: true },
      { name: 'Reporting par équipe', free: false, pro: false, business: true },
    ],
  },
  {
    category: 'Équipe & Entreprise',
    features: [
      { name: 'Comptes utilisateurs', free: '1', pro: '1', business: '5 inclus' },
      { name: 'Gestion d\'équipe (rôles, droits)', free: false, pro: false, business: true },
      { name: 'Domaines personnalisés', free: false, pro: false, business: true },
      { name: 'White-label (sans branding)', free: false, pro: false, business: true },
      { name: 'API complète', free: false, pro: false, business: true },
    ],
  },
  {
    category: 'Support',
    features: [
      { name: 'Centre d\'aide', free: true, pro: true, business: true },
      { name: 'Email standard', free: true, pro: false, business: false },
      { name: 'Support prioritaire', free: false, pro: true, business: true },
      { name: 'Onboarding assisté', free: false, pro: false, business: true },
    ],
  },
];

// Upsell messages for in-app limits
export const SAAS_UPSELL_MESSAGES = {
  visitesLimit: "Vous avez atteint la limite de 100 visites / mois. Passez en Pro pour débloquer les visites illimitées.",
  iaLocked: "Activez l'IA pour générer une bio professionnelle en 10 secondes – disponible dans le plan Pro.",
  storiesLocked: "Les stories sont une fonctionnalité Pro. Débloquez-les dès maintenant pour dynamiser votre profil.",
  pushLocked: "Les notifications push sont réservées aux comptes Pro. Convertissez vos visiteurs au bon moment.",
  collectionsLocked: "Les collections sont disponibles avec le plan Pro. Organisez vos services et produits.",
  whitelabelLocked: "Supprimez le branding avec le plan Business pour une identité 100% personnalisée.",
  teamLocked: "Gérez plusieurs profils avec le plan Business. Parfait pour les équipes et agences.",
};
