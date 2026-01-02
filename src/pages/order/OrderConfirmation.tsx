/**
 * Order Confirmation Page
 * /order/confirmation
 * 
 * Success page after COD order or Stripe payment
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Package, 
  MessageCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Clock,
  Truck
} from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentMethod = searchParams.get("method") || "cod";
  const isCOD = paymentMethod === "cod";

  // Confetti effect on mount
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#D4AF37", "#1A1A1A", "#FFFFFF"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#D4AF37", "#1A1A1A", "#FFFFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Merci pour votre commande ! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Votre commande i-wasp est validée et en cours de préparation.
            </p>
          </motion.div>

          {/* COD Specific Info */}
          {isCOD && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Prochaine étape : Confirmation par WhatsApp
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        Notre service client vous contactera par <strong>téléphone ou WhatsApp</strong> dans les prochaines heures pour :
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Confirmer votre adresse de livraison exacte
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Préciser les détails de votre quartier
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Vous donner une estimation de livraison précise
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Votre commande en 3 étapes</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Commande validée</p>
                      <p className="text-sm text-muted-foreground">Votre carte est en préparation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Gravure laser sous 48h</p>
                      <p className="text-sm text-muted-foreground">Votre carte est personnalisée par nos artisans</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Livraison à domicile</p>
                      <p className="text-sm text-muted-foreground">
                        {isCOD ? "Payez en espèces à la réception" : "Expédition express partout au Maroc"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prepare Profile CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-6 bg-gradient-to-r from-primary/10 to-amber-500/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Préparez votre profil digital dès maintenant !
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Pendant que votre carte est en préparation, configurez votre profil : ajoutez vos liens Instagram, WhatsApp et configurez votre Story.
                    </p>
                    <Button 
                      onClick={() => navigate("/dashboard")}
                      className="gap-2"
                    >
                      Accéder au Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Install App CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="mb-6 border-dashed">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Installation recommandée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pour une expérience optimale, ouvrez notre site sur votre mobile et cliquez sur <strong>"Ajouter à l'écran d'accueil"</strong>.
                </p>
                <Button variant="outline" onClick={() => navigate("/install")}>
                  Guide d'installation
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-muted-foreground"
          >
            <p>
              Une question ? Contactez-nous sur{" "}
              <a 
                href="https://wa.me/212600000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                WhatsApp
              </a>
            </p>
            <p className="mt-4 font-medium text-foreground">
              Restez connecté,<br />
              L'équipe i-wasp 🐝
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}