/**
 * i-wasp Studio Badge Component
 * Branding component for marketing and UI
 * 
 * Messages marketing:
 * - "Créez avec i-wasp Studio"
 * - "Technologie propriétaire i-wasp"
 * - "Plateforme d'identité digitale i-wasp"
 * - "Powered by i-wasp Advanced IA"
 * 
 * JAMAIS de mention "Lovable" dans l'interface client !
 */

import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe } from 'lucide-react';
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

type BadgeVariant = 'studio' | 'ai' | 'cloud' | 'platform';

interface IWASPStudioBadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variants = {
  studio: {
    icon: Sparkles,
    text: "Créez avec i-wasp Studio",
    subtext: "Technologie propriétaire i-wasp",
  },
  ai: {
    icon: Zap,
    text: "Powered by i-wasp Advanced IA",
    subtext: "Intelligence artificielle propriétaire",
  },
  cloud: {
    icon: Globe,
    text: "i-wasp Cloud Infrastructure",
    subtext: "Hébergement haute performance",
  },
  platform: {
    icon: Shield,
    text: "Plateforme i-wasp",
    subtext: "Identité digitale de confiance",
  },
};

export function IWASPStudioBadge({
  variant = 'studio',
  size = 'md',
  className,
}: IWASPStudioBadgeProps) {
  const config = variants[variant];
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: "px-3 py-1.5 gap-1.5",
      icon: 12,
      text: "text-xs",
      subtext: "text-[10px]",
    },
    md: {
      container: "px-4 py-2 gap-2",
      icon: 14,
      text: "text-sm",
      subtext: "text-xs",
    },
    lg: {
      container: "px-5 py-2.5 gap-2.5",
      icon: 16,
      text: "text-base",
      subtext: "text-sm",
    },
  };

  const s = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex items-center rounded-full",
        s.container,
        className
      )}
      style={{
        backgroundColor: `${COLORS.gold}15`,
        border: `1px solid ${COLORS.gold}30`,
      }}
    >
      <Icon size={s.icon} style={{ color: COLORS.gold }} />
      <div className="flex flex-col">
        <span 
          className={cn("font-medium", s.text)}
          style={{ color: COLORS.ivoire }}
        >
          {config.text}
        </span>
        <span 
          className={cn("opacity-70", s.subtext)}
          style={{ color: COLORS.gris }}
        >
          {config.subtext}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Compact inline badge for headers/footers
 */
interface InlineBadgeProps {
  text?: string;
  className?: string;
}

export function IWASPInlineBadge({ 
  text = "Powered by i-wasp Advanced IA",
  className 
}: InlineBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs uppercase tracking-widest",
        className
      )}
      style={{ color: COLORS.gold }}
    >
      <Sparkles size={10} />
      {text}
    </span>
  );
}

/**
 * Domain badge for studio branding
 */
export function IWASPDomainBadge({ className }: { className?: string }) {
  return (
    <a
      href="https://studio.i-wasp.com"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      style={{
        backgroundColor: COLORS.noirSoft,
        border: `1px solid ${COLORS.gold}30`,
      }}
    >
      <Globe size={14} style={{ color: COLORS.gold }} />
      <span className="text-sm font-medium" style={{ color: COLORS.ivoire }}>
        studio.i-wasp.com
      </span>
    </a>
  );
}

export default IWASPStudioBadge;
