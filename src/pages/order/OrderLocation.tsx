/**
 * Step 3: Location
 * /order/location
 * 
 * VALIDATION INFAILLIBLE:
 * - Localisation obligatoire (géoloc, carte ou manuel)
 * - Adresse de livraison complète requise
 * - Bouton désactivé tant que tout n'est pas rempli
 * - Messages clairs et guidage utilisateur
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, LocationInfo } from "@/contexts/OrderFunnelContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmartLocationEditor } from "@/components/SmartLocationEditor";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, MapPin, Home, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { validateLocation } from "@/lib/orderValidation";

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

  // Combine data for validation
  const fullLocationData = useMemo(() => ({
    ...locationData,
    ...deliveryAddress,
  }), [locationData, deliveryAddress]);

  // Real-time validation
  const validation = useMemo(() => {
    return validateLocation(fullLocationData);
  }, [fullLocationData]);

  // Validation items for summary
  const validationItems = useMemo(() => [
    {
      key: "address",
      label: "Adresse de l'établissement",
      isValid: !!locationData.address.trim(),
      message: "Sélectionnez une adresse sur la carte",
    },
    {
      key: "postalCode",
      label: "Code postal de livraison",
      isValid: !!deliveryAddress.postalCode.trim(),
      message: "Ajoutez le code postal",
    },
    {
      key: "city",
      label: "Ville de livraison",
      isValid: !!deliveryAddress.city.trim(),
      message: "Ajoutez la ville",
    },
  ], [locationData.address, deliveryAddress.postalCode, deliveryAddress.city]);

  // Can proceed?
  const canProceed = validation.isValid;
  const blockingMessage = !canProceed
    ? validationItems.find(i => !i.isValid)?.message
    : undefined;

  const handleContinue = () => {
    if (!canProceed) {
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
  const hasCoordinates = locationData.latitude && locationData.longitude;

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

            {/* Validation Summary */}
            <AnimatePresence>
              {!canProceed && (locationData.address || deliveryAddress.city) && (
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
              {/* Smart Location Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin size={20} className="text-primary" />
                    Adresse de votre établissement
                    {hasLocation && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SmartLocationEditor
                    value={locationData}
                    onChange={setLocationData}
                  />
                  
                  {/* Location status */}
                  {hasLocation && hasCoordinates && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Localisation précise enregistrée
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Home size={20} className="text-primary" />
                    Adresse de livraison
                    {deliveryAddress.city && deliveryAddress.postalCode && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Où souhaitez-vous recevoir votre carte NFC ?
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <SmartInput
                      id="postalCode"
                      label="Code postal"
                      value={deliveryAddress.postalCode}
                      onChange={(value) => setDeliveryAddress(prev => ({ ...prev, postalCode: value }))}
                      validate={(value) => ({
                        isValid: value.trim().length > 0,
                        message: value.trim().length === 0 ? "Requis" : undefined,
                      })}
                      required
                      placeholder="75001"
                    />
                    <SmartInput
                      id="city"
                      label="Ville"
                      value={deliveryAddress.city}
                      onChange={(value) => setDeliveryAddress(prev => ({ ...prev, city: value }))}
                      validate={(value) => ({
                        isValid: value.trim().length > 0,
                        message: value.trim().length === 0 ? "Requis" : undefined,
                      })}
                      required
                      placeholder="Paris"
                    />
                  </div>

                  <SmartInput
                    id="country"
                    label="Pays"
                    value={deliveryAddress.country}
                    onChange={(value) => setDeliveryAddress(prev => ({ ...prev, country: value }))}
                    placeholder="France"
                  />
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

export default function OrderLocation() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderLocationContent />
    </OrderFunnelGuard>
  );
}
