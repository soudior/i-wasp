/**
 * Step 2: Quantity Selection
 * /order/quantity
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  OrderProgressBar, 
  PageTransition,
  contentVariants,
  itemVariants 
} from "@/components/order";
import { formatPrice, calculateB2BPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Minus, Plus, Check, Percent } from "lucide-react";

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

// Discount tiers for enterprise
const DISCOUNT_TIERS = [
  { min: 10, discount: 15 },
  { min: 25, discount: 20 },
  { min: 50, discount: 25 },
  { min: 100, discount: 30 },
];

function getDiscount(quantity: number): number {
  for (let i = DISCOUNT_TIERS.length - 1; i >= 0; i--) {
    if (quantity >= DISCOUNT_TIERS[i].min) {
      return DISCOUNT_TIERS[i].discount;
    }
  }
  return 0;
}

function OrderQuantityContent() {
  const { state, setQuantity, nextStep, prevStep } = useOrderFunnel();
  
  const [selectedQuantity, setSelectedQuantity] = useState(state.quantity || 1);

  // Get quantity options based on customer type
  const quantityOptions = QUANTITY_OPTIONS[state.customerType || "particulier"];
  const minQuantity = quantityOptions[0];

  // Initialize with first valid quantity for customer type
  useEffect(() => {
    if (!quantityOptions.includes(selectedQuantity) && selectedQuantity < minQuantity) {
      setSelectedQuantity(minQuantity);
    }
  }, [quantityOptions, selectedQuantity, minQuantity]);

  const basePrice = BASE_PRICES[state.customerType || "particulier"];
  const isEnterprise = state.customerType === "entreprise";
  const discount = isEnterprise ? getDiscount(selectedQuantity) : 0;
  const unitPrice = isEnterprise ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
  const totalPrice = unitPrice * selectedQuantity;

  const handleContinue = () => {
    setQuantity(selectedQuantity);
    nextStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-3xl mx-auto">
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
                Combien de cartes ?
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                {isEnterprise ? "Prix dégressifs automatiques" : "Sélectionnez votre quantité"}
              </motion.p>
            </motion.div>

          {/* Quantity Grid */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {quantityOptions.map((qty, index) => {
              const qtyDiscount = isEnterprise ? getDiscount(qty) : 0;
              const qtyUnitPrice = isEnterprise ? Math.round(basePrice * (1 - qtyDiscount / 100)) : basePrice;
              
              return (
                <motion.button
                  key={qty}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedQuantity(qty)}
                  className={`relative p-6 rounded-2xl border-2 text-center transition-all duration-300 hover:scale-[1.02] ${
                    selectedQuantity === qty
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  {selectedQuantity === qty && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check size={14} className="text-primary-foreground" />
                    </motion.div>
                  )}
                  
                  {qtyDiscount > 0 && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Percent size={10} />
                      -{qtyDiscount}%
                    </div>
                  )}
                  
                  <p className="text-4xl font-bold mb-2">{qty}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    carte{qty > 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(qtyUnitPrice)}/carte
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: {formatPrice(qtyUnitPrice * qty)}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Custom quantity for enterprise */}
          {isEnterprise && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="mb-8">
                <CardContent className="p-6">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Quantité personnalisée (minimum 10)
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => setSelectedQuantity(Math.max(minQuantity, selectedQuantity - 10))}
                      disabled={selectedQuantity <= minQuantity}
                    >
                      <Minus size={20} />
                    </Button>
                    <span className="text-4xl font-bold w-24 text-center">{selectedQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => setSelectedQuantity(selectedQuantity + 10)}
                    >
                      <Plus size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Price Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-primary/5 border-primary/20 mb-10">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total estimé</p>
                    <p className="text-3xl font-bold">{formatPrice(totalPrice)}</p>
                    {selectedQuantity > 1 && (
                      <p className="text-sm text-muted-foreground">
                        soit {formatPrice(unitPrice)}/carte
                      </p>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="text-right">
                      <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                        -{discount}% de réduction
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Économie: {formatPrice((basePrice - unitPrice) * selectedQuantity)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation */}
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ArrowLeft size={18} />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              className="px-8 h-14 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
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

export default function OrderQuantity() {
  return (
    <OrderFunnelGuard step={2}>
      <OrderQuantityContent />
    </OrderFunnelGuard>
  );
}
