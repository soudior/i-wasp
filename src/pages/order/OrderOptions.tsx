/**
 * Step 4: Order Options
 * /order/options
 * 
 * - Quantity selection
 * - Promo code
 * - Price calculation
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
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
import { formatPrice, calculateB2BPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Minus, 
  Plus,
  Tag
} from "lucide-react";
import { toast } from "sonner";

// Options form data for auto-save
interface OptionsFormData {
  quantity: number;
  promoCode: string;
  appliedPromo: { code: string; discount: number } | null;
}

// Base prices per customer type (in cents)
const BASE_PRICES = {
  particulier: 2900,  // 29€
  professionnel: 4400, // 44€
  entreprise: 2900,   // 29€ (prix dégressif)
};

// Quantity options par type de client
const QUANTITY_OPTIONS = {
  particulier: [1, 2],
  professionnel: [1, 2, 5],
  entreprise: [10, 20, 50, 100],
};

// Promo codes
const PROMO_CODES: Record<string, number> = {
  "IWASP10": 10,
  "WELCOME20": 20,
  "VIP30": 30,
};

function OrderOptionsContent() {
  const { state, setOrderOptions, nextStep, prevStep } = useOrderFunnel();
  
  const [quantity, setQuantity] = useState(state.orderOptions?.quantity || 1);
  const [promoCode, setPromoCode] = useState(state.orderOptions?.promoCode || "");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(
    state.orderOptions?.promoCode && state.orderOptions?.promoDiscount
      ? { code: state.orderOptions.promoCode, discount: state.orderOptions.promoDiscount }
      : null
  );
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);

  // Get quantity options based on customer type
  const quantityOptions = QUANTITY_OPTIONS[state.customerType || "particulier"];
  const minQuantity = quantityOptions[0];
  const maxQuantity = quantityOptions[quantityOptions.length - 1];

  // Memoize form data for auto-save
  const formData = useMemo<OptionsFormData>(() => ({
    quantity,
    promoCode,
    appliedPromo,
  }), [quantity, promoCode, appliedPromo]);

  // Auto-save hook
  const { 
    status: saveStatus, 
    lastSaved, 
    hasSavedData, 
    getSavedData, 
    clearSaved 
  } = useAutoSave<OptionsFormData>({
    key: "order_options",
    data: formData,
    enabled: true,
  });

  // Check for saved draft on mount
  useEffect(() => {
    if (!state.orderOptions && hasSavedData()) {
      setShowRestoreBanner(true);
    }
  }, [state.orderOptions, hasSavedData]);

  const handleRestoreDraft = () => {
    const savedData = getSavedData();
    if (savedData) {
      setQuantity(savedData.quantity);
      setPromoCode(savedData.promoCode);
      setAppliedPromo(savedData.appliedPromo);
      toast.success("Brouillon restauré");
    }
    setShowRestoreBanner(false);
  };

  const handleDismissDraft = () => {
    clearSaved();
    setShowRestoreBanner(false);
  };

  useEffect(() => {
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
    }
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [minQuantity, maxQuantity, quantity]);

  // Get base price for customer type
  const baseUnitPrice = BASE_PRICES[state.customerType || "particulier"];

  // Calculate total price
  const calculateTotalPrice = () => {
    let unitPrice = baseUnitPrice;
    
    // Apply B2B pricing for quantity orders
    if (state.customerType === "entreprise" || state.customerType === "professionnel") {
      const b2bPrice = calculateB2BPrice(quantity);
      unitPrice = Math.min(unitPrice, b2bPrice);
    }
    
    let total = unitPrice * quantity;
    
    // Apply promo discount
    if (appliedPromo) {
      total = total * (1 - appliedPromo.discount / 100);
    }
    
    return Math.round(total);
  };

  const getUnitPrice = () => {
    let unitPrice = baseUnitPrice;
    if (state.customerType === "entreprise" || state.customerType === "professionnel") {
      const b2bPrice = calculateB2BPrice(quantity);
      unitPrice = Math.min(unitPrice, b2bPrice);
    }
    return unitPrice;
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, discount: PROMO_CODES[code] });
      toast.success(`Code promo appliqué : -${PROMO_CODES[code]}%`);
    } else {
      toast.error("Code promo invalide");
    }
  };

  const handleContinue = () => {
    const unitPrice = getUnitPrice();
    const totalPrice = calculateTotalPrice();

    setOrderOptions({
      quantity,
      unitPriceCents: unitPrice,
      totalPriceCents: totalPrice,
      promoCode: appliedPromo?.code,
      promoDiscount: appliedPromo?.discount,
    });

    clearSaved(); // Clear draft on successful submit
    nextStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={4} />

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
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Options de commande
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Choisissez la quantité et appliquez un code promo
              </motion.p>
              {/* Auto-save indicator */}
              <motion.div 
                className="flex justify-center mt-2"
                variants={itemVariants}
              >
                <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
              </motion.div>
            </motion.div>

          {/* Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quantity */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-medium mb-4 block">Quantité de cartes</Label>
                
                {/* Quick quantity buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {quantityOptions.map((q) => (
                    <Button
                      key={q}
                      variant={quantity === q ? "default" : "outline"}
                      size="lg"
                      className="min-w-[60px]"
                      onClick={() => setQuantity(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>

                {/* Custom quantity input for enterprise */}
                {state.customerType === "entreprise" && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Label className="text-sm text-muted-foreground">Quantité personnalisée :</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(minQuantity, quantity - 10))}
                        disabled={quantity <= minQuantity}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 10)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center mt-4">
                  {state.customerType === "entreprise" && "Minimum 10 cartes • Prix dégressifs automatiques"}
                  {state.customerType === "professionnel" && "1 à 5 cartes pour les professionnels"}
                  {state.customerType === "particulier" && "1 à 2 cartes pour les particuliers"}
                </p>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-medium mb-4 block">Code promo</Label>
                <div className="flex gap-3">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Entrez votre code"
                    className="flex-1 h-12"
                    disabled={!!appliedPromo}
                  />
                  {appliedPromo ? (
                    <Button
                      variant="outline"
                      className="h-12"
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoCode("");
                      }}
                    >
                      Retirer
                    </Button>
                  ) : (
                    <Button 
                      className="h-12" 
                      onClick={handleApplyPromo} 
                      disabled={!promoCode.trim()}
                    >
                      Appliquer
                    </Button>
                  )}
                </div>
                {appliedPromo && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                    <Tag size={16} />
                    Code {appliedPromo.code} : -{appliedPromo.discount}% appliqué
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Prix unitaire</span>
                    <span>{formatPrice(getUnitPrice())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Quantité</span>
                    <span>× {quantity}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction ({appliedPromo.code})</span>
                      <span>-{appliedPromo.discount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Livraison</span>
                    <span className="text-green-600 font-medium">Gratuite</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total TTC</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold">{formatPrice(calculateTotalPrice())}</span>
                        {quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            soit {formatPrice(Math.round(calculateTotalPrice() / quantity))}/carte
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              Voir le récapitulatif
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

export default function OrderOptions() {
  return (
    <OrderFunnelGuard step={4}>
      <OrderOptionsContent />
    </OrderFunnelGuard>
  );
}
