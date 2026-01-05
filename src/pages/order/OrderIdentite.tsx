/**
 * Step 2: Identité digitale
 * /order/identite
 * 
 * Palette Stealth Luxury : Argent Titane #A5A9B4
 */

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, DigitalIdentity, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Building2, 
  Globe,
  MapPin,
  Navigation,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

// Stealth Luxury Palette
const STEALTH = {
  bg: "#050807",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  border: "rgba(165, 169, 180, 0.2)",
};

// Validation helpers
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  return cleaned.length >= 8 && /^[\+]?[0-9]+$/.test(cleaned);
};

function OrderIdentiteContent() {
  const { state, setDigitalIdentity, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);

  const [formData, setFormData] = useState<DigitalIdentity>(
    state.digitalIdentity || {
      firstName: "",
      lastName: "",
      title: "",
      company: "",
      phone: "",
      email: "",
      whatsapp: "",
      instagram: "",
      linkedin: "",
      website: "",
      bio: "",
      latitude: undefined,
      longitude: undefined,
      googleMapsUrl: "",
    }
  );

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Geolocation
  const handleGeoSuccess = useCallback((geoData: any) => {
    const lat = geoData.latitude;
    const lng = geoData.longitude;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      googleMapsUrl: mapsUrl,
    }));
    toast.success("Position enregistrée");
  }, []);

  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    onSuccess: handleGeoSuccess,
  });

  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errs.firstName = "Prénom requis";
    if (!formData.lastName.trim()) errs.lastName = "Nom requis";
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
    
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof DigitalIdentity, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    
    if (!isValid) {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      });
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    setIsNavigating(true);

    // Normalize data
    const normalizedData: DigitalIdentity = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      title: formData.title?.trim(),
      company: formData.company?.trim(),
      phone: formData.phone.trim(),
      email: formData.email.toLowerCase().trim(),
      whatsapp: formData.whatsapp?.trim(),
      instagram: formData.instagram?.replace("@", "").trim(),
      linkedin: formData.linkedin?.trim(),
      website: formData.website?.trim(),
      bio: formData.bio?.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      googleMapsUrl: formData.googleMapsUrl,
    };

    setDigitalIdentity(normalizedData);
    await nextStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={2} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Étape 2 sur 6
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Votre identité digitale
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Ces informations seront visibles sur votre carte publique
              </motion.p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Personal Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User size={20} style={{ color: STEALTH.accent }} />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="title">Fonction</Label>
                    <Input
                      id="title"
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Directeur Commercial"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      value={formData.company || ""}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Ma Société"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio courte</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Quelques mots sur vous ou votre activité..."
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {(formData.bio?.length || 0)}/200
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 size={20} style={{ color: STEALTH.accent }} />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+212 6 12 34 56 78"
                      className={touched.phone && errors.phone ? "border-destructive" : ""}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="jean@exemple.com"
                      className={touched.email && errors.email ? "border-destructive" : ""}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp || ""}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="+212 6 12 34 56 78"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social & Web */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe size={20} style={{ color: STEALTH.accent }} />
                    Réseaux & Web
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        id="instagram"
                        value={formData.instagram || ""}
                        onChange={(e) => handleChange("instagram", e.target.value.replace("@", ""))}
                        placeholder="moncompte"
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin || ""}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/monprofil"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="www.monsite.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Geolocation */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin size={20} style={{ color: STEALTH.accent }} />
                    Géolocalisation
                    {formData.latitude && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ajoutez votre position pour générer un lien Google Maps automatique.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => geolocation.getCurrentPosition()}
                    disabled={geolocation.isLoading}
                    className="w-full h-12 gap-2 border-2 border-dashed"
                    style={{ 
                      borderColor: `${STEALTH.accent}50`,
                    }}
                  >
                    {geolocation.isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" style={{ color: STEALTH.accent }} />
                        <span>Localisation en cours...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="h-5 w-5" style={{ color: STEALTH.accent }} />
                        <span>Utiliser ma position actuelle</span>
                      </>
                    )}
                  </Button>

                  {geolocation.error && (
                    <p className="text-xs text-destructive">{geolocation.error}</p>
                  )}

                  {formData.googleMapsUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                    >
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Position enregistrée
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {formData.googleMapsUrl}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Validation Status */}
              {isValid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Toutes les informations obligatoires sont remplies</span>
                </motion.div>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-between items-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={state.isTransitioning}
                className="gap-2"
              >
                <ArrowLeft size={18} />
                Retour
              </Button>
              <LoadingButton
                size="xl"
                onClick={handleContinue}
                disabled={!isValid || state.isTransitioning}
                isLoading={isNavigating}
                loadingText="Chargement..."
                className="px-8 rounded-full font-semibold disabled:opacity-50"
                style={{ 
                  backgroundColor: STEALTH.accent, 
                  color: STEALTH.bg 
                }}
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

export default function OrderIdentite() {
  return (
    <OrderFunnelGuard step={2}>
      <OrderIdentiteContent />
    </OrderFunnelGuard>
  );
}
