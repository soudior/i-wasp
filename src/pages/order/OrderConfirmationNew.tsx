/**
 * Step 6: Confirmation
 * /order/confirmation
 * 
 * - Vérification du paiement Stripe si applicable
 * - Compte créé automatiquement
 * - Accès immédiat à la carte digitale
 * - Partage activé (WhatsApp, lien, QR)
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition, contentVariants, itemVariants } from "@/components/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle2,
  Share2,
  ExternalLink,
  QrCode,
  MessageCircle,
  User,
  CreditCard,
  Sparkles,
  ArrowRight,
  Smartphone,
  Truck,
  Loader2,
  XCircle,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

type PaymentStatus = "loading" | "verified" | "failed" | "cod";

interface PaymentDetails {
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
}

function OrderConfirmationContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, resetFunnel } = useOrderFunnel();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("loading");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  const sessionId = searchParams.get("session_id");
  const paymentParam = searchParams.get("payment");

  // Verify payment on mount
  useEffect(() => {
    const verifyPayment = async () => {
      // If COD or no session, mark as COD
      if (!sessionId || paymentParam !== "success") {
        setPaymentStatus("cod");
        triggerConfetti();
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });

        if (error) throw error;

        if (data?.verified) {
          setPaymentStatus("verified");
          setPaymentDetails({
            amountTotal: data.amountTotal,
            currency: data.currency,
            customerEmail: data.customerEmail,
          });
          toast.success("Paiement confirmé !");
          triggerConfetti();
        } else {
          setPaymentStatus("failed");
          toast.error("Le paiement n'a pas pu être vérifié");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setPaymentStatus("failed");
      }
    };

    verifyPayment();
  }, [sessionId, paymentParam]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFC700', '#FFD700', '#FFED4A']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFC700', '#FFD700', '#FFED4A']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleGoToDashboard = () => {
    resetFunnel();
    navigate("/dashboard");
  };

  const handleShareWhatsApp = () => {
    const name = `${state.digitalIdentity?.firstName} ${state.digitalIdentity?.lastName}`;
    const message = `Découvrez ma nouvelle carte de visite digitale i-Wasp ! 🚀\n\nUne carte NFC qui simplifie le networking.\n\n- ${name}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const formatAmount = (cents: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  // Loading state
  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#FFC700] animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">Vérification du paiement...</h1>
            <p className="text-muted-foreground">Veuillez patienter quelques instants</p>
            <div className="mt-8 space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Failed payment state
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-14 h-14 text-red-500" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold mb-4">Problème de paiement</h1>
            <p className="text-muted-foreground mb-8">
              Nous n'avons pas pu vérifier votre paiement. Votre commande a été enregistrée.
            </p>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <p className="text-sm text-left">
                  Notre équipe vous contactera par WhatsApp pour finaliser votre commande.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGoToDashboard}
                className="bg-[#FFC700] hover:bg-[#FFC700]/90 text-black"
              >
                <User className="mr-2 h-5 w-5" />
                Accéder à mon profil
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/order/recap")}
              >
                Réessayer le paiement
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Success state (verified or COD)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-[#FFC700] flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-black" />
              </div>
            </motion.div>

            {/* Header */}
            <motion.div 
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-4"
                variants={itemVariants}
              >
                Commande confirmée ! 🎉
              </motion.h1>
              
              {/* Payment Verified Badge */}
              {paymentStatus === "verified" && (
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-400">
                    Paiement vérifié
                    {paymentDetails?.amountTotal && paymentDetails?.currency && (
                      <span className="ml-1">
                        • {formatAmount(paymentDetails.amountTotal, paymentDetails.currency)}
                      </span>
                    )}
                  </span>
                </motion.div>
              )}
              
              {/* Immediate Access Banner */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-4"
              >
                <Sparkles className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-400">
                  Votre carte digitale est active immédiatement
                </span>
              </motion.div>
              
              <motion.p 
                className="text-muted-foreground text-lg mb-8"
                variants={itemVariants}
              >
                Votre carte physique est en cours de fabrication
              </motion.p>
            </motion.div>

            {/* Order Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card border-border mb-8">
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFC700]/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#FFC700]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Production</p>
                        <p className="font-medium">2-3 jours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFC700]/20 flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-[#FFC700]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Livraison</p>
                        <p className="font-medium">48-72h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFC700]/20 flex items-center justify-center">
                        {paymentStatus === "verified" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-[#FFC700]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Paiement</p>
                        <p className="font-medium">
                          {paymentStatus === "verified" ? "Confirmé ✓" : "À la livraison"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Ce qui se passe maintenant</h2>
              <div className="space-y-3 text-left">
                {/* Step 1 - Digital card active NOW */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="font-medium text-green-400">Votre carte digitale est active</p>
                    <p className="text-sm text-muted-foreground">
                      Partagez-la dès maintenant via lien, QR code ou WhatsApp
                    </p>
                  </div>
                  <Smartphone className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
                
                {/* Step 2 - Account created */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FFC700]/10 border border-[#FFC700]/30">
                  <div className="w-6 h-6 rounded-full bg-[#FFC700] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-black">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Votre compte a été créé</p>
                    <p className="text-sm text-muted-foreground">
                      Accédez à votre tableau de bord pour personnaliser votre profil
                    </p>
                  </div>
                </div>
                
                {/* Step 3 - Physical card in production */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Carte physique en fabrication</p>
                    <p className="text-sm text-muted-foreground">
                      Livraison sous 48-72h
                      {paymentStatus === "cod" && " · Paiement à la réception"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                onClick={handleGoToDashboard}
                className="w-full sm:w-auto px-8 rounded-full bg-[#FFC700] hover:bg-[#FFC700]/90 text-black font-semibold"
              >
                <User className="mr-2 h-5 w-5" />
                Accéder à mon profil
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleShareWhatsApp}
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  Partager sur WhatsApp
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <Link to="/guide">
                    <QrCode className="h-4 w-4" />
                    Voir le guide
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-sm text-muted-foreground">
                Des questions ? Notre équipe vous contactera par WhatsApp pour confirmer votre commande.
              </p>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function OrderConfirmationNew() {
  return (
    <OrderFunnelGuard step={7}>
      <OrderConfirmationContent />
    </OrderFunnelGuard>
  );
}
