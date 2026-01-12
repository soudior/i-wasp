/**
 * Step 4: Livraison + Paiement
 * /order/livraison
 * 
 * IWASP Stealth Luxury Style
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, ShippingInfo, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { STEALTH } from "@/lib/stealthPalette";
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Home,
  Building,
  Hotel,
  Banknote,
  CreditCard,
  CheckCircle2,
  Truck,
  AlertCircle,
  Info
} from "lucide-react";
import { toast } from "sonner";

// Address types based on client type
const ADDRESS_TYPES_BY_CLIENT = {
  particulier: [
    { id: "domicile" as const, icon: Home, label: "Domicile" },
    { id: "hotel" as const, icon: Hotel, label: "Hôtel" },
  ],
  independant: [
    { id: "domicile" as const, icon: Home, label: "Domicile" },
    { id: "entreprise" as const, icon: Building, label: "Bureau" },
    { id: "hotel" as const, icon: Hotel, label: "Hôtel" },
  ],
  entreprise: [
    { id: "entreprise" as const, icon: Building, label: "Siège social" },
    { id: "domicile" as const, icon: Home, label: "Autre adresse" },
  ],
};

// Delivery options based on client type
const DELIVERY_OPTIONS = {
  particulier: [
    { id: "standard", label: "Livraison standard", delay: "48h-72h", price: 0 },
  ],
  independant: [
    { id: "standard", label: "Livraison standard", delay: "48h-72h", price: 0 },
    { id: "express", label: "Livraison express", delay: "24h", price: 30, badge: "Rapide" },
  ],
  entreprise: [
    { id: "standard", label: "Livraison standard", delay: "48h-72h", price: 0 },
    { id: "express", label: "Livraison express", delay: "24h", price: 30, badge: "Rapide" },
    { id: "premium", label: "Livraison premium", delay: "Même jour (Casablanca)", price: 80, badge: "VIP" },
  ],
};

function OrderLivraisonContent() {
  const { state, setShippingInfo, setPaymentInfo, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Get client type and corresponding options
  const clientType = state.digitalIdentity?.clientType || "particulier";
  const addressTypes = ADDRESS_TYPES_BY_CLIENT[clientType];
  const deliveryOptions = DELIVERY_OPTIONS[clientType];
  
  // Selected delivery option
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id);

  const [formData, setFormData] = useState<ShippingInfo>(
    state.shippingInfo || {
      addressType: addressTypes[0].id,
      address: "",
      city: "",
      country: "Maroc",
      phone: "",
    }
  );

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    if (!formData.address.trim()) errs.address = "Adresse requise";
    if (!formData.city.trim()) errs.city = "Ville requise";
    if (!formData.phone.trim()) errs.phone = "Téléphone requis";
    
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    
    if (!isValid) {
      setTouched({
        address: true,
        city: true,
        phone: true,
      });
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsNavigating(true);

    // Normalize data
    const normalizedData: ShippingInfo = {
      addressType: formData.addressType,
      address: formData.address.trim(),
      city: formData.city.trim(),
      country: formData.country.trim() || "Maroc",
      phone: formData.phone.trim(),
    };

    setShippingInfo(normalizedData);
    setPaymentInfo({ method: "cod" }); // Only COD for now
    await nextStep();
  };

  // Input styles for dark theme
  const inputStyles = {
    backgroundColor: STEALTH.bgInput,
    borderColor: STEALTH.border,
    color: STEALTH.text,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={5} />

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
                Étape 5 sur 7
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Livraison & Paiement
              </motion.h1>
              <motion.p 
                className="text-lg"
                style={{ color: STEALTH.textSecondary }}
                variants={itemVariants}
              >
                Où livrer votre carte NFC ?
              </motion.p>
            </motion.div>

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl flex items-start gap-3"
              style={{ 
                backgroundColor: STEALTH.accentMuted, 
                border: `1px solid ${STEALTH.borderActive}` 
              }}
            >
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: STEALTH.accent }} />
              <p className="text-sm" style={{ color: STEALTH.textSecondary }}>
                Ces informations servent uniquement à la livraison. Elles n'apparaîtront pas sur votre carte digitale.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Shipping Address */}
              <div 
                className="rounded-3xl p-6"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                  style={{ color: STEALTH.text }}
                >
                  <MapPin size={20} style={{ color: STEALTH.accent }} />
                  Adresse de livraison
                </div>
                <div className="space-y-4">
                  {/* Address Type */}
                  <div className="space-y-2">
                    <Label style={{ color: STEALTH.text }}>Type d'adresse</Label>
                    <div className={`grid gap-3 ${addressTypes.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      {addressTypes.map((type) => {
                        const isSelected = formData.addressType === type.id;
                        const Icon = type.icon;
                        
                        return (
                          <button
                            key={type.id}
                            onClick={() => handleChange("addressType", type.id)}
                            className="flex flex-col items-center p-3 rounded-2xl border-2 transition-all"
                            style={{
                              borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                              backgroundColor: isSelected ? STEALTH.accentMuted : STEALTH.bgCard,
                            }}
                          >
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                              style={{ 
                                backgroundColor: isSelected ? STEALTH.accent : STEALTH.bgInput
                              }}
                            >
                              <Icon 
                                className="w-5 h-5" 
                                style={{ color: isSelected ? STEALTH.bg : STEALTH.textSecondary }} 
                              />
                            </div>
                            <span 
                              className="text-xs font-medium"
                              style={{ color: STEALTH.text }}
                            >
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" style={{ color: STEALTH.text }}>Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      onBlur={() => handleBlur("address")}
                      placeholder="123 Rue Mohammed V, Quartier Maarif"
                      className="rounded-xl"
                      style={inputStyles}
                    />
                    {touched.address && errors.address && (
                      <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.error }}>
                        <AlertCircle size={12} />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city" style={{ color: STEALTH.text }}>Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                      placeholder="Casablanca"
                      className="rounded-xl"
                      style={inputStyles}
                    />
                    {touched.city && errors.city && (
                      <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.error }}>
                        <AlertCircle size={12} />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country" style={{ color: STEALTH.text }}>Pays</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="Maroc"
                      className="rounded-xl"
                      style={inputStyles}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" style={{ color: STEALTH.text }}>Téléphone de livraison *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+212 6 12 34 56 78"
                      className="rounded-xl"
                      style={inputStyles}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.error }}>
                        <AlertCircle size={12} />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Options - Conditional based on client type */}
              {deliveryOptions.length > 1 && (
                <div 
                  className="rounded-3xl p-6"
                  style={{ 
                    backgroundColor: STEALTH.bgCard,
                    border: `1px solid ${STEALTH.border}`
                  }}
                >
                  <div 
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                    style={{ color: STEALTH.text }}
                  >
                    <Truck size={20} style={{ color: STEALTH.accent }} />
                    Mode de livraison
                    {clientType !== "particulier" && (
                      <span 
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: STEALTH.accentMuted, 
                          color: STEALTH.accent 
                        }}
                      >
                        {clientType === "entreprise" ? "Options B2B" : "Options Pro"}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {deliveryOptions.map((option) => {
                      const isSelected = selectedDelivery === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setSelectedDelivery(option.id)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
                          style={{
                            borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                            backgroundColor: isSelected ? STEALTH.accentMuted : STEALTH.bgCard,
                          }}
                        >
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: isSelected ? STEALTH.accent : STEALTH.bgInput
                            }}
                          >
                            <Truck 
                              className="w-5 h-5" 
                              style={{ color: isSelected ? STEALTH.bg : STEALTH.textSecondary }} 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span 
                                className="font-semibold"
                                style={{ color: STEALTH.text }}
                              >
                                {option.label}
                              </span>
                              {option.badge && (
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ 
                                    backgroundColor: STEALTH.accentMuted, 
                                    color: STEALTH.accent 
                                  }}
                                >
                                  {option.badge}
                                </span>
                              )}
                            </div>
                            <span 
                              className="text-sm"
                              style={{ color: STEALTH.textSecondary }}
                            >
                              Délai: {option.delay}
                            </span>
                          </div>
                          <div className="text-right">
                            {option.price === 0 ? (
                              <span 
                                className="text-sm font-medium"
                                style={{ color: STEALTH.success }}
                              >
                                Gratuit
                              </span>
                            ) : (
                              <span 
                                className="text-sm font-medium"
                                style={{ color: STEALTH.text }}
                              >
                                +{option.price} MAD
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: STEALTH.accent }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div 
                className="rounded-3xl p-6"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                  style={{ color: STEALTH.text }}
                >
                  <Banknote size={20} style={{ color: STEALTH.accent }} />
                  Mode de paiement
                </div>
                <div className="space-y-4">
                  <RadioGroup defaultValue="cod" className="space-y-3">
                    {/* COD - Active */}
                    <div 
                      className="flex items-start gap-4 p-4 rounded-2xl border-2"
                      style={{ 
                        borderColor: STEALTH.accent, 
                        backgroundColor: STEALTH.accentMuted 
                      }}
                    >
                      <RadioGroupItem value="cod" id="cod" className="mt-1" />
                      <div className="flex-1">
                        <Label 
                          htmlFor="cod" 
                          className="flex items-center gap-2 font-semibold text-base cursor-pointer"
                          style={{ color: STEALTH.text }}
                        >
                          <Banknote className="h-5 w-5" style={{ color: STEALTH.success }} />
                          Paiement à la livraison
                        </Label>
                        <p className="text-sm mt-1" style={{ color: STEALTH.textSecondary }}>
                          Payez en espèces à la réception de votre carte 🇲🇦
                        </p>
                        <div 
                          className="flex items-center gap-4 mt-2 text-xs"
                          style={{ color: STEALTH.textSecondary }}
                        >
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" style={{ color: STEALTH.success }} />
                            Pas de paiement maintenant
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" style={{ color: STEALTH.accent }} />
                            Livraison 48h-72h
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5" style={{ color: STEALTH.accent }} />
                    </div>

                    {/* Card - Disabled with "Coming soon" message */}
                    <div 
                      className="flex items-start gap-4 p-4 rounded-2xl border opacity-60"
                      style={{ 
                        backgroundColor: STEALTH.bgInput,
                        borderColor: STEALTH.border
                      }}
                    >
                      <RadioGroupItem value="card" id="card" disabled className="mt-1" />
                      <div className="flex-1">
                        <Label 
                          htmlFor="card" 
                          className="flex items-center gap-2 font-semibold text-base"
                          style={{ color: STEALTH.textSecondary }}
                        >
                          <CreditCard className="h-5 w-5" />
                          Carte bancaire
                          <span 
                            className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ 
                              backgroundColor: STEALTH.accentMuted, 
                              color: STEALTH.accent 
                            }}
                          >
                            Bientôt
                          </span>
                        </Label>
                        <p className="text-sm mt-1" style={{ color: STEALTH.textMuted }}>
                          Paiement en ligne bientôt disponible
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {/* Online payment notice */}
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: STEALTH.bgInput }}
                  >
                    <Info className="h-4 w-4 flex-shrink-0" style={{ color: STEALTH.accent }} />
                    <p className="text-xs" style={{ color: STEALTH.textSecondary }}>
                      <span className="font-medium" style={{ color: STEALTH.accent }}>
                        Paiement en ligne bientôt disponible.
                      </span>
                      {" "}Pour l'instant, payez à la livraison.
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Status */}
              {isValid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 rounded-xl"
                  style={{ 
                    backgroundColor: STEALTH.successBg,
                    border: `1px solid ${STEALTH.success}30`
                  }}
                >
                  <CheckCircle2 className="h-5 w-5" style={{ color: STEALTH.success }} />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: STEALTH.success }}
                  >
                    Adresse de livraison complète
                  </span>
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
                disabled={state.isTransitioning}
                className="gap-2"
                style={{ color: STEALTH.textSecondary }}
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

export default function OrderLivraison() {
  return (
    <OrderFunnelGuard step={5}>
      <OrderLivraisonContent />
    </OrderFunnelGuard>
  );
}
