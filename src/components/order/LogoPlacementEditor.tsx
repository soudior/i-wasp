/**
 * LogoPlacementEditor - Éditeur de placement logo avancé
 * 
 * OPTIONS:
 * - Centré
 * - Coin (4 positions)
 * - Ajuster automatiquement
 * - PLEIN FORMAT (logo couvrant toute la carte)
 * 
 * FEATURES:
 * - Réglage opacité
 * - Effet caméléon (blending)
 * - Aperçu temps réel
 * - Guides visuels
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlignCenter, 
  Maximize2, 
  Grid3X3,
  Move,
  Eye,
  Blend,
  Check
} from "lucide-react";

// i-wasp logo
import iwaspLogoWhite from "@/assets/iwasp-logo-white.png";

export type LogoPlacement = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "auto-fit" | "full";

export type BlendMode = "normal" | "multiply" | "screen" | "overlay";

export interface LogoPlacementConfig {
  placement: LogoPlacement;
  opacity: number;
  blendMode: BlendMode;
  scale: number;
}

interface LogoPlacementEditorProps {
  logoUrl: string;
  cardColor: string;
  textColor: string;
  config: LogoPlacementConfig;
  onChange: (config: LogoPlacementConfig) => void;
}

const PLACEMENTS = [
  { id: "center" as const, label: "Centré", icon: AlignCenter },
  { id: "top-left" as const, label: "Haut gauche", icon: Grid3X3 },
  { id: "top-right" as const, label: "Haut droite", icon: Grid3X3 },
  { id: "bottom-left" as const, label: "Bas gauche", icon: Grid3X3 },
  { id: "bottom-right" as const, label: "Bas droite", icon: Grid3X3 },
  { id: "auto-fit" as const, label: "Auto", icon: Move },
  { id: "full" as const, label: "Plein format", icon: Maximize2 },
];

const BLEND_MODES = [
  { id: "normal" as const, label: "Normal" },
  { id: "multiply" as const, label: "Fondu" },
  { id: "screen" as const, label: "Lumineux" },
  { id: "overlay" as const, label: "Caméléon" },
];

// Dimensions carte CR80 (85.6mm x 53.98mm)
const CARD_WIDTH = 85.6;
const CARD_HEIGHT = 54;
const CARD_RATIO = CARD_WIDTH / CARD_HEIGHT;

// Safe zone (3mm bleed)
const BLEED = 3;
const SAFE_ZONE = {
  top: BLEED / CARD_HEIGHT * 100,
  right: BLEED / CARD_WIDTH * 100,
  bottom: BLEED / CARD_HEIGHT * 100,
  left: BLEED / CARD_WIDTH * 100,
};

function getLogoStyles(placement: LogoPlacement, scale: number): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    position: "absolute",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  switch (placement) {
    case "center":
      return {
        ...baseStyles,
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        maxWidth: "50%",
        maxHeight: "45%",
      };
    case "top-left":
      return {
        ...baseStyles,
        top: "12%",
        left: "8%",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        maxWidth: "35%",
        maxHeight: "35%",
      };
    case "top-right":
      return {
        ...baseStyles,
        top: "12%",
        right: "20%", // Leave space for i-wasp logo
        transform: `scale(${scale})`,
        transformOrigin: "top right",
        maxWidth: "35%",
        maxHeight: "35%",
      };
    case "bottom-left":
      return {
        ...baseStyles,
        bottom: "15%",
        left: "20%", // Leave space for NFC indicator
        transform: `scale(${scale})`,
        transformOrigin: "bottom left",
        maxWidth: "35%",
        maxHeight: "35%",
      };
    case "bottom-right":
      return {
        ...baseStyles,
        bottom: "12%",
        right: "8%",
        transform: `scale(${scale})`,
        transformOrigin: "bottom right",
        maxWidth: "35%",
        maxHeight: "35%",
      };
    case "auto-fit":
      return {
        ...baseStyles,
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        maxWidth: "60%",
        maxHeight: "50%",
        objectFit: "contain",
      };
    case "full":
      return {
        ...baseStyles,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale})`,
        transformOrigin: "center",
      };
    default:
      return baseStyles;
  }
}

export function LogoPlacementEditor({
  logoUrl,
  cardColor,
  textColor,
  config,
  onChange,
}: LogoPlacementEditorProps) {
  const [showGuides, setShowGuides] = useState(true);
  const isLightCard = cardColor === "#FFFFFF" || cardColor === "#fafafa";

  const updateConfig = (updates: Partial<LogoPlacementConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Card Preview with Guides */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Aperçu impression</span>
            <button
              onClick={() => setShowGuides(!showGuides)}
              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors ${
                showGuides ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <Eye size={14} />
              Guides
            </button>
          </div>

          {/* Card Preview */}
          <div
            className="relative rounded-xl overflow-hidden shadow-2xl mx-auto"
            style={{
              aspectRatio: CARD_RATIO,
              maxWidth: "100%",
              backgroundColor: cardColor,
              boxShadow: `0 25px 50px -12px ${cardColor}40`,
            }}
          >
            {/* Visual guides */}
            <AnimatePresence>
              {showGuides && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-10"
                >
                  {/* Bleed zone */}
                  <div 
                    className="absolute border border-dashed"
                    style={{
                      top: `${SAFE_ZONE.top}%`,
                      right: `${SAFE_ZONE.right}%`,
                      bottom: `${SAFE_ZONE.bottom}%`,
                      left: `${SAFE_ZONE.left}%`,
                      borderColor: isLightCard ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                    }}
                  />
                  {/* Center lines */}
                  <div 
                    className="absolute top-1/2 left-0 right-0 h-px"
                    style={{ backgroundColor: isLightCard ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}
                  />
                  <div 
                    className="absolute left-1/2 top-0 bottom-0 w-px"
                    style={{ backgroundColor: isLightCard ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Client Logo */}
            <motion.img
              src={logoUrl}
              alt="Logo client"
              style={{
                ...getLogoStyles(config.placement, config.scale),
                opacity: config.opacity / 100,
                mixBlendMode: config.blendMode,
              }}
              className="object-contain"
            />

            {/* i-wasp logo - FIXED top right */}
            <div className="absolute top-3 right-3 z-20">
              <img
                src={iwaspLogoWhite}
                alt="i-wasp"
                className="h-4 object-contain"
                style={{
                  filter: isLightCard ? "invert(1)" : "none",
                  opacity: 0.7,
                }}
              />
            </div>

            {/* NFC indicator */}
            <div className="absolute bottom-3 left-3 z-20">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: `${textColor}15` }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: `${textColor}40` }}
                />
              </div>
            </div>

            {/* Premium reflection */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
              style={{
                background: isLightCard
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 100%)"
                  : "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Dimensions info */}
          <p className="text-center text-xs text-muted-foreground mt-3">
            Format CR80 • 85.6 × 54 mm • Zone de sécurité 3mm
          </p>
          <p className="text-center text-xs text-amber-600 mt-1">
            ⚠️ Cet aperçu représente le rendu final imprimé
          </p>
        </CardContent>
      </Card>

      {/* Placement Options */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Position du logo</Label>
        <div className="grid grid-cols-4 gap-2">
          {PLACEMENTS.map((p) => {
            const Icon = p.icon;
            const isSelected = config.placement === p.id;
            return (
              <button
                key={p.id}
                onClick={() => updateConfig({ placement: p.id })}
                className={`relative flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                } ${p.id === "full" ? "col-span-2" : ""}`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="placement-check"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check size={12} className="text-primary-foreground" />
                  </motion.div>
                )}
                <Icon size={18} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                <span className={`text-[10px] font-medium ${isSelected ? "text-primary" : ""}`}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opacity Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Eye size={16} />
            Opacité
          </Label>
          <span className="text-sm text-muted-foreground">{config.opacity}%</span>
        </div>
        <Slider
          value={[config.opacity]}
          onValueChange={([value]) => updateConfig({ opacity: value })}
          min={20}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Scale Slider (for full mode) */}
      {config.placement === "full" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Maximize2 size={16} />
              Échelle
            </Label>
            <span className="text-sm text-muted-foreground">{Math.round(config.scale * 100)}%</span>
          </div>
          <Slider
            value={[config.scale * 100]}
            onValueChange={([value]) => updateConfig({ scale: value / 100 })}
            min={100}
            max={150}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 Augmentez l'échelle pour un débordement jusqu'aux bords (bleed)
          </p>
        </div>
      )}

      {/* Blend Mode */}
      <div>
        <Label className="text-sm font-medium mb-3 flex items-center gap-2">
          <Blend size={16} />
          Effet caméléon
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {BLEND_MODES.map((mode) => {
            const isSelected = config.blendMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => updateConfig({ blendMode: mode.id })}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          L'effet caméléon mélange subtilement le logo avec la couleur de la carte
        </p>
      </div>
    </div>
  );
}

export default LogoPlacementEditor;
