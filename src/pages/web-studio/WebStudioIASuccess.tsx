/**
 * Web Studio IA Success - Page de succès après paiement
 * Vérifie le paiement et lance la génération du site (instantané pour Starter)
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Check, 
  Loader2, 
  Sparkles, 
  ExternalLink,
  AlertCircle,
  Zap,
  Clock,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STUDIO = {
  noir: "#050505",
  noirCard: "#111111",
  or: "#D4A853",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

type VerificationStatus = 'verifying' | 'generating' | 'generated' | 'queued' | 'error';

export default function WebStudioIASuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const proposalId = searchParams.get('proposal_id');

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInstant, setIsInstant] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!sessionId || !proposalId) {
      setStatus('error');
      setErrorMessage('Paramètres manquants');
      return;
    }

    verifyAndProcess();
  }, [sessionId, proposalId]);

  const verifyAndProcess = async () => {
    try {
      // Verify payment
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'verify-webstudio-ia-payment',
        {
          body: { sessionId, proposalId },
        }
      );

      if (verifyError) throw verifyError;

      if (!verifyData?.success) {
        throw new Error(verifyData?.error || 'Payment verification failed');
      }

      setIsInstant(verifyData.isInstant);

      if (verifyData.isInstant) {
        // Instant generation - show progress
        setStatus('generating');
        pollGenerationStatus();
      } else {
        // Non-instant - show queued message
        setStatus('queued');
      }

    } catch (error: any) {
      console.error('Verification error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Une erreur est survenue');
    }
  };

  const pollGenerationStatus = async () => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      attempts++;
      setProgress(Math.min(95, (attempts / maxAttempts) * 100));

      try {
        const { data, error } = await supabase
          .from('generated_websites')
          .select('status, preview_url, slug')
          .eq('proposal_id', proposalId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data?.status === 'completed' && data.preview_url) {
          setStatus('generated');
          setSiteUrl(data.preview_url);
          setProgress(100);
          return;
        }

        if (data?.status === 'failed') {
          setStatus('error');
          setErrorMessage('La génération a échoué');
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          // Timeout - but generation might still be in progress
          setStatus('queued');
        }
      } catch (error: any) {
        console.error('Poll error:', error);
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        }
      }
    };

    poll();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: STUDIO.noir }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center" style={{ backgroundColor: STUDIO.noirCard, border: '1px solid rgba(255,255,255,0.1)' }}>
          
          {/* Verifying */}
          {status === 'verifying' && (
            <>
              <Loader2 size={48} className="mx-auto mb-4 animate-spin text-amber-500" />
              <h2 className="text-xl font-semibold mb-2" style={{ color: STUDIO.ivoire }}>
                Vérification du paiement...
              </h2>
              <p className="text-sm" style={{ color: STUDIO.gris }}>
                Merci de patienter quelques instants
              </p>
            </>
          )}

          {/* Generating (instant) */}
          {status === 'generating' && (
            <>
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={40} className="text-emerald-500" />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2" style={{ color: STUDIO.ivoire }}>
                Création de votre site en cours...
              </h2>
              <p className="text-sm mb-6" style={{ color: STUDIO.gris }}>
                Notre IA génère votre landing page personnalisée
              </p>

              {/* Progress bar */}
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs" style={{ color: STUDIO.gris }}>
                {Math.round(progress)}% - Encore quelques instants...
              </p>
            </>
          )}

          {/* Generated (instant success) */}
          {status === 'generated' && siteUrl && (
            <>
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Check size={40} className="text-emerald-500" />
              </motion.div>
              
              <h2 className="text-2xl font-semibold mb-2" style={{ color: STUDIO.ivoire }}>
                🎉 Votre site est prêt !
              </h2>
              <p className="text-sm mb-6" style={{ color: STUDIO.gris }}>
                Votre landing page a été créée avec succès
              </p>

              <Button
                onClick={() => window.open(siteUrl, '_blank')}
                className="w-full mb-4 bg-emerald-600 hover:bg-emerald-700"
              >
                <ExternalLink size={18} className="mr-2" />
                Voir mon site
              </Button>

              <p className="text-xs" style={{ color: STUDIO.gris }}>
                Un email de confirmation vous a été envoyé
              </p>
            </>
          )}

          {/* Queued (non-instant) */}
          {status === 'queued' && (
            <>
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(212, 168, 83, 0.2)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Clock size={40} className="text-amber-500" />
              </motion.div>
              
              <h2 className="text-2xl font-semibold mb-2" style={{ color: STUDIO.ivoire }}>
                Commande confirmée !
              </h2>
              <p className="text-sm mb-6" style={{ color: STUDIO.gris }}>
                Votre paiement a été reçu. Notre équipe va créer votre site.
              </p>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-amber-500" />
                  <span className="font-medium" style={{ color: STUDIO.ivoire }}>
                    Prochaines étapes
                  </span>
                </div>
                <ul className="text-sm space-y-2" style={{ color: STUDIO.gris }}>
                  <li>• Vous recevrez un email de confirmation</li>
                  <li>• Notre équipe crée votre site</li>
                  <li>• Livraison sous 3-7 jours selon la formule</li>
                </ul>
              </div>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2" style={{ color: STUDIO.ivoire }}>
                Une erreur est survenue
              </h2>
              <p className="text-sm mb-6" style={{ color: STUDIO.gris }}>
                {errorMessage || 'Veuillez contacter notre support'}
              </p>
            </>
          )}

          {/* Navigation */}
          <div className="mt-6 pt-6 border-t border-white/10">
            {proposalId && (
              <Link to={`/web-studio/suivi?id=${proposalId}`}>
                <Button variant="outline" className="w-full mb-3 border-white/20 text-white hover:bg-white/10">
                  Suivre ma commande
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="ghost" className="w-full text-white/60 hover:text-white">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
