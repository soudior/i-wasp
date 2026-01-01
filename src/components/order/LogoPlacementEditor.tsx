/**
 * LogoPlacementEditor - Éditeur de placement logo avancé
 * 
 * FEATURES:
 * - Drag & drop direct sur la carte
 * - Contraintes visuelles (safe zone)
 * - Réglage opacité & échelle
 * - Effet caméléon (blending)
 * - Aperçu temps réel premium
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlignCenter, 
  Maximize2, 
  Grid3X3,
  Move,
  Eye,
  Blend,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Hand,
  RotateCcw
} from "lucide-react";

// i-wasp logo
import iwaspLogoWhite from "@/assets/iwasp-logo-white.png";

export type LogoPlacement = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "auto-fit" | "full" | "custom";

export type BlendMode = "normal" | "multiply" | "screen" | "overlay";

export interface LogoPlacementConfig {
  placement: LogoPlacement;
  opacity: number;
  blendMode: BlendMode;
  scale: number;
  customX?: number; // percentage from left (0-100)
  customY?: number; // percentage from top (0-100)
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
  { id: "top-left" as const, label: "Haut G.", icon: Grid3X3 },
  { id: "top-right" as const, label: "Haut D.", icon: Grid3X3 },
  { id: "bottom-left" as const, label: "Bas G.", icon: Grid3X3 },
  { id: "bottom-right" as const, label: "Bas D.", icon: Grid3X3 },
  { id: "full" as const, label: "Plein", icon: Maximize2 },
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

// Margins for drag constraints (percentage)
const DRAG_MARGIN = 10;

type LoadingState = "loading" | "loaded" | "error";

function getPresetPosition(placement: LogoPlacement): { x: number; y: number } {
  switch (placement) {
    case "center":
    case "auto-fit":
      return { x: 50, y: 50 };
    case "top-left":
      return { x: 20, y: 25 };
    case "top-right":
      return { x: 70, y: 25 };
    case "bottom-left":
      return { x: 25, y: 75 };
    case "bottom-right":
      return { x: 80, y: 75 };
    case "full":
      return { x: 50, y: 50 };
    default:
      return { x: 50, y: 50 };
  }
}

function getLogoSize(placement: LogoPlacement, scale: number): { 
  width: string; 
  height: string;
  maxWidth: string; 
  maxHeight: string;
} {
  if (placement === "full") {
    return { 
      width: "100%", 
      height: "100%",
      maxWidth: "100%", 
      maxHeight: "100%" 
    };
  }
  // Base size as percentage of card - center gets bigger, corners smaller
  const baseSize = placement === "center" || placement === "auto-fit" || placement === "custom" ? 50 : 35;
  const finalSize = Math.min(80, Math.max(20, baseSize * scale)); // Clamp between 20-80%
  
  return { 
    width: `${finalSize}%`,
    height: "auto",
    maxWidth: `${finalSize}%`, 
    maxHeight: `${finalSize}%` 
  };
}

export function LogoPlacementEditor({
  logoUrl,
  cardColor,
  textColor,
  config,
  onChange,
}: LogoPlacementEditorProps) {
  const [showGuides, setShowGuides] = useState(true);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [imageKey, setImageKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  
  const isLightCard = cardColor === "#FFFFFF" || cardColor === "#fafafa";
  const isFullMode = config.placement === "full";

  // Initialize drag position based on placement
  useEffect(() => {
    if (config.placement === "custom" && config.customX !== undefined && config.customY !== undefined) {
      setDragPosition({ x: config.customX, y: config.customY });
    } else {
      setDragPosition(getPresetPosition(config.placement));
    }
  }, [config.placement, config.customX, config.customY]);

  // Reset loading state when URL changes - with pre-validation
  useEffect(() => {
    if (logoUrl) {
      setLoadingState("loading");
      setImageKey(prev => prev + 1);
      
      // Pre-load image to detect errors early
      const img = new Image();
      img.onload = () => setLoadingState("loaded");
      img.onerror = () => setLoadingState("error");
      img.src = logoUrl;
    }
  }, [logoUrl]);

  const handleImageLoad = useCallback(() => {
    console.log("[LogoPlacementEditor] Image loaded successfully");
    setLoadingState("loaded");
  }, []);

  const handleImageError = useCallback(() => {
    console.error("[LogoPlacementEditor] Image failed to load:", logoUrl);
    setLoadingState("error");
  }, [logoUrl]);

  const handleRetry = useCallback(() => {
    setLoadingState("loading");
    setImageKey(prev => prev + 1);
  }, []);

  const updateConfig = (updates: Partial<LogoPlacementConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!cardRef.current || isFullMode) return;
    
    const cardRect = cardRef.current.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    
    // Calculate new position as percentage
    const newX = Math.max(DRAG_MARGIN, Math.min(100 - DRAG_MARGIN, 
      dragPosition.x + (info.offset.x / cardWidth) * 100
    ));
    const newY = Math.max(DRAG_MARGIN, Math.min(100 - DRAG_MARGIN, 
      dragPosition.y + (info.offset.y / cardHeight) * 100
    ));
    
    setDragPosition({ x: newX, y: newY });
    setIsDragging(false);
    
    // Update config with custom position
    updateConfig({ 
      placement: "custom",
      customX: newX,
      customY: newY
    });
  }, [dragPosition, isFullMode, updateConfig]);

  const handleDragStart = useCallback(() => {
    if (!isFullMode) {
      setIsDragging(true);
    }
  }, [isFullMode]);

  const handlePresetClick = (placement: LogoPlacement) => {
    const newPos = getPresetPosition(placement);
    setDragPosition(newPos);
    updateConfig({ 
      placement, 
      customX: undefined, 
      customY: undefined 
    });
  };

  const handleCenterLogo = () => {
    setDragPosition({ x: 50, y: 50 });
    updateConfig({ 
      placement: "center",
      customX: undefined,
      customY: undefined
    });
  };

  const logoSize = getLogoSize(config.placement, config.scale);

  return (
    <div className="space-y-6">
      {/* Card Preview with Drag & Drop */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Aperçu impression</span>
              {!isFullMode && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Hand size={10} />
                  Glissez le logo
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCenterLogo}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                title="Recentrer"
              >
                <RotateCcw size={12} />
              </button>
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
          </div>

          {/* Card Preview */}
          <div
            ref={cardRef}
            className={`relative rounded-xl overflow-hidden shadow-2xl mx-auto ${
              isDragging ? "cursor-grabbing" : !isFullMode ? "cursor-grab" : ""
            }`}
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
                  
                  {/* Drag constraint zone indicator */}
                  {isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute border-2 border-primary/30 rounded-lg"
                      style={{
                        top: `${DRAG_MARGIN}%`,
                        left: `${DRAG_MARGIN}%`,
                        right: `${DRAG_MARGIN}%`,
                        bottom: `${DRAG_MARGIN}%`,
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            <AnimatePresence mode="wait">
              {loadingState === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 
                      className="w-8 h-8 animate-spin"
                      style={{ color: textColor }}
                    />
                    <span 
                      className="text-xs opacity-60"
                      style={{ color: textColor }}
                    >
                      Chargement...
                    </span>
                  </div>
                </motion.div>
              )}

              {loadingState === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <div className="flex flex-col items-center gap-3 p-4 max-w-[80%]">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${textColor}15` }}
                    >
                      <AlertTriangle 
                        className="w-6 h-6"
                        style={{ color: textColor }}
                      />
                    </div>
                    <div className="text-center">
                      <p 
                        className="text-sm font-medium mb-1"
                        style={{ color: textColor }}
                      >
                        Logo invalide
                      </p>
                      <p 
                        className="text-xs opacity-60"
                        style={{ color: textColor }}
                      >
                        Veuillez télécharger un nouveau fichier PNG, JPG ou SVG
                      </p>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: textColor,
                        color: cardColor 
                      }}
                    >
                      <RefreshCw size={14} />
                      Réessayer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Client Logo - Draggable */}
            {isFullMode ? (
              // Full mode - no drag, cover entire card
              <motion.img
                key={`logo-${imageKey}`}
                src={logoUrl}
                alt="Logo client"
                onLoad={handleImageLoad}
                onError={handleImageError}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ 
                  opacity: loadingState === "loaded" ? config.opacity / 100 : 0,
                  scale: loadingState === "loaded" ? config.scale : 0.98
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  mixBlendMode: config.blendMode,
                  zIndex: 5,
                  // Fusion effect with card
                  filter: isLightCard 
                    ? `drop-shadow(0 0 20px rgba(0,0,0,0.1))` 
                    : `drop-shadow(0 0 20px rgba(0,0,0,0.3))`,
                }}
                className="object-cover"
              />
            ) : (
              // Draggable mode
              <motion.div
                drag
                dragControls={dragControls}
                dragMomentum={false}
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                initial={false}
                animate={{
                  opacity: loadingState === "loaded" ? 1 : 0,
                }}
                whileDrag={{ scale: 1.05, zIndex: 50 }}
                style={{
                  position: "absolute",
                  left: `${dragPosition.x}%`,
                  top: `${dragPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isDragging ? 50 : 5,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                className="touch-none"
              >
              <motion.img
                  key={`logo-${imageKey}`}
                  src={logoUrl}
                  alt="Logo client"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: loadingState === "loaded" ? config.opacity / 100 : 0,
                    scale: loadingState === "loaded" ? 1 : 0.9
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{
                    width: logoSize.width,
                    height: logoSize.height,
                    maxWidth: logoSize.maxWidth,
                    maxHeight: logoSize.maxHeight,
                    objectFit: "contain",
                    mixBlendMode: config.blendMode,
                    // Auto shadow based on card color for fusion effect
                    filter: isLightCard 
                      ? `drop-shadow(0 4px 12px rgba(0,0,0,0.15))` 
                      : `drop-shadow(0 4px 12px rgba(0,0,0,0.4))`,
                  }}
                  className="object-contain pointer-events-none select-none"
                  draggable={false}
                />
                
                {/* Drag handle indicator */}
                {loadingState === "loaded" && !isDragging && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: isLightCard ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
                      color: isLightCard ? "#fff" : "#000",
                    }}
                  >
                    <Move size={10} />
                    Déplacer
                  </motion.div>
                )}
              </motion.div>
            )}

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

          {/* Position info */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              Format CR80 • 85.6 × 54 mm
            </p>
            {config.placement === "custom" && (
              <p className="text-xs text-primary">
                Position: {Math.round(dragPosition.x)}%, {Math.round(dragPosition.y)}%
              </p>
            )}
          </div>
          
          {/* Status indicator */}
          <AnimatePresence mode="wait">
            {loadingState === "loaded" && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs text-green-600 mt-1 flex items-center justify-center gap-1"
              >
                <Check size={12} />
                {config.placement === "custom" ? "Position personnalisée" : "Logo positionné"}
              </motion.p>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Positions prédéfinies</Label>
        <div className="grid grid-cols-6 gap-2">
          {PLACEMENTS.map((p) => {
            const Icon = p.icon;
            const isSelected = config.placement === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p.id)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="placement-check"
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check size={10} className="text-primary-foreground" />
                  </motion.div>
                )}
                <Icon size={16} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                <span className={`text-[9px] font-medium ${isSelected ? "text-primary" : ""}`}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
        {config.placement === "custom" && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Position personnalisée par glisser-déposer
          </p>
        )}
      </div>

      {/* Scale Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Maximize2 size={16} />
            Taille
          </Label>
          <span className="text-sm text-muted-foreground">{Math.round(config.scale * 100)}%</span>
        </div>
        <Slider
          value={[config.scale * 100]}
          onValueChange={([value]) => updateConfig({ scale: value / 100 })}
          min={50}
          max={isFullMode ? 150 : 120}
          step={5}
          className="w-full"
        />
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
      </div>
    </div>
  );
}

export default LogoPlacementEditor;
