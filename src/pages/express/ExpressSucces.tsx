/**
 * Express Checkout - Page de succès
 * /express/succes
 * 
 * Style: Apple/Cupertino - Clean celebration
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { APPLE } from "@/lib/applePalette";
import confetti from "canvas-confetti";

export default function ExpressSucces() {
  useEffect(() => {
    // Confetti celebration with Apple-style blue
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [APPLE.accent, '#34C759', '#5856D6'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [APPLE.accent, '#34C759', '#5856D6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center" 
      style={{ backgroundColor: APPLE.background }}
    >
      <div className="px-6 py-12 w-full max-w-md mx-auto text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div 
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: APPLE.successBg }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: APPLE.success }} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 
            className="text-3xl font-semibold tracking-tight mb-3"
            style={{ color: APPLE.text }}
          >
            Commande confirmée !
          </h1>
          <p className="text-base mb-8" style={{ color: APPLE.textSecondary }}>
            Merci pour votre confiance.
          </p>
        </motion.div>

        {/* Info cards */}
        <motion.div
          className="space-y-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div 
            className="p-4 flex items-center gap-4"
            style={{ 
              backgroundColor: APPLE.card, 
              borderRadius: APPLE.radiusLg,
              boxShadow: APPLE.shadowCard,
            }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: APPLE.accentSubtle }}
            >
              <Mail className="w-5 h-5" style={{ color: APPLE.accent }} />
            </div>
            <div className="text-left">
              <p className="font-medium" style={{ color: APPLE.text }}>Email de confirmation</p>
              <p className="text-sm" style={{ color: APPLE.textSecondary }}>Envoyé à votre adresse</p>
            </div>
          </div>

          <div 
            className="p-4 flex items-center gap-4"
            style={{ 
              backgroundColor: APPLE.card, 
              borderRadius: APPLE.radiusLg,
              boxShadow: APPLE.shadowCard,
            }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: APPLE.accentSubtle }}
            >
              <Package className="w-5 h-5" style={{ color: APPLE.accent }} />
            </div>
            <div className="text-left">
              <p className="font-medium" style={{ color: APPLE.text }}>Livraison 48-72h</p>
              <p className="text-sm" style={{ color: APPLE.textSecondary }}>Vous serez contacté avant livraison</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: APPLE.accent,
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            <span className="text-base">Retour à l'accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <p className="mt-6 text-sm" style={{ color: APPLE.textSecondary }}>
            Une question ? Contactez-nous sur WhatsApp
          </p>
        </motion.div>
      </div>
    </div>
  );
}
