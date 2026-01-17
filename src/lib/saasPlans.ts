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
    tagline: 'Essai gratuit',
    description: 'Découvrez IWASP sans engagement',
    priceEur: 0,
    priceMad: 0,
    priceEurAnnual: 0,
    priceMadAnnual: 0,
    interval: null,
    isPopular: false,
    
    included: [
      'Profil digital basique',
      'QR Code partageable',
      'vCard + QR + NFC',
      'Branding IWASP visible',
    ],
    
    excluded: [
      'Site web personnalisé',
      'Collections',
      'Stories',
      'Push notifications',
      'Analytics IA',
      'White-label',
      'API',
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
    },
  },
  
  PRO: {
    id: 'pro' as SaaSPlanId,
    name: 'Pro',
    tagline: 'Freelancers & PME',
    description: 'L\'essentiel pour votre présence digitale',
    priceEur: 12,
    priceMad: 132,
    priceEurAnnual: 108,
    priceMadAnnual: 1188,
    interval: 'month' as const,
    isPopular: true, // ⭐ PLUS POPULAIRE
    stripe: {
      monthly: SAAS_STRIPE_PRODUCTS.PRO_MONTHLY,
      annual: SAAS_STRIPE_PRODUCTS.PRO_ANNUAL,
    },
    
    included: [
      'vCard + QR + NFC',
      'Site web personnalisé',
      'Collections',
      'Stories',
      'Push notifications',
      'Analytics IA',
    ],
    
    excluded: [
      'White-label',
      'API',
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
    },
  },
  
  BUSINESS: {
    id: 'business' as SaaSPlanId,
    name: 'Business',
    tagline: 'Agences & Entreprises',
    description: 'Solution complète pour les professionnels',
    priceEur: 39,
    priceMad: 429,
    priceEurAnnual: 351,
    priceMadAnnual: 3861,
    interval: 'month' as const,
    isPopular: false,
    stripe: {
      monthly: SAAS_STRIPE_PRODUCTS.BUSINESS_MONTHLY,
      annual: SAAS_STRIPE_PRODUCTS.BUSINESS_ANNUAL,
    },
    
    included: [
      'vCard + QR + NFC',
      'Site web personnalisé',
      'Collections',
      'Stories',
      'Push notifications',
      'Analytics IA',
      'White-label (sans branding IWASP)',
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
      { name: 'vCard complète', free: true, pro: true, business: true },
      { name: 'QR Code partageable', free: true, pro: true, business: true },
      { name: 'Technologie NFC', free: true, pro: true, business: true },
    ],
  },
  {
    category: 'Site Web & Contenu',
    features: [
      { name: 'Site web personnalisé', free: false, pro: true, business: true },
      { name: 'Collections', free: false, pro: true, business: true },
      { name: 'Stories', free: false, pro: true, business: true },
    ],
  },
  {
    category: 'Marketing & Analytics',
    features: [
      { name: 'Push notifications', free: false, pro: true, business: true },
      { name: 'Analytics IA', free: false, pro: true, business: true },
    ],
  },
  {
    category: 'Business',
    features: [
      { name: 'White-label (sans branding)', free: false, pro: false, business: true },
      { name: 'API complète', free: false, pro: false, business: true },
    ],
  },
];
