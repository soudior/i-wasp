/**
 * Step 4: Récapitulatif
 * /order/recap
 * 
 * Résumé complet de la commande avant validation
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Package,
  User,
  MapPin,
  Edit2,
  Shield,
  Truck,
  Clock,
  CheckCircle2,
  Banknote
} from "lucide-react";
import { toast } from "sonner";

function OrderRecapContent() {
  const navigate = useNavigate();
  const { state, prevStep, goToStep, markComplete, resetFunnel } = useOrderFunnel();
  const { user, signUp } = useAuth();
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
          // Continue without account - will be created later
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

      // Mark funnel complete and navigate to confirmation
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
          <div className="max-w-3xl mx-auto">
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
                className="text-sm text-primary tracking-widest uppercase mb-3"
                variants={itemVariants}
              >
                Étape 4 sur 5
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Récapitulatif
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Vérifiez les détails avant de confirmer
              </motion.p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Offer Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-card border-border">
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package size={20} className="text-[#FFC700]" />
                        Votre offre
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(1)}>
                        <Edit2 size={14} className="mr-1" />
                        Modifier
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg bg-[#0B0B0B] flex items-center justify-center">
                          <span className="text-[#FFC700] text-xs font-bold">NFC</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Carte i-Wasp {selectedOffer?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(selectedOffer?.price || 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Identity Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-card border-border">
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User size={20} className="text-[#FFC700]" />
                        Votre profil
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(2)}>
                        <Edit2 size={14} className="mr-1" />
                        Modifier
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Nom</p>
                          <p className="font-medium">
                            {state.digitalIdentity?.firstName} {state.digitalIdentity?.lastName}
                          </p>
                        </div>
                        {state.digitalIdentity?.title && (
                          <div>
                            <p className="text-muted-foreground">Fonction</p>
                            <p className="font-medium">{state.digitalIdentity.title}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{state.digitalIdentity?.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Téléphone</p>
                          <p className="font-medium">{state.digitalIdentity?.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Shipping Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-card border-border">
                    <CardHeader className="flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin size={20} className="text-[#FFC700]" />
                        Livraison
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
                        <Edit2 size={14} className="mr-1" />
                        Modifier
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{state.shippingInfo?.address}</p>
                      <p className="text-muted-foreground">
                        {state.shippingInfo?.city}, {state.shippingInfo?.country}
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Tél: {state.shippingInfo?.phone}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#FFC700]">
                        <Banknote size={16} />
                        <span>Paiement à la livraison</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Price Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="sticky top-24 bg-card border-border">
                  <CardHeader>
                    <CardTitle>Total</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Carte NFC i-Wasp {selectedOffer?.name}
                        </span>
                        <span>{formatPrice(selectedOffer?.price || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="text-green-500 font-medium">Gratuite</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total TTC</span>
                      <span className="text-[#FFC700]">{formatPrice(selectedOffer?.price || 0)}</span>
                    </div>

                    {/* CTA */}
                    <LoadingButton
                      size="xl"
                      onClick={handleConfirmOrder}
                      isLoading={isProcessing}
                      loadingText="Traitement..."
                      disabled={state.isTransitioning}
                      className="w-full rounded-full bg-[#FFC700] hover:bg-[#FFC700]/90 text-black font-semibold"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirmer ma commande
                    </LoadingButton>

                    <p className="text-xs text-center text-muted-foreground">
                      Vous ne payez rien maintenant. Règlement en espèces à la réception.
                    </p>

                    {/* Trust badges */}
                    <div className="space-y-2 pt-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="h-4 w-4 text-[#FFC700]" />
                        <span>Données protégées</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-[#FFC700]" />
                        <span>Production : 2-3 jours</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4 text-[#FFC700]" />
                        <span>Livraison gratuite 48-72h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-start mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={state.isTransitioning || isProcessing}
                className="gap-2"
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
    <OrderFunnelGuard step={4}>
      <OrderRecapContent />
    </OrderFunnelGuard>
  );
}
