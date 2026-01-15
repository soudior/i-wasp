/**
 * Express Checkout - Page de succès
 * /express/succes
 */

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";
import confetti from "canvas-confetti";

export default function ExpressSucces() {
  const navigate = useNavigate();

  useEffect(() => {
    // Confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [COUTURE.gold, '#ffffff', '#d4af37'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [COUTURE.gold, '#ffffff', '#d4af37'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COUTURE.jet }}>
      {/* Honeycomb texture */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      <div className="relative z-10 px-6 py-12 w-full max-w-md mx-auto text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div 
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: `${COUTURE.gold}20` }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: COUTURE.gold }} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 
            className="font-display text-3xl font-light italic mb-3"
            style={{ color: COUTURE.silk }}
          >
            Commande <span style={{ color: COUTURE.gold }}>confirmée !</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: COUTURE.textMuted }}>
            Merci pour votre confiance.
          </p>
        </motion.div>

        {/* Info cards */}
        <motion.div
          className="space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div 
            className="p-4 flex items-center gap-4"
            style={{ backgroundColor: COUTURE.jetSoft, border: `1px solid ${COUTURE.jetMuted}` }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${COUTURE.gold}20` }}
            >
              <Mail className="w-5 h-5" style={{ color: COUTURE.gold }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: COUTURE.silk }}>Email de confirmation</p>
              <p className="text-xs" style={{ color: COUTURE.textMuted }}>Envoyé à votre adresse</p>
            </div>
          </div>

          <div 
            className="p-4 flex items-center gap-4"
            style={{ backgroundColor: COUTURE.jetSoft, border: `1px solid ${COUTURE.jetMuted}` }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${COUTURE.gold}20` }}
            >
              <Package className="w-5 h-5" style={{ color: COUTURE.gold }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: COUTURE.silk }}>Livraison 48-72h</p>
              <p className="text-xs" style={{ color: COUTURE.textMuted }}>Vous serez contacté avant livraison</p>
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
            className="inline-flex items-center gap-2 px-8 py-4 transition-all duration-300"
            style={{ 
              backgroundColor: COUTURE.gold,
              color: COUTURE.jet,
            }}
          >
            <span className="text-sm uppercase tracking-[0.15em] font-medium">Retour à l'accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <p className="mt-6 text-xs" style={{ color: COUTURE.textMuted }}>
            Une question ? Contactez-nous sur WhatsApp
          </p>
        </motion.div>
      </div>
    </div>
  );
}
