/**
 * Web Studio Context - Gestion du tunnel de création de site
 * Collecte ordonnée des informations: Société → Produits → Design → Contact → Récapitulatif
 */

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Types pour les données du formulaire
export interface WebStudioFormData {
  // Étape 1: Informations de l'entreprise
  businessName: string;
  businessType: string;
  description: string;
  address: string;
  city: string;
  
  // Étape 2: Produits/Services
  products: string;
  services: string;
  priceRange: string;
  targetAudience: string;
  
  // Étape 3: Style et Design
  style: string;
  colors: string;
  logoUrl: string;
  websiteUrl: string;
  socialLinks: string;
  
  // Étape 4: Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  preferredContact: "email" | "phone" | "whatsapp";
}

export interface WebsiteProposal {
  siteName: string;
  tagline: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  pages: Array<{
    name: string;
    slug: string;
    sections: Array<{
      type: string;
      title: string;
      content: string;
      items?: string[];
    }>;
  }>;
  features: string[];
  estimatedPages: number;
  complexity: "simple" | "standard" | "premium";
}

export interface WebStudioState {
  currentStep: number;
  formData: WebStudioFormData;
  proposal: WebsiteProposal | null;
  isExpress: boolean;
  isGenerating: boolean;
  sessionId: string;
  savedProposalId: string | null;
  selectedTemplate: string | null;
}

const STEP_PATHS = [
  "/web-studio/entreprise",
  "/web-studio/produits",
  "/web-studio/design",
  "/web-studio/contact",
  "/web-studio/recapitulatif",
];

export const STEP_LABELS = [
  "Entreprise",
  "Produits",
  "Design",
  "Contact",
  "Récapitulatif",
];

const initialFormData: WebStudioFormData = {
  businessName: "",
  businessType: "",
  description: "",
  address: "",
  city: "",
  products: "",
  services: "",
  priceRange: "",
  targetAudience: "",
  style: "",
  colors: "",
  logoUrl: "",
  websiteUrl: "",
  socialLinks: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  preferredContact: "whatsapp",
};

const generateSessionId = () => {
  const stored = sessionStorage.getItem("iwasp_studio_session");
  if (stored) return stored;
  const newId = `studio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("iwasp_studio_session", newId);
  return newId;
};

interface WebStudioContextType {
  state: WebStudioState;
  // Navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canAccessStep: (step: number) => boolean;
  validateCurrentStep: () => boolean;
  // Data setters
  updateFormData: (data: Partial<WebStudioFormData>) => void;
  setProposal: (proposal: WebsiteProposal | null) => void;
  setIsExpress: (value: boolean) => void;
  setIsGenerating: (value: boolean) => void;
  setSavedProposalId: (id: string | null) => void;
  setSelectedTemplate: (id: string | null) => void;
  // Reset
  resetStudio: () => void;
  // Computed
  calculatePrice: () => { eur: number; mad: number };
}

const WebStudioContext = createContext<WebStudioContextType | null>(null);

const PRICING = {
  simple: { base: 200, baseMAD: 2000 },
  standard: { base: 350, baseMAD: 3500 },
  premium: { base: 500, baseMAD: 5000 },
};

const EXPRESS_SURCHARGE = { eur: 50, mad: 500 };
const PAGE_EXTRA = { eur: 30, mad: 300 };

export function WebStudioProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState<WebStudioState>(() => {
    const saved = sessionStorage.getItem("iwasp_studio_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          sessionId: generateSessionId(),
        };
      } catch {
        // Invalid saved state
      }
    }
    return {
      currentStep: 0,
      formData: initialFormData,
      proposal: null,
      isExpress: false,
      isGenerating: false,
      sessionId: generateSessionId(),
      savedProposalId: null,
      selectedTemplate: null,
    };
  });

  // Persist state
  useEffect(() => {
    const { isGenerating, ...toSave } = state;
    sessionStorage.setItem("iwasp_studio_state", JSON.stringify(toSave));
  }, [state]);

  // Sync URL with step
  useEffect(() => {
    const stepIndex = STEP_PATHS.findIndex(path => location.pathname.startsWith(path));
    if (stepIndex >= 0 && stepIndex !== state.currentStep) {
      setState(prev => ({ ...prev, currentStep: stepIndex }));
    }
  }, [location.pathname]);

  const canAccessStep = (step: number): boolean => {
    if (step === 0) return true;
    if (step === 1) return !!state.formData.businessName && !!state.formData.businessType;
    if (step === 2) return canAccessStep(1) && (!!state.formData.products || !!state.formData.services);
    if (step === 3) return canAccessStep(2);
    if (step === 4) return canAccessStep(3) && !!state.formData.contactEmail;
    return false;
  };

  const validateCurrentStep = (): boolean => {
    const { formData } = state;
    switch (state.currentStep) {
      case 0:
        return !!formData.businessName.trim() && !!formData.businessType.trim();
      case 1:
        return !!formData.products.trim() || !!formData.services.trim();
      case 2:
        return true; // Style is optional
      case 3:
        return !!formData.contactEmail.trim() && !!formData.contactName.trim();
      case 4:
        return true;
      default:
        return false;
    }
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= STEP_PATHS.length) return;
    if (!canAccessStep(step) && step > state.currentStep) return;
    
    setState(prev => ({ ...prev, currentStep: step }));
    navigate(STEP_PATHS[step]);
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    if (state.currentStep < STEP_PATHS.length - 1) {
      goToStep(state.currentStep + 1);
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      goToStep(state.currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<WebStudioFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  };

  const setProposal = (proposal: WebsiteProposal | null) => {
    setState(prev => ({ ...prev, proposal }));
  };

  const setIsExpress = (value: boolean) => {
    setState(prev => ({ ...prev, isExpress: value }));
  };

  const setIsGenerating = (value: boolean) => {
    setState(prev => ({ ...prev, isGenerating: value }));
  };

  const setSavedProposalId = (id: string | null) => {
    setState(prev => ({ ...prev, savedProposalId: id }));
  };

  const setSelectedTemplate = (id: string | null) => {
    setState(prev => ({ ...prev, selectedTemplate: id }));
  };

  const resetStudio = () => {
    sessionStorage.removeItem("iwasp_studio_state");
    setState({
      currentStep: 0,
      formData: initialFormData,
      proposal: null,
      isExpress: false,
      isGenerating: false,
      sessionId: generateSessionId(),
      savedProposalId: null,
      selectedTemplate: null,
    });
    navigate(STEP_PATHS[0]);
  };

  const calculatePrice = () => {
    if (!state.proposal) return { eur: 0, mad: 0 };
    
    const base = PRICING[state.proposal.complexity];
    const extraPages = Math.max(0, state.proposal.estimatedPages - 5);
    
    let totalEur = base.base + (extraPages * PAGE_EXTRA.eur);
    let totalMAD = base.baseMAD + (extraPages * PAGE_EXTRA.mad);
    
    if (state.isExpress) {
      totalEur += EXPRESS_SURCHARGE.eur;
      totalMAD += EXPRESS_SURCHARGE.mad;
    }
    
    return { eur: totalEur, mad: totalMAD };
  };

  return (
    <WebStudioContext.Provider
      value={{
        state,
        goToStep,
        nextStep,
        prevStep,
        canAccessStep,
        validateCurrentStep,
        updateFormData,
        setProposal,
        setIsExpress,
        setIsGenerating,
        setSavedProposalId,
        setSelectedTemplate,
        resetStudio,
        calculatePrice,
      }}
    >
      {children}
    </WebStudioContext.Provider>
  );
}

export function useWebStudio() {
  const context = useContext(WebStudioContext);
  if (!context) {
    throw new Error("useWebStudio must be used within a WebStudioProvider");
  }
  return context;
}

// Guard component for routes
export function WebStudioGuard({ 
  step, 
  children 
}: { 
  step: number; 
  children: ReactNode 
}) {
  const { state, canAccessStep, goToStep } = useWebStudio();
  const navigate = useNavigate();

  useEffect(() => {
    if (!canAccessStep(step)) {
      // Find the first incomplete step
      for (let i = 0; i < step; i++) {
        if (!canAccessStep(i + 1)) {
          goToStep(i);
          return;
        }
      }
      goToStep(0);
    }
  }, [step, canAccessStep, goToStep]);

  if (!canAccessStep(step) && step > 0) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
