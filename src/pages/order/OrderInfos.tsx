/**
 * Step 2: Personal Information
 * /order/infos
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, PersonalInfo } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  OrderProgressBar, 
  AutoSaveIndicator, 
  RestoreDraftBanner,
  PageTransition,
  contentVariants,
  itemVariants 
} from "@/components/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, User, Building } from "lucide-react";
import { toast } from "sonner";

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

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({});
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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalInfo, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }

    // Company required for entreprise type
    if (state.customerType === "entreprise" && !formData.company?.trim()) {
      newErrors.company = "Le nom de l'entreprise est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinue = () => {
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    setPersonalInfo(formData);
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
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        placeholder="Jean"
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        placeholder="Dupont"
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="jean.dupont@email.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="title">Titre / Fonction</Label>
                    <Input
                      id="title"
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Directeur Commercial"
                    />
                  </div>
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
                    <div>
                      <Label htmlFor="company">
                        Nom de l'entreprise {state.customerType === "entreprise" ? "*" : "(optionnel)"}
                      </Label>
                      <Input
                        id="company"
                        value={formData.company || ""}
                        onChange={(e) => handleChange("company", e.target.value)}
                        placeholder="Ma Société SAS"
                        className={errors.company ? "border-destructive" : ""}
                      />
                      {errors.company && (
                        <p className="text-xs text-destructive mt-1">{errors.company}</p>
                      )}
                    </div>
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
              <Button
                size="lg"
                onClick={handleContinue}
                className="px-8 h-14 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500"
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
