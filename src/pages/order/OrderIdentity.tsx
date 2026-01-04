/**
 * Step 2: Identity
 * /order/identity
 * 
 * Personal information: nom, prénom, fonction, téléphone, email
 * Validation obligatoire
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, PersonalInfo } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  OrderProgressBar, 
  PageTransition,
  contentVariants,
  itemVariants 
} from "@/components/order";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Building2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Validation helpers
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  return cleaned.length >= 8 && /^[\+]?[0-9]+$/.test(cleaned);
};

function OrderIdentityContent() {
  const { state, setPersonalInfo, nextStep, prevStep } = useOrderFunnel();
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

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

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errs.firstName = "Prénom requis";
    }
    if (!formData.lastName.trim()) {
      errs.lastName = "Nom requis";
    }
    if (!formData.email.trim()) {
      errs.email = "Email requis";
    } else if (!validateEmail(formData.email)) {
      errs.email = "Email invalide";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Téléphone requis";
    } else if (!validatePhone(formData.phone)) {
      errs.phone = "Téléphone invalide";
    }
    
    // Company required for pro/entreprise
    if ((state.customerType === "professionnel" || state.customerType === "entreprise") && !formData.company?.trim()) {
      errs.company = "Entreprise requise";
    }
    
    return errs;
  }, [formData, state.customerType]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleContinue = () => {
    if (isNavigating) return;
    
    if (!isValid) {
      // Mark all as touched to show errors
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
      });
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    setIsNavigating(true);

    // Normalize data
    const normalizedData: PersonalInfo = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.trim(),
      company: formData.company?.trim(),
      title: formData.title?.trim(),
    };

    setPersonalInfo(normalizedData);
    nextStep();
  };

  const showCompanyField = state.customerType === "professionnel" || state.customerType === "entreprise";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={2} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Votre identité
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Ces informations apparaîtront sur votre carte digitale
              </motion.p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Personal Info Card */}
              <Card className="card-iwasp">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User size={20} className="text-iwasp-vert" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-1">
                        Prénom <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        onBlur={() => handleBlur("firstName")}
                        placeholder="Jean"
                        className={touched.firstName && errors.firstName ? "border-destructive" : ""}
                      />
                      {touched.firstName && errors.firstName && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-1">
                        Nom <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        onBlur={() => handleBlur("lastName")}
                        placeholder="Dupont"
                        className={touched.lastName && errors.lastName ? "border-destructive" : ""}
                      />
                      {touched.lastName && errors.lastName && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Fonction / Titre</Label>
                    <Input
                      id="title"
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Directeur Commercial"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="jean.dupont@email.com"
                      className={touched.email && errors.email ? "border-destructive" : ""}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      Téléphone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+33 6 12 34 56 78"
                      className={touched.phone && errors.phone ? "border-destructive" : ""}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Company Card (for pro/entreprise) */}
              {showCompanyField && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="card-iwasp">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 size={20} className="text-iwasp-vert" />
                        Entreprise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="flex items-center gap-1">
                          Nom de l'entreprise <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="company"
                          value={formData.company || ""}
                          onChange={(e) => handleChange("company", e.target.value)}
                          onBlur={() => handleBlur("company")}
                          placeholder="Ma Société SAS"
                          className={touched.company && errors.company ? "border-destructive" : ""}
                        />
                        {touched.company && errors.company && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.company}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Validation Summary */}
              {isValid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-iwasp-vert/10 border border-iwasp-vert/20"
                >
                  <Check className="h-5 w-5 text-iwasp-vert" />
                  <span className="text-sm font-medium">Toutes les informations sont valides</span>
                </motion.div>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-between items-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                className="gap-2 btn-iwasp-ghost"
              >
                <ArrowLeft size={18} />
                Retour
              </Button>
              <LoadingButton
                size="xl"
                onClick={handleContinue}
                disabled={!isValid}
                isLoading={isNavigating}
                className="px-8 rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 disabled:opacity-50"
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </LoadingButton>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function OrderIdentity() {
  return (
    <OrderFunnelGuard step={2}>
      <OrderIdentityContent />
    </OrderFunnelGuard>
  );
}
