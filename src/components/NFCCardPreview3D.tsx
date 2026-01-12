/**
 * NFCCardPreview3D - Haute Couture NFC Card Component
 * 
 * Premium card preview with:
 * - 3D perspective on hover
 * - Shimmer effect traversing the surface
 * - Slow, luxurious animations (1s+ duration)
 * - Sanded Gold accents on Jet Black
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Wifi, Crown } from "lucide-react";
import { HAUTE_COUTURE } from "@/lib/hauteCouturePalette";

interface NFCCardPreview3DProps {
  name?: string;
  title?: string;
  company?: string;
  logoUrl?: string;
  photoUrl?: string;
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function NFCCardPreview3D({
  name = "Votre Nom",
  title = "Titre",
  company = "Entreprise",
  logoUrl,
  photoUrl,
  variant = "dark",
  size = "md",
  className = "",
  onClick,
}: NFCCardPreview3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizes = {
    sm: { width: 200, height: 125, textScale: 0.75 },
    md: { width: 320, height: 200, textScale: 1 },
    lg: { width: 400, height: 250, textScale: 1.25 },
  };

  const { width, height, textScale } = sizes[size];

  // Variant color schemes
  const variants = {
    dark: {
      bg: HAUTE_COUTURE.colors.jetBlack,
      accent: HAUTE_COUTURE.colors.sandedGold,
      text: HAUTE_COUTURE.colors.silk,
      secondaryText: `${HAUTE_COUTURE.colors.silk}99`,
    },
    light: {
      bg: HAUTE_COUTURE.colors.silk,
      accent: HAUTE_COUTURE.colors.sandedGold,
      text: HAUTE_COUTURE.colors.jetBlack,
      secondaryText: `${HAUTE_COUTURE.colors.jetBlack}99`,
    },
    gold: {
      bg: `linear-gradient(135deg, ${HAUTE_COUTURE.colors.jetBlack}, #1a1510)`,
      accent: HAUTE_COUTURE.colors.sandedGold,
      text: HAUTE_COUTURE.colors.sandedGold,
      secondaryText: `${HAUTE_COUTURE.colors.sandedGold}aa`,
    },
  };

  const colors = variants[variant];

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse position (max ±15 degrees)
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    const rotateXValue = -((e.clientY - centerY) / (rect.height / 2)) * 8;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div
      className={`perspective-1000 ${className}`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        className="relative cursor-pointer"
        style={{
          width,
          height,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
          duration: 1,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Card Base */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            background: typeof colors.bg === "string" && colors.bg.includes("gradient") 
              ? colors.bg 
              : colors.bg,
            backgroundColor: typeof colors.bg === "string" && !colors.bg.includes("gradient") 
              ? colors.bg 
              : undefined,
            boxShadow: isHovered
              ? `0 25px 50px -12px ${HAUTE_COUTURE.colors.jetBlack}80, 
                 0 0 40px ${colors.accent}15`
              : `0 10px 30px -10px ${HAUTE_COUTURE.colors.jetBlack}60`,
            transition: "box-shadow 1s ease",
          }}
        >
          {/* Shimmer Effect Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                105deg,
                transparent 40%,
                ${colors.accent}15 45%,
                ${colors.accent}25 50%,
                ${colors.accent}15 55%,
                transparent 60%
              )`,
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: isHovered ? ["200% 0", "-100% 0"] : "200% 0",
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 2,
            }}
          />

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(${colors.accent}20 1px, transparent 1px),
                linear-gradient(90deg, ${colors.accent}20 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Card Content */}
          <div className="relative h-full p-5 flex flex-col justify-between">
            {/* Top Row - Logo & Brand */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                    style={{ filter: variant === "light" ? "none" : "brightness(0) invert(1)" }}
                  />
                ) : (
                  <Crown
                    className="w-5 h-5"
                    style={{ color: colors.accent }}
                  />
                )}
                <span
                  className="text-xs font-medium tracking-[0.15em] uppercase"
                  style={{ 
                    color: colors.accent,
                    fontSize: `${0.65 * textScale}rem`,
                  }}
                >
                  i-wasp
                </span>
              </div>

              {/* NFC Indicator */}
              <motion.div
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ 
                  backgroundColor: `${colors.accent}15`,
                  border: `1px solid ${colors.accent}30`,
                }}
                animate={{
                  boxShadow: isHovered
                    ? [
                        `0 0 0 0 ${colors.accent}40`,
                        `0 0 0 8px ${colors.accent}00`,
                      ]
                    : `0 0 0 0 ${colors.accent}00`,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeOut",
                }}
              >
                <Wifi
                  className="w-4 h-4"
                  style={{ color: colors.accent }}
                />
              </motion.div>
            </div>

            {/* Bottom Row - User Info */}
            <div className="flex items-end justify-between">
              <div>
                <h3
                  className="font-semibold tracking-tight mb-0.5"
                  style={{ 
                    color: colors.text,
                    fontSize: `${1.1 * textScale}rem`,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {name}
                </h3>
                <p
                  className="font-light"
                  style={{ 
                    color: colors.secondaryText,
                    fontSize: `${0.75 * textScale}rem`,
                    letterSpacing: "0.05em",
                  }}
                >
                  {title} · {company}
                </p>
              </div>

              {/* Photo Avatar */}
              {photoUrl && (
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border-2"
                  style={{ borderColor: `${colors.accent}40` }}
                >
                  <img
                    src={photoUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Edge Highlight */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              border: `0.5px solid ${colors.accent}20`,
              boxShadow: isHovered
                ? `inset 0 0 30px ${colors.accent}08`
                : "none",
              transition: "all 1s ease",
            }}
          />
        </div>

        {/* 3D Shadow Layer */}
        <div
          className="absolute inset-0 rounded-xl -z-10"
          style={{
            transform: "translateZ(-20px)",
            background: `linear-gradient(135deg, ${HAUTE_COUTURE.colors.jetBlack}, transparent)`,
            opacity: isHovered ? 0.3 : 0.1,
            transition: "opacity 1s ease",
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * NFCCardStack - Display multiple cards with stacking effect
 */
export function NFCCardStack({
  cards,
  className = "",
}: {
  cards: Array<{
    name?: string;
    title?: string;
    company?: string;
    variant?: "dark" | "light" | "gold";
  }>;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`relative ${className}`} style={{ height: 280 }}>
      {cards.map((card, index) => {
        const isActive = index === activeIndex;
        const offset = (index - activeIndex) * 20;
        const scale = 1 - Math.abs(index - activeIndex) * 0.05;
        const zIndex = cards.length - Math.abs(index - activeIndex);

        return (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2 cursor-pointer"
            style={{ zIndex }}
            animate={{
              x: "-50%",
              y: `calc(-50% + ${offset}px)`,
              scale,
              opacity: 1 - Math.abs(index - activeIndex) * 0.2,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setActiveIndex(index)}
          >
            <NFCCardPreview3D
              {...card}
              size={isActive ? "md" : "sm"}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * NFCCardShowcase - Animated rotating showcase
 */
export function NFCCardShowcase({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-8 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NFCCardPreview3D
          name="Sophie Martin"
          title="Directrice"
          company="Luxe Hospitality"
          variant="dark"
        />
        <NFCCardPreview3D
          name="Karim Benali"
          title="Fondateur"
          company="IWASP"
          variant="gold"
        />
        <NFCCardPreview3D
          name="Emma Laurent"
          title="Consultante"
          company="Strategy Co"
          variant="light"
        />
      </div>
      
      {/* Floating decoration */}
      <motion.div
        className="w-px h-16"
        style={{
          background: `linear-gradient(to bottom, ${HAUTE_COUTURE.colors.sandedGold}40, transparent)`,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default NFCCardPreview3D;
