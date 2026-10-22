/**
 * ExpressCheckoutContext - Checkout simplifié en 3 étapes
 * 
 * Optimisé pour la conversion:
 * 1. /express/offre - Choix du pack (le plus important)
 * 2. /express/infos - Infos essentielles + livraison (fusionnés)
 * 3. /express/payer - Récap + paiement immédiat
 */

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serverChargeCents } from "@/lib/nfcChargeCatalog";
import { formatMadCents } from "@/lib/nfcPricing";

// Offer types
export type ExpressOfferType = "essentiel" | "signature" | "alliance";

// Offer configuration
export interface ExpressOfferConfig {
  id: ExpressOfferType;
  name: string;
  price: number; // in centimes (MAD)
  priceDisplay: string;
}

// Grille CANONIQUE (identique à nfcPricing.ts et au serveur create-nfc-payment) :
// 199 / 349 / 599 DH ⇔ 29 / 49 / 79 €. Ne pas dériver d'autres montants.
export const EXPRESS_OFFERS: ExpressOfferConfig[] = [
  { id: "essentiel", name: "Essentielle", price: serverChargeCents("essentiel", "MAD") ?? 0, priceDisplay: formatMadCents(serverChargeCents("essentiel", "MAD") ?? 0, "MAD") },
  { id: "signature", name: "Professionnelle", price: serverChargeCents("signature", "MAD") ?? 0, priceDisplay: formatMadCents(serverChargeCents("signature", "MAD") ?? 0, "MAD") },
  { id: "alliance", name: "Prestige", price: serverChargeCents("alliance", "MAD") ?? 0, priceDisplay: formatMadCents(serverChargeCents("alliance", "MAD") ?? 0, "MAD") },
];

// Minimal customer info (fusionné identité + livraison)
export interface ExpressCustomerInfo {
  /** Only an explicit checked choice permits a names-only public profile. */
  publishNameOnly?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Livraison
  address: string;
  city: string;
}

// Payment info
export type ExpressPaymentMethod = "stripe" | "cod";

// Complete checkout state
export interface ExpressCheckoutState {
  currentStep: 1 | 2 | 3;
  selectedOffer: ExpressOfferType | null;
  customerInfo: ExpressCustomerInfo | null;
  customerDraft?: ExpressCustomerInfo | null;
  paymentMethod: ExpressPaymentMethod;
  isComplete: boolean;
}

// Step paths
const EXPRESS_STEP_PATHS = [
  "/express/offre",    // Step 1
  "/express/infos",    // Step 2
  "/express/payer",    // Step 3
];

export const EXPRESS_TOTAL_STEPS = 3;

// Context interface
interface ExpressCheckoutContextType {
  state: ExpressCheckoutState;
  setSelectedOffer: (offer: ExpressOfferType) => void;
  setCustomerInfo: (info: ExpressCustomerInfo) => void;
  setCustomerDraft: (info: ExpressCustomerInfo) => void;
  storageWarning: boolean;
  setPaymentMethod: (method: ExpressPaymentMethod) => void;
  goToStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  canAccessStep: (step: number) => boolean;
  resetCheckout: () => void;
  markComplete: () => void;
  getSelectedOfferConfig: () => ExpressOfferConfig | null;
}

const initialState: ExpressCheckoutState = {
  currentStep: 1,
  selectedOffer: null,
  customerInfo: null,
  paymentMethod: "cod", // Default to COD for Morocco
  isComplete: false,
};

const ExpressCheckoutContext = createContext<ExpressCheckoutContextType | null>(null);

export function ExpressCheckoutProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [storageWarning, setStorageWarning] = useState(false);
  
  // Load state from sessionStorage
  const [state, setState] = useState<ExpressCheckoutState>(() => {
    try {
      const saved = sessionStorage.getItem("expressCheckoutState");
      if (saved) {
        return { ...initialState, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
    return initialState;
  });

  // Persist state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("expressCheckoutState", JSON.stringify(state));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [state]);

  // Check if a step can be accessed
  const canAccessStep = useCallback((step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return state.selectedOffer !== null;
    if (step === 3) return state.selectedOffer !== null && state.customerInfo !== null;
    return false;
  }, [state.selectedOffer, state.customerInfo]);

  // Get selected offer config
  const getSelectedOfferConfig = useCallback((): ExpressOfferConfig | null => {
    if (!state.selectedOffer) return null;
    return EXPRESS_OFFERS.find(o => o.id === state.selectedOffer) || null;
  }, [state.selectedOffer]);

  // Set offer (step 1)
  const setSelectedOffer = useCallback((offer: ExpressOfferType) => {
    setState(prev => ({
      ...prev,
      selectedOffer: offer,
      currentStep: prev.currentStep === 1 ? 1 : prev.currentStep,
    }));
  }, []);

  // Edits invalidate any previously validated checkout, including its public choice.
  const setCustomerDraft = useCallback((info: ExpressCustomerInfo) => {
    setState(prev => ({ ...prev, customerDraft: info, customerInfo: null }));
  }, []);

  // Set customer info (step 2)
  const setCustomerInfo = useCallback((info: ExpressCustomerInfo) => {
    setState(prev => ({
      ...prev,
      customerInfo: info,
      customerDraft: info,
    }));
  }, []);

  // Set payment method
  const setPaymentMethod = useCallback((method: ExpressPaymentMethod) => {
    setState(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  }, []);

  // Mark as complete
  const markComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isComplete: true,
    }));
  }, []);

  // Navigate to specific step
  const goToStep = useCallback((step: 1 | 2 | 3) => {
    if (canAccessStep(step)) {
      setState(prev => ({ ...prev, currentStep: step }));
      navigate(EXPRESS_STEP_PATHS[step - 1]);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [canAccessStep, navigate]);

  // Next step
  const nextStep = useCallback(() => {
    const next = (state.currentStep + 1) as 1 | 2 | 3;
    if (next <= EXPRESS_TOTAL_STEPS) {
      setState(prev => ({ ...prev, currentStep: next }));
      navigate(EXPRESS_STEP_PATHS[next - 1]);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [state.currentStep, navigate]);

  // Previous step
  const prevStep = useCallback(() => {
    const prevStepNum = (state.currentStep - 1) as 1 | 2 | 3;
    if (prevStepNum >= 1) {
      setState(s => ({ ...s, currentStep: prevStepNum }));
      navigate(EXPRESS_STEP_PATHS[prevStepNum - 1]);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [state.currentStep, navigate]);

  // Reset checkout
  const resetCheckout = useCallback(() => {
    setState(initialState);
    try { sessionStorage.removeItem("expressCheckoutState"); } catch { /* Reset remains effective in memory. */ }
  }, []);

  return (
    <ExpressCheckoutContext.Provider
      value={{
        state,
        setSelectedOffer,
        setCustomerInfo,
        setCustomerDraft,
        storageWarning,
        setPaymentMethod,
        goToStep,
        nextStep,
        prevStep,
        canAccessStep,
        resetCheckout,
        markComplete,
        getSelectedOfferConfig,
      }}
    >
      {children}
    </ExpressCheckoutContext.Provider>
  );
}

export function useExpressCheckout() {
  const context = useContext(ExpressCheckoutContext);
  if (!context) {
    throw new Error("useExpressCheckout must be used within an ExpressCheckoutProvider");
  }
  return context;
}
