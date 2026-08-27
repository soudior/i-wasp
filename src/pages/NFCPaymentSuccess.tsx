import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Package,
  MessageCircle,
  Truck,
  CreditCard,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import confetti from 'canvas-confetti';

// Palette Premium Noir & Or
const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
  success: "#22c55e",
};

export default function NFCPaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const tier = searchParams.get("tier") || "essentielle";
  const [copied, setCopied] = useState(false);
  // Vérification serveur du paiement — la page ne confirme RIEN tant que
  // verify-payment n'a pas relu la session côté Stripe (anti-falsification URL).
  const [verifyState, setVerifyState] = useState<"loading" | "verified" | "failed">("loading");

  // Tier info mapping (ids canoniques du serveur create-nfc-payment)
  const TIER_INFO: Record<string, { name: string; description: string }> = {
    essentielle: { name: "Carte NFC Essentielle", description: "1 carte NFC premium" },
    professionnelle: { name: "Carte NFC Professionnelle", description: "1 carte NFC premium PVC" },
    prestige: { name: "Carte NFC Prestige", description: "1 carte NFC métal premium" },
    pack_team: { name: "Pack TEAM", description: "5 cartes NFC pour votre équipe" },
    // ids historiques (anciens liens)
    single: { name: "Carte NFC Essentielle", description: "1 carte NFC premium" },
    pack_10: { name: "Pack Mini", description: "10 cartes NFC" },
    pack_50: { name: "Pack Standard", description: "50 cartes NFC" },
    pack_100: { name: "Pack Volume Pro", description: "100 cartes NFC" },
  };

  const tierInfo = TIER_INFO[tier] || TIER_INFO.essentielle;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!sessionId) {
        setVerifyState("failed");
        return;
      }
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });
        if (cancelled) return;
        setVerifyState(!error && data?.verified ? "verified" : "failed");
      } catch {
        if (!cancelled) setVerifyState("failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (verifyState !== "verified") return;
    // Trigger confetti once payment is confirmed server-side
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: [COLORS.or, COLORS.orLight, COLORS.success, '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: [COLORS.or, COLORS.orLight, COLORS.success, '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [verifyState]);

  const handleCopyOrderId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (verifyState === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4" style={{ backgroundColor: COLORS.noir }}>
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: COLORS.or, borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: COLORS.gris }}>Vérification de votre paiement…</p>
      </div>
    );
  }

  if (verifyState === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.noir }}>
        <Card className="max-w-lg w-full overflow-hidden border-0" style={{ backgroundColor: COLORS.noirCard }}>
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-xl font-medium" style={{ color: COLORS.ivoire }}>
              Paiement non confirmé
            </h1>
            <p className="text-sm" style={{ color: COLORS.gris }}>
              Nous n'avons pas pu confirmer ce paiement. S'il a bien été débité,
              contactez-nous avec votre référence — aucune commande n'est perdue.
            </p>
            {sessionId && (
              <p className="text-xs break-all" style={{ color: COLORS.gris }}>Référence : {sessionId}</p>
            )}
            <div className="flex flex-col gap-3 pt-2">
              <Button asChild style={{ backgroundColor: COLORS.success, color: "white" }}>
                <a href="https://wa.me/212661928670?text=Bonjour%2C%20mon%20paiement%20NFC%20n'est%20pas%20confirm%C3%A9." target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} className="mr-2" /> Contacter le support
                </a>
              </Button>
              <Link to="/order/offre" className="text-sm hover:opacity-80" style={{ color: COLORS.or }}>
                Réessayer la commande
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLORS.noir }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <Card 
          className="overflow-hidden border-0"
          style={{ backgroundColor: COLORS.noirCard }}
        >
          {/* Success Header */}
          <div 
            className="p-8 text-center relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.success}15 0%, ${COLORS.success}05 100%)`,
              borderBottom: `1px solid ${COLORS.success}30`,
            }}
          >
            {/* Background glow */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${COLORS.success}40 0%, transparent 70%)`,
              }}
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
              style={{ backgroundColor: `${COLORS.success}20`, border: `2px solid ${COLORS.success}` }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: COLORS.success }} />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-medium mb-2"
              style={{ color: COLORS.success }}
            >
              Commande confirmée !
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ color: COLORS.gris }}
            >
              Merci pour votre achat
            </motion.p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl"
              style={{ backgroundColor: COLORS.noirSoft, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.or}15` }}
                >
                  <Package size={20} style={{ color: COLORS.or }} />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: COLORS.ivoire }}>{tierInfo.name}</h3>
                  <p className="text-sm" style={{ color: COLORS.gris }}>{tierInfo.description}</p>
                </div>
              </div>
              
              {sessionId && (
                <button
                  onClick={handleCopyOrderId}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs w-full justify-between transition-all hover:opacity-80"
                  style={{ backgroundColor: `${COLORS.or}10` }}
                >
                  <span style={{ color: COLORS.gris }}>Référence: {sessionId.slice(0, 20)}...</span>
                  {copied ? (
                    <Check size={14} style={{ color: COLORS.success }} />
                  ) : (
                    <Copy size={14} style={{ color: COLORS.or }} />
                  )}
                </button>
              )}
            </motion.div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium uppercase tracking-wider" style={{ color: COLORS.gris }}>
                Prochaines étapes
              </h3>
              
              <div className="space-y-3">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: COLORS.noirSoft }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${COLORS.success}20`, color: COLORS.success }}
                  >
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Paiement validé</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                      Un email de confirmation vous a été envoyé
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: COLORS.noirSoft }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}
                  >
                    <Package size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Préparation en cours</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                      Vos cartes NFC sont préparées avec soin
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: COLORS.noirSoft }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}
                  >
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Expédition sous 48h</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                      Livraison rapide au Maroc et à l'international
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Contact WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-4 rounded-xl text-center"
              style={{ 
                backgroundColor: `${COLORS.success}10`,
                border: `1px solid ${COLORS.success}30`,
              }}
            >
              <p className="text-sm mb-3" style={{ color: COLORS.ivoire }}>
                Une question sur votre commande ?
              </p>
              <Button
                asChild
                className="gap-2"
                style={{ 
                  backgroundColor: COLORS.success,
                  color: 'white',
                }}
              >
                <a 
                  href="https://wa.me/212661928670?text=Bonjour%20!%20Je%20viens%20de%20commander%20des%20cartes%20NFC%20et%20j'ai%20une%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={16} />
                  Nous contacter
                </a>
              </Button>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center pt-2"
            >
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                style={{ color: COLORS.or }}
              >
                Retour à l'accueil
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
