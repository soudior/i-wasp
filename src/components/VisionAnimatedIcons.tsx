/**
 * Vision Animated Icons Component
 * Icônes dorées animées - Connexion, Donnée, Croissance
 */

import { Wifi, Database, TrendingUp, Sparkles } from "lucide-react";

interface AnimatedIconProps {
  icon: "connection" | "data" | "growth";
  label: string;
  description: string;
}

const iconConfig = {
  connection: {
    Icon: Wifi,
    gradient: "from-amber-400 to-yellow-300",
  },
  data: {
    Icon: Database,
    gradient: "from-yellow-300 to-amber-500",
  },
  growth: {
    Icon: TrendingUp,
    gradient: "from-amber-500 to-yellow-400",
  },
};

function AnimatedIcon({ icon, label, description }: AnimatedIconProps) {
  const { Icon, gradient } = iconConfig[icon];

  return (
    <div className="text-center group">
      {/* Icon container with pulse effect */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-400/30 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
        />
        {/* Icon circle */}
        <div 
          className={`relative w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-amber-500/30`}
        >
          <Icon className="w-8 h-8 text-black" />
        </div>
        {/* Floating particles */}
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>
      </div>
      
      {/* Label */}
      <h3 className="text-white font-semibold text-lg mb-2">{label}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export function VisionAnimatedIcons({ className = "" }: { className?: string }) {
  const icons: AnimatedIconProps[] = [
    {
      icon: "connection",
      label: "Connexion",
      description: "Chaque scan crée un lien instantané entre vous et votre contact.",
    },
    {
      icon: "data",
      label: "Donnée",
      description: "Collectez, analysez et exploitez chaque interaction pour croître.",
    },
    {
      icon: "growth",
      label: "Croissance",
      description: "Transformez vos contacts en opportunités business mesurables.",
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {icons.map((iconProps) => (
        <AnimatedIcon key={iconProps.icon} {...iconProps} />
      ))}
    </div>
  );
}

/**
 * Premium badge section with certification seal
 */
export function CertifiedBadgeSection({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      {/* Badge container */}
      <div className="inline-flex flex-col items-center">
        {/* Golden seal */}
        <div className="relative w-32 h-32 mb-6">
          {/* Outer ring with shimmer */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/50" />
          <div className="absolute inset-2 rounded-full border-2 border-amber-500/30" />
          
          {/* Center */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
            <div className="text-center">
              <span className="block text-black font-bold text-xs tracking-wider">CERTIFIÉ</span>
              <span className="block text-black font-black text-lg">i-wasp</span>
            </div>
          </div>
          
          {/* Sparkle accents */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400" />
          <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-300" />
        </div>
        
        <h3 className="text-white font-bold text-xl mb-2">Standard de Confiance Mondial</h3>
        <p className="text-zinc-400 text-sm max-w-md">
          Seuls les modèles premium sont visibles. Chaque carte certifiée garantit l'image de marque i-wasp.
        </p>
      </div>
    </div>
  );
}
