import { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  CreditCard,
  ArrowRight,
  Clock,
  Shield,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = searchParams.get("order");

  // Confetti celebration on mount
  useEffect(() => {
    if (!orderNumber) return;
    
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#22c55e", "#10b981", "#FFD700", "#FFFFFF"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#22c55e", "#10b981", "#FFD700", "#FFFFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#10b981", "#FFD700"],
    });

    frame();
  }, [orderNumber]);

  // Redirect if no order number
  useEffect(() => {
    if (!orderNumber) {
      navigate("/dashboard");
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] orb opacity-30 animate-pulse-glow" />
      <div className="noise" />

      <motion.div 
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="overflow-hidden">
          {/* Success header */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
            {/* Animated sparkles */}
            <motion.div
              className="absolute top-4 left-4"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="h-6 w-6 text-white/50" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 right-4"
              animate={{ rotate: -360, scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles className="h-5 w-5 text-white/40" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <CheckCircle2 className="h-14 w-14" />
                </motion.div>
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/30"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                />
              </div>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Commande confirmée ! 🎉
            </motion.h1>
            <motion.p 
              className="text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Merci pour votre confiance
            </motion.p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Order number */}
            <div className="text-center py-4 px-6 bg-secondary/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">
                Numéro de commande
              </p>
              <p className="font-mono text-2xl font-bold text-foreground">
                {orderNumber}
              </p>
            </div>

            {/* Next steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Prochaines étapes</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Confirmation sous 24h</p>
                    <p className="text-sm text-muted-foreground">
                      Nous vérifions votre commande et vous contactons
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Production: 1-3 jours</p>
                    <p className="text-sm text-muted-foreground">
                      Vos cartes NFC sont produites avec soin
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Livraison: 2-5 jours</p>
                    <p className="text-sm text-muted-foreground">
                      Expédition rapide partout au Maroc
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Paiement à la livraison</p>
                    <p className="text-sm text-muted-foreground">
                      Payez en espèces ou carte à la réception
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Commande sécurisée</span>
              </div>
              <span>•</span>
              <span>🇲🇦 Livraison Maroc</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/orders" className="block">
                <Button className="w-full" size="lg">
                  Voir ma commande
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <Link to="/dashboard" className="block">
                <Button variant="outline" className="w-full">
                  Retour au tableau de bord
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
