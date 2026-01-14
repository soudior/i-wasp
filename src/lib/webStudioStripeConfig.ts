/**
 * Web Studio Stripe Configuration
 * Products for website creation packages
 */

export const WEBSTUDIO_STRIPE_PRODUCTS = {
  STARTER: {
    product_id: 'prod_Tmu1Ku2SVd3vOV',
    price_id: 'price_1SpKDVIvyaABH94u9C3Zq7i1',
    name: 'Web Studio Starter',
    description: 'Site web 1-3 pages',
    priceEur: 200, // in EUR
    priceMad: 2000, // in MAD
    pages: '1-3',
  },
  STANDARD: {
    product_id: 'prod_Tmu19XepLfGFdH',
    price_id: 'price_1SpKDmIvyaABH94uhKxXCnW5',
    name: 'Web Studio Standard',
    description: 'Site web 4-6 pages',
    priceEur: 500,
    priceMad: 5000,
    pages: '4-6',
  },
  PREMIUM: {
    product_id: 'prod_Tmu21t1NzPkYvW',
    price_id: 'price_1SpKEGIvyaABH94uY8yuOQ4l',
    name: 'Web Studio Premium',
    description: 'Site web 7-10 pages',
    priceEur: 1000,
    priceMad: 10000,
    pages: '7-10',
  },
} as const;

export type WebStudioPackage = keyof typeof WEBSTUDIO_STRIPE_PRODUCTS;

/**
 * Get the appropriate package based on price
 */
export function getPackageByPrice(priceEur: number): WebStudioPackage {
  if (priceEur <= 200) return 'STARTER';
  if (priceEur <= 500) return 'STANDARD';
  return 'PREMIUM';
}

/**
 * Get Stripe price ID based on package
 */
export function getWebStudioPriceId(pkg: WebStudioPackage): string {
  return WEBSTUDIO_STRIPE_PRODUCTS[pkg].price_id;
}

/**
 * Get package info from price in EUR
 */
export function getPackageFromPriceEur(priceEur: number) {
  if (priceEur <= 200) return WEBSTUDIO_STRIPE_PRODUCTS.STARTER;
  if (priceEur <= 500) return WEBSTUDIO_STRIPE_PRODUCTS.STANDARD;
  return WEBSTUDIO_STRIPE_PRODUCTS.PREMIUM;
}
