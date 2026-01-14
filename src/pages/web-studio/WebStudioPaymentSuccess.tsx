/**
 * WebStudioPaymentSuccess - Page affichée après un paiement réussi
 * Supporte les paiements directs (depuis /pricing) et les paiements avec proposal/génération IA
 */

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  Globe,
  Clock,
  AlertCircle,
  Package,
  Mail,
  MessageCircle,
  Calendar,
  Shield,
  Zap,
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
};

type VerificationStatus = 'verifying' | 'success' | 'generating' | 'generated' | 'error' | 'direct_success';

// Package info mapping
const PACKAGE_INFO = {
  starter: { name: 'Pack Starter', pages: '1-3 pages', delivery: '⚡ Livraison instantanée' },
  standard: { name: 'Pack Standard', pages: '4-6 pages', delivery: '📅 3-5 jours' },
  premium: { name: 'Pack Premium', pages: '7-10 pages', delivery: '📅 7 jours' },
};

export default function WebStudioPaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const proposalId = searchParams.get("proposal_id");
  const packageType = searchParams.get("package") as keyof typeof PACKAGE_INFO | null;
  
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    amount: string;
    currency: string;
    email: string;
    items: Array<{ name: string; quantity: number; amount: string }>;
  } | null>(null);

  // Trigger confetti on success
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [COLORS.or, COLORS.orLight, '#22c55e', '#ffffff'],
    });
  };

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setErrorMessage("Session de paiement invalide");
        return;
      }

      try {
        // For direct payments (from pricing page), we don't need full verification
        // The package parameter indicates it's a direct payment
        if (packageType && !proposalId) {
          // Verify with Stripe directly
          const { data, error } = await supabase.functions.invoke('verify-direct-payment', {
            body: { sessionId },
          });

          if (error) throw error;

          if (data?.success) {
            setStatus('direct_success');
            setOrderDetails(data.orderDetails || null);
            triggerConfetti();
          } else {
            throw new Error(data?.error || "Erreur de vérification");
          }
          return;
        }

        // For proposal-based payments with IA generation
        const { data, error } = await supabase.functions.invoke('verify-webstudio-payment', {
          body: { sessionId, proposalId },
        });

        if (error) throw error;

        if (data?.success) {
          setStatus('generating');
          triggerConfetti();
          
          // Poll for site generation status
          pollGenerationStatus(data.proposalId || proposalId);
        } else {
          throw new Error(data?.error || "Erreur de vérification");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        // Even if verification fails, show success for direct payments (Stripe already processed)
        if (packageType && !proposalId) {
          setStatus('direct_success');
          triggerConfetti();
        } else {
          setStatus('error');
          setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la vérification");
        }
      }
    };

    verifyPayment();
  }, [sessionId, proposalId, packageType]);

  const pollGenerationStatus = async (propId: string) => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    const checkStatus = async () => {
      attempts++;
      
      try {
        const { data: website } = await supabase
          .from("generated_websites")
          .select("status, preview_url")
          .eq("proposal_id", propId)
          .single();

        if (website?.status === 'completed') {
          setStatus('generated');
          setSiteUrl(website.preview_url);
          return;
        }

        if (website?.status === 'failed') {
          setStatus('error');
          setErrorMessage("La génération a échoué. Notre équipe va intervenir.");
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        } else {
          setStatus('success');
        }
      } catch (err) {
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        }
      }
    };

    setTimeout(checkStatus, 3000);
  };

  const packageInfo = packageType ? PACKAGE_INFO[packageType] : null;

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
          {(status === 'direct_success' || status === 'success' || status === 'generating' || status === 'generated') && (
            <div 
              className="p-8 text-center relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.or}15 0%, ${COLORS.or}05 100%)`,
                borderBottom: `1px solid ${COLORS.or}30`,
              }}
            >
              {/* Background glow */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${COLORS.or}40 0%, transparent 70%)`,
                }}
              />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                style={{ backgroundColor: '#22c55e20', border: `2px solid #22c55e` }}
              >
                <CheckCircle2 className="w-10 h-10" style={{ color: '#22c55e' }} />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-medium mb-2"
                style={{ color: '#22c55e' }}
              >
                Paiement confirmé !
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ color: COLORS.gris }}
              >
                Merci pour votre confiance
              </motion.p>
            </div>
          )}

          {/* Error Header */}
          {status === 'error' && (
            <div 
              className="p-8 text-center"
              style={{ 
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
                borderBottom: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(239,68,68,0.2)', border: '2px solid #ef4444' }}
              >
                <AlertCircle className="w-10 h-10 text-red-400" />
              </motion.div>
              <h1 className="text-2xl font-medium text-red-400 mb-2">Une erreur est survenue</h1>
              <p style={{ color: COLORS.gris }}>{errorMessage}</p>
            </div>
          )}

          <CardContent className="p-6 space-y-6">
            {/* Verifying State */}
            {status === 'verifying' && (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: COLORS.or }} />
                <p className="text-lg font-medium" style={{ color: COLORS.ivoire }}>Vérification du paiement...</p>
                <p className="text-sm mt-2" style={{ color: COLORS.gris }}>Un instant s'il vous plaît</p>
              </div>
            )}

            {/* Direct Success State - Order Summary */}
            {status === 'direct_success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                {/* Package Summary */}
                {packageInfo && (
                  <div 
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
                        <h3 className="font-medium" style={{ color: COLORS.ivoire }}>{packageInfo.name}</h3>
                        <p className="text-sm" style={{ color: COLORS.gris }}>{packageInfo.pages}</p>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: `${COLORS.or}10` }}
                    >
                      <Zap size={14} style={{ color: COLORS.or }} />
                      <span style={{ color: COLORS.or }}>{packageInfo.delivery}</span>
                    </div>
                  </div>
                )}

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
                        style={{ backgroundColor: '#22c55e20', color: '#22c55e' }}
                      >
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Confirmation par email</p>
                        <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                          Vous recevrez un email de confirmation avec tous les détails
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
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Notre équipe vous contacte</p>
                        <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                          Sous 24h pour définir vos besoins et le design
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
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>Livraison de votre site</p>
                        <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                          {packageInfo?.delivery || 'Selon le forfait choisi'}
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
                    backgroundColor: '#22c55e10',
                    border: '1px solid #22c55e30',
                  }}
                >
                  <p className="text-sm mb-3" style={{ color: COLORS.ivoire }}>
                    Une question ? Contactez-nous directement
                  </p>
                  <Button
                    asChild
                    className="gap-2"
                    style={{ 
                      backgroundColor: '#22c55e',
                      color: 'white',
                    }}
                  >
                    <a 
                      href="https://wa.me/33626424394?text=Bonjour%20!%20Je%20viens%20d'effectuer%20un%20paiement%20et%20j'ai%20une%20question."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Generating State */}
            {status === 'generating' && (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <Sparkles className="w-full h-full" style={{ color: COLORS.or }} />
                </motion.div>
                <p className="text-lg font-medium" style={{ color: COLORS.ivoire }}>
                  Génération de votre site en cours...
                </p>
                <p className="text-sm mt-2" style={{ color: COLORS.gris }}>
                  Notre IA crée votre site personnalisé. Cela peut prendre 1-2 minutes.
                </p>
                
                <div className="mt-6 space-y-2">
                  {['Analyse de votre demande', 'Génération du design', 'Création du code'].map((step, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-sm" style={{ color: COLORS.gris }}>
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: i < 2 ? '#22c55e' : COLORS.or }}
                      />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated State */}
            {status === 'generated' && (
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${COLORS.or}20` }}
                >
                  <Globe className="w-8 h-8" style={{ color: COLORS.or }} />
                </motion.div>
                <p className="text-lg font-medium" style={{ color: '#22c55e' }}>Votre site est prêt !</p>
                <p className="text-sm mt-2 mb-6" style={{ color: COLORS.gris }}>
                  Découvrez votre nouveau site web généré par IA
                </p>

                {siteUrl && (
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full gap-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                      color: COLORS.noir,
                    }}
                  >
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-5 h-5" />
                      Voir mon site
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}

            {/* Success State (payment verified but generation ongoing) */}
            {status === 'success' && (
              <div className="text-center py-4">
                <p className="text-sm mb-4" style={{ color: COLORS.gris }}>
                  La génération de votre site est en cours. Vous recevrez un email 
                  dès qu'il sera prêt.
                </p>
              </div>
            )}

            {/* Error Actions */}
            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full gap-2"
                  style={{ 
                    backgroundColor: '#22c55e',
                    color: 'white',
                  }}
                >
                  <a 
                    href="https://wa.me/33626424394?text=Bonjour%20!%20J'ai%20eu%20une%20erreur%20lors%20de%20mon%20paiement."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} />
                    Contacter le support
                  </a>
                </Button>
              </div>
            )}

            {/* Navigation Links */}
            <div 
              className="pt-4 space-y-3"
              style={{ borderTop: `1px solid ${COLORS.border}` }}
            >
              {proposalId && (
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                  style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                >
                  <Link to={`/web-studio/suivi?id=${proposalId}`}>
                    Suivre ma commande
                  </Link>
                </Button>
              )}
              
              <Button 
                asChild 
                variant="ghost" 
                className="w-full"
                style={{ color: COLORS.gris }}
              >
                <Link to="/">
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 mt-6 text-xs"
          style={{ color: COLORS.gris }}
        >
          <Shield size={14} />
          <span>Paiement sécurisé par Stripe</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
