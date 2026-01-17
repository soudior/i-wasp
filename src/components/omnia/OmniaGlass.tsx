/**
 * Omnia Glass Components
 * 
 * Composants avec l'esthétique "Omnia Glass":
 * - Background: rgba(255, 255, 255, 0.02)
 * - Blur: backdrop-filter: blur(50px)
 * - Bordures: 1px solid rgba(255, 255, 255, 0.05)
 * - Coins: Arrondis massifs (4rem ou full)
 */

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OmniaGlassProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle" | "floating";
  rounded?: "omnia" | "full" | "lg";
  glow?: boolean;
}

export function OmniaGlass({ 
  children, 
  className,
  variant = "default",
  rounded = "omnia",
  glow = false,
  ...props 
}: OmniaGlassProps) {
  const variants = {
    default: "bg-white/[0.02] border-white/[0.05]",
    elevated: "bg-white/[0.03] border-white/[0.08]",
    subtle: "bg-white/[0.01] border-white/[0.03]",
    floating: "bg-white/[0.02] border-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.4)]",
  };
  
  const radiusClasses = {
    omnia: "rounded-[4rem]",
    full: "rounded-full",
    lg: "rounded-3xl",
  };
  
  return (
    <motion.div
      className={cn(
        "backdrop-blur-[50px] border",
        variants[variant],
        radiusClasses[rounded],
        glow && "shadow-[0_0_80px_rgba(220,199,176,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA BUTTON — Effet Silk
// ═══════════════════════════════════════════════════════════════════════════

interface OmniaButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "champagne";
  size?: "default" | "lg" | "xl";
}

export function OmniaButton({ 
  children, 
  className,
  variant = "primary",
  size = "default",
  ...props 
}: OmniaButtonProps) {
  const variants = {
    primary: "bg-omnia-champagne text-omnia-obsidienne hover:bg-omnia-champagne-light",
    ghost: "bg-transparent text-omnia-ivoire border border-white/10 hover:border-omnia-champagne/30 hover:text-omnia-champagne",
    champagne: "bg-omnia-champagne/10 text-omnia-champagne border border-omnia-champagne/20 hover:bg-omnia-champagne/20",
  };
  
  const sizes = {
    default: "px-8 py-4 text-xs",
    lg: "px-10 py-5 text-sm",
    xl: "px-12 py-6 text-sm",
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={cn(
        "relative overflow-hidden font-body font-light",
        "tracking-[0.2em] uppercase",
        "rounded-full transition-all duration-[1200ms]",
        "focus:outline-none focus:ring-2 focus:ring-omnia-champagne/20",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA TEXT — Typographie hiérarchique
// ═══════════════════════════════════════════════════════════════════════════

interface OmniaTextProps {
  children: ReactNode;
  variant?: "display" | "h1" | "h2" | "h3" | "body" | "caption" | "technical";
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  champagne?: boolean;
}

export function OmniaText({ 
  children, 
  variant = "body",
  className,
  as,
  champagne = false,
}: OmniaTextProps) {
  const variants = {
    display: "font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-[0.1em] leading-[0.9]",
    h1: "font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.08em] leading-[1.1]",
    h2: "font-display text-3xl sm:text-4xl font-normal tracking-[0.06em] leading-[1.2]",
    h3: "font-display text-xl sm:text-2xl font-normal tracking-[0.04em] leading-[1.3]",
    body: "font-body text-base font-extralight tracking-wide leading-relaxed",
    caption: "font-body text-sm font-extralight tracking-wider leading-relaxed",
    technical: "font-mono text-xs tracking-widest uppercase",
  };
  
  const Component = as || (variant === "display" ? "h1" : variant.startsWith("h") ? variant : "p") as keyof JSX.IntrinsicElements;
  
  return (
    <Component 
      className={cn(
        variants[variant],
        champagne ? "text-omnia-champagne" : "text-omnia-ivoire",
        className
      )}
    >
      {children}
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA CARD 3D — Carte flottante avec reflets
// ═══════════════════════════════════════════════════════════════════════════

interface OmniaCard3DProps {
  className?: string;
}

export function OmniaCard3D({ className }: OmniaCard3DProps) {
  return (
    <motion.div
      initial={{ rotateX: 5, rotateY: -10, opacity: 0 }}
      animate={{ rotateX: 0, rotateY: 0, opacity: 1 }}
      transition={{ 
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ 
        rotateX: 2, 
        rotateY: -5,
        scale: 1.02,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      }}
      className={cn(
        "relative w-80 h-48 sm:w-96 sm:h-56",
        "rounded-3xl overflow-hidden",
        "transform-gpu perspective-1000",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)",
        boxShadow: `
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          0 0 80px rgba(220, 199, 176, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `,
      }}
    >
      {/* Reflet Champagne */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, transparent 40%, rgba(220, 199, 176, 0.08) 50%, transparent 60%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <span 
          className="font-display text-2xl tracking-[0.15em]"
          style={{ color: "rgba(220, 199, 176, 0.9)" }}
        >
          OMNIA
        </span>
      </div>
      
      {/* Icône NFC stylisée */}
      <div className="absolute bottom-8 right-8">
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(220, 199, 176, 0.1)",
            border: "1px solid rgba(220, 199, 176, 0.2)",
          }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(220, 199, 176, 0.1)",
              "0 0 40px rgba(220, 199, 176, 0.2)",
              "0 0 20px rgba(220, 199, 176, 0.1)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="rgba(220, 199, 176, 0.8)"
            strokeWidth="1.5"
          >
            <path d="M6 18.5a4.5 4.5 0 1 1 0-9" />
            <path d="M10 15a2 2 0 1 1 0-4" />
            <path d="M18 14a6.5 6.5 0 0 0-6.5-6.5" />
            <path d="M18 10a10.5 10.5 0 0 0-10.5-6.5" />
          </svg>
        </motion.div>
      </div>
      
      {/* Ligne de signature */}
      <div className="absolute bottom-8 left-8">
        <p 
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(253, 252, 251, 0.3)" }}
        >
          Calibre · i-wasp
        </p>
      </div>
      
      {/* Texture subtile */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 70% 20%, rgba(220, 199, 176, 0.03) 0%, transparent 50%)`,
        }}
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA NAV — Navigation quasi-invisible
// ═══════════════════════════════════════════════════════════════════════════

interface OmniaNavProps {
  children: ReactNode;
  className?: string;
}

export function OmniaNav({ children, className }: OmniaNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "px-8 py-6",
        "bg-omnia-obsidienne/80 backdrop-blur-[50px]",
        "border-b border-white/[0.03]",
        className
      )}
    >
      {children}
    </motion.nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA GLOW — Effet de halo Champagne
// ═══════════════════════════════════════════════════════════════════════════

interface OmniaGlowProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

export function OmniaGlow({ className, intensity = "subtle" }: OmniaGlowProps) {
  const intensities = {
    subtle: "opacity-[0.03]",
    medium: "opacity-[0.06]",
    strong: "opacity-[0.1]",
  };
  
  return (
    <div 
      className={cn(
        "absolute pointer-events-none",
        intensities[intensity],
        className
      )}
      style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, #DCC7B0 0%, transparent 70%)",
      }}
    />
  );
}
