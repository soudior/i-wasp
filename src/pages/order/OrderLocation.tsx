/**
 * Step 3: Location
 * /order/location
 * 
 * - Auto geolocation button
 * - Interactive map picker (OpenStreetMap)
 * - Manual point selection
 * - Reverse geocoding
 * - Custom label
 * - Mandatory validation
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, LocationInfo } from "@/contexts/OrderFunnelContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartLocationEditor } from "@/components/SmartLocationEditor";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, MapPin, Home, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
  label?: string;
}

function OrderLocationContent() {
  const { state, setLocationInfo, nextStep, prevStep } = useOrderFunnel();

  const [locationData, setLocationData] = useState<LocationData>(
    state.locationInfo ? {
      address: state.locationInfo.address,
      latitude: state.locationInfo.latitude,
      longitude: state.locationInfo.longitude,
      label: state.locationInfo.label,
    } : {
      address: "",
      latitude: undefined,
      longitude: undefined,
      label: "",
    }
  );

  const [deliveryAddress, setDeliveryAddress] = useState({
    city: state.locationInfo?.city || "",
    postalCode: state.locationInfo?.postalCode || "",
    country: state.locationInfo?.country || "France",
  });

  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save hook
  const { 
    status: saveStatus, 
    lastSaved, 
    hasSavedData, 
    getSavedData, 
    clearSaved 
  } = useAutoSave<{ locationData: LocationData; deliveryAddress: typeof deliveryAddress }>({
    key: "order_location",
    data: { locationData, deliveryAddress },
    enabled: true,
  });

  // Check for saved draft on mount
  useEffect(() => {
    if (!state.locationInfo && hasSavedData()) {
      setShowRestoreBanner(true);
    }
  }, [state.locationInfo, hasSavedData]);

  const handleRestoreDraft = () => {
    const savedData = getSavedData();
    if (savedData) {
      setLocationData(savedData.locationData);
      setDeliveryAddress(savedData.deliveryAddress);
      toast.success("Brouillon restauré");
    }
    setShowRestoreBanner(false);
  };

  const handleDismissDraft = () => {
    clearSaved();
    setShowRestoreBanner(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!locationData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (!deliveryAddress.city.trim()) {
      newErrors.city = "La ville est requise";
    }

    if (!deliveryAddress.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      toast.error("Veuillez renseigner votre adresse complète");
      return;
    }

    setLocationInfo({
      address: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      label: locationData.label,
      city: deliveryAddress.city,
      postalCode: deliveryAddress.postalCode,
      country: deliveryAddress.country,
    });

    clearSaved();
    nextStep();
  };

  const hasLocation = locationData.address.trim() !== "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={3} />

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
                <MapPin className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  Localisation
                </h1>
              </motion.div>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Définissez l'adresse affichée sur votre carte NFC
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
              {/* Smart Location Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin size={20} className="text-primary" />
                    Adresse de votre établissement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SmartLocationEditor
                    value={locationData}
                    onChange={setLocationData}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive mt-2">{errors.address}</p>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Home size={20} className="text-primary" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Où souhaitez-vous recevoir votre carte NFC ?
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={deliveryAddress.postalCode}
                        onChange={(e) => {
                          setDeliveryAddress(prev => ({ ...prev, postalCode: e.target.value }));
                          if (errors.postalCode) {
                            setErrors(prev => ({ ...prev, postalCode: "" }));
                          }
                        }}
                        placeholder="75001"
                        className={errors.postalCode ? "border-destructive" : ""}
                      />
                      {errors.postalCode && (
                        <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={deliveryAddress.city}
                        onChange={(e) => {
                          setDeliveryAddress(prev => ({ ...prev, city: e.target.value }));
                          if (errors.city) {
                            setErrors(prev => ({ ...prev, city: "" }));
                          }
                        }}
                        placeholder="Paris"
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive mt-1">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={deliveryAddress.country}
                      onChange={(e) => setDeliveryAddress(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="France"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              {!hasLocation && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    Utilisez le bouton "Ma position" ou "Choisir sur la carte" pour définir votre adresse.
                  </AlertDescription>
                </Alert>
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

export default function OrderLocation() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderLocationContent />
    </OrderFunnelGuard>
  );
}
