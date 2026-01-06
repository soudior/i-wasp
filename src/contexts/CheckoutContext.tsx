/**
 * CheckoutContext - Gestion du tunnel de commande en 4 étapes
 * 
 * Étapes:
 * 1. Sélection - Choix des produits
 * 2. Livraison - Formulaire de livraison (Maroc)
 * 3. Signature - Confirmation blockchain simulée
 * 4. Confirmation - Récapitulatif et envoi WhatsApp
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

// Types de produits disponibles
export interface Product {
  id: string;
  name: string;
  description: string;
  priceDH: number;
  image?: string;
  category: "nfc-card" | "nfc-tag" | "nfc-nail" | "accessory";
  isElite?: boolean;
}

// Article dans le panier
export interface CheckoutItem {
  product: Product;
  quantity: number;
}

// Informations de livraison (Maroc uniquement)
export interface DeliveryInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

// État de la signature
export interface SignatureState {
  signed: boolean;
  timestamp?: string;
  hash?: string;
}

// État complet du checkout
export interface CheckoutState {
  currentStep: 1 | 2 | 3 | 4;
  items: CheckoutItem[];
  deliveryInfo: DeliveryInfo;
  signature: SignatureState;
  orderNumber?: string;
}

// Calculs de prix
export interface PriceCalculation {
  subtotalDH: number;
  shippingDH: number;
  discountDH: number;
  totalDH: number;
  isEliteOrder: boolean;
  freeShipping: boolean;
}

// Villes du Maroc pour autocomplétion
export const MOROCCO_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Meknès", "Agadir",
  "Oujda", "Kénitra", "Tétouan", "Salé", "Nador", "Mohammedia", "El Jadida",
  "Beni Mellal", "Taza", "Khénifra", "Safi", "Khouribga", "Settat",
  "Laâyoune", "Dakhla", "Essaouira", "Ouarzazate"
].sort();

// Frais de port standards
const SHIPPING_COST_DH = 40;
const FREE_SHIPPING_THRESHOLD_DH = 500;

// Numéro WhatsApp IWASP
export const IWASP_WHATSAPP = "+212600000000"; // À remplacer par le vrai numéro

interface CheckoutContextValue {
  // État
  state: CheckoutState;
  priceCalculation: PriceCalculation;
  
  // Navigation
  goToStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Panier
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Livraison
  setDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
  isDeliveryValid: () => boolean;
  
  // Signature
  signOrder: () => void;
  
  // Finalisation
  generateWhatsAppMessage: () => string;
  generateWhatsAppUrl: () => string;
  completeOrder: () => string; // Retourne le numéro de commande
  resetCheckout: () => void;
}

const defaultDeliveryInfo: DeliveryInfo = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

const defaultCheckoutState: CheckoutState = {
  currentStep: 1,
  items: [],
  deliveryInfo: defaultDeliveryInfo,
  signature: { signed: false },
};

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CheckoutState>(defaultCheckoutState);

  // Calcul des prix
  const priceCalculation = useMemo<PriceCalculation>(() => {
    const subtotalDH = state.items.reduce(
      (sum, item) => sum + item.product.priceDH * item.quantity,
      0
    );
    
    const hasEliteItem = state.items.some(item => item.product.isElite);
    const freeShipping = subtotalDH >= FREE_SHIPPING_THRESHOLD_DH || hasEliteItem;
    const shippingDH = freeShipping ? 0 : SHIPPING_COST_DH;
    const discountDH = 0; // Peut être étendu avec des codes promo
    const totalDH = subtotalDH + shippingDH - discountDH;
    
    return {
      subtotalDH,
      shippingDH,
      discountDH,
      totalDH,
      isEliteOrder: hasEliteItem,
      freeShipping,
    };
  }, [state.items]);

  // Navigation entre étapes
  const goToStep = useCallback((step: 1 | 2 | 3 | 4) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4) as 1 | 2 | 3 | 4,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1) as 1 | 2 | 3 | 4,
    }));
  }, []);

  // Gestion du panier
  const addItem = useCallback((product: Product, quantity = 1) => {
    setState(prev => {
      const existingIndex = prev.items.findIndex(item => item.product.id === product.id);
      
      if (existingIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return { ...prev, items: newItems };
      }
      
      return {
        ...prev,
        items: [...prev.items, { product, quantity }],
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product.id !== productId),
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    
    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, items: [] }));
  }, []);

  // Gestion de la livraison
  const setDeliveryInfo = useCallback((info: Partial<DeliveryInfo>) => {
    setState(prev => ({
      ...prev,
      deliveryInfo: { ...prev.deliveryInfo, ...info },
    }));
  }, []);

  const isDeliveryValid = useCallback(() => {
    const { fullName, phone, address, city } = state.deliveryInfo;
    return !!(
      fullName.trim().length >= 3 &&
      phone.trim().length >= 10 &&
      address.trim().length >= 5 &&
      city.trim().length >= 2
    );
  }, [state.deliveryInfo]);

  // Signature
  const signOrder = useCallback(() => {
    const timestamp = new Date().toISOString();
    const hash = `IWASP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    setState(prev => ({
      ...prev,
      signature: { signed: true, timestamp, hash },
    }));
  }, []);

  // Génération du message WhatsApp
  const generateWhatsAppMessage = useCallback(() => {
    const { deliveryInfo, items, signature } = state;
    const { totalDH, subtotalDH, shippingDH, freeShipping } = priceCalculation;
    
    let message = `🛒 *NOUVELLE COMMANDE IWASP*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Produits
    message += `📦 *ARTICLES*\n`;
    items.forEach(item => {
      message += `• ${item.product.name} x${item.quantity} — ${(item.product.priceDH * item.quantity).toLocaleString()} DH\n`;
    });
    message += `\n`;
    
    // Prix
    message += `💰 *MONTANT*\n`;
    message += `Sous-total: ${subtotalDH.toLocaleString()} DH\n`;
    message += `Livraison: ${freeShipping ? "OFFERTE ✨" : `${shippingDH} DH`}\n`;
    message += `*TOTAL: ${totalDH.toLocaleString()} DH*\n\n`;
    
    // Livraison
    message += `📍 *LIVRAISON*\n`;
    message += `${deliveryInfo.fullName}\n`;
    message += `📞 ${deliveryInfo.phone}\n`;
    message += `${deliveryInfo.address}\n`;
    message += `${deliveryInfo.postalCode ? deliveryInfo.postalCode + " " : ""}${deliveryInfo.city}, Maroc\n`;
    if (deliveryInfo.notes) {
      message += `📝 ${deliveryInfo.notes}\n`;
    }
    message += `\n`;
    
    // Signature
    if (signature.signed && signature.hash) {
      message += `🔐 *SIGNATURE*\n`;
      message += `Hash: ${signature.hash}\n`;
      message += `Date: ${new Date(signature.timestamp!).toLocaleString("fr-MA")}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━\n`;
    message += `Commande via i-wasp.com`;
    
    return message;
  }, [state, priceCalculation]);

  const generateWhatsAppUrl = useCallback(() => {
    const message = encodeURIComponent(generateWhatsAppMessage());
    return `https://wa.me/${IWASP_WHATSAPP.replace(/[^0-9]/g, "")}?text=${message}`;
  }, [generateWhatsAppMessage]);

  // Finalisation de la commande
  const completeOrder = useCallback(() => {
    const orderNumber = `IW-${Date.now().toString(36).toUpperCase()}`;
    setState(prev => ({ ...prev, orderNumber }));
    return orderNumber;
  }, []);

  const resetCheckout = useCallback(() => {
    setState(defaultCheckoutState);
  }, []);

  const value: CheckoutContextValue = {
    state,
    priceCalculation,
    goToStep,
    nextStep,
    prevStep,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDeliveryInfo,
    isDeliveryValid,
    signOrder,
    generateWhatsAppMessage,
    generateWhatsAppUrl,
    completeOrder,
    resetCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
