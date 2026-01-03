/**
 * Animated IWASP Logo Component
 * Logo animé Or sur fond Noir - Animation d'entrée premium
 */

import { useEffect, useState } from "react";

interface AnimatedIWASPLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showAnimation?: boolean;
}

export function AnimatedIWASPLogo({ 
  className = "", 
  size = "lg",
  showAnimation = true 
}: AnimatedIWASPLogoProps) {
  const [isVisible, setIsVisible] = useState(!showAnimation);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
    xl: "h-24"
  };

  return (
    <div 
      className={`flex items-center gap-2 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {/* Logo SVG animé */}
      <svg 
        viewBox="0 0 120 32" 
        className={sizeClasses[size]}
        fill="none"
      >
        {/* Définitions des dégradés */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5C542" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37">
              <animate 
                attributeName="stop-color" 
                values="#D4AF37;#FFD700;#D4AF37" 
                dur="2s" 
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#FFD700">
              <animate 
                attributeName="stop-color" 
                values="#FFD700;#F5C542;#FFD700" 
                dur="2s" 
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#D4AF37">
              <animate 
                attributeName="stop-color" 
                values="#D4AF37;#FFD700;#D4AF37" 
                dur="2s" 
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Texte i-wasp avec effet doré */}
        <text 
          x="4" 
          y="24" 
          fontFamily="'Inter', system-ui, sans-serif" 
          fontSize="24" 
          fontWeight="700" 
          fill="url(#goldShimmer)"
          filter="url(#goldGlow)"
          letterSpacing="-0.02em"
        >
          i-wasp
        </text>

        {/* Ondes NFC dorées animées */}
        <g transform="translate(90, 8)">
          <path 
            d="M0 12a5 5 0 0 1 5-5" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            <animate 
              attributeName="opacity" 
              values="0.6;1;0.6" 
              dur="1.5s" 
              repeatCount="indefinite"
            />
          </path>
          <path 
            d="M0 12a9 9 0 0 1 9-9" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          >
            <animate 
              attributeName="opacity" 
              values="0.4;0.8;0.4" 
              dur="1.5s" 
              repeatCount="indefinite"
              begin="0.2s"
            />
          </path>
          <path 
            d="M0 12a13 13 0 0 1 13-13" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeLinecap="round"
            fill="none"
            opacity="0.2"
          >
            <animate 
              attributeName="opacity" 
              values="0.2;0.6;0.2" 
              dur="1.5s" 
              repeatCount="indefinite"
              begin="0.4s"
            />
          </path>
          <circle 
            cx="0" 
            cy="12" 
            r="2" 
            fill="url(#goldGradient)"
          >
            <animate 
              attributeName="r" 
              values="2;2.5;2" 
              dur="1s" 
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}

/**
 * Slogan component - "Connecter le physique au digital. Redéfinir l'influence."
 */
export function IWASPSlogan({ className = "" }: { className?: string }) {
  return (
    <p className={`text-amber-400/80 text-sm md:text-base font-light tracking-wide ${className}`}>
      Connecter le physique au digital. Redéfinir l'influence.
    </p>
  );
}

/**
 * Full branding header with logo + slogan
 */
export function IWASPBrandHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center space-y-2 ${className}`}>
      <AnimatedIWASPLogo size="lg" className="justify-center" />
      <IWASPSlogan />
    </div>
  );
}
