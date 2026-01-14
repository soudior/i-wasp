/**
 * SaaS Pricing Card Component
 * Displays the new tiered pricing: Identity ($29), Professional ($79), Enterprise ($249)
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
import { SAAS_PLANS, SaaSPlanId, formatSaaSPrice } from '@/lib/saasPlans';

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
  identity: Zap,
  professional: Star,
  enterprise: Crown,
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
    if (!user) {
      toast.error('Veuillez vous connecter pour souscrire');
      return;
    }

    if (isCurrentPlan) {
      toast.info('Vous êtes déjà abonné à ce plan');
      return;
    }

    if (isFree) {
      toast.info('Le plan gratuit est déjà actif');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-saas-checkout', {
        body: { plan: planId },
      });

      if (error) throw error;

      if (data?.already_subscribed) {
        toast.info('Vous êtes déjà abonné à ce plan');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Redirection vers le paiement sécurisé...');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Erreur lors de la création du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative p-8 rounded-3xl ${isPopular ? "md:-mt-4 md:mb-4" : ""}`}
      style={{ 
        backgroundColor: isPopular ? `${COLORS.or}08` : COLORS.noirCard,
        border: `1px solid ${isPopular ? COLORS.or : isCurrentPlan ? '#22c55e' : COLORS.border}40`,
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span 
            className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider flex items-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
              color: COLORS.noir,
              boxShadow: `0 4px 20px ${COLORS.or}40`,
            }}
          >
            <Star size={12} />
            Plus populaire
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <Badge className="bg-green-500 text-white">
            Votre plan actuel
          </Badge>
        </div>
      )}

      {/* Icon */}
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ 
          backgroundColor: isPopular ? `${COLORS.or}20` : `${COLORS.gris}15`,
          border: `1px solid ${isPopular ? COLORS.or : COLORS.gris}30`,
        }}
      >
        <Icon size={24} style={{ color: isPopular ? COLORS.or : COLORS.gris }} />
      </div>

      {/* Plan Name */}
      <h3 className="text-2xl font-medium mb-1 tracking-tight" style={{ color: COLORS.ivoire }}>
        {plan.name}
      </h3>
      <p className="text-sm mb-2" style={{ color: COLORS.or }}>
        {'tagline' in plan ? plan.tagline : ''}
      </p>
      <p className="text-sm mb-6 font-light" style={{ color: COLORS.gris }}>
        {plan.description}
      </p>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          {isFree ? (
            <span className="text-4xl font-light" style={{ color: COLORS.ivoire }}>Gratuit</span>
          ) : (
            <>
              <span className="text-4xl font-light" style={{ color: COLORS.ivoire }}>
                {formatSaaSPrice(plan.price)}
              </span>
              <span className="text-lg" style={{ color: COLORS.gris }}>
                /mois
              </span>
            </>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <Button 
        className="w-full py-6 font-medium text-sm uppercase tracking-widest"
        style={{ 
          background: isCurrentPlan
            ? '#22c55e'
            : isPopular 
              ? `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`
              : "transparent",
          color: isCurrentPlan || isPopular ? COLORS.noir : COLORS.ivoire,
          border: isCurrentPlan || isPopular ? "none" : `1px solid ${COLORS.border}`,
        }}
        onClick={handleSubscribe}
        disabled={isLoading || isCurrentPlan || isFree}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isCurrentPlan ? (
          'Plan actuel'
        ) : isFree ? (
          'Plan gratuit'
        ) : (
          'Commencer'
        )}
      </Button>

      {/* Features List */}
      <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <h4 className="text-xs uppercase tracking-widest mb-4" style={{ color: COLORS.gris }}>
          Inclus
        </h4>
        <ul className="space-y-3">
          {plan.included.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: COLORS.gris }}>
              <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.or }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {plan.excluded.length > 0 && (
          <>
            <h4 className="text-xs uppercase tracking-widest mb-4 mt-6" style={{ color: COLORS.gris }}>
              Non inclus
            </h4>
            <ul className="space-y-3">
              {plan.excluded.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: `${COLORS.gris}60` }}>
                  <X size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.div>
  );
}
