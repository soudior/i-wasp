/**
 * Step 2: Personal Information
 * /order/infos
 * 
 * VALIDATION INFAILLIBLE:
 * - Bouton désactivé tant que le formulaire est invalide
 * - Auto-correction (email lowercase, phone normalisé)
 * - Messages clairs et humains
 * - Impossible de continuer sans données valides
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, PersonalInfo } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartInput } from "@/components/order/SmartInput";
import { SmartContinueButton } from "@/components/order/SmartContinueButton";
import { ValidationSummary } from "@/components/order/ValidationSummary";
import { 
  OrderProgressBar, 
  AutoSaveIndicator, 
  RestoreDraftBanner,
  PageTransition,
  contentVariants,
  itemVariants 
} from "@/components/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Building } from "lucide-react";
import { toast } from "sonner";
import {
  normalizeEmail,
  normalizePhone,
  normalizeName,
  validateEmailField,
  validatePhoneField,
  validatePersonalInfo,
} from "@/lib/orderValidation";

function OrderInfosContent() {
  const { state, setPersonalInfo, nextStep, prevStep } = useOrderFunnel();
  const { user } = useAuth();

  const [formData, setFormData] = useState<PersonalInfo>(
    state.personalInfo || {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      company: "",
      title: "",
    }
  );

  const [showRestoreBanner, setShowRestoreBanner] = useState(false);

  // Auto-save hook
  const { 
    status: saveStatus, 
    lastSaved, 
    hasSavedData, 
    getSavedData, 
    clearSaved 
  } = useAutoSave<PersonalInfo>({
    key: "order_infos",
    data: formData,
    enabled: true,
    onRestore: (data) => {
      setFormData(data);
      toast.success("Brouillon restauré");
    },
  });

  // Check for saved draft on mount
  useEffect(() => {
    if (!state.personalInfo && hasSavedData()) {
      setShowRestoreBanner(true);
    }
  }, [state.personalInfo, hasSavedData]);

  const handleRestoreDraft = () => {
    const savedData = getSavedData();
    if (savedData) {
      setFormData(savedData);
      toast.success("Brouillon restauré");
    }
    setShowRestoreBanner(false);
  };

  const handleDismissDraft = () => {
    clearSaved();
    setShowRestoreBanner(false);
  };

  // Real-time validation
  const validation = useMemo(() => {
    return validatePersonalInfo(formData, state.customerType);
  }, [formData, state.customerType]);

  // Validation items for summary
  const validationItems = useMemo(() => {
    const items = [
      {
        key: "firstName",
        label: "Prénom",
        isValid: !validation.errors.firstName,
        message: validation.errors.firstName,
      },
      {
        key: "lastName",
        label: "Nom",
        isValid: !validation.errors.lastName,
        message: validation.errors.lastName,
      },
      {
        key: "email",
        label: "Email valide",
        isValid: !validation.errors.email,
        message: validation.errors.email,
      },
      {
        key: "phone",
        label: "Téléphone valide",
        isValid: !validation.errors.phone,
        message: validation.errors.phone,
      },
    ];

    // Add company for pro/entreprise
    if (state.customerType === "entreprise" || state.customerType === "professionnel") {
      items.push({
        key: "company",
        label: "Nom de l'entreprise",
        isValid: !validation.errors.company,
        message: validation.errors.company,
      });
    }

    return items;
  }, [validation.errors, state.customerType]);

  // Can proceed?
  const canProceed = validation.isValid;
  const blockingMessage = !canProceed
    ? Object.values(validation.errors)[0]
    : undefined;

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!canProceed) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    // Apply normalizations before saving
    const normalizedData: PersonalInfo = {
      ...formData,
      firstName: normalizeName(formData.firstName),
      lastName: normalizeName(formData.lastName),
      email: normalizeEmail(formData.email),
      phone: normalizePhone(formData.phone),
    };

    setPersonalInfo(normalizedData);
    clearSaved();
    nextStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={2} />

            {/* Restore Draft Banner */}
            <AnimatePresence>
              {showRestoreBanner && (
                <RestoreDraftBanner
                  lastSaved={lastSaved}
                  onRestore={handleRestoreDraft}
                  onDismiss={handleDismissDraft}
                />
              )}
            </AnimatePresence>

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="flex items-center justify-center gap-3 mb-3"
                variants={itemVariants}
              >
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Vos informations
                </h1>
              </motion.div>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Renseignez vos coordonnées
              </motion.p>
              <motion.div 
                className="flex justify-center mt-2"
                variants={itemVariants}
              >
                <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
              </motion.div>
            </motion.div>

            {/* Validation Summary */}
            <AnimatePresence>
              {!canProceed && formData.firstName && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6"
                >
                  <ValidationSummary items={validationItems} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User size={20} className="text-primary" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <SmartInput
                      id="firstName"
                      label="Prénom"
                      value={formData.firstName}
                      onChange={(value) => handleChange("firstName", value)}
                      onNormalize={normalizeName}
                      validate={(value) => ({
                        isValid: value.trim().length > 0,
                        message: value.trim().length === 0 ? "Requis" : undefined,
                      })}
                      error={validation.errors.firstName}
                      required
                      placeholder="Jean"
                    />
                    <SmartInput
                      id="lastName"
                      label="Nom"
                      value={formData.lastName}
                      onChange={(value) => handleChange("lastName", value)}
                      onNormalize={normalizeName}
                      validate={(value) => ({
                        isValid: value.trim().length > 0,
                        message: value.trim().length === 0 ? "Requis" : undefined,
                      })}
                      error={validation.errors.lastName}
                      required
                      placeholder="Dupont"
                    />
                  </div>

                  <SmartInput
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleChange("email", value)}
                    onNormalize={normalizeEmail}
                    validate={validateEmailField}
                    error={validation.errors.email}
                    required
                    placeholder="jean.dupont@email.com"
                    helpText="Nous vous enverrons les confirmations ici"
                  />

                  <SmartInput
                    id="phone"
                    label="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => handleChange("phone", value)}
                    onNormalize={normalizePhone}
                    validate={validatePhoneField}
                    error={validation.errors.phone}
                    required
                    placeholder="+33 6 12 34 56 78"
                    helpText="Format international recommandé"
                  />

                  <SmartInput
                    id="title"
                    label="Titre / Fonction"
                    value={formData.title || ""}
                    onChange={(value) => handleChange("title", value)}
                    placeholder="Directeur Commercial"
                  />
                </CardContent>
              </Card>

              {/* Company Info (for entreprise/professionnel) */}
              {(state.customerType === "entreprise" || state.customerType === "professionnel") && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building size={20} className="text-primary" />
                      Entreprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SmartInput
                      id="company"
                      label="Nom de l'entreprise"
                      value={formData.company || ""}
                      onChange={(value) => handleChange("company", value)}
                      validate={(value) => ({
                        isValid: state.customerType !== "entreprise" || value.trim().length > 0,
                        message: "Requis pour les entreprises",
                      })}
                      error={validation.errors.company}
                      required={state.customerType === "entreprise"}
                      placeholder="Ma Société SAS"
                    />
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-between items-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button variant="ghost" onClick={prevStep} className="gap-2">
                <ArrowLeft size={18} />
                Retour
              </Button>
              <SmartContinueButton
                onClick={handleContinue}
                canProceed={canProceed}
                blockingMessage={blockingMessage}
              />
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function OrderInfos() {
  return (
    <OrderFunnelGuard step={2}>
      <OrderInfosContent />
    </OrderFunnelGuard>
  );
}
