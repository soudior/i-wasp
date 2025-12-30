/**
 * OrderFunnelContext - Manages multi-step order flow state
 * 
 * STEPS:
 * 1. /order/type - Customer type selection
 * 2. /order/card - Card model, quantity, promo
 * 3. /order/profile - Personal information
 * 4. /order/design - Logo upload, color selection
 * 5. /order/summary - Final review before payment
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Customer types
export type CustomerType = "particulier" | "professionnel" | "entreprise";

// Card model selection
export interface CardSelection {
  modelId: string;
  modelName: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  promoCode?: string;
  promoDiscount?: number;
}

// Profile information
export interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
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

// Complete funnel state
export interface OrderFunnelState {
  currentStep: number;
  customerType: CustomerType | null;
  cardSelection: CardSelection | null;
  profileInfo: ProfileInfo | null;
  designConfig: DesignConfig | null;
  isComplete: boolean;
}

// Step paths mapping
const STEP_PATHS = [
  "/order/type",
  "/order/card",
  "/order/profile",
  "/order/design",
  "/order/summary",
];

// Context interface
interface OrderFunnelContextType {
  state: OrderFunnelState;
  setCustomerType: (type: CustomerType) => void;
  setCardSelection: (selection: CardSelection) => void;
  setProfileInfo: (info: ProfileInfo) => void;
  setDesignConfig: (config: DesignConfig) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canAccessStep: (step: number) => boolean;
  getFirstIncompleteStep: () => number;
  resetFunnel: () => void;
  validateCurrentStep: () => boolean;
}

const initialState: OrderFunnelState = {
  currentStep: 1,
  customerType: null,
  cardSelection: null,
  profileInfo: null,
  designConfig: null,
  isComplete: false,
};

const OrderFunnelContext = createContext<OrderFunnelContextType | null>(null);

export function OrderFunnelProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Check if a step can be accessed
  const canAccessStep = useCallback((step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return state.customerType !== null;
    if (step === 3) return state.customerType !== null && state.cardSelection !== null;
    if (step === 4) return state.customerType !== null && state.cardSelection !== null && state.profileInfo !== null;
    if (step === 5) return state.customerType !== null && state.cardSelection !== null && state.profileInfo !== null && state.designConfig !== null;
    return false;
  }, [state]);

  // Get first incomplete step
  const getFirstIncompleteStep = useCallback((): number => {
    if (!state.customerType) return 1;
    if (!state.cardSelection) return 2;
    if (!state.profileInfo) return 3;
    if (!state.designConfig) return 4;
    return 5;
  }, [state]);

  // Set customer type (step 1)
  const setCustomerType = useCallback((type: CustomerType) => {
    setState(prev => ({
      ...prev,
      customerType: type,
      currentStep: Math.max(prev.currentStep, 1),
    }));
  }, []);

  // Set card selection (step 2)
  const setCardSelection = useCallback((selection: CardSelection) => {
    setState(prev => ({
      ...prev,
      cardSelection: selection,
      currentStep: Math.max(prev.currentStep, 2),
    }));
  }, []);

  // Set profile info (step 3)
  const setProfileInfo = useCallback((info: ProfileInfo) => {
    setState(prev => ({
      ...prev,
      profileInfo: info,
      currentStep: Math.max(prev.currentStep, 3),
    }));
  }, []);

  // Set design config (step 4)
  const setDesignConfig = useCallback((config: DesignConfig) => {
    setState(prev => ({
      ...prev,
      designConfig: config,
      currentStep: Math.max(prev.currentStep, 4),
      isComplete: true,
    }));
  }, []);

  // Navigate to specific step
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 5 && canAccessStep(step)) {
      setState(prev => ({ ...prev, currentStep: step }));
      navigate(STEP_PATHS[step - 1]);
    } else {
      // Redirect to first incomplete step
      const firstIncomplete = getFirstIncompleteStep();
      navigate(STEP_PATHS[firstIncomplete - 1]);
    }
  }, [canAccessStep, getFirstIncompleteStep, navigate]);

  // Next step
  const nextStep = useCallback(() => {
    const next = state.currentStep + 1;
    if (next <= 5) {
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
        return state.cardSelection !== null;
      case 3:
        return state.profileInfo !== null;
      case 4:
        return state.designConfig !== null;
      case 5:
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
        setCardSelection,
        setProfileInfo,
        setDesignConfig,
        goToStep,
        nextStep,
        prevStep,
        canAccessStep,
        getFirstIncompleteStep,
        resetFunnel,
        validateCurrentStep,
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

// Route guard component
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
