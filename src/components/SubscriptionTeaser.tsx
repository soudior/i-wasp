/**
 * SubscriptionTeaser - Affichage subtil des avantages Signature
 * Perspicace et non-intrusif - aide l'utilisateur à décider
 */

import { motion } from "framer-motion";
import { Crown, Sparkles, Lock, TrendingUp, Users, BarChart3, Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useStripeSubscription } from "@/hooks/useStripeSubscription";
import { STEALTH } from "@/lib/stealthPalette";

interface SubscriptionTeaserProps {
  variant?: "minimal" | "inline" | "banner" | "contextual";
  context?: "stats" | "leads" | "templates" | "stories" | "dashboard";
  showUpgradeLink?: boolean;
  className?: string;
}

// Features clés qui différencient Signature d'Essentiel
const SIGNATURE_BENEFITS = {
  stats: {
    icon: BarChart3,
    title: "Statistiques en temps réel",
    description: "Voyez qui consulte votre profil",
    benefit: "Optimisez votre impact"
  },
  leads: {
    icon: Users,
    title: "Capture automatique",
    description: "Récoltez les contacts de vos visiteurs",
    benefit: "+47% de conversion en moyenne"
  },
  templates: {
    icon: Sparkles,
    title: "Templates premium",
    description: "Accès à tous les designs exclusifs",
    benefit: "Image professionnelle garantie"
  },
  stories: {
    icon: Zap,
    title: "Stories dynamiques",
    description: "Partagez vos actualités instantanément",
    benefit: "Engagement multiplié par 3"
  },
  dashboard: {
    icon: TrendingUp,
    title: "Dashboard complet",
    description: "Pilotez votre networking efficacement",
    benefit: "Prenez les bonnes décisions"
  }
};

export function SubscriptionTeaser({ 
  variant = "minimal", 
  context = "dashboard",
  showUpgradeLink = true,
  className = ""
}: SubscriptionTeaserProps) {
  const { isGold, isLoading } = useStripeSubscription();

  // Ne rien afficher si déjà Gold ou en chargement
  if (isLoading || isGold) return null;

  const benefit = SIGNATURE_BENEFITS[context];
  const Icon = benefit.icon;

  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 text-xs ${className}`}
        style={{ color: STEALTH.textSecondary }}
      >
        <Lock className="w-3 h-3" style={{ color: STEALTH.accent }} />
        <span>{benefit.title}</span>
        {showUpgradeLink && (
          <Link 
            to="/pricing" 
            className="font-medium transition-colors hover:opacity-80"
            style={{ color: STEALTH.accent }}
          >
            Signature
          </Link>
        )}
      </motion.div>
    );
  }

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${className}`}
        style={{ 
          backgroundColor: `${STEALTH.accent}10`,
          border: `1px solid ${STEALTH.accent}30`
        }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${STEALTH.accent}20` }}
        >
          <Icon className="w-4 h-4" style={{ color: STEALTH.accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: STEALTH.text }}>
            {benefit.title}
          </p>
          <p className="text-xs" style={{ color: STEALTH.textSecondary }}>
            {benefit.benefit}
          </p>
        </div>
        {showUpgradeLink && (
          <Link to="/pricing">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ 
                background: `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.accent}DD)`,
                color: STEALTH.bg
              }}
            >
              <Crown className="w-3 h-3" />
              Signature
            </motion.div>
          </Link>
        )}
      </motion.div>
    );
  }

  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-5 ${className}`}
        style={{ 
          background: `linear-gradient(135deg, ${STEALTH.bgCard} 0%, ${STEALTH.bg} 100%)`,
          border: `1px solid ${STEALTH.accent}30`
        }}
      >
        {/* Subtle glow effect */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: STEALTH.accent }}
        />
        
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${STEALTH.accent}20, ${STEALTH.accent}10)`,
                border: `1px solid ${STEALTH.accent}40`
              }}
            >
              <Icon className="w-6 h-6" style={{ color: STEALTH.accent }} />
            </div>
            <div>
              <p className="font-semibold" style={{ color: STEALTH.text }}>
                {benefit.title}
              </p>
              <p className="text-sm" style={{ color: STEALTH.textSecondary }}>
                {benefit.description}
              </p>
            </div>
          </div>
          
          {showUpgradeLink && (
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.accent}CC)`,
                  color: STEALTH.bg
                }}
              >
                <Crown className="w-4 h-4" />
                Découvrir Signature
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          )}
        </div>
      </motion.div>
    );
  }

  // Contextual - très subtil, s'intègre naturellement
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`group flex items-center gap-2 cursor-pointer ${className}`}
    >
      <Link 
        to="/pricing"
        className="flex items-center gap-2 transition-all hover:gap-3"
      >
        <div 
          className="w-5 h-5 rounded-md flex items-center justify-center transition-colors"
          style={{ 
            backgroundColor: `${STEALTH.accent}15`,
          }}
        >
          <Crown className="w-3 h-3" style={{ color: STEALTH.accent }} />
        </div>
        <span 
          className="text-xs font-medium transition-colors"
          style={{ color: STEALTH.textSecondary }}
        >
          {benefit.benefit}
        </span>
        <ChevronRight 
          className="w-3 h-3 transition-transform group-hover:translate-x-1" 
          style={{ color: STEALTH.accent }} 
        />
      </Link>
    </motion.div>
  );
}

/**
 * LockedFeatureHint - Indication qu'une feature est Signature
 * Ultra-subtil, juste une icône avec tooltip
 */
export function LockedFeatureHint({ 
  feature,
  size = "sm" 
}: { 
  feature: keyof typeof SIGNATURE_BENEFITS;
  size?: "sm" | "md";
}) {
  const { isGold } = useStripeSubscription();
  
  if (isGold) return null;

  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  
  return (
    <Link to="/pricing" className="inline-flex">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-colors"
        style={{ backgroundColor: `${STEALTH.accent}15` }}
        title={`Fonctionnalité Signature: ${SIGNATURE_BENEFITS[feature].title}`}
      >
        <Crown className={sizeClasses} style={{ color: STEALTH.accent }} />
      </motion.div>
    </Link>
  );
}

/**
 * UpgradePrompt - Call-to-action pour upgrade contextuel
 * Apparaît quand l'utilisateur tente d'accéder à une feature Signature
 */
export function UpgradePrompt({ 
  feature,
  onDismiss 
}: { 
  feature: keyof typeof SIGNATURE_BENEFITS;
  onDismiss?: () => void;
}) {
  const benefit = SIGNATURE_BENEFITS[feature];
  const Icon = benefit.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative max-w-sm w-full rounded-3xl overflow-hidden"
        style={{ 
          backgroundColor: STEALTH.bgCard,
          border: `1px solid ${STEALTH.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: STEALTH.accent }}
        />
        
        <div className="relative p-6 text-center">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${STEALTH.accent}30, ${STEALTH.accent}10)`,
              border: `1px solid ${STEALTH.accent}40`
            }}
          >
            <Icon className="w-8 h-8" style={{ color: STEALTH.accent }} />
          </div>
          
          <h3 className="text-lg font-bold mb-2" style={{ color: STEALTH.text }}>
            {benefit.title}
          </h3>
          <p className="text-sm mb-4" style={{ color: STEALTH.textSecondary }}>
            {benefit.description}
          </p>
          
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ 
              backgroundColor: `${STEALTH.accent}15`,
              color: STEALTH.accent
            }}
          >
            <TrendingUp className="w-3 h-3" />
            {benefit.benefit}
          </div>
          
          <div className="flex gap-3">
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-colors"
                style={{ 
                  backgroundColor: STEALTH.border,
                  color: STEALTH.textSecondary
                }}
              >
                Plus tard
              </button>
            )}
            <Link to="/pricing" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ 
                  background: `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.accent}CC)`,
                  color: STEALTH.bg
                }}
              >
                <Crown className="w-4 h-4" />
                Passer à Signature
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
