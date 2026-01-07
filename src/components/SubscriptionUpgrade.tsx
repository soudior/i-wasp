/**
 * SubscriptionUpgrade - Composant pour upgrader vers Signature
 * Gère l'upgrade d'abonnement et la mise à jour en base de données
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, ArrowRight, Loader2, Star, Shield, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptionPlans';

interface SubscriptionUpgradeProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function SubscriptionUpgrade({ onClose, onSuccess }: SubscriptionUpgradeProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour vous abonner');
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate expiration date based on plan
      const now = new Date();
      const expiresAt = new Date(now);
      if (selectedPlan === 'annual') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      // Price in centimes
      const priceCents = selectedPlan === 'annual' 
        ? SUBSCRIPTION_PLANS.SIGNATURE.priceAnnual * 100 
        : SUBSCRIPTION_PLANS.SIGNATURE.priceMonthly * 100;

      // Check if subscription exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingSub) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan: 'signature',
            status: 'active',
            price_cents: priceCents,
            currency: 'MAD',
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            payment_method: 'pending', // Will be updated after actual payment
            updated_at: now.toISOString(),
            notes: `Upgrade to Signature (${selectedPlan})`
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan: 'signature',
            status: 'active',
            price_cents: priceCents,
            currency: 'MAD',
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            payment_method: 'pending',
            notes: `New Signature subscription (${selectedPlan})`
          });

        if (error) throw error;
      }

      setStep('success');
      toast.success('🎉 Bienvenue dans Signature !');
      onSuccess?.();

    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error('Erreur lors de la mise à niveau. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    'Profil 100% dynamique',
    'Mises à jour illimitées',
    'Templates premium',
    'Statistiques de visites',
    'Capture de contacts',
    'Support prioritaire',
    'Badge Signature',
    'Conseiller IA dédié'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ backgroundColor: '#0A0F0D', border: '1px solid rgba(165, 169, 180, 0.2)' }}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Glow effect */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[150px] pointer-events-none"
          style={{ backgroundColor: 'rgba(165, 169, 180, 0.1)' }}
        />

        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative p-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #A5A9B4, #D1D5DB)' }}
                >
                  <Crown className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Passez à Signature</h2>
                <p className="text-[#A5A9B4]">L'expérience conciergerie complète</p>
              </div>

              {/* Plan selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPlan === 'monthly' 
                      ? 'border-[#A5A9B4] bg-[#A5A9B4]/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <p className="text-white font-semibold">49 DH</p>
                  <p className="text-xs text-[#A5A9B4]">/mois</p>
                </button>
                <button
                  onClick={() => setSelectedPlan('annual')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedPlan === 'annual' 
                      ? 'border-[#A5A9B4] bg-[#A5A9B4]/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-green-500 text-[10px] font-bold text-white">
                    -17%
                  </div>
                  <p className="text-white font-semibold">490 DH</p>
                  <p className="text-xs text-[#A5A9B4]">/an</p>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-8">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-[#A5A9B4] flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={() => setStep('confirm')}
                className="w-full py-6 text-lg font-semibold"
                style={{ 
                  background: 'linear-gradient(135deg, #A5A9B4, #D1D5DB)',
                  color: '#050807'
                }}
              >
                Continuer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative p-8"
            >
              <div className="text-center mb-8">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(165, 169, 180, 0.2)' }}
                >
                  <Shield className="w-8 h-8 text-[#A5A9B4]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Confirmer l'abonnement</h2>
                <p className="text-[#A5A9B4]">
                  {selectedPlan === 'annual' ? '490 DH/an' : '49 DH/mois'}
                </p>
              </div>

              <div 
                className="p-4 rounded-xl mb-6"
                style={{ backgroundColor: 'rgba(165, 169, 180, 0.1)', border: '1px solid rgba(165, 169, 180, 0.2)' }}
              >
                <p className="text-sm text-[#A5A9B4] mb-3">Récapitulatif :</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Plan Signature ({selectedPlan === 'annual' ? 'Annuel' : 'Mensuel'})</span>
                    <span className="font-semibold">{selectedPlan === 'annual' ? '490' : '49'} DH</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-[#A5A9B4] mb-6">
                En continuant, vous acceptez nos conditions d'utilisation. Le paiement sera traité séparément.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('select')}
                  className="flex-1 py-6 border-white/20 text-white hover:bg-white/5"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="flex-1 py-6 font-semibold"
                  style={{ 
                    background: 'linear-gradient(135deg, #A5A9B4, #D1D5DB)',
                    color: '#050807'
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Confirmer
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #A5A9B4, #D1D5DB)' }}
              >
                <Sparkles className="w-10 h-10 text-black" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">Bienvenue dans Signature !</h2>
              <p className="text-[#A5A9B4] mb-8">
                Vous avez maintenant accès à toutes les fonctionnalités premium.
              </p>

              <Button
                onClick={onClose}
                className="w-full py-6 font-semibold"
                style={{ 
                  background: 'linear-gradient(135deg, #A5A9B4, #D1D5DB)',
                  color: '#050807'
                }}
              >
                Commencer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
