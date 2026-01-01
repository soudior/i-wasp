/**
 * Step 3: Digital
 * /order/digital
 * 
 * Digital links: website, WhatsApp, Instagram, Google Reviews
 * Geolocation: auto + map selection
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, DigitalInfo } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartLocationEditor } from "@/components/SmartLocationEditor";
import { 
  OrderProgressBar, 
  PageTransition,
  contentVariants,
  itemVariants 
} from "@/components/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  ArrowRight, 
  Globe, 
  MessageCircle, 
  Instagram, 
  Star,
  MapPin,
  CheckCircle2,
  Info
} from "lucide-react";
import { toast } from "sonner";

// URL validation helper
const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty is valid (optional)
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

// Format URL with protocol
const formatUrl = (url: string): string => {
  if (!url.trim()) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

// WhatsApp validation
const formatWhatsApp = (phone: string): string => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("0")) return `+33${cleaned.slice(1)}`;
  return cleaned;
};

function OrderDigitalContent() {
  const { state, setDigitalInfo, nextStep, prevStep } = useOrderFunnel();

  const [formData, setFormData] = useState<DigitalInfo>(
    state.digitalInfo || {
      website: "",
      whatsapp: "",
      instagram: "",
      googleReviews: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      city: "",
      postalCode: "",
      country: "France",
    }
  );

  const [locationData, setLocationData] = useState({
    address: formData.address || "",
    latitude: formData.latitude,
    longitude: formData.longitude,
    label: "",
  });

  // At least one link OR location is required
  const hasAtLeastOneLink = useMemo(() => {
    return !!(
      formData.website?.trim() ||
      formData.whatsapp?.trim() ||
      formData.instagram?.trim() ||
      formData.googleReviews?.trim() ||
      locationData.address?.trim()
    );
  }, [formData, locationData]);

  // URL validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    if (formData.website && !isValidUrl(formData.website)) {
      errs.website = "URL invalide";
    }
    if (formData.googleReviews && !isValidUrl(formData.googleReviews)) {
      errs.googleReviews = "URL invalide";
    }
    
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0 && hasAtLeastOneLink;

  const handleChange = (field: keyof DigitalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!hasAtLeastOneLink) {
      toast.error("Ajoutez au moins un lien ou une adresse");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    const digitalInfo: DigitalInfo = {
      website: formData.website ? formatUrl(formData.website) : undefined,
      whatsapp: formData.whatsapp ? formatWhatsApp(formData.whatsapp) : undefined,
      instagram: formData.instagram?.trim() || undefined,
      googleReviews: formData.googleReviews ? formatUrl(formData.googleReviews) : undefined,
      address: locationData.address || undefined,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: formData.city || undefined,
      postalCode: formData.postalCode || undefined,
      country: formData.country || "France",
    };

    setDigitalInfo(digitalInfo);
    nextStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={3} />

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
                Liens digitaux
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Connectez votre présence en ligne
              </motion.p>
            </motion.div>

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-surface-1 border border-border flex items-start gap-3"
            >
              <Info className="h-5 w-5 text-iwasp-vert flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Ajoutez au moins un lien ou une adresse. Ces informations seront accessibles depuis votre carte NFC.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Digital Links Card */}
              <Card className="card-iwasp">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe size={20} className="text-iwasp-vert" />
                    Liens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe size={16} className="text-muted-foreground" />
                      Site web
                    </Label>
                    <Input
                      id="website"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="www.monsite.com"
                      className={errors.website ? "border-destructive" : ""}
                    />
                    {errors.website && (
                      <p className="text-xs text-destructive">{errors.website}</p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-green-500" />
                      WhatsApp
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp || ""}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format international recommandé
                    </p>
                  </div>

                  {/* Instagram */}
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram size={16} className="text-pink-500" />
                      Instagram
                    </Label>
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

                  {/* Google Reviews */}
                  <div className="space-y-2">
                    <Label htmlFor="googleReviews" className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      Google Reviews
                    </Label>
                    <Input
                      id="googleReviews"
                      value={formData.googleReviews || ""}
                      onChange={(e) => handleChange("googleReviews", e.target.value)}
                      placeholder="Lien vers votre fiche Google"
                      className={errors.googleReviews ? "border-destructive" : ""}
                    />
                    {errors.googleReviews && (
                      <p className="text-xs text-destructive">{errors.googleReviews}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Récupérez le lien depuis Google Maps
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card className="card-iwasp">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin size={20} className="text-iwasp-vert" />
                    Géolocalisation
                    {locationData.address && (
                      <CheckCircle2 className="h-5 w-5 text-iwasp-vert ml-auto" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SmartLocationEditor
                    value={locationData}
                    onChange={(data) => setLocationData({
                      address: data.address,
                      latitude: data.latitude ?? 0,
                      longitude: data.longitude ?? 0,
                      label: data.label ?? "",
                    })}
                  />
                  
                  {locationData.address && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-sm text-iwasp-vert"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Localisation enregistrée
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Validation Status */}
              {hasAtLeastOneLink && Object.keys(errors).length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-iwasp-vert/10 border border-iwasp-vert/20"
                >
                  <CheckCircle2 className="h-5 w-5 text-iwasp-vert" />
                  <span className="text-sm font-medium">Prêt à continuer</span>
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
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!isValid}
                className="btn-iwasp px-8"
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

export default function OrderDigital() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderDigitalContent />
    </OrderFunnelGuard>
  );
}
