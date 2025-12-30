/**
 * Cart Context
 * 
 * Global cart state management with localStorage persistence.
 * Stores selected template, card data, order configuration, and promo codes.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CardBlock } from "@/lib/cardBlocks";

// Template info for display
export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category?: string;
  cardImage?: string;
  phoneImage?: string;
}

// Cart item represents a configured card ready for order
export interface CartItem {
  id: string;
  templateId: string;
  templateName: string;
  cardName: string;
  quantity: number;
  unitPriceCents: number;
  blocks?: CardBlock[];
  photoUrl?: string | null;
  logoUrl?: string | null;
  createdAt: string;
}

// Promo code definition
export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minAmountCents?: number;
  expiresAt?: string;
}

// Available promo codes
const PROMO_CODES: PromoCode[] = [
  { 
    code: "IWASP10", 
    discountPercent: 10, 
    description: "Offre de lancement -10%",
  },
  { 
    code: "WELCOME20", 
    discountPercent: 20, 
    description: "Bienvenue -20%",
    minAmountCents: 5000,
  },
  { 
    code: "PRO15", 
    discountPercent: 15, 
    description: "Professionnel -15%",
    minAmountCents: 10000,
  },
];

// Cart state
export interface CartState {
  items: CartItem[];
  selectedTemplateId: string | null;
  appliedPromoCode: string | null;
  lastUpdated: string;
}

// Cart context value
interface CartContextValue {
  // State
  items: CartItem[];
  selectedTemplateId: string | null;
  totalItems: number;
  subtotalCents: number;
  discountCents: number;
  totalPriceCents: number;
  appliedPromoCode: PromoCode | null;
  
  // Actions
  setSelectedTemplate: (templateId: string) => void;
  addItem: (item: Omit<CartItem, "id" | "createdAt">) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (itemId: string) => CartItem | undefined;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
}

const CART_STORAGE_KEY = "iwasp-cart";

const defaultCartState: CartState = {
  items: [],
  selectedTemplateId: null,
  appliedPromoCode: null,
  lastUpdated: new Date().toISOString(),
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartState, setCartState] = useState<CartState>(() => {
    // Load from localStorage on init
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...defaultCartState, ...parsed };
        } catch {
          return defaultCartState;
        }
      }
    }
    return defaultCartState;
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  }, [cartState]);

  // Set selected template
  const setSelectedTemplate = useCallback((templateId: string) => {
    setCartState((prev) => ({
      ...prev,
      selectedTemplateId: templateId,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Add item to cart
  const addItem = useCallback((item: Omit<CartItem, "id" | "createdAt">) => {
    const newItem: CartItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    setCartState((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      lastUpdated: new Date().toISOString(),
    }));
    
    return newItem.id;
  }, []);

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setCartState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Update item quantity
  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setCartState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
      lastUpdated: new Date().toISOString(),
    }));
  }, [removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartState({
      items: [],
      selectedTemplateId: null,
      appliedPromoCode: null,
      lastUpdated: new Date().toISOString(),
    });
  }, []);

  // Get item by ID
  const getItem = useCallback((itemId: string) => {
    return cartState.items.find((item) => item.id === itemId);
  }, [cartState.items]);

  // Computed values
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = cartState.items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  );

  // Get applied promo code object
  const appliedPromoCode = useMemo(() => {
    if (!cartState.appliedPromoCode) return null;
    return PROMO_CODES.find(p => p.code === cartState.appliedPromoCode) || null;
  }, [cartState.appliedPromoCode]);

  // Calculate discount
  const discountCents = useMemo(() => {
    if (!appliedPromoCode) return 0;
    return Math.round(subtotalCents * (appliedPromoCode.discountPercent / 100));
  }, [appliedPromoCode, subtotalCents]);

  // Total after discount
  const totalPriceCents = subtotalCents - discountCents;

  // Apply promo code
  const applyPromoCode = useCallback((code: string): { success: boolean; message: string } => {
    const normalizedCode = code.trim().toUpperCase();
    
    if (!normalizedCode) {
      return { success: false, message: "Veuillez entrer un code promo" };
    }

    const promo = PROMO_CODES.find(p => p.code === normalizedCode);
    
    if (!promo) {
      return { success: false, message: "Code promo invalide" };
    }

    // Check expiration
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return { success: false, message: "Ce code promo a expiré" };
    }

    // Check minimum amount
    if (promo.minAmountCents && subtotalCents < promo.minAmountCents) {
      const minAmount = (promo.minAmountCents / 100).toFixed(0);
      return { success: false, message: `Minimum de commande : ${minAmount}€` };
    }

    setCartState((prev) => ({
      ...prev,
      appliedPromoCode: normalizedCode,
      lastUpdated: new Date().toISOString(),
    }));

    return { success: true, message: `${promo.description} appliqué !` };
  }, [subtotalCents]);

  // Remove promo code
  const removePromoCode = useCallback(() => {
    setCartState((prev) => ({
      ...prev,
      appliedPromoCode: null,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const value: CartContextValue = {
    items: cartState.items,
    selectedTemplateId: cartState.selectedTemplateId,
    totalItems,
    subtotalCents,
    discountCents,
    totalPriceCents,
    appliedPromoCode,
    setSelectedTemplate,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getItem,
    applyPromoCode,
    removePromoCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
