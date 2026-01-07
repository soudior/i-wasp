/**
 * SubscriptionUpgrade - Composant pour upgrader vers Gold via Stripe
 * Redirige vers Stripe Checkout pour le paiement
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, ArrowRight, Loader2, Shield, Sparkles, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { STRIPE_PRODUCTS, formatStripePrice } from '@/lib/stripeConfig';

interface SubscriptionUpgradeProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function SubscriptionUpgrade({ isOpen = true, onClose, onSuccess }: SubscriptionUpgradeProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour vous abonner');
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe Checkout in new tab
        window.open(data.url, '_blank');
        toast.success('Redirection vers le paiement sécurisé...');
        onSuccess?.();
        onClose?.();
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error('Erreur lors de la création du paiement. Veuillez réessayer.');
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
    'Badge Gold',
    'Conseiller IA dédié'
  ];

  const monthlyPrice = STRIPE_PRODUCTS.GOLD_MONTHLY.price;
  const annualPrice = STRIPE_PRODUCTS.GOLD_ANNUAL.price;
  const savingsPercent = Math.round((1 - (annualPrice / (monthlyPrice * 12))) * 100);

  if (!isOpen) return null;

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
        style={{ backgroundColor: '#0A0F0D', border: '1px solid rgba(212, 175, 55, 0.2)' }}
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
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}
        />

        <motion.div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F4D03F)' }}
            >
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Passez à Gold</h2>
            <p className="text-[#A5A9B4]">L'expérience premium complète</p>
          </div>

          {/* Plan selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <p className="text-white font-semibold">{formatStripePrice(monthlyPrice)}</p>
              <p className="text-xs text-[#A5A9B4]">/mois</p>
            </button>
            <button
              onClick={() => setSelectedPlan('annual')}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedPlan === 'annual' 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-green-500 text-[10px] font-bold text-white">
                -{savingsPercent}%
              </div>
              <p className="text-white font-semibold">{formatStripePrice(annualPrice)}</p>
              <p className="text-xs text-[#A5A9B4]">/an</p>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Recap */}
          <div 
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
          >
            <div className="flex justify-between items-center text-white">
              <span>Plan Gold ({selectedPlan === 'annual' ? 'Annuel' : 'Mensuel'})</span>
              <span className="font-bold text-lg">
                {formatStripePrice(selectedPlan === 'annual' ? annualPrice : monthlyPrice)}
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-[#A5A9B4] mb-6">
            <Shield className="w-3 h-3 inline mr-1" />
            Paiement sécurisé par Stripe. Annulez à tout moment.
          </p>

          {/* CTA */}
          <Button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full py-6 text-lg font-semibold gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
              color: '#050807'
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Préparation...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Passer à Gold
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
