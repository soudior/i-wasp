/**
 * CardWizard - Flow de création premium IWASP
 * 
 * DESIGN SYSTEM:
 * - Fond sombre premium
 * - Animations lentes et élégantes (ease-in-out)
 * - Mobile-first, boutons sticky
 * - Aucun drag non contrôlé
 * 
 * FLOW LINÉAIRE:
 * 1. Infos personnelles
 * 2. Photo / Logo (obligatoire)
 * 3. Template + couleurs
 * 4. Aperçu final + liens
 * 5. Sauvegarde
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCreateCard, useUpdateCard } from "@/hooks/useCards";
import { templateInfo, TemplateType } from "@/components/templates/CardTemplates";
import { SocialLink } from "@/lib/socialNetworks";
import { validateForPublication } from "@/lib/publicationValidator";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  User,
  Camera,
  Palette,
  Eye,
  CreditCard,
  Sparkles,
  Lock
} from "lucide-react";

// Step components
import { StepIdentity } from "./steps/StepIdentity";
import { StepMedia } from "./steps/StepMedia";
import { StepDesign } from "./steps/StepDesign";
import { StepPreview } from "./steps/StepPreview";
import { StepComplete } from "./steps/StepComplete";
import { WizardProgress } from "./WizardProgress";
import { WizardPreview } from "./WizardPreview";

export interface GoogleReviewsData {
  url: string;
  rating: number;
  reviewCount: number;
}

export interface CardFormData {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  tagline: string;
  photoUrl: string | null;
  logoUrl: string | null;
  location: string;
  template: TemplateType;
  socialLinks: SocialLink[];
  googleReviews?: GoogleReviewsData;
}

interface CardWizardProps {
  editId?: string | null;
  initialData?: Partial<CardFormData>;
  onComplete?: (cardId: string) => void;
}

const STEPS = [
  { id: "identity", label: "Identité", icon: User, description: "Vos informations" },
  { id: "media", label: "Médias", icon: Camera, description: "Photo & Logo" },
  { id: "design", label: "Design", icon: Palette, description: "Template & couleurs" },
  { id: "preview", label: "Aperçu", icon: Eye, description: "Liens & validation" },
  { id: "complete", label: "Terminé", icon: Check, description: "Carte créée" },
];

const PREMIUM_COPY = {
  identity: {
    title: "Créez votre impression",
    subtitle: "Chaque détail compte. Commencez par votre identité.",
  },
  media: {
    title: "Votre image commence ici",
    subtitle: "Un visuel de qualité fait toute la différence.",
  },
  design: {
    title: "L'élégance du choix",
    subtitle: "Sélectionnez le design qui vous représente.",
  },
  preview: {
    title: "Presque parfait",
    subtitle: "Vérifiez chaque détail avant de finaliser.",
  },
  complete: {
    title: "Votre carte est prête",
    subtitle: "Une impression premium, à portée de main.",
  },
};

export function CardWizard({ editId, initialData, onComplete }: CardWizardProps) {
  const navigate = useNavigate();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCardId, setSavedCardId] = useState<string | null>(editId || null);
  const [savedCardSlug, setSavedCardSlug] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CardFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    title: initialData?.title || "",
    company: initialData?.company || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    tagline: initialData?.tagline || "",
    photoUrl: initialData?.photoUrl || null,
    logoUrl: initialData?.logoUrl || null,
    location: initialData?.location || "",
    template: initialData?.template || "signature",
    socialLinks: initialData?.socialLinks || [],
    googleReviews: initialData?.googleReviews || undefined,
  });

  // State for publication validation from StepPreview
  const [canPublishCard, setCanPublishCard] = useState(false);

  // Validation per step - utilise la validation de publication pour l'étape preview
  const stepValidation = useMemo(() => ({
    identity: Boolean(formData.firstName.trim() && formData.lastName.trim()),
    media: Boolean(formData.photoUrl || formData.logoUrl),
    design: Boolean(formData.template),
    preview: canPublishCard, // Utilise le résultat de la validation de publication
    complete: Boolean(savedCardId),
  }), [formData, savedCardId, canPublishCard]);

  // Callback pour recevoir l'état de validation de StepPreview
  const handleValidationChange = useCallback((canPublish: boolean) => {
    setCanPublishCard(canPublish);
  }, []);

  const currentStepId = STEPS[currentStep]?.id as keyof typeof stepValidation;
  const isCurrentStepValid = stepValidation[currentStepId] ?? false;
  const canProceed = isCurrentStepValid;

  // Get publication validation for blocking
  const publicationValidation = useMemo(() => {
    return validateForPublication(formData);
  }, [formData]);

  const updateFormData = (updates: Partial<CardFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (!canProceed) {
      toast.error(getValidationMessage(currentStepId));
      return;
    }

    // If on preview step, save the card
    if (currentStepId === "preview") {
      await handleSave();
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      // Build blocks array with Google Reviews if present
      const blocks: any[] = [];
      if (formData.googleReviews?.url) {
        blocks.push({
          id: `google-reviews-${Date.now()}`,
          type: "googleReviews",
          visible: true,
          order: 0,
          data: {
            url: formData.googleReviews.url,
            rating: formData.googleReviews.rating,
            reviewCount: formData.googleReviews.reviewCount,
          },
        });
      }

      const cardData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        title: formData.title || undefined,
        company: formData.company || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        location: formData.location || undefined,
        website: formData.website || undefined,
        tagline: formData.tagline || undefined,
        photo_url: formData.photoUrl || undefined,
        logo_url: formData.logoUrl || undefined,
        template: formData.template,
        social_links: formData.socialLinks.length > 0 ? formData.socialLinks : undefined,
        blocks: blocks.length > 0 ? blocks : undefined,
      };

      let resultId: string;

      if (editId) {
        await updateCard.mutateAsync({
          id: editId,
          data: cardData as any,
        });
        resultId = editId;
        // For edit, we need to fetch the slug separately if not cached
      } else {
        const result = await createCard.mutateAsync(cardData);
        resultId = result.id;
        setSavedCardSlug(result.slug); // Store the slug for the public URL
      }

      setSavedCardId(resultId);
      setCurrentStep(STEPS.length - 1); // Go to complete step
      toast.success("Votre carte a été sauvegardée");
      
      if (onComplete) {
        onComplete(resultId);
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationMessage = (stepId: string): string => {
    switch (stepId) {
      case "identity":
        return "Veuillez renseigner votre prénom et nom";
      case "media":
        return "Ajoutez une photo ou un logo pour continuer";
      case "design":
        return "Choisissez un template pour votre carte";
      case "preview":
        const errors = publicationValidation.criticalErrors;
        if (errors.length > 0) {
          return `${errors.length} élément(s) requis: ${errors.map(e => e.label).join(", ")}`;
        }
        return "Complétez tous les champs requis";
      default:
        return "Complétez cette étape pour continuer";
    }
  };

  const copy = PREMIUM_COPY[currentStepId as keyof typeof PREMIUM_COPY] || PREMIUM_COPY.identity;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Retour</span>
            </button>
            
            <WizardProgress 
              steps={STEPS} 
              currentStep={currentStep} 
              validation={stepValidation}
            />
            
            <div className="w-20" /> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Premium Title */}
          <motion.div
            key={currentStepId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              {copy.title}
            </h1>
            <p className="text-muted-foreground">
              {copy.subtitle}
            </p>
          </motion.div>

          {/* Two Column Layout on Desktop */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form Area */}
            <div className="order-2 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {currentStepId === "identity" && (
                    <StepIdentity 
                      data={formData} 
                      onChange={updateFormData}
                    />
                  )}
                  {currentStepId === "media" && (
                    <StepMedia 
                      data={formData} 
                      onChange={updateFormData}
                    />
                  )}
                  {currentStepId === "design" && (
                    <StepDesign 
                      data={formData} 
                      onChange={updateFormData}
                    />
                  )}
                  {currentStepId === "preview" && (
                    <StepPreview 
                      data={formData} 
                      onChange={updateFormData}
                      validation={stepValidation}
                      onValidationChange={handleValidationChange}
                    />
                  )}
                  {currentStepId === "complete" && (
                    <StepComplete 
                      cardId={savedCardId}
                      cardSlug={savedCardSlug}
                      data={formData}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview Area - Always visible */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <WizardPreview data={formData} />
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer - Mobile First */}
      {currentStepId !== "complete" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 max-w-6xl mx-auto">
              {/* Back Button */}
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-border hover:bg-muted transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {/* Main CTA */}
              <button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className={`flex-1 h-14 rounded-full font-medium text-base transition-all flex items-center justify-center gap-2 ${
                  canProceed
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : currentStepId === "preview" ? (
                  canProceed ? (
                    <>
                      <Check size={20} />
                      <span>Sauvegarder ma carte</span>
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      <span>Compléter les champs requis</span>
                    </>
                  )
                ) : (
                  <>
                    <span>Continuer</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            {/* Validation hint */}
            {!canProceed && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs text-muted-foreground mt-2"
              >
                {getValidationMessage(currentStepId)}
              </motion.p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CardWizard;