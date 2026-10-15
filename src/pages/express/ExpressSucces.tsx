/**
 * Express Checkout - Page de succès
 * /express/succes
 * 
 * Style: OMNIA — Obsidienne, champagne, ivoire
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { CHECKOUT_BRAND as CHECKOUT } from "@/lib/checkoutBrandPalette";
import "@/styles/checkout-brand.css";
import confetti from "canvas-confetti";

export default function ExpressSucces() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Confetti celebration in the checkout brand palette
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [CHECKOUT.accent, CHECKOUT.text, CHECKOUT.accentLight],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [CHECKOUT.accent, CHECKOUT.text, CHECKOUT.accentLight],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div 
      className="brand-checkout min-h-screen flex items-center justify-center"
      style={{ backgroundColor: CHECKOUT.background }}
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
            style={{ backgroundColor: CHECKOUT.successBg }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: CHECKOUT.success }} />
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
            style={{ color: CHECKOUT.text }}
          >
            Commande confirmée !
          </h1>
          <p className="text-base mb-8" style={{ color: CHECKOUT.textSecondary }}>
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
              backgroundColor: CHECKOUT.card,
              borderRadius: CHECKOUT.radiusLg,
              boxShadow: CHECKOUT.shadowCard,
            }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: CHECKOUT.accentSubtle }}
            >
              <Mail className="w-5 h-5" style={{ color: CHECKOUT.accent }} />
            </div>
            <div className="text-left">
              <p className="font-medium" style={{ color: CHECKOUT.text }}>Email de confirmation</p>
              <p className="text-sm" style={{ color: CHECKOUT.textSecondary }}>Envoyé à votre adresse</p>
            </div>
          </div>

          <div 
            className="p-4 flex items-center gap-4"
            style={{ 
              backgroundColor: CHECKOUT.card,
              borderRadius: CHECKOUT.radiusLg,
              boxShadow: CHECKOUT.shadowCard,
            }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: CHECKOUT.accentSubtle }}
            >
              <Package className="w-5 h-5" style={{ color: CHECKOUT.accent }} />
            </div>
            <div className="text-left">
              <p className="font-medium" style={{ color: CHECKOUT.text }}>Livraison 48-72h</p>
              <p className="text-sm" style={{ color: CHECKOUT.textSecondary }}>Vous serez contacté avant livraison</p>
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
              backgroundColor: CHECKOUT.accent,
              color: CHECKOUT.background,
              fontWeight: 600,
            }}
          >
            <span className="text-base">Retour à l'accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <p className="mt-6 text-sm" style={{ color: CHECKOUT.textSecondary }}>
            Une question ? Contactez-nous sur WhatsApp
          </p>
        </motion.div>
      </div>
    </div>
  );
}
