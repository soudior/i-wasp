/**
 * Web Studio Stripe Configuration
 * Products for website creation packages
 */

export const WEBSTUDIO_STRIPE_PRODUCTS = {
  BASIC: {
    product_id: 'prod_Tmu1Ku2SVd3vOV',
    price_id: 'price_1SpKDVIvyaABH94u9C3Zq7i1',
    name: 'Web Studio Basic',
    description: 'Site web jusqu\'à 5 pages',
    priceEur: 200,
    priceMad: 2000,
    pages: '5',
  },
  PRO: {
    product_id: 'prod_Tmu19XepLfGFdH',
    price_id: 'price_1SpKDmIvyaABH94uhKxXCnW5',
    name: 'Web Studio Pro',
    description: 'Site web jusqu\'à 10 pages',
    priceEur: 500,
    priceMad: 5000,
    pages: '10',
  },
  ENTERPRISE: {
    product_id: 'prod_Tmu21t1NzPkYvW',
    price_id: 'price_1SpKEGIvyaABH94uY8yuOQ4l',
    name: 'Web Studio Enterprise',
    description: 'Site web illimité + CRM',
    priceEur: 1000,
    priceMad: 10000,
    pages: 'Illimité',
  },
} as const;

export type WebStudioPackageStripe = keyof typeof WEBSTUDIO_STRIPE_PRODUCTS;

/**
 * Get the appropriate package based on price
 */
export function getPackageByPrice(priceEur: number): WebStudioPackageStripe {
  if (priceEur <= 200) return 'BASIC';
  if (priceEur <= 500) return 'PRO';
  return 'ENTERPRISE';
}

/**
 * Get Stripe price ID based on package
 */
export function getWebStudioPriceId(pkg: WebStudioPackageStripe): string {
  return WEBSTUDIO_STRIPE_PRODUCTS[pkg].price_id;
}

/**
 * Get package info from price in EUR
 */
export function getPackageFromPriceEur(priceEur: number) {
  if (priceEur <= 200) return WEBSTUDIO_STRIPE_PRODUCTS.BASIC;
  if (priceEur <= 500) return WEBSTUDIO_STRIPE_PRODUCTS.PRO;
  return WEBSTUDIO_STRIPE_PRODUCTS.ENTERPRISE;
}
