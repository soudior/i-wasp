/**
 * GoldFeatureCard - Composant pour les fonctionnalités verrouillées GOLD
 */

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Lock, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface GoldFeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isUnlocked: boolean;
  children: ReactNode;
}

export function GoldFeatureCard({
  title,
  description,
  icon,
  isUnlocked,
  children,
}: GoldFeatureCardProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D1D1F] to-[#2D2D30] opacity-95" />
      
      {/* Gold border glow for unlocked */}
      {isUnlocked && (
        <div className="absolute inset-0 rounded-2xl border border-[#D4AF37]/30" />
      )}
      
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isUnlocked 
                ? "bg-gradient-to-br from-[#D4AF37] to-[#F5D76E]" 
                : "bg-white/10"
            }`}>
              <span className={isUnlocked ? "text-[#1D1D1F]" : "text-white/50"}>
                {icon}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                {title}
                <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] text-[10px] px-1.5 py-0 font-bold border-0">
                  <Crown className="w-2.5 h-2.5 mr-0.5" />
                  GOLD
                </Badge>
              </h3>
              <p className="text-white/50 text-xs">{description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isUnlocked ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        ) : (
          <div className="relative">
            {/* Blurred content preview */}
            <div className="filter blur-sm opacity-30 pointer-events-none select-none">
              {children}
            </div>
            
            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#1D1D1F]/50 backdrop-blur-sm rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center border border-[#D4AF37]/30">
                <Lock className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <p className="text-white/70 text-sm text-center max-w-[200px]">
                Devenez membre <span className="text-[#D4AF37] font-semibold">GOLD</span> pour activer cette fonctionnalité
              </p>
              <Link to="/order/type">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] hover:from-[#C9A431] hover:to-[#E5C75E] font-semibold"
                >
                  <Crown className="w-4 h-4 mr-1.5" />
                  Passer à GOLD
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * GoldVerificationBadge - Badge de vérification pour les membres GOLD
 */
export function GoldVerificationBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] text-xs font-bold ${className}`}
    >
      <Crown className="w-3 h-3" />
      <span>Vérifié</span>
    </motion.div>
  );
}
