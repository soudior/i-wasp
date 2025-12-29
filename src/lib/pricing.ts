// IWASP Pricing Configuration - Moroccan Market Launch
// Currency: EUR (for now, can be switched to MAD later)

export const PRICING = {
  currency: "EUR",
  currencySymbol: "€",
  
  // B2C Pricing (TTC - includes VAT)
  b2c: {
    single: 4900, // 49€ for 1 card
    double: 8900, // 89€ for 2 cards (44.50€ each)
    premiumPlus: 6900, // 69€ Premium+ single
  },
  
  // B2B Pricing (HT - excludes VAT)
  b2b: {
    tier1: { min: 10, max: 24, unitPrice: 3900 }, // 39€ HT/card
    tier2: { min: 25, max: 99, unitPrice: 3400 }, // 34€ HT/card
    tier3: { min: 100, max: Infinity, unitPrice: 2900 }, // 29€ HT/card
    personalizationFee: 1000, // +10€ HT/card for personalization
  },
  
  // Payment methods for launch
  paymentMethods: ["cod"] as const, // Cash on Delivery only for Moroccan market
  
  // Shipping (Morocco)
  shipping: {
    standard: 0, // Free shipping included
    express: 5000, // 50€ for express (optional later)
  },
} as const;

export type PaymentMethod = typeof PRICING.paymentMethods[number];

// Calculate B2C price based on quantity
export function calculateB2CPrice(quantity: number, isPremiumPlus: boolean = false): number {
  if (isPremiumPlus) {
    return PRICING.b2c.premiumPlus * quantity;
  }
  
  if (quantity === 1) {
    return PRICING.b2c.single;
  }
  
  if (quantity === 2) {
    return PRICING.b2c.double;
  }
  
  // For 3+ cards, use unit price from single card
  return PRICING.b2c.single * quantity;
}

// Calculate B2B price based on quantity and personalization
export function calculateB2BPrice(quantity: number, isPersonalized: boolean = false): number {
  let unitPrice: number;
  
  if (quantity >= PRICING.b2b.tier3.min) {
    unitPrice = PRICING.b2b.tier3.unitPrice;
  } else if (quantity >= PRICING.b2b.tier2.min) {
    unitPrice = PRICING.b2b.tier2.unitPrice;
  } else if (quantity >= PRICING.b2b.tier1.min) {
    unitPrice = PRICING.b2b.tier1.unitPrice;
  } else {
    // Less than 10 cards = B2C pricing
    return calculateB2CPrice(quantity);
  }
  
  if (isPersonalized) {
    unitPrice += PRICING.b2b.personalizationFee;
  }
  
  return unitPrice * quantity;
}

// Get unit price for display
export function getUnitPrice(quantity: number, isB2B: boolean = false): number {
  if (!isB2B || quantity < 10) {
    if (quantity === 2) {
      return Math.round(PRICING.b2c.double / 2);
    }
    return PRICING.b2c.single;
  }
  
  if (quantity >= PRICING.b2b.tier3.min) {
    return PRICING.b2b.tier3.unitPrice;
  } else if (quantity >= PRICING.b2b.tier2.min) {
    return PRICING.b2b.tier2.unitPrice;
  }
  return PRICING.b2b.tier1.unitPrice;
}

// Format price for display (cents to euros)
export function formatPrice(cents: number): string {
  const euros = cents / 100;
  return `${euros.toFixed(2).replace(".", ",")} ${PRICING.currencySymbol}`;
}

// Format price short (no decimals if whole number)
export function formatPriceShort(cents: number): string {
  const euros = cents / 100;
  if (euros === Math.floor(euros)) {
    return `${euros} ${PRICING.currencySymbol}`;
  }
  return `${euros.toFixed(2).replace(".", ",")} ${PRICING.currencySymbol}`;
}

// Check if quantity qualifies for B2B pricing
export function isB2BQuantity(quantity: number): boolean {
  return quantity >= PRICING.b2b.tier1.min;
}

// Get tier name for display
export function getPricingTier(quantity: number): string {
  if (quantity >= PRICING.b2b.tier3.min) {
    return "Entreprise (100+)";
  } else if (quantity >= PRICING.b2b.tier2.min) {
    return "Business (25-99)";
  } else if (quantity >= PRICING.b2b.tier1.min) {
    return "Starter (10-24)";
  }
  return "Particulier";
}
