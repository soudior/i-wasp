/**
 * SaaS Pricing Card Component
 * Displays the new tiered pricing: FREE (0€), PRO (12€/mois), BUSINESS (39€/mois)
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Zap, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSaaSSubscription } from '@/hooks/useSaaSSubscription';
import { SAAS_PLANS, SaaSPlanId } from '@/lib/saasPlans';

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

const planIcons = {
  free: Zap,
  pro: Star,
  business: Crown,
};

interface SaaSPricingCardProps {
  planId: SaaSPlanId;
  isCurrentPlan?: boolean;
}

export function SaaSPricingCard({ planId, isCurrentPlan = false }: SaaSPricingCardProps) {
  const { user } = useAuth();
  const { isSubscribed, refresh } = useSaaSSubscription();
  const [isLoading, setIsLoading] = useState(false);
  
  const plan = SAAS_PLANS[planId.toUpperCase() as keyof typeof SAAS_PLANS];
  const Icon = planIcons[planId] || Zap;
  const isPopular = 'isPopular' in plan && plan.isPopular;
  const isFree = planId === 'free';

  const handleSubscribe = async () => {
    if (isFree) {
      toast.info("Vous utilisez déjà le plan gratuit");
      return;
    }

    if (!user) {
      toast.error("Veuillez vous connecter pour souscrire");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-saas-checkout', {
        body: { planId }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      toast.error("Erreur lors de la souscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast.error("Erreur lors de l'accès au portail");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl p-6 md:p-8 flex flex-col h-full"
      style={{
        backgroundColor: isPopular ? `${COLORS.or}08` : COLORS.noirCard,
        border: `1px solid ${isPopular ? `${COLORS.or}40` : COLORS.border}`,
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge 
            className="px-4 py-1 text-xs font-medium"
            style={{ backgroundColor: COLORS.or, color: COLORS.noir }}
          >
            ⭐ Plus populaire
          </Badge>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge 
            className="px-3 py-1 text-xs"
            style={{ backgroundColor: '#22C55E', color: 'white' }}
          >
            Votre plan
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${COLORS.or}15` }}
        >
          <Icon size={24} style={{ color: COLORS.or }} />
        </div>
        
        <h3 className="text-xl font-medium mb-1" style={{ color: COLORS.ivoire }}>
          {plan.name}
        </h3>
        <p className="text-sm" style={{ color: COLORS.gris }}>
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          {isFree ? (
            <span className="text-4xl font-light" style={{ color: COLORS.ivoire }}>Gratuit</span>
          ) : (
            <>
              <span className="text-4xl font-light" style={{ color: COLORS.ivoire }}>
                {plan.priceEur}€
              </span>
              <span className="text-lg" style={{ color: COLORS.gris }}>
                /mois
              </span>
            </>
          )}
        </div>
        {!isFree && 'priceMad' in plan && (
          <p className="text-sm mt-1" style={{ color: COLORS.gris }}>
            ou {plan.priceMad} DH/mois
          </p>
        )}
        {!isFree && 'priceEurAnnual' in plan && (
          <p className="text-xs mt-2" style={{ color: COLORS.or }}>
            {plan.priceEurAnnual}€/an (-25%)
          </p>
        )}
      </div>

      {/* Features */}
      <div className="flex-1 mb-6">
        <ul className="space-y-3">
          {plan.included.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${COLORS.or}20` }}
              >
                <Check size={12} style={{ color: COLORS.or }} />
              </div>
              <span className="text-sm" style={{ color: COLORS.ivoire }}>
                {feature}
              </span>
            </li>
          ))}
          
          {plan.excluded.map((feature, index) => (
            <li key={`ex-${index}`} className="flex items-start gap-3 opacity-50">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${COLORS.gris}20` }}
              >
                <X size={12} style={{ color: COLORS.gris }} />
              </div>
              <span className="text-sm line-through" style={{ color: COLORS.gris }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div>
        {isCurrentPlan ? (
          <Button
            onClick={handleManage}
            disabled={isLoading || isFree}
            className="w-full py-6"
            variant="outline"
            style={{ 
              borderColor: COLORS.border,
              color: COLORS.ivoire,
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isFree ? 'Plan actuel' : 'Gérer l\'abonnement'}
          </Button>
        ) : (
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-6"
            style={{ 
              backgroundColor: isPopular ? COLORS.or : 'transparent',
              color: isPopular ? COLORS.noir : COLORS.ivoire,
              border: isPopular ? 'none' : `1px solid ${COLORS.border}`,
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isFree ? 'Commencer gratuitement' : 'Souscrire'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
