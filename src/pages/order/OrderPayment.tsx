/**
 * Step 6: Payment
 * /order/payment
 * 
 * - Payment form
 * - Final order creation
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar } from "@/components/order/OrderProgressBar";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CreditCard,
  Lock,
  Shield,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

function OrderPaymentContent() {
  const navigate = useNavigate();
  const { state, resetFunnel } = useOrderFunnel();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour continuer");
      navigate("/login?redirect=/order/payment");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically:
      // 1. Create order in database
      // 2. Process payment via Stripe
      // 3. Send confirmation email

      toast.success("Commande confirmée !");
      resetFunnel();
      navigate("/dashboard");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    navigate("/order/summary");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Step Indicator */}
          <OrderProgressBar currentStep={6} />

          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Paiement sécurisé
            </h1>
            <p className="text-muted-foreground text-lg">
              Finalisez votre commande
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {state.orderOptions?.quantity} carte{(state.orderOptions?.quantity || 0) > 1 ? "s" : ""} NFC
                  </span>
                  <span>{formatPrice(state.orderOptions?.totalPriceCents || 0)}</span>
                </div>
                {state.orderOptions?.promoDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({state.orderOptions.promoCode})</span>
                    <span>-{state.orderOptions.promoDiscount}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total TTC</span>
                  <span>{formatPrice(state.orderOptions?.totalPriceCents || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {state.profileInfo?.firstName} {state.profileInfo?.lastName}
                </p>
                <p className="text-muted-foreground">{state.profileInfo?.address}</p>
                <p className="text-muted-foreground">
                  {state.profileInfo?.postalCode} {state.profileInfo?.city}
                </p>
                <p className="text-muted-foreground">{state.profileInfo?.country}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 space-y-6">
                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Paiement sécurisé par cryptage SSL</span>
                </div>

                {/* Pay Button */}
                <Button
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-16 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payer {formatPrice(state.orderOptions?.totalPriceCents || 0)}
                    </>
                  )}
                </Button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>100% sécurisé</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>CB / Visa / Mastercard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-start mt-10">
            <Button variant="ghost" onClick={goBack} className="gap-2">
              <ArrowLeft size={18} />
              Retour au récapitulatif
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderPayment() {
  return (
    <OrderFunnelGuard step={6}>
      <OrderPaymentContent />
    </OrderFunnelGuard>
  );
}
