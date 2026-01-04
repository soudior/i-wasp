/**
 * Step 6: Confirmation
 * /order/confirmation
 * 
 * - Compte créé automatiquement
 * - Accès immédiat à la carte digitale
 * - Partage activé (WhatsApp, lien, QR)
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition, contentVariants, itemVariants } from "@/components/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2,
  Share2,
  ExternalLink,
  QrCode,
  MessageCircle,
  User,
  CreditCard,
  Sparkles,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

function OrderConfirmationContent() {
  const navigate = useNavigate();
  const { state, resetFunnel } = useOrderFunnel();

  // Confetti on mount
  useEffect(() => {
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
  }, []);

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
              <motion.p 
                className="text-muted-foreground text-lg mb-8"
                variants={itemVariants}
              >
                Votre carte i-Wasp est en cours de fabrication
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
                        <Sparkles className="w-5 h-5 text-[#FFC700]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Paiement</p>
                        <p className="font-medium">À la livraison</p>
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
              <h2 className="text-xl font-semibold mb-4">Prochaines étapes</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-6 h-6 rounded-full bg-[#FFC700] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-black">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Votre compte a été créé</p>
                    <p className="text-sm text-muted-foreground">
                      Accédez à votre tableau de bord pour personnaliser votre profil
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-6 h-6 rounded-full bg-[#FFC700] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-black">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Partagez votre profil</p>
                    <p className="text-sm text-muted-foreground">
                      Commencez à partager votre carte digitale via WhatsApp ou QR code
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-muted-foreground">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Recevez votre carte NFC</p>
                    <p className="text-sm text-muted-foreground">
                      Elle sera automatiquement liée à votre profil digital
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
    <OrderFunnelGuard step={6}>
      <OrderConfirmationContent />
    </OrderFunnelGuard>
  );
}
