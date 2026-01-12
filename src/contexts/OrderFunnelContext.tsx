/**
 * OrderFunnelContext - Tunnel de commande i-Wasp
 * 
 * 6 ÉTAPES STRICTES :
 * 1. /order/offre - Choix de l'offre (Essentiel / Signature / Élite)
 * 2. /order/identite - Identité digitale (profil public)
 * 3. /order/carte - Personnalisation carte physique (logo ou photo)
 * 4. /order/livraison - Livraison + Paiement
 * 5. /order/recap - Récapitulatif
 * 6. /order/confirmation - Confirmation + accès compte
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Offer types
export type OfferType = "essentiel" | "signature" | "alliance";

// Pack vitrine (upsell)
export type VitrinePackType = "none" | "solo" | "equipe";

// Offer configuration
export interface OfferConfig {
  id: OfferType;
  name: string;
  price: number; // in centimes (DH)
  priceCurrency: string;
}

export const OFFERS: OfferConfig[] = [
  { id: "essentiel", name: "Essentiel", price: 27700, priceCurrency: "MAD" },
  { id: "signature", name: "Signature", price: 55500, priceCurrency: "MAD" },
  { id: "alliance", name: "Alliance", price: 92500, priceCurrency: "MAD" },
];

export const VITRINE_PACKS = [
  { id: "none" as VitrinePackType, name: "Sans pack", price: 0, priceCurrency: "MAD" },
  { id: "solo" as VitrinePackType, name: "Pack Vitrine Solo", price: 150000, priceCurrency: "MAD" },
  { id: "equipe" as VitrinePackType, name: "Pack Vitrine Équipe", price: 300000, priceCurrency: "MAD" },
];

// Client type (step 2: type of customer)
export type ClientType = "particulier" | "independant" | "entreprise";

// Digital identity (step 2: public profile)
export interface DigitalIdentity {
  clientType: ClientType;
  firstName: string;
  lastName: string;
  tagline?: string;         // Phrase emblème (max 80 caractères)
  photoUrl?: string;        // Photo de profil (data URL ou URL)
  title?: string;           // Fonction
  company?: string;         // Entreprise
  phone: string;
  email: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
  bio?: string;             // Bio courte
  // Geolocation
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
}

// Card personalization (step 3: physical card visual)
export type CardVisualType = "logo" | "photo";

export interface CardPersonalization {
  visualType: CardVisualType;
  imageUrl: string;         // URL of uploaded logo or photo
  fileName: string;         // Original file name
}

// Shipping info (step 4: delivery only - NOT on digital card)
export interface ShippingInfo {
  addressType: "domicile" | "entreprise" | "hotel";
  address: string;
  city: string;
  country: string;  // Default: Maroc
  phone: string;
}

// Payment info
export interface PaymentInfo {
  method: "cod" | "stripe"; // COD or Stripe online payment
}

// Complete funnel state
export interface OrderFunnelState {
  currentStep: number;
  productType: string | null;  // NEW: pvc, nails, metal
  selectedOffer: OfferType | null;
  selectedTemplate: string | null; // NEW: template selection
  digitalIdentity: DigitalIdentity | null;
  cardPersonalization: CardPersonalization | null;
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  isComplete: boolean;
  isTransitioning: boolean; // Block interactions during transitions
}

// Step paths (7 steps now)
const STEP_PATHS = [
  "/order/offre",        // Step 1: Offer selection
  "/order/identite",     // Step 2: Digital identity (MOVED UP)
  "/order/template",     // Step 3: Template selection
  "/order/carte",        // Step 4: Card personalization
  "/order/livraison",    // Step 5: Shipping + Payment
  "/order/recap",        // Step 6: Summary
  "/order/confirmation", // Step 7: Confirmation
];

export const STEP_LABELS = [
  "Offre",
  "Identité",
  "Template",
  "Carte",
  "Livraison",
  "Récap",
  "Confirmation"
];

export const TOTAL_STEPS = 7;

// Context interface
interface OrderFunnelContextType {
  state: OrderFunnelState;
  setProductType: (type: string) => void;
  setSelectedOffer: (offer: OfferType) => void;
  setSelectedTemplate: (template: string) => void;
  setDigitalIdentity: (identity: DigitalIdentity) => void;
  setCardPersonalization: (card: CardPersonalization) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  goToStep: (step: number) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  canAccessStep: (step: number) => boolean;
  getFirstIncompleteStep: () => number;
  resetFunnel: () => void;
  validateCurrentStep: () => boolean;
  markComplete: () => void;
  getStepPath: (step: number) => string;
  getSelectedOfferConfig: () => OfferConfig | null;
}

const initialState: OrderFunnelState = {
  currentStep: 0,
  productType: null,
  selectedOffer: null,
  selectedTemplate: null,
  digitalIdentity: null,
  cardPersonalization: null,
  shippingInfo: null,
  paymentInfo: null,
  isComplete: false,
  isTransitioning: false,
};

const OrderFunnelContext = createContext<OrderFunnelContextType | null>(null);

// Scroll to top instantly
const scrollToTopInstant = () => {
  window.scrollTo({ top: 0, behavior: "auto" });
};

export function OrderFunnelProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const transitionLock = useRef(false);
  
  // Load state from sessionStorage
  const [state, setState] = useState<OrderFunnelState>(() => {
    try {
      const saved = sessionStorage.getItem("orderFunnelStateV2");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, isTransitioning: false };
      }
    } catch {
      // Ignore
    }
    return initialState;
  });

  // Persist state to sessionStorage
  useEffect(() => {
    const { isTransitioning, ...stateToSave } = state;
    sessionStorage.setItem("orderFunnelStateV2", JSON.stringify(stateToSave));
  }, [state]);

  // Check if a step can be accessed (strict - no bypass)
  // Order: 1=Offre, 2=Identité, 3=Template, 4=Carte, 5=Livraison, 6=Récap, 7=Confirmation
  const canAccessStep = useCallback((step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return state.selectedOffer !== null;
    if (step === 3) return state.selectedOffer !== null && state.digitalIdentity !== null;
    if (step === 4) return state.selectedOffer !== null && state.digitalIdentity !== null && state.selectedTemplate !== null;
    if (step === 5) return state.selectedOffer !== null && state.digitalIdentity !== null && state.selectedTemplate !== null && state.cardPersonalization !== null;
    if (step === 6) return state.selectedOffer !== null && state.digitalIdentity !== null && state.selectedTemplate !== null && state.cardPersonalization !== null && state.shippingInfo !== null;
    if (step === 7) return state.isComplete;
    return false;
  }, [state]);

  // Get first incomplete step
  // Order: 1=Offre, 2=Identité, 3=Template, 4=Carte, 5=Livraison, 6=Récap, 7=Confirmation
  const getFirstIncompleteStep = useCallback((): number => {
    if (!state.selectedOffer) return 1;
    if (!state.digitalIdentity) return 2;
    if (!state.selectedTemplate) return 3;
    if (!state.cardPersonalization) return 4;
    if (!state.shippingInfo) return 5;
    if (!state.isComplete) return 6;
    return 7;
  }, [state]);

  // Get step path
  const getStepPath = useCallback((step: number): string => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      return STEP_PATHS[step - 1];
    }
    return STEP_PATHS[0];
  }, []);

  // Get selected offer config
  const getSelectedOfferConfig = useCallback((): OfferConfig | null => {
    if (!state.selectedOffer) return null;
    return OFFERS.find(o => o.id === state.selectedOffer) || null;
  }, [state.selectedOffer]);

  // Set product type (step 0)
  const setProductType = useCallback((type: string) => {
    setState(prev => ({
      ...prev,
      productType: type,
      currentStep: Math.max(prev.currentStep, 0),
    }));
  }, []);

  // Set offer (step 1)
  const setSelectedOffer = useCallback((offer: OfferType) => {
    setState(prev => ({
      ...prev,
      selectedOffer: offer,
      currentStep: Math.max(prev.currentStep, 1),
    }));
  }, []);

  // Set digital identity (step 2) - NOW STEP 2
  const setDigitalIdentity = useCallback((identity: DigitalIdentity) => {
    setState(prev => ({
      ...prev,
      digitalIdentity: identity,
      currentStep: Math.max(prev.currentStep, 2),
    }));
  }, []);

  // Set template (step 3) - NOW STEP 3
  const setSelectedTemplate = useCallback((template: string) => {
    setState(prev => ({
      ...prev,
      selectedTemplate: template,
      currentStep: Math.max(prev.currentStep, 3),
    }));
  }, []);

  // Set card personalization (step 4)
  const setCardPersonalization = useCallback((card: CardPersonalization) => {
    setState(prev => ({
      ...prev,
      cardPersonalization: card,
      currentStep: Math.max(prev.currentStep, 4),
    }));
  }, []);

  // Set shipping info (step 5)
  const setShippingInfo = useCallback((info: ShippingInfo) => {
    setState(prev => ({
      ...prev,
      shippingInfo: info,
      currentStep: Math.max(prev.currentStep, 5),
    }));
  }, []);

  // Set payment info
  const setPaymentInfo = useCallback((info: PaymentInfo) => {
    setState(prev => ({
      ...prev,
      paymentInfo: info,
    }));
  }, []);

  // Mark as complete (step 6 validated -> ready for confirmation)
  const markComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isComplete: true,
      currentStep: 7,
    }));
  }, []);

  // Navigate to specific step with scroll to top
  const goToStep = useCallback((step: number) => {
    if (transitionLock.current) return;
    
    if (step >= 1 && step <= TOTAL_STEPS && canAccessStep(step)) {
      transitionLock.current = true;
      setState(prev => ({ ...prev, currentStep: step, isTransitioning: true }));
      
      // Navigate and scroll
      navigate(STEP_PATHS[step - 1]);
      scrollToTopInstant();
      
      // Release lock after transition
      setTimeout(() => {
        transitionLock.current = false;
        setState(prev => ({ ...prev, isTransitioning: false }));
      }, 300);
    } else {
      // Redirect to first incomplete step
      const firstIncomplete = getFirstIncompleteStep();
      navigate(STEP_PATHS[firstIncomplete - 1], { replace: true });
      scrollToTopInstant();
    }
  }, [canAccessStep, getFirstIncompleteStep, navigate]);

  // Next step with transition
  const nextStep = useCallback(async () => {
    if (transitionLock.current || state.isTransitioning) {
      return;
    }
    
    const next = state.currentStep + 1;
    if (next <= TOTAL_STEPS) {
      transitionLock.current = true;
      setState(prev => ({ ...prev, isTransitioning: true }));
      
      // Navigate
      navigate(STEP_PATHS[next - 1]);
      scrollToTopInstant();
      
      // Update state after short delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setState(prev => ({ 
        ...prev, 
        currentStep: next,
        isTransitioning: false 
      }));
      
      transitionLock.current = false;
    }
  }, [state.currentStep, state.isTransitioning, navigate]);

  // Previous step
  const prevStep = useCallback(() => {
    if (transitionLock.current || state.isTransitioning) return;
    
    const prev = state.currentStep - 1;
    if (prev >= 1) {
      goToStep(prev);
    }
  }, [state.currentStep, state.isTransitioning, goToStep]);

  // Validate current step
  // Order: 1=Offre, 2=Identité, 3=Template, 4=Carte, 5=Livraison, 6=Récap, 7=Confirmation
  const validateCurrentStep = useCallback((): boolean => {
    switch (state.currentStep) {
      case 1:
        return state.selectedOffer !== null;
      case 2:
        return state.digitalIdentity !== null;
      case 3:
        return state.selectedTemplate !== null;
      case 4:
        return state.cardPersonalization !== null;
      case 5:
        return state.shippingInfo !== null;
      case 6:
        return state.shippingInfo !== null;
      case 7:
        return state.isComplete;
      default:
        return false;
    }
  }, [state]);

  // Reset funnel
  const resetFunnel = useCallback(() => {
    setState(initialState);
    sessionStorage.removeItem("orderFunnelStateV2");
  }, []);

  return (
    <OrderFunnelContext.Provider
      value={{
        state,
        setProductType,
        setSelectedOffer,
        setSelectedTemplate,
        setDigitalIdentity,
        setCardPersonalization,
        setShippingInfo,
        setPaymentInfo,
        goToStep,
        nextStep,
        prevStep,
        canAccessStep,
        getFirstIncompleteStep,
        resetFunnel,
        validateCurrentStep,
        markComplete,
        getStepPath,
        getSelectedOfferConfig,
      }}
    >
      {children}
    </OrderFunnelContext.Provider>
  );
}

export function useOrderFunnel() {
  const context = useContext(OrderFunnelContext);
  if (!context) {
    throw new Error("useOrderFunnel must be used within an OrderFunnelProvider");
  }
  return context;
}

// Route guard component - STRICT, no bypass
export function OrderFunnelGuard({ 
  step, 
  children 
}: { 
  step: number; 
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { canAccessStep, getFirstIncompleteStep, getStepPath, state } = useOrderFunnel();
  const [isReady, setIsReady] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Give a short delay to allow state to hydrate from sessionStorage
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || hasChecked.current) return;
    
    hasChecked.current = true;
    
    if (!canAccessStep(step)) {
      const firstIncomplete = getFirstIncompleteStep();
      navigate(getStepPath(firstIncomplete), { replace: true });
    }
  }, [isReady, step, canAccessStep, getFirstIncompleteStep, navigate, getStepPath]);

  // Block rendering during transition or if not ready yet
  if (!isReady || state.isTransitioning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If can't access after ready, show loading while redirecting
  if (!canAccessStep(step)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
