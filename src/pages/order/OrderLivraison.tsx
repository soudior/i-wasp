/**
 * Step 3: Livraison + Paiement
 * /order/livraison
 * 
 * Champs livraison (NE PAS afficher sur carte digitale):
 * - Type d'adresse (Domicile / Entreprise / Hôtel)
 * - Adresse
 * - Ville
 * - Pays (Maroc par défaut)
 * - Téléphone
 * 
 * Paiement:
 * - Paiement à la livraison (activé)
 * - Carte bancaire (désactivé - "bientôt disponible")
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={3} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm text-primary tracking-widest uppercase mb-3"
                variants={itemVariants}
              >
                Étape 3 sur 5
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Livraison & Paiement
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Où livrer votre carte NFC ?
              </motion.p>
            </motion.div>

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-[#FFC700]/10 border border-[#FFC700]/30 flex items-start gap-3"
            >
              <Info className="h-5 w-5 text-[#FFC700] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
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
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin size={20} className="text-[#FFC700]" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address Type */}
                  <div className="space-y-2">
                    <Label>Type d'adresse</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {addressTypes.map((type) => {
                        const isSelected = formData.addressType === type.id;
                        const Icon = type.icon;
                        
                        return (
                          <button
                            key={type.id}
                            onClick={() => handleChange("addressType", type.id)}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-[#FFC700] bg-[#FFC700]/10"
                                : "border-border hover:border-[#FFC700]/50"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 ${
                              isSelected ? "bg-[#FFC700]" : "bg-muted"
                            }`}>
                              <Icon className={`w-5 h-5 ${isSelected ? "text-black" : "text-muted-foreground"}`} />
                            </div>
                            <span className="text-xs font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      onBlur={() => handleBlur("address")}
                      placeholder="123 Rue Mohammed V, Quartier Maarif"
                      className={touched.address && errors.address ? "border-destructive" : ""}
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
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                      placeholder="Casablanca"
                      className={touched.city && errors.city ? "border-destructive" : ""}
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
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="Maroc"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone de livraison *</Label>
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
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Banknote size={20} className="text-[#FFC700]" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup defaultValue="cod" className="space-y-3">
                    {/* COD - Active */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-[#FFC700] bg-[#FFC700]/5">
                      <RadioGroupItem value="cod" id="cod" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="cod" className="flex items-center gap-2 font-semibold text-base cursor-pointer">
                          <Banknote className="h-5 w-5 text-green-600" />
                          Paiement à la livraison
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Payez en espèces à la réception de votre carte 🇲🇦
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            Pas de paiement maintenant
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3 text-[#FFC700]" />
                            Livraison 48h-72h
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-[#FFC700]" />
                    </div>

                    {/* Card - Disabled */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30 opacity-60">
                      <RadioGroupItem value="card" id="card" disabled className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="card" className="flex items-center gap-2 font-semibold text-base text-muted-foreground">
                          <CreditCard className="h-5 w-5" />
                          Carte bancaire
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Paiement par carte bientôt disponible
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
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
                className="px-8 rounded-full bg-[#FFC700] hover:bg-[#FFC700]/90 text-black font-semibold disabled:opacity-50"
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
    <OrderFunnelGuard step={3}>
      <OrderLivraisonContent />
    </OrderFunnelGuard>
  );
}
