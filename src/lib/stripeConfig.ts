/**
 * i-wasp Studio - Stripe Configuration
 * Centralizes all Stripe product and price IDs
 */

// ==================== NFC CARDS ====================
export const NFC_STRIPE_PRICES = {
  SINGLE: {
    id: 'single',
    name: 'Carte NFC Unitaire',
    quantity: 1,
    priceId: 'price_1Spet5IvyaABH94uidZ843Q4',
    productId: 'prod_TnFNP7xk2FWKNb',
    priceMad: 249,
  },
  PACK_10: {
    id: 'pack_10',
    name: 'Pack Mini NFC (10 cartes)',
    quantity: 10,
    priceId: 'price_1SpetKIvyaABH94uhbYUQPze',
    productId: 'prod_TnFOeNQP1ROYGL',
    priceMad: 1900,
  },
  PACK_50: {
    id: 'pack_50',
    name: 'Pack Standard NFC (50 cartes)',
    quantity: 50,
    priceId: 'price_1SpetXIvyaABH94uaXdvz8zf',
    productId: 'prod_TnFOLs3NAzOfvk',
    priceMad: 4900,
  },
  PACK_100: {
    id: 'pack_100',
    name: 'Pack Volume Pro NFC (100 cartes)',
    quantity: 100,
    priceId: 'price_1SpetjIvyaABH94u9Hc5nip0',
    productId: 'prod_TnFOhPUrrg6Ln2',
    priceMad: 7900,
  },
} as const;

// ==================== PROMO PACKS ====================
export const PROMO_STRIPE_PRICES = {
  BUSINESS: {
    id: 'business',
    name: 'Pack Business (Site + NFC)',
    priceId: 'price_1SpetzIvyaABH94uxGb0EVKS',
    productId: 'prod_TnFOaXZJ9EP6tk',
    priceMad: 5900,
  },
  PREMIUM: {
    id: 'premium',
    name: 'Pack Premium (Site + NFC + Maintenance)',
    priceId: 'price_1SpeuCIvyaABH94uqUbngAFt',
    productId: 'prod_TnFP1CoKbAYpvm',
    priceMad: 12900,
  },
} as const;

// ==================== WEB STUDIO ====================
export const WEB_STUDIO_STRIPE_PRICES = {
  BASIC: {
    id: 'basic',
    name: 'Site Basic (5 pages)',
    priceIdMAD: 'price_1SpKRXIvyaABH94u3XFnG4qg',
    priceIdEUR: 'price_1SpKDVIvyaABH94u9C3Zq7i1',
    productId: 'prod_TmuG5HE5p4MFRj',
    priceMad: 2000,
    priceEur: 200,
  },
  PRO: {
    id: 'pro',
    name: 'Site Pro (10 pages)',
    priceIdMAD: 'price_1SpKRqIvyaABH94uKQIXaEIW',
    priceIdEUR: 'price_1SpKDmIvyaABH94uhKxXCnW5',
    productId: 'prod_TmuGoD257oDhrS',
    priceMad: 5000,
    priceEur: 500,
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Site Enterprise (Illimité)',
    priceIdMAD: 'price_1SpKS3IvyaABH94ujjmo6jDb',
    priceIdEUR: 'price_1SpKEGIvyaABH94uY8yuOQ4l',
    productId: 'prod_TmuGjPyWT6Gle4',
    priceMad: 10000,
    priceEur: 1000,
  },
} as const;

// ==================== LEGACY SUBSCRIPTIONS ====================
export const STRIPE_PRODUCTS = {
  GOLD_MONTHLY: {
    product_id: 'prod_TkashOgkZlDDzm',
    price_id: 'price_1Sn5gvIvyaABH94uT3RkeEbz',
    name: 'IWASP Gold - Mensuel',
    price: 290, // cents
    currency: 'eur',
    interval: 'month' as const,
  },
  GOLD_ANNUAL: {
    product_id: 'prod_TkasPk75rM1k69',
    price_id: 'price_1Sn5h7IvyaABH94uTfkCq0zL',
    name: 'IWASP Gold - Annuel',
    price: 2300, // cents
    currency: 'eur',
    interval: 'year' as const,
  },
  NFC_CARD: {
    product_id: 'prod_TkatNM0sjZrtwb',
    price_id: 'price_1Sn5hIIvyaABH94uEfrEsvHn',
    name: 'Carte NFC Signature',
    price: 2900, // cents
    currency: 'eur',
    interval: null, // one-time payment
  },
} as const;

// Type exports
export type NfcTierId = keyof typeof NFC_STRIPE_PRICES;
export type PromoPackId = keyof typeof PROMO_STRIPE_PRICES;
export type WebStudioPackageId = keyof typeof WEB_STUDIO_STRIPE_PRICES;
export type StripePlanType = 'monthly' | 'annual';

// Helpers
export function getNfcPriceById(tierId: string): typeof NFC_STRIPE_PRICES[NfcTierId] | null {
  const tier = Object.values(NFC_STRIPE_PRICES).find(t => t.id === tierId);
  return tier || null;
}

export function getPromoPriceById(packId: string): typeof PROMO_STRIPE_PRICES[PromoPackId] | null {
  const pack = Object.values(PROMO_STRIPE_PRICES).find(p => p.id === packId);
  return pack || null;
}

export const getPriceId = (plan: StripePlanType): string => {
  return plan === 'monthly' 
    ? STRIPE_PRODUCTS.GOLD_MONTHLY.price_id 
    : STRIPE_PRODUCTS.GOLD_ANNUAL.price_id;
};

export const getProductId = (plan: StripePlanType): string => {
  return plan === 'monthly' 
    ? STRIPE_PRODUCTS.GOLD_MONTHLY.product_id 
    : STRIPE_PRODUCTS.GOLD_ANNUAL.product_id;
};

export const formatStripePrice = (cents: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
};
