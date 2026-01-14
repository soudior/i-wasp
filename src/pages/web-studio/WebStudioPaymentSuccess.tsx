/**
 * WebStudioPaymentSuccess - Page affichée après un paiement réussi
 * Vérifie le paiement et montre le statut de génération
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type VerificationStatus = 'verifying' | 'success' | 'generating' | 'generated' | 'error';

export default function WebStudioPaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const proposalId = searchParams.get("proposal_id");
  
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setErrorMessage("Session de paiement invalide");
        return;
      }

      try {
        // Verify the payment
        const { data, error } = await supabase.functions.invoke('verify-webstudio-payment', {
          body: { sessionId, proposalId },
        });

        if (error) throw error;

        if (data?.success) {
          setStatus('generating');
          
          // Poll for site generation status
          pollGenerationStatus(data.proposalId || proposalId);
        } else {
          throw new Error(data?.error || "Erreur de vérification");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la vérification");
      }
    };

    verifyPayment();
  }, [sessionId, proposalId]);

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
          setTimeout(checkStatus, 5000); // Check every 5 seconds
        } else {
          setStatus('success');
          // Generation taking too long, but payment was successful
        }
      } catch (err) {
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        }
      }
    };

    // Start polling after a short delay
    setTimeout(checkStatus, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          {/* Success Header */}
          {status !== 'error' && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-500/30 p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </motion.div>
              <h1 className="text-2xl font-bold text-green-400">Paiement réussi !</h1>
              <p className="text-muted-foreground mt-2">Merci pour votre confiance</p>
            </div>
          )}

          {/* Error Header */}
          {status === 'error' && (
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircle className="w-8 h-8 text-red-400" />
              </motion.div>
              <h1 className="text-2xl font-bold text-red-400">Une erreur est survenue</h1>
              <p className="text-muted-foreground mt-2">{errorMessage}</p>
            </div>
          )}

          <CardContent className="p-6 space-y-6">
            {/* Verifying State */}
            {status === 'verifying' && (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Vérification du paiement...</p>
                <p className="text-sm text-muted-foreground mt-2">Un instant s'il vous plaît</p>
              </div>
            )}

            {/* Generating State */}
            {status === 'generating' && (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <Sparkles className="w-full h-full text-amber-400" />
                </motion.div>
                <p className="text-lg font-medium">Génération de votre site en cours...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Notre IA crée votre site personnalisé. Cela peut prendre 1-2 minutes.
                </p>
                
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>Analyse de votre demande</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Génération du design</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Création du code</span>
                  </div>
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
                  className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Globe className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-lg font-medium text-green-400">Votre site est prêt !</p>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  Découvrez votre nouveau site web généré par IA
                </p>

                {siteUrl && (
                  <Button asChild size="lg" className="w-full gap-2">
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
                <p className="text-sm text-muted-foreground mb-4">
                  La génération de votre site est en cours. Vous recevrez un email 
                  dès qu'il sera prêt.
                </p>
              </div>
            )}

            {/* Navigation Links */}
            <div className="pt-4 border-t border-border/50 space-y-3">
              {proposalId && (
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/track-webstudio-order?id=${proposalId}`}>
                    Suivre ma commande
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="ghost" className="w-full">
                <Link to="/">
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
