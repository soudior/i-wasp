/**
 * Step 5: Récapitulatif Final
 * /order/recap
 * 
 * Affichage épuré : Offre, Prix, Quantité, Paiement, Livraison, Carte
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard, OFFERS } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder, OrderItem } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhysicalCardPreview } from "@/components/PhysicalCardPreview";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function OrderRecapContent() {
  const navigate = useNavigate();
  const { state, prevStep, markComplete } = useOrderFunnel();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedOffer = OFFERS.find(o => o.id === state.selectedOffer);

  const formatPrice = (cents: number): string => {
    return `${(cents / 100).toFixed(0)} DH`;
  };

  const handleConfirmOrder = async () => {
    if (isProcessing || state.isTransitioning) return;
    
    setIsProcessing(true);

    try {
      let userId = user?.id;

      // Auto-create account if not logged in
      if (!user && state.digitalIdentity) {
        const { email, firstName, lastName } = state.digitalIdentity;
        const tempPassword = `iwasp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password: tempPassword,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
              }
            }
          });

          if (authError) throw authError;
          if (authData.user) {
            userId = authData.user.id;
          }
        } catch (authError: any) {
          console.error("Auto signup error:", authError);
        }
      }

      // Create order
      const orderItem: OrderItem = {
        id: crypto.randomUUID(),
        templateId: "iwasp-signature",
        templateName: `Carte NFC i-Wasp ${selectedOffer?.name || ""}`,
        cardName: `${state.digitalIdentity?.firstName} ${state.digitalIdentity?.lastName}`,
        quantity: 1,
        unitPriceCents: selectedOffer?.price || 59900,
        logoUrl: null,
      };

      await createOrder.mutateAsync({
        order_items: [orderItem],
        quantity: 1,
        unit_price_cents: selectedOffer?.price || 59900,
        total_price_cents: selectedOffer?.price || 59900,
        order_type: "personalized",
        template: "iwasp-signature",
        card_color: "#0B0B0B",
        logo_url: null,
        currency: "MAD",
        shipping_name: `${state.digitalIdentity?.firstName} ${state.digitalIdentity?.lastName}`,
        shipping_phone: state.shippingInfo?.phone || state.digitalIdentity?.phone,
        shipping_address: state.shippingInfo?.address,
        shipping_city: state.shippingInfo?.city,
        shipping_postal_code: "",
        shipping_country: "MA",
        customer_email: state.digitalIdentity?.email,
        payment_method: "cod",
      });

      markComplete();
      navigate("/order/confirmation");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Erreur lors de la commande. Veuillez réessayer.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-lg mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={5} />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-2"
                variants={itemVariants}
              >
                Récapitulatif
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                variants={itemVariants}
              >
                Vérifiez avant de confirmer
              </motion.p>
            </motion.div>

            {/* Clean Summary Card */}
            <motion.div
              className="bg-secondary/50 rounded-2xl p-6 space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Offre */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Offre</span>
                <span className="font-semibold text-primary">
                  i-Wasp {selectedOffer?.name}
                </span>
              </div>

              {/* Quantité */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantité</span>
                <span className="font-medium">1 carte</span>
              </div>

              {/* Mode de paiement */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Paiement</span>
                <span className="font-medium">À la livraison</span>
              </div>

              {/* Visuel carte */}
              {state.cardPersonalization && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Visuel carte</span>
                  <span className="font-medium capitalize">
                    {state.cardPersonalization.visualType === "logo" ? "Logo" : "Photo"}
                  </span>
                </div>
              )}

              <Separator className="bg-border/50" />

              {/* Adresse de livraison */}
              <div>
                <p className="text-muted-foreground text-sm mb-1">Livraison</p>
                <p className="font-medium">{state.shippingInfo?.address}</p>
                <p className="text-sm text-muted-foreground">
                  {state.shippingInfo?.city}, {state.shippingInfo?.country}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tél: {state.shippingInfo?.phone}
                </p>
              </div>

              <Separator className="bg-border/50" />

              {/* Prix Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold">Total TTC</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(selectedOffer?.price || 0)}
                </span>
              </div>
            </motion.div>

            {/* Physical Card Preview */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <PhysicalCardPreview compact />
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <LoadingButton
                size="xl"
                onClick={handleConfirmOrder}
                isLoading={isProcessing}
                loadingText="Traitement..."
                disabled={state.isTransitioning}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-lg"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Confirmer ma commande
              </LoadingButton>

              <p className="text-xs text-center text-muted-foreground mt-3">
                Règlement en espèces à la réception
              </p>
            </motion.div>

            {/* Back Button */}
            <motion.div 
              className="flex justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={state.isTransitioning || isProcessing}
                className="gap-2 text-muted-foreground"
              >
                <ArrowLeft size={18} />
                Retour
              </Button>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function OrderRecap() {
  return (
    <OrderFunnelGuard step={5}>
      <OrderRecapContent />
    </OrderFunnelGuard>
  );
}
