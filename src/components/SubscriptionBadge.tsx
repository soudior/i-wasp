/**
 * SubscriptionBadge - Affiche le badge d'abonnement actuel
 * Utilise useStripeSubscription pour le statut réel Stripe
 */

import { useState } from 'react';
import { Crown, Star, Settings, Loader2, ExternalLink, FileText } from 'lucide-react';
import { useStripeSubscription } from '@/hooks/useStripeSubscription';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SubscriptionBadgeProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function SubscriptionBadge({ showLabel = true, size = 'md', onClick }: SubscriptionBadgeProps) {
  const { isGold, subscription, isLoading } = useStripeSubscription();
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Ouverture du portail de gestion...');
      } else {
        throw new Error('No portal URL received');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast.error('Impossible d\'ouvrir le portail. Veuillez réessayer.');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
    );
  }

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const formatEndDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isGold) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${sizeClasses[size]} rounded-full flex items-center ${showLabel ? 'gap-2 px-4' : 'justify-center px-2'}`}
            style={{ 
              background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
            }}
          >
            <Crown className={`${iconSizes[size]} text-black`} />
            {showLabel && (
              <span className="text-sm font-semibold text-black">Gold</span>
            )}
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-[#0A0F0D] border-white/10">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-white">Abonnement Gold</p>
            {subscription.subscriptionEnd && (
              <p className="text-xs text-[#A5A9B4] mt-1">
                Renouvellement : {formatEndDate(subscription.subscriptionEnd)}
              </p>
            )}
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild>
            <Link to="/subscription" className="text-white hover:bg-white/10 cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Voir les détails
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleManageSubscription}
            disabled={isOpeningPortal}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            {isOpeningPortal ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Settings className="w-4 h-4 mr-2" />
            )}
            Gérer mon abonnement
            <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${sizeClasses[size]} rounded-full flex items-center ${showLabel ? 'gap-2 px-4' : 'justify-center px-2'} border border-white/20 hover:border-[#D4AF37]/50 transition-colors`}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    >
      <Star className={`${iconSizes[size]} text-[#D4AF37]`} />
      {showLabel && (
        <span className="text-sm text-[#A5A9B4]">
          Passer à Gold
        </span>
      )}
    </motion.button>
  );
}
