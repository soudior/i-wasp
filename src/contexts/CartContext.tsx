/**
 * Cart Context
 * 
 * Global cart state management with localStorage persistence.
 * Stores selected template, card data, and order configuration.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

// Cart state
export interface CartState {
  items: CartItem[];
  selectedTemplateId: string | null;
  lastUpdated: string;
}

// Cart context value
interface CartContextValue {
  // State
  items: CartItem[];
  selectedTemplateId: string | null;
  totalItems: number;
  totalPriceCents: number;
  
  // Actions
  setSelectedTemplate: (templateId: string) => void;
  addItem: (item: Omit<CartItem, "id" | "createdAt">) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (itemId: string) => CartItem | undefined;
}

const CART_STORAGE_KEY = "iwasp-cart";

const defaultCartState: CartState = {
  items: [],
  selectedTemplateId: null,
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
          return JSON.parse(stored);
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
      lastUpdated: new Date().toISOString(),
    });
  }, []);

  // Get item by ID
  const getItem = useCallback((itemId: string) => {
    return cartState.items.find((item) => item.id === itemId);
  }, [cartState.items]);

  // Computed values
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPriceCents = cartState.items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  );

  const value: CartContextValue = {
    items: cartState.items,
    selectedTemplateId: cartState.selectedTemplateId,
    totalItems,
    totalPriceCents,
    setSelectedTemplate,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getItem,
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
