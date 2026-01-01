/**
 * OrderFunnelContext - Manages multi-step order flow state
 * 
 * STRICT ORDER FLOW (6 steps, no bypass):
 * 1. /order/type - Customer type selection (particulier / pro / équipe)
 * 2. /order/profile - Personal information + digital profile creation
 * 3. /order/design - Physical card customization (logo, color)
 * 4. /order/options - Quantity + promo code
 * 5. /order/summary - Final review
 * 6. /order/payment - Payment only (after validation of step 5)
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Customer types
export type CustomerType = "particulier" | "professionnel" | "entreprise";

// Profile information (for digital profile + delivery)
export interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  title?: string;
  linkedin?: string;
  website?: string;
  whatsapp?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Design configuration
export interface DesignConfig {
  logoUrl: string | null;
  cardColor: string;
  designPreviewUrl?: string;
}

// Order options (quantity + promo)
export interface OrderOptions {
  quantity: number;
  promoCode?: string;
  promoDiscount?: number;
  unitPriceCents: number;
  totalPriceCents: number;
}

// Complete funnel state
export interface OrderFunnelState {
  currentStep: number;
  customerType: CustomerType | null;
  profileInfo: ProfileInfo | null;
  designConfig: DesignConfig | null;
  orderOptions: OrderOptions | null;
  isComplete: boolean;
}

// Step paths mapping (6 steps STRICT)
const STEP_PATHS = [
  "/order/type",      // Step 1: Choose customer type
  "/order/profile",   // Step 2: Personal info + digital profile
  "/order/design",    // Step 3: Card customization
  "/order/options",   // Step 4: Quantity + promo
  "/order/summary",   // Step 5: Review
  "/order/payment",   // Step 6: Payment
];

export const STEP_LABELS = [
  "Type",
  "Profil",
  "Design",
  "Options",
  "Récap",
  "Paiement"
];

// Context interface
interface OrderFunnelContextType {
  state: OrderFunnelState;
  setCustomerType: (type: CustomerType) => void;
  setProfileInfo: (info: ProfileInfo) => void;
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
}

const initialState: OrderFunnelState = {
  currentStep: 1,
  customerType: null,
  profileInfo: null,
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

  // Check if a step can be accessed (6 steps, STRICT - no bypass)
  const canAccessStep = useCallback((step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return state.customerType !== null;
    if (step === 3) return state.customerType !== null && state.profileInfo !== null;
    if (step === 4) return state.customerType !== null && state.profileInfo !== null && state.designConfig !== null;
    if (step === 5) return state.customerType !== null && state.profileInfo !== null && state.designConfig !== null && state.orderOptions !== null;
    if (step === 6) return state.isComplete;
    return false;
  }, [state]);

  // Get first incomplete step
  const getFirstIncompleteStep = useCallback((): number => {
    if (!state.customerType) return 1;
    if (!state.profileInfo) return 2;
    if (!state.designConfig) return 3;
    if (!state.orderOptions) return 4;
    if (!state.isComplete) return 5;
    return 6;
  }, [state]);

  // Set customer type (step 1)
  const setCustomerType = useCallback((type: CustomerType) => {
    setState(prev => ({
      ...prev,
      customerType: type,
      currentStep: Math.max(prev.currentStep, 1),
    }));
  }, []);

  // Set profile info (step 2)
  const setProfileInfo = useCallback((info: ProfileInfo) => {
    setState(prev => ({
      ...prev,
      profileInfo: info,
      currentStep: Math.max(prev.currentStep, 2),
    }));
  }, []);

  // Set design config (step 3)
  const setDesignConfig = useCallback((config: DesignConfig) => {
    setState(prev => ({
      ...prev,
      designConfig: config,
      currentStep: Math.max(prev.currentStep, 3),
    }));
  }, []);

  // Set order options (step 4 - quantity + promo)
  const setOrderOptions = useCallback((options: OrderOptions) => {
    setState(prev => ({
      ...prev,
      orderOptions: options,
      currentStep: Math.max(prev.currentStep, 4),
    }));
  }, []);

  // Mark as complete (step 5 -> ready for payment)
  const markComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isComplete: true,
      currentStep: 5,
    }));
  }, []);

  // Navigate to specific step
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6 && canAccessStep(step)) {
      setState(prev => ({ ...prev, currentStep: step }));
      navigate(STEP_PATHS[step - 1]);
    } else {
      // Redirect to first incomplete step
      const firstIncomplete = getFirstIncompleteStep();
      navigate(STEP_PATHS[firstIncomplete - 1], { replace: true });
    }
  }, [canAccessStep, getFirstIncompleteStep, navigate]);

  // Next step
  const nextStep = useCallback(() => {
    const next = state.currentStep + 1;
    if (next <= 6) {
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
        return state.profileInfo !== null;
      case 3:
        return state.designConfig !== null;
      case 4:
        return state.orderOptions !== null;
      case 5:
        return state.orderOptions !== null && state.isComplete;
      case 6:
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
        setCustomerType,
        setProfileInfo,
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
  const { canAccessStep, getFirstIncompleteStep } = useOrderFunnel();

  useEffect(() => {
    if (!canAccessStep(step)) {
      const firstIncomplete = getFirstIncompleteStep();
      navigate(STEP_PATHS[firstIncomplete - 1], { replace: true });
    }
  }, [step, canAccessStep, getFirstIncompleteStep, navigate]);

  if (!canAccessStep(step)) {
    return null;
  }

  return <>{children}</>;
}

// Cart guard - redirect to order funnel if not configured
export function CartGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { state, getFirstIncompleteStep } = useOrderFunnel();

  useEffect(() => {
    // Cart only accessible after complete configuration
    if (!state.isComplete) {
      const firstIncomplete = getFirstIncompleteStep();
      navigate(STEP_PATHS[firstIncomplete - 1], { replace: true });
    }
  }, [state.isComplete, getFirstIncompleteStep, navigate]);

  if (!state.isComplete) {
    return null;
  }

  return <>{children}</>;
}
