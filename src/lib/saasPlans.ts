/**
 * IWASP SaaS Plans Configuration
 * New tiered pricing: Identity ($29), Professional ($79), Enterprise ($249)
 */

// Stripe Product and Price IDs - SaaS Monthly Subscriptions
export const SAAS_STRIPE_PRODUCTS = {
  IDENTITY: {
    product_id: 'prod_Tn8WPxz16dwjIl',
    price_id: 'price_1SpYFDIvyaABH94uC2gdPZHU',
    name: 'IWASP Identity',
    price: 2900, // cents ($29)
    currency: 'usd',
    interval: 'month' as const,
  },
  PROFESSIONAL: {
    product_id: 'prod_Tn8WtygsFfDTca',
    price_id: 'price_1SpYFaIvyaABH94uEGnzrZ0k',
    name: 'IWASP Professional',
    price: 7900, // cents ($79)
    currency: 'usd',
    interval: 'month' as const,
  },
  ENTERPRISE: {
    product_id: 'prod_Tn8WC7DS971gvQ',
    price_id: 'price_1SpYFpIvyaABH94ujt0myXhE',
    name: 'IWASP Enterprise',
    price: 24900, // cents ($249)
    currency: 'usd',
    interval: 'month' as const,
  },
} as const;

// Legacy Gold products (for backward compatibility)
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
export type SaaSPlanId = 'free' | 'identity' | 'professional' | 'enterprise';

// Plan configuration with features and limits
export const SAAS_PLANS = {
  FREE: {
    id: 'free' as SaaSPlanId,
    name: 'Free',
    tagline: 'Essai gratuit',
    description: 'Découvrez IWASP sans engagement',
    price: 0,
    currency: 'usd',
    interval: null,
    isPopular: false,
    
    included: [
      'Profil digital basique',
      'QR Code partageable',
      'Branding IWASP visible',
    ],
    
    excluded: [
      'Cartes NFC',
      'Apple/Google Wallet',
      'Site web',
      'Domaine custom',
      'Analytics',
      'Support prioritaire',
    ],
    
    features: {
      nfcCardsPerMonth: 0,
      nfcMaterial: null,
      logoOnCard: false,
      vcard: 'basic',
      wallet: false,
      sitePages: 0,
      blogIntegrated: false,
      customDomain: false,
      sslIncluded: false,
      analytics: 'none',
      support: 'email',
      iwaspCredits: 0, // Crédits i-wasp pour génération IA
    },
    
    limits: {
      maxNfcCards: 0,
      maxSocialLinks: 3,
      maxSitePages: 0,
      iwaspCreditsMonthly: 0,
    },
  },
  
  IDENTITY: {
    id: 'identity' as SaaSPlanId,
    name: 'Identity',
    tagline: 'Freelancers & Solo',
    description: 'Votre entrée dans l\'identité digitale professionnelle',
    price: 29,
    currency: 'usd',
    interval: 'month' as const,
    isPopular: false,
    stripe: SAAS_STRIPE_PRODUCTS.IDENTITY,
    
    included: [
      '10 cartes NFC/mois (PVC)',
      '5 crédits i-wasp IA/mois',
      'Design template simple',
      'vCard complète',
      'Apple & Google Wallet',
      'QR Code partageable',
      'Landing page 1 page',
      'Domaine .com inclus',
      'SSL gratuit',
      'Analytics basique',
      'Support email',
    ],
    
    excluded: [
      'Logo imprimé sur cartes',
      'Cartes métal',
      'Site multi-pages',
      'Blog intégré',
      'Chat 24/7',
    ],
    
    features: {
      nfcCardsPerMonth: 10,
      nfcMaterial: ['pvc_white', 'pvc_color'],
      logoOnCard: false, // Addon: +$15/mois
      vcard: 'full',
      wallet: true,
      sitePages: 1,
      blogIntegrated: false,
      customDomain: true,
      sslIncluded: true,
      analytics: 'basic',
      support: 'email',
      iwaspCredits: 5, // 5 crédits i-wasp/mois
    },
    
    limits: {
      maxNfcCards: 10,
      maxSocialLinks: 8,
      maxSitePages: 1,
      iwaspCreditsMonthly: 5,
    },
    
    addons: {
      logoOnCard: {
        name: 'Impression logo sur cartes',
        price: 15, // $/mois
      },
    },
  },
  
  PROFESSIONAL: {
    id: 'professional' as SaaSPlanId,
    name: 'Professional',
    tagline: 'PME & Petites Équipes',
    description: 'L\'expérience complète pour votre équipe',
    price: 79,
    currency: 'usd',
    interval: 'month' as const,
    isPopular: true, // ⭐ PLUS POPULAIRE
    stripe: SAAS_STRIPE_PRODUCTS.PROFESSIONAL,
    
    included: [
      '25 cartes NFC/mois (PVC + Métal brossé)',
      '20 crédits i-wasp IA/mois',
      'Design premium personnalisé',
      'Logo IMPRIMÉ sur cartes ✓',
      'vCard avancée + Formulaire contact',
      'Apple & Google Wallet passbook',
      'Site 5-10 pages + Blog intégré',
      'Domaines illimités',
      'SEO premium',
      'Analytics détaillée',
      'Chat 24/7 + Email support',
    ],
    
    excluded: [
      'Cartes métal premium',
      'Logo gravé',
      'E-commerce',
      'Manager dédié',
    ],
    
    features: {
      nfcCardsPerMonth: 25,
      nfcMaterial: ['pvc_white', 'pvc_color', 'metal_brushed'],
      logoOnCard: true,
      vcard: 'advanced',
      contactForm: true,
      wallet: true,
      sitePages: 10,
      blogIntegrated: true,
      customDomain: true,
      unlimitedDomains: true,
      sslIncluded: true,
      seoPremium: true,
      iwaspCredits: 20, // 20 crédits i-wasp/mois
      analytics: 'detailed',
      support: 'chat_24_7',
    },
    
    limits: {
      maxNfcCards: 25,
      maxSocialLinks: 15,
      maxSitePages: 10,
      iwaspCreditsMonthly: 20,
    },
  },
  
  ENTERPRISE: {
    id: 'enterprise' as SaaSPlanId,
    name: 'Enterprise',
    tagline: 'Agences & Startups en croissance',
    description: 'Solution complète pour les entreprises ambitieuses',
    price: 249,
    currency: 'usd',
    interval: 'month' as const,
    isPopular: false,
    stripe: SAAS_STRIPE_PRODUCTS.ENTERPRISE,
    
    included: [
      '75 cartes NFC/mois (Métal premium)',
      'Crédits i-wasp IA ILLIMITÉS ∞',
      'Logo IMPRIMÉ + GRAVÉ sur cartes ✓',
      'Designs illimités + variations',
      'vCard illimitées + CRM sync',
      'Apple & Google Wallet illimité',
      'Boutique e-commerce complète (20+ pages)',
      'Paiements Stripe intégrés',
      'Domaines illimités',
      'Marketing automation',
      'Analytics avancée + API access',
      'Manager dédié 24/7',
    ],
    
    excluded: [],
    
    features: {
      nfcCardsPerMonth: 75,
      nfcMaterial: ['pvc_white', 'pvc_color', 'metal_brushed', 'metal_premium'],
      logoOnCard: true,
      logoEngraved: true,
      vcard: 'unlimited',
      crmSync: true,
      wallet: true,
      sitePages: 20,
      ecommerce: true,
      stripePayments: true,
      blogIntegrated: true,
      customDomain: true,
      unlimitedDomains: true,
      sslIncluded: true,
      seoPremium: true,
      marketingAutomation: true,
      iwaspCredits: Infinity, // Crédits ILLIMITÉS
      analytics: 'advanced',
      apiAccess: true,
      support: 'dedicated_manager',
    },
    
    limits: {
      maxNfcCards: 75,
      maxSocialLinks: Infinity,
      maxSitePages: 20,
      iwaspCreditsMonthly: Infinity, // ILLIMITÉ
    },
  },
} as const;

// Helper functions
export type SaaSPlan = typeof SAAS_PLANS[keyof typeof SAAS_PLANS];

export const getSaaSPlan = (planId: SaaSPlanId): SaaSPlan => {
  switch (planId) {
    case 'identity':
      return SAAS_PLANS.IDENTITY;
    case 'professional':
      return SAAS_PLANS.PROFESSIONAL;
    case 'enterprise':
      return SAAS_PLANS.ENTERPRISE;
    default:
      return SAAS_PLANS.FREE;
  }
};

export const getSaaSPlanByProductId = (productId: string): SaaSPlan | null => {
  if (productId === SAAS_STRIPE_PRODUCTS.IDENTITY.product_id) {
    return SAAS_PLANS.IDENTITY;
  }
  if (productId === SAAS_STRIPE_PRODUCTS.PROFESSIONAL.product_id) {
    return SAAS_PLANS.PROFESSIONAL;
  }
  if (productId === SAAS_STRIPE_PRODUCTS.ENTERPRISE.product_id) {
    return SAAS_PLANS.ENTERPRISE;
  }
  // Legacy Gold plans map to Professional
  if (productId === LEGACY_STRIPE_PRODUCTS.GOLD_MONTHLY.product_id ||
      productId === LEGACY_STRIPE_PRODUCTS.GOLD_ANNUAL.product_id) {
    return SAAS_PLANS.PROFESSIONAL;
  }
  return null;
};

export const getSaaSPriceId = (planId: SaaSPlanId): string | null => {
  switch (planId) {
    case 'identity':
      return SAAS_STRIPE_PRODUCTS.IDENTITY.price_id;
    case 'professional':
      return SAAS_STRIPE_PRODUCTS.PROFESSIONAL.price_id;
    case 'enterprise':
      return SAAS_STRIPE_PRODUCTS.ENTERPRISE.price_id;
    default:
      return null;
  }
};

export const formatSaaSPrice = (price: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const isPremiumPlan = (planId: SaaSPlanId): boolean => {
  return planId === 'professional' || planId === 'enterprise';
};

export const isEnterprisePlan = (planId: SaaSPlanId): boolean => {
  return planId === 'enterprise';
};

// Feature comparison for pricing page
export const SAAS_FEATURE_COMPARISON = [
  {
    category: 'Cartes NFC',
    features: [
      { name: 'Cartes NFC/mois', free: '0', identity: '10', professional: '25', enterprise: '75' },
      { name: 'Matériaux disponibles', free: '-', identity: 'PVC', professional: 'PVC + Métal', enterprise: 'Métal Premium' },
      { name: 'Logo imprimé', free: false, identity: false, professional: true, enterprise: true },
      { name: 'Logo gravé', free: false, identity: false, professional: false, enterprise: true },
    ],
  },
  {
    category: 'Profil Digital',
    features: [
      { name: 'vCard complète', free: 'Basique', identity: 'Complète', professional: 'Avancée', enterprise: 'Illimitée' },
      { name: 'Apple & Google Wallet', free: false, identity: true, professional: true, enterprise: true },
      { name: 'QR Code', free: true, identity: true, professional: true, enterprise: true },
      { name: 'Formulaire contact', free: false, identity: false, professional: true, enterprise: true },
      { name: 'CRM Sync', free: false, identity: false, professional: false, enterprise: true },
    ],
  },
  {
    category: 'Site Web',
    features: [
      { name: 'Nombre de pages', free: '0', identity: '1', professional: '5-10', enterprise: '20+' },
      { name: 'Blog intégré', free: false, identity: false, professional: true, enterprise: true },
      { name: 'E-commerce', free: false, identity: false, professional: false, enterprise: true },
      { name: 'Domaine custom', free: false, identity: true, professional: true, enterprise: true },
      { name: 'SEO Premium', free: false, identity: false, professional: true, enterprise: true },
    ],
  },
  {
    category: 'i-wasp Studio IA',
    features: [
      { name: 'Crédits i-wasp IA/mois', free: '0', identity: '5', professional: '20', enterprise: '∞ Illimité' },
      { name: 'Génération sites web', free: false, identity: true, professional: true, enterprise: true },
      { name: 'Design cartes NFC IA', free: false, identity: true, professional: true, enterprise: true },
      { name: 'Profils smart IA', free: false, identity: true, professional: true, enterprise: true },
    ],
  },
  {
    category: 'Analytics & Support',
    features: [
      { name: 'Analytics', free: '-', identity: 'Basique', professional: 'Détaillée', enterprise: 'Avancée + API' },
      { name: 'Support', free: 'Email', identity: 'Email', professional: 'Chat 24/7', enterprise: 'Manager dédié' },
    ],
  },
];
