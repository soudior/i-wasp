/**
 * OrderFunnelContext - Manages multi-step order flow state
 * 
 * STRICT ORDER FLOW (7 steps, no bypass):
 * 1. /order/type - Customer type selection (particulier / pro / équipe)
 * 2. /order/identity - Personal info (name, title, phone, email)
 * 3. /order/digital - Digital links (website, WhatsApp, Instagram, Google Reviews, geolocation)
 * 4. /order/design - Card design (color, logo)
 * 5. /order/options - Quantity + promo code
 * 6. /order/summary - Final review
 * 7. /order/payment - Stripe payment
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { scrollToTopInstant } from "@/hooks/useScrollToTop";

// Customer types
export type CustomerType = "particulier" | "professionnel" | "entreprise";

// Product type
export type ProductType = "card" | "nails";

// Personal information (step 2: Identity)
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  title?: string;
}

// Digital links (step 3: Digital)
export interface DigitalInfo {
  website?: string;
  whatsapp?: string;
  instagram?: string;
  googleReviews?: string;
  // Geolocation & Shipping
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  postalCode?: string;
  country?: string;
  neighborhood?: string; // Quartier (Maroc)
}

// Design configuration (step 4)
export interface DesignConfig {
  logoUrl: string | null;
  cardColor: string;
  designPreviewUrl?: string;
}

// Order options (step 5)
export interface OrderOptions {
  quantity: number;
  promoCode?: string;
  promoDiscount?: number;
  unitPriceCents: number;
  totalPriceCents: number;
  paymentMethod?: "cod" | "card"; // Maroc = COD, Europe = Card
}

// Complete funnel state
export interface OrderFunnelState {
  currentStep: number;
  productType: ProductType | null;
  customerType: CustomerType | null;
  personalInfo: PersonalInfo | null;
  digitalInfo: DigitalInfo | null;
  designConfig: DesignConfig | null;
  orderOptions: OrderOptions | null;
  isComplete: boolean;
}

// Step paths mapping (7 steps STRICT)
const STEP_PATHS = [
  "/order/type",      // Step 1: Choose customer type
  "/order/identity",  // Step 2: Personal info
  "/order/digital",   // Step 3: Digital links + geolocation
  "/order/design",    // Step 4: Card customization
  "/order/options",   // Step 5: Quantity + promo
  "/order/summary",   // Step 6: Review
  "/order/payment",   // Step 7: Payment
];

export const STEP_LABELS = [
  "Type",
  "Identité",
  "Digital",
  "Design",
  "Options",
  "Récap",
  "Paiement"
];

export const TOTAL_STEPS = 7;

// Context interface
interface OrderFunnelContextType {
  state: OrderFunnelState;
  setProductType: (type: ProductType) => void;
  setCustomerType: (type: CustomerType) => void;
  setPersonalInfo: (info: PersonalInfo) => void;
  setDigitalInfo: (info: DigitalInfo) => void;
  setDesignConfig: (config: DesignConfig) => void;
  setOrderOptions: (options: OrderOptions) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canAccessStep: (step: number) => boolean;
  getFirstIncompleteStep: () => number;
  resetFunnel: () => void;
  validateCurrentStep: () => boolean;
  markComplete: () => void;
  getStepPath: (step: number) => string;
}

const initialState: OrderFunnelState = {
  currentStep: 1,
  productType: null,
  customerType: null,
  personalInfo: null,
  digitalInfo: null,
  designConfig: null,
  orderOptions: null,
  isComplete: false,
};

const OrderFunnelContext = createContext<OrderFunnelContextType | null>(null);

export function OrderFunnelProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  // Load state from sessionStorage
  const [state, setState] = useState<OrderFunnelState>(() => {
    try {
      const saved = sessionStorage.getItem("orderFunnelState");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return initialState;
  });

  // Persist state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("orderFunnelState", JSON.stringify(state));
  }, [state]);

  // Check if a step can be accessed (7 steps, STRICT - no bypass)
  const canAccessStep = useCallback((step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return state.customerType !== null;
    if (step === 3) return state.customerType !== null && state.personalInfo !== null;
    if (step === 4) return state.customerType !== null && state.personalInfo !== null && state.digitalInfo !== null;
    if (step === 5) return state.customerType !== null && state.personalInfo !== null && state.digitalInfo !== null && state.designConfig !== null;
    if (step === 6) return state.customerType !== null && state.personalInfo !== null && state.digitalInfo !== null && state.designConfig !== null && state.orderOptions !== null;
    if (step === 7) return state.isComplete;
    return false;
  }, [state]);

  // Get first incomplete step
  const getFirstIncompleteStep = useCallback((): number => {
    if (!state.customerType) return 1;
    if (!state.personalInfo) return 2;
    if (!state.digitalInfo) return 3;
    if (!state.designConfig) return 4;
    if (!state.orderOptions) return 5;
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

  // Set product type (step 0/1)
  const setProductType = useCallback((type: ProductType) => {
    setState(prev => ({
      ...prev,
      productType: type,
    }));
  }, []);

  // Set customer type (step 1)
  const setCustomerType = useCallback((type: CustomerType) => {
    setState(prev => ({
      ...prev,
      customerType: type,
      currentStep: Math.max(prev.currentStep, 1),
    }));
  }, []);

  // Set personal info (step 2)
  const setPersonalInfo = useCallback((info: PersonalInfo) => {
    setState(prev => ({
      ...prev,
      personalInfo: info,
      currentStep: Math.max(prev.currentStep, 2),
    }));
  }, []);

  // Set digital info (step 3)
  const setDigitalInfo = useCallback((info: DigitalInfo) => {
    setState(prev => ({
      ...prev,
      digitalInfo: info,
      currentStep: Math.max(prev.currentStep, 3),
    }));
  }, []);

  // Set design config (step 4)
  const setDesignConfig = useCallback((config: DesignConfig) => {
    setState(prev => ({
      ...prev,
      designConfig: config,
      currentStep: Math.max(prev.currentStep, 4),
    }));
  }, []);

  // Set order options (step 5)
  const setOrderOptions = useCallback((options: OrderOptions) => {
    setState(prev => ({
      ...prev,
      orderOptions: options,
      currentStep: Math.max(prev.currentStep, 5),
    }));
  }, []);

  // Mark as complete (step 6 -> ready for payment)
  const markComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isComplete: true,
      currentStep: 6,
    }));
  }, []);

  // Navigate to specific step with scroll to top
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS && canAccessStep(step)) {
      setState(prev => ({ ...prev, currentStep: step }));
      navigate(STEP_PATHS[step - 1]);
      // Auto scroll to top after navigation
      scrollToTopInstant();
    } else {
      // Redirect to first incomplete step
      const firstIncomplete = getFirstIncompleteStep();
      navigate(STEP_PATHS[firstIncomplete - 1], { replace: true });
      scrollToTopInstant();
    }
  }, [canAccessStep, getFirstIncompleteStep, navigate]);

  // Next step
  const nextStep = useCallback(() => {
    const next = state.currentStep + 1;
    if (next <= TOTAL_STEPS) {
      goToStep(next);
    }
  }, [state.currentStep, goToStep]);

  // Previous step
  const prevStep = useCallback(() => {
    const prev = state.currentStep - 1;
    if (prev >= 1) {
      goToStep(prev);
    }
  }, [state.currentStep, goToStep]);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    switch (state.currentStep) {
      case 1:
        return state.customerType !== null;
      case 2:
        return state.personalInfo !== null;
      case 3:
        return state.digitalInfo !== null;
      case 4:
        return state.designConfig !== null;
      case 5:
        return state.orderOptions !== null;
      case 6:
        return state.orderOptions !== null && state.isComplete;
      case 7:
        return state.isComplete;
      default:
        return false;
    }
  }, [state]);

  // Reset funnel
  const resetFunnel = useCallback(() => {
    setState(initialState);
    sessionStorage.removeItem("orderFunnelState");
  }, []);

  return (
    <OrderFunnelContext.Provider
      value={{
        state,
        setProductType,
        setCustomerType,
        setPersonalInfo,
        setDigitalInfo,
        setDesignConfig,
        setOrderOptions,
        goToStep,
        nextStep,
        prevStep,
        canAccessStep,
        getFirstIncompleteStep,
        resetFunnel,
        validateCurrentStep,
        markComplete,
        getStepPath,
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
  const { canAccessStep, getFirstIncompleteStep, getStepPath } = useOrderFunnel();

  useEffect(() => {
    if (!canAccessStep(step)) {
      const firstIncomplete = getFirstIncompleteStep();
      navigate(getStepPath(firstIncomplete), { replace: true });
    }
  }, [step, canAccessStep, getFirstIncompleteStep, navigate, getStepPath]);

  if (!canAccessStep(step)) {
    return null;
  }

  return <>{children}</>;
}

// Cart guard - redirect to order funnel if not configured
export function CartGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { state, getFirstIncompleteStep, getStepPath } = useOrderFunnel();

  useEffect(() => {
    // Cart only accessible after complete configuration
    if (!state.isComplete) {
      const firstIncomplete = getFirstIncompleteStep();
      navigate(getStepPath(firstIncomplete), { replace: true });
    }
  }, [state.isComplete, getFirstIncompleteStep, navigate, getStepPath]);

  if (!state.isComplete) {
    return null;
  }

  return <>{children}</>;
}
