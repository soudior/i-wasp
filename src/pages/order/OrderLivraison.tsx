/**
 * Step 4: Livraison + Paiement
 * /order/livraison
 * 
 * IWASP Cupertino Style
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, ShippingInfo, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

// IWASP Cupertino Palette
const CUPERTINO = {
  bg: "#F5F5F7",
  card: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#8E8E93",
  accent: "#007AFF",
};

const addressTypes = [
  { id: "domicile" as const, icon: Home, label: "Domicile" },
  { id: "entreprise" as const, icon: Building, label: "Entreprise" },
  { id: "hotel" as const, icon: Hotel, label: "Hôtel" },
];

function OrderLivraisonContent() {
  const { state, setShippingInfo, setPaymentInfo, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);

  const [formData, setFormData] = useState<ShippingInfo>(
    state.shippingInfo || {
      addressType: "domicile",
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: CUPERTINO.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={4} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: CUPERTINO.accent }}
                variants={itemVariants}
              >
                Étape 4 sur 6
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                style={{ color: CUPERTINO.text }}
                variants={itemVariants}
              >
                Livraison & Paiement
              </motion.h1>
              <motion.p 
                className="text-lg"
                style={{ color: CUPERTINO.textSecondary }}
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
                backgroundColor: `${CUPERTINO.accent}10`, 
                border: `1px solid ${CUPERTINO.accent}30` 
              }}
            >
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: CUPERTINO.accent }} />
              <p className="text-sm" style={{ color: CUPERTINO.textSecondary }}>
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
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: CUPERTINO.card }}
              >
                <div className="flex items-center gap-2 text-lg font-semibold mb-4" style={{ color: CUPERTINO.text }}>
                  <MapPin size={20} style={{ color: CUPERTINO.accent }} />
                  Adresse de livraison
                </div>
                <div className="space-y-4">
                  {/* Address Type */}
                  <div className="space-y-2">
                    <Label style={{ color: CUPERTINO.text }}>Type d'adresse</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {addressTypes.map((type) => {
                        const isSelected = formData.addressType === type.id;
                        const Icon = type.icon;
                        
                        return (
                          <button
                            key={type.id}
                            onClick={() => handleChange("addressType", type.id)}
                            className="flex flex-col items-center p-3 rounded-2xl border-2 transition-all"
                            style={{
                              borderColor: isSelected ? CUPERTINO.accent : '#E5E5EA',
                              backgroundColor: isSelected ? `${CUPERTINO.accent}10` : CUPERTINO.card,
                            }}
                          >
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                              style={{ 
                                backgroundColor: isSelected ? CUPERTINO.accent : '#F2F2F7'
                              }}
                            >
                              <Icon 
                                className="w-5 h-5" 
                                style={{ color: isSelected ? '#FFFFFF' : CUPERTINO.textSecondary }} 
                              />
                            </div>
                            <span className="text-xs font-medium" style={{ color: CUPERTINO.text }}>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" style={{ color: CUPERTINO.text }}>Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      onBlur={() => handleBlur("address")}
                      placeholder="123 Rue Mohammed V, Quartier Maarif"
                      className={`rounded-xl ${touched.address && errors.address ? "border-destructive" : ""}`}
                    />
                    {touched.address && errors.address && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city" style={{ color: CUPERTINO.text }}>Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                      placeholder="Casablanca"
                      className={`rounded-xl ${touched.city && errors.city ? "border-destructive" : ""}`}
                    />
                    {touched.city && errors.city && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country" style={{ color: CUPERTINO.text }}>Pays</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="Maroc"
                      className="rounded-xl"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" style={{ color: CUPERTINO.text }}>Téléphone de livraison *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+212 6 12 34 56 78"
                      className={`rounded-xl ${touched.phone && errors.phone ? "border-destructive" : ""}`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div 
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: CUPERTINO.card }}
              >
                <div className="flex items-center gap-2 text-lg font-semibold mb-4" style={{ color: CUPERTINO.text }}>
                  <Banknote size={20} style={{ color: CUPERTINO.accent }} />
                  Mode de paiement
                </div>
                <div className="space-y-4">
                  <RadioGroup defaultValue="cod" className="space-y-3">
                    {/* COD - Active */}
                    <div 
                      className="flex items-start gap-4 p-4 rounded-2xl border-2"
                      style={{ 
                        borderColor: CUPERTINO.accent, 
                        backgroundColor: `${CUPERTINO.accent}05` 
                      }}
                    >
                      <RadioGroupItem value="cod" id="cod" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="cod" className="flex items-center gap-2 font-semibold text-base cursor-pointer" style={{ color: CUPERTINO.text }}>
                          <Banknote className="h-5 w-5 text-green-600" />
                          Paiement à la livraison
                        </Label>
                        <p className="text-sm mt-1" style={{ color: CUPERTINO.textSecondary }}>
                          Payez en espèces à la réception de votre carte 🇲🇦
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: CUPERTINO.textSecondary }}>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            Pas de paiement maintenant
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3" style={{ color: CUPERTINO.accent }} />
                            Livraison 48h-72h
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5" style={{ color: CUPERTINO.accent }} />
                    </div>

                    {/* Card - Disabled with "Coming soon" message */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl border opacity-60" style={{ backgroundColor: '#F2F2F7' }}>
                      <RadioGroupItem value="card" id="card" disabled className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="card" className="flex items-center gap-2 font-semibold text-base" style={{ color: CUPERTINO.textSecondary }}>
                          <CreditCard className="h-5 w-5" />
                          Carte bancaire
                          <span 
                            className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: `${CUPERTINO.accent}20`, color: CUPERTINO.accent }}
                          >
                            Bientôt
                          </span>
                        </Label>
                        <p className="text-sm mt-1" style={{ color: CUPERTINO.textSecondary }}>
                          Paiement en ligne bientôt disponible
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {/* Online payment notice */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#F2F2F7' }}>
                    <Info className="h-4 w-4 flex-shrink-0" style={{ color: CUPERTINO.accent }} />
                    <p className="text-xs" style={{ color: CUPERTINO.textSecondary }}>
                      <span className="font-medium" style={{ color: CUPERTINO.accent }}>Paiement en ligne bientôt disponible.</span>
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
                  className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Adresse de livraison complète</span>
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
                style={{ color: CUPERTINO.textSecondary }}
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
                className="px-8 rounded-full font-semibold disabled:opacity-50 text-white"
                style={{ backgroundColor: CUPERTINO.accent }}
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
    <OrderFunnelGuard step={4}>
      <OrderLivraisonContent />
    </OrderFunnelGuard>
  );
}
