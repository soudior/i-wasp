/**
 * Pricing Cart Context - Panier de commande unifié
 * Accumule tous les produits (forfaits, options, maintenance)
 * avec calcul automatique du total
 */

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// Types
export type Currency = 'MAD' | 'EUR';
export type PackageType = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface CartItem {
  id: string;
  name: string;
  type: 'package' | 'option' | 'maintenance' | 'nfc';
  priceMAD: number;
  priceEUR: number;
  quantity: number;
  unit?: string;
  period?: string;
}

interface PricingCartContextType {
  items: CartItem[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  hasPackage: () => boolean;
  getTotal: () => number;
  getTotalFormatted: () => string;
  itemCount: number;
}

const PricingCartContext = createContext<PricingCartContextType | undefined>(undefined);

// Prix des forfaits Web Studio
export const WEB_PACKAGES = {
  BASIC: { 
    id: 'web-basic',
    name: 'Basic (5 pages)', 
    priceMAD: 2000, 
    priceEUR: 200,
    stripePriceEUR: 'price_1SpKDVIvyaABH94u9C3Zq7i1',
    stripePriceMAD: 'price_1SpKRXIvyaABH94u3XFnG4qg',
  },
  PRO: { 
    id: 'web-pro',
    name: 'Pro (10 pages)', 
    priceMAD: 5000, 
    priceEUR: 500,
    stripePriceEUR: 'price_1SpKDmIvyaABH94uhKxXCnW5',
    stripePriceMAD: 'price_1SpKRqIvyaABH94uKQIXaEIW',
  },
  ENTERPRISE: { 
    id: 'web-enterprise',
    name: 'Enterprise (Illimité)', 
    priceMAD: 10000, 
    priceEUR: 1000,
    stripePriceEUR: 'price_1SpKEGIvyaABH94uY8yuOQ4l',
    stripePriceMAD: 'price_1SpKS3IvyaABH94ujjmo6jDb',
  },
};

// Options Web Studio
export const WEB_OPTIONS = [
  { id: 'extra_pages', name: 'Page supplémentaire', priceMAD: 500, priceEUR: 50, unit: '/page', hasQuantity: true },
  { id: 'ecommerce', name: 'E-commerce', priceMAD: 1000, priceEUR: 100, hasQuantity: false },
  { id: 'seo', name: 'SEO avancé', priceMAD: 500, priceEUR: 50, hasQuantity: false },
  { id: 'branding', name: 'Logo / Branding', priceMAD: 1500, priceEUR: 150, hasQuantity: false },
  { id: 'multilingual', name: 'Multilingue', priceMAD: 800, priceEUR: 80, hasQuantity: false },
  { id: 'express', name: 'Express 24-48h', priceMAD: 500, priceEUR: 50, hasQuantity: false },
];

// Plans de maintenance
export const MAINTENANCE_PLANS = [
  { id: 'maintenance_monthly', name: 'Maintenance mensuelle', priceMAD: 200, priceEUR: 20, period: '/mois' },
  { id: 'maintenance_yearly', name: 'Maintenance annuelle', priceMAD: 2000, priceEUR: 200, period: '/an', badge: '2 mois offerts' },
];

// NFC Plans
export const NFC_PACKAGES = {
  ESSENTIEL: { id: 'nfc-essentiel', name: 'Essentiel NFC', priceMAD: 290, priceEUR: 29 },
  SIGNATURE: { id: 'nfc-signature', name: 'Signature NFC', priceMAD: 290, priceEUR: 29, subscription: { priceMAD: 29, priceEUR: 2.9, period: '/mois' } },
  ELITE: { id: 'nfc-elite', name: 'Elite NFC', priceMAD: 990, priceEUR: 99 },
};

export function PricingCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<Currency>('EUR');

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      // Si c'est un package, remplacer l'ancien
      if (item.type === 'package') {
        const filtered = prev.filter(i => i.type !== 'package');
        return [...filtered, { ...item, quantity: item.quantity || 1 }];
      }
      
      // Si l'item existe déjà, augmenter la quantité
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const hasPackage = () => items.some(item => item.type === 'package');

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const price = currency === 'MAD' ? item.priceMAD : item.priceEUR;
      return sum + (price * item.quantity);
    }, 0);
  };

  const getTotalFormatted = () => {
    const total = getTotal();
    const symbol = currency === 'MAD' ? 'DH' : '€';
    return `${total.toLocaleString('fr-FR')} ${symbol}`;
  };

  const itemCount = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <PricingCartContext.Provider value={{
      items,
      currency,
      setCurrency,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      hasPackage,
      getTotal,
      getTotalFormatted,
      itemCount,
    }}>
      {children}
    </PricingCartContext.Provider>
  );
}

export function usePricingCart() {
  const context = useContext(PricingCartContext);
  if (!context) {
    throw new Error('usePricingCart must be used within PricingCartProvider');
  }
  return context;
}
