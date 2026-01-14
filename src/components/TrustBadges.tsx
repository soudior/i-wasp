/**
 * TrustBadges - Composant de preuve sociale et badges de confiance
 * 
 * Augmente la confiance des visiteurs avec:
 * - Compteur de clients
 * - Badges de sécurité
 * - Mini-témoignages
 */

import { motion } from "framer-motion";
import { Shield, Star, Users, CreditCard, Truck, CheckCircle2 } from "lucide-react";

const LUXE = {
  or: "#B8956C",
  orLight: "#D4B896",
  textMuted: "#6B6B6B",
  silk: "#F5F5F5",
};

interface TrustBadgesProps {
  variant?: 'minimal' | 'full';
  showCounter?: boolean;
  className?: string;
}

export function TrustBadges({ 
  variant = 'minimal', 
  showCounter = true,
  className = '' 
}: TrustBadgesProps) {
  const badges = [
    { icon: Shield, label: "Paiement sécurisé" },
    { icon: Truck, label: "Livraison 48h" },
    { icon: CreditCard, label: "Paiement à réception" },
  ];

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center gap-6 flex-wrap ${className}`}>
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2"
          >
            <badge.icon 
              className="w-3.5 h-3.5" 
              style={{ color: LUXE.or }} 
            />
            <span 
              className="text-[10px] uppercase tracking-wider"
              style={{ color: LUXE.textMuted }}
            >
              {badge.label}
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Compteur de clients */}
      {showCounter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-4 h-4" style={{ color: LUXE.or }} />
            <span 
              className="text-2xl font-light tabular-nums"
              style={{ color: LUXE.silk }}
            >
              2,847+
            </span>
          </div>
          <span 
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: LUXE.textMuted }}
          >
            Professionnels équipés
          </span>
        </motion.div>
      )}

      {/* Badges de confiance */}
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${LUXE.or}15` }}
            >
              <badge.icon 
                className="w-4 h-4" 
                style={{ color: LUXE.or }} 
              />
            </div>
            <span 
              className="text-[9px] uppercase tracking-wider text-center"
              style={{ color: LUXE.textMuted }}
            >
              {badge.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Note moyenne */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-3"
      >
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-3 h-3"
              fill={LUXE.or}
              style={{ color: LUXE.or }}
            />
          ))}
        </div>
        <span 
          className="text-xs"
          style={{ color: LUXE.textMuted }}
        >
          4.9/5 · 127 avis
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Mini témoignage pour les pages de conversion
 */
interface MiniTestimonialProps {
  quote: string;
  author: string;
  role: string;
}

export function MiniTestimonial({ quote, author, role }: MiniTestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 max-w-sm"
    >
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${LUXE.or}20` }}
      >
        <CheckCircle2 className="w-4 h-4" style={{ color: LUXE.or }} />
      </div>
      <div>
        <p 
          className="text-xs italic mb-1"
          style={{ color: LUXE.silk }}
        >
          "{quote}"
        </p>
        <p 
          className="text-[10px]"
          style={{ color: LUXE.textMuted }}
        >
          — {author}, {role}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Bandeau d'urgence/rareté
 */
interface UrgencyBannerProps {
  message: string;
  highlight?: string;
}

export function UrgencyBanner({ message, highlight }: UrgencyBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-2 px-4 text-center"
      style={{ backgroundColor: `${LUXE.or}10` }}
    >
      <span 
        className="text-[10px] uppercase tracking-wider"
        style={{ color: LUXE.textMuted }}
      >
        {message}{' '}
        {highlight && (
          <span style={{ color: LUXE.or }}>{highlight}</span>
        )}
      </span>
    </motion.div>
  );
}

export default TrustBadges;
