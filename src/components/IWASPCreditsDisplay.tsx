/**
 * i-wasp Credits Display Component
 * Shows user's available credits and credit-related messages
 * 
 * Branding:
 * - "i-wasp Credits" (jamais "Lovable Credits")
 * - "Powered by i-wasp Advanced IA"
 * - Couleurs i-wasp officielles
 */

import { motion } from 'framer-motion';
import { Sparkles, Coins, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Couleurs officielles i-wasp
const COLORS = {
  gold: "#D4A853",
  goldLight: "#E8C87A",
  noir: "#050505",
  noirSoft: "#0A0A0A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

interface IWASPCreditsDisplayProps {
  credits: number;
  maxCredits?: number;
  isUnlimited?: boolean;
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Display user's i-wasp Credits balance
 */
export function IWASPCreditsDisplay({
  credits,
  maxCredits,
  isUnlimited = false,
  variant = 'full',
  className,
}: IWASPCreditsDisplayProps) {
  const isLow = !isUnlimited && credits <= 2;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
          className
        )}
        style={{
          backgroundColor: `${COLORS.gold}15`,
          border: `1px solid ${COLORS.gold}30`,
        }}
      >
        <Coins size={14} style={{ color: COLORS.gold }} />
        <span 
          className="text-sm font-medium"
          style={{ color: COLORS.ivoire }}
        >
          {isUnlimited ? '∞' : credits}
        </span>
        <span 
          className="text-xs"
          style={{ color: COLORS.gris }}
        >
          i-wasp Credits
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-2xl",
        className
      )}
      style={{
        backgroundColor: COLORS.noirSoft,
        border: `1px solid ${isLow ? '#ef4444' : COLORS.gold}30`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${COLORS.gold}20` }}
          >
            <Sparkles size={20} style={{ color: COLORS.gold }} />
          </div>
          <div>
            <h3 
              className="text-sm font-medium"
              style={{ color: COLORS.ivoire }}
            >
              i-wasp Credits
            </h3>
            <p 
              className="text-xs"
              style={{ color: COLORS.gris }}
            >
              Powered by i-wasp Advanced IA
            </p>
          </div>
        </div>
        
        {!isUnlimited && maxCredits && (
          <span 
            className="text-xs"
            style={{ color: COLORS.gris }}
          >
            {credits}/{maxCredits} ce mois
          </span>
        )}
      </div>

      {/* Credits Display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span 
          className="text-4xl font-light tracking-tight"
          style={{ color: isLow ? '#ef4444' : COLORS.gold }}
        >
          {isUnlimited ? '∞' : credits}
        </span>
        <span 
          className="text-lg"
          style={{ color: COLORS.gris }}
        >
          {isUnlimited ? 'Illimités' : 'disponibles'}
        </span>
      </div>

      {/* Progress bar (if not unlimited) */}
      {!isUnlimited && maxCredits && (
        <div 
          className="w-full h-2 rounded-full overflow-hidden mb-4"
          style={{ backgroundColor: `${COLORS.gris}30` }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(credits / maxCredits) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: isLow 
                ? '#ef4444' 
                : `linear-gradient(90deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`,
            }}
          />
        </div>
      )}

      {/* Status message */}
      <p 
        className="text-sm"
        style={{ color: COLORS.gris }}
      >
        {isUnlimited 
          ? "Crédits illimités avec votre plan Enterprise"
          : isLow 
            ? "Crédits bientôt épuisés. Passez à un plan supérieur."
            : "Utilisez vos crédits pour générer des sites, designs et profils IA."
        }
      </p>
    </motion.div>
  );
}

/**
 * Credit cost indicator for actions
 */
interface CreditCostProps {
  cost: number;
  className?: string;
}

export function IWASPCreditCost({ cost, className }: CreditCostProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
        className
      )}
      style={{
        backgroundColor: `${COLORS.gold}15`,
        color: COLORS.gold,
      }}
    >
      <Zap size={12} />
      <span>Cette action coûte {cost} i-wasp Credit{cost > 1 ? 's' : ''}</span>
    </div>
  );
}

/**
 * Call to action for buying credits
 */
interface BuyCreditsProps {
  className?: string;
  onClick?: () => void;
}

export function IWASPBuyCredits({ className, onClick }: BuyCreditsProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`,
        color: COLORS.noir,
      }}
    >
      <Coins size={16} />
      Achetez des i-wasp Credits
    </button>
  );
}

export default IWASPCreditsDisplay;
