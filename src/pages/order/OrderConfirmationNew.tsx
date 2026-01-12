/**
 * Step 7: Confirmation
 * /order/confirmation
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste extrême
 * 
 * - Vérification du paiement Stripe si applicable
 * - Compte créé automatiquement
 * - Accès immédiat à la carte digitale
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { supabase } from "@/integrations/supabase/client";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { 
  Check,
  ArrowRight,
  MessageCircle,
  Loader2,
  X
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
          toast.success("Paiement confirmé");
          triggerConfetti();
        } else {
          setPaymentStatus("failed");
          toast.error("Paiement non vérifié");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setPaymentStatus("failed");
      }
    };

    verifyPayment();
  }, [sessionId, paymentParam]);

  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 45,
        origin: { x: 0, y: 0.6 },
        colors: ['#AF8E56', '#C4A672', '#D4C4A8']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 45,
        origin: { x: 1, y: 0.6 },
        colors: ['#AF8E56', '#C4A672', '#D4C4A8']
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
    const message = `Découvrez ma nouvelle carte de visite digitale i-Wasp.\n\n— ${name}`;
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COUTURE.jet }}>
        {/* Honeycomb texture */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 mx-auto mb-8" style={{ color: COUTURE.gold }} />
          </motion.div>
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: COUTURE.textMuted }}>
            Vérification
          </p>
        </div>
      </div>
    );
  }

  // Failed payment state
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: COUTURE.jet }}>
        {/* Honeycomb texture */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 mx-auto mb-10 rounded-full flex items-center justify-center"
            style={{ border: `1px solid ${COUTURE.textMuted}40` }}
          >
            <X className="w-6 h-6" style={{ color: COUTURE.textMuted }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-display text-2xl font-light italic mb-4"
            style={{ color: COUTURE.silk }}
          >
            Paiement non confirmé.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-sm font-light mb-12"
            style={{ color: COUTURE.textMuted }}
          >
            Votre commande a été enregistrée. Notre équipe vous contactera.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col gap-4"
          >
            <button
              onClick={handleGoToDashboard}
              className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1 mx-auto"
              style={{ 
                color: COUTURE.gold,
                borderBottom: `1px solid ${COUTURE.gold}60`,
              }}
            >
              Accéder à mon profil
            </button>
            <button
              onClick={() => navigate("/order/recap")}
              className="text-[11px] uppercase tracking-[0.15em] font-light transition-all duration-500"
              style={{ color: COUTURE.textMuted }}
            >
              Réessayer
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success state (verified or COD)
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COUTURE.jet }}>
      {/* Honeycomb texture */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center">
          <Link to="/" className="font-display text-lg tracking-[0.1em]" style={{ color: COUTURE.silk }}>
            i-wasp
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-20 h-20 mx-auto mb-12 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: COUTURE.gold,
              boxShadow: `0 0 60px ${COUTURE.gold}30`
            }}
          >
            <Check className="w-8 h-8" style={{ color: COUTURE.jet }} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="font-display text-3xl md:text-4xl font-light italic mb-4"
            style={{ color: COUTURE.silk }}
          >
            Bienvenue.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm font-light mb-3"
            style={{ color: COUTURE.textMuted }}
          >
            Votre carte digitale est <span style={{ color: COUTURE.gold }}>active</span>.
          </motion.p>

          {/* Payment verified badge */}
          {paymentStatus === "verified" && paymentDetails?.amountTotal && paymentDetails?.currency && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COUTURE.success }} />
              <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: COUTURE.textMuted }}>
                {formatAmount(paymentDetails.amountTotal, paymentDetails.currency)}
              </span>
            </motion.div>
          )}

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mb-16 space-y-4"
          >
            {/* Digital card active */}
            <div 
              className="p-5 text-left"
              style={{ 
                backgroundColor: `${COUTURE.gold}08`,
                border: `1px solid ${COUTURE.gold}20`,
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: COUTURE.gold }}
                >
                  <Check className="w-4 h-4" style={{ color: COUTURE.jet }} />
                </div>
                <div>
                  <p className="font-light" style={{ color: COUTURE.silk }}>Carte digitale active</p>
                  <p className="text-[11px]" style={{ color: COUTURE.textMuted }}>Partagez-la dès maintenant</p>
                </div>
              </div>
            </div>

            {/* Physical card */}
            <div 
              className="p-5 text-left"
              style={{ 
                border: `1px solid ${COUTURE.jetSoft}`,
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: `1px solid ${COUTURE.textMuted}40` }}
                >
                  <span className="text-[10px]" style={{ color: COUTURE.textMuted }}>02</span>
                </div>
                <div>
                  <p className="font-light" style={{ color: COUTURE.textMuted }}>Carte physique en production</p>
                  <p className="text-[11px]" style={{ color: COUTURE.textMuted }}>
                    Livraison sous 48-72h
                    {paymentStatus === "cod" && " · Paiement à la réception"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="space-y-6"
          >
            <button
              onClick={handleGoToDashboard}
              className="w-full py-4 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] font-light transition-all duration-700"
              style={{ 
                backgroundColor: COUTURE.gold,
                color: COUTURE.jet,
              }}
            >
              <span>Mon profil</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 mx-auto text-[11px] uppercase tracking-[0.15em] font-light transition-all duration-500 pb-1"
              style={{ 
                color: COUTURE.textMuted,
                borderBottom: `1px solid ${COUTURE.textMuted}30`,
              }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Partager</span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: COUTURE.textMuted }}>
            Powered by <span style={{ color: COUTURE.gold }}>i-wasp</span>
          </p>
        </div>
      </footer>
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
