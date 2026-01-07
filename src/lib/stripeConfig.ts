// Stripe Product and Price Configuration
// Created from Stripe dashboard products

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

export type StripePlanType = 'monthly' | 'annual';

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
