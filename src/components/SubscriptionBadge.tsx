/**
 * SubscriptionBadge - Affiche le badge d'abonnement actuel
 */

import { Crown, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';

interface SubscriptionBadgeProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function SubscriptionBadge({ showLabel = true, size = 'md', onClick }: SubscriptionBadgeProps) {
  const { isGold, plan, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
    );
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (isGold) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClasses[size]} rounded-full flex items-center ${showLabel ? 'gap-2 px-4' : 'justify-center'}`}
        style={{ 
          background: 'linear-gradient(135deg, #A5A9B4, #D1D5DB)',
        }}
      >
        <Crown className={`${iconSizes[size]} text-black`} />
        {showLabel && (
          <span className="text-sm font-semibold text-black">Signature</span>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${sizeClasses[size]} rounded-full flex items-center ${showLabel ? 'gap-2 px-4' : 'justify-center'} border border-white/20 hover:border-[#A5A9B4]/50 transition-colors`}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    >
      <Star className={`${iconSizes[size]} text-[#A5A9B4]`} />
      {showLabel && (
        <span className="text-sm text-[#A5A9B4]">
          Passer à Signature
        </span>
      )}
    </motion.button>
  );
}
