import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Package,
  MessageCircle,
  Globe,
  CreditCard,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Shield
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

export default function PromoPackSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const pack = searchParams.get("pack") || "business";
  const [copied, setCopied] = useState(false);

  // Pack info mapping
  const PACK_INFO: Record<string, { 
    name: string; 
    description: string; 
    features: string[];
    delivery: string;
  }> = {
    business: { 
      name: "Pack Business", 
      description: "Site Basic + 50 cartes NFC",
      features: ["Site web professionnel", "50 cartes NFC Standard", "Économie de 1000 DH"],
      delivery: "5-7 jours ouvrés"
    },
    premium: { 
      name: "Pack Premium", 
      description: "Site Pro + 100 cartes NFC + Maintenance 1 an",
      features: ["Site web Pro (10 pages)", "100 cartes NFC Premium", "Maintenance 1 an incluse", "Économie de 6000 DH"],
      delivery: "7-10 jours ouvrés"
    },
  };

  const packInfo = PACK_INFO[pack] || PACK_INFO.business;

  useEffect(() => {
    // Trigger premium confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: [COLORS.or, COLORS.orLight, COLORS.success, '#ffffff']
      });
      confetti({
        particleCount: 4,
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
  }, []);

  const handleCopyOrderId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          {/* Success Header with Premium Feel */}
          <div 
            className="p-8 text-center relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.or}20 0%, ${COLORS.success}10 50%, ${COLORS.or}05 100%)`,
              borderBottom: `1px solid ${COLORS.or}30`,
            }}
          >
            {/* Background glow */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${COLORS.or}50 0%, transparent 70%)`,
              }}
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.or}30, ${COLORS.success}20)`,
                border: `2px solid ${COLORS.or}` 
              }}
            >
              <CheckCircle2 className="w-12 h-12" style={{ color: COLORS.or }} />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6" style={{ color: COLORS.orLight }} />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-medium mb-2"
              style={{ color: COLORS.or }}
            >
              Pack activé avec succès !
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ color: COLORS.gris }}
            >
              Bienvenue dans l'univers IWASP
            </motion.p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Pack Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.or}10, ${COLORS.noirSoft})`,
                border: `1px solid ${COLORS.or}30` 
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.or}20` }}
                >
                  <Package size={24} style={{ color: COLORS.or }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: COLORS.ivoire }}>{packInfo.name}</h3>
                  <p className="text-sm" style={{ color: COLORS.gris }}>{packInfo.description}</p>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-2 mb-4">
                {packInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} style={{ color: COLORS.success }} />
                    <span style={{ color: COLORS.ivoire }}>{feature}</span>
                  </div>
                ))}
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
                    <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Paiement confirmé</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                      Confirmation envoyée par email
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
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Notre équipe vous contacte</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                      Sous 24h pour définir votre projet web
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
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Livraison complète</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                      {packInfo.delivery}
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
                Démarrons votre projet dès maintenant
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
                  href="https://wa.me/212661928670?text=Bonjour%20!%20Je%20viens%20de%20commander%20le%20Pack%20Promo%20et%20je%20souhaite%20démarrer%20mon%20projet."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={16} />
                  Démarrer maintenant
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
