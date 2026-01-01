/**
 * LogoPlacementEditor - Éditeur de placement logo professionnel
 * 
 * FEATURES:
 * - Drag & drop contraint avec snapping grille
 * - Boutons de positionnement précis
 * - Sensation luxe, solide, industrielle
 * - Aperçu temps réel premium
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlignCenter, 
  Maximize2, 
  Grid3X3,
  Eye,
  Blend,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move
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
  customX?: number;
  customY?: number;
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

// Grid snapping configuration (invisible grid)
const GRID_SIZE = 5; // 5% grid steps
const SNAP_THRESHOLD = 3; // Snap within 3% of grid line

// Drag constraints (safe zone margins)
const MIN_X = 15;
const MAX_X = 85;
const MIN_Y = 20;
const MAX_Y = 80;

type LoadingState = "loading" | "loaded" | "error";

function snapToGrid(value: number): number {
  const snapped = Math.round(value / GRID_SIZE) * GRID_SIZE;
  if (Math.abs(value - snapped) <= SNAP_THRESHOLD) {
    return snapped;
  }
  return value;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getPresetPosition(placement: LogoPlacement): { x: number; y: number } {
  switch (placement) {
    case "center":
    case "auto-fit":
      return { x: 50, y: 50 };
    case "top-left":
      return { x: 25, y: 30 };
    case "top-right":
      return { x: 75, y: 30 };
    case "bottom-left":
      return { x: 25, y: 70 };
    case "bottom-right":
      return { x: 75, y: 70 };
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
  const baseSize = placement === "center" || placement === "auto-fit" || placement === "custom" ? 50 : 35;
  const finalSize = Math.min(80, Math.max(20, baseSize * scale));
  
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
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

  // Reset loading state when URL changes
  useEffect(() => {
    if (logoUrl) {
      setLoadingState("loading");
      setImageKey(prev => prev + 1);
      
      const img = new Image();
      img.onload = () => setLoadingState("loaded");
      img.onerror = () => setLoadingState("error");
      img.src = logoUrl;
    }
  }, [logoUrl]);

  const handleImageLoad = useCallback(() => {
    setLoadingState("loaded");
  }, []);

  const handleImageError = useCallback(() => {
    setLoadingState("error");
  }, [logoUrl]);

  const handleRetry = useCallback(() => {
    setLoadingState("loading");
    setImageKey(prev => prev + 1);
  }, []);

  const updateConfig = useCallback((updates: Partial<LogoPlacementConfig>) => {
    onChange({ ...config, ...updates });
  }, [config, onChange]);

  // Professional drag handlers with snapping
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isFullMode || !cardRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const cardRect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - cardRect.left - (dragPosition.x / 100 * cardRect.width);
    const offsetY = e.clientY - cardRect.top - (dragPosition.y / 100 * cardRect.height);
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isFullMode, dragPosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !cardRef.current || isFullMode) return;
    
    e.preventDefault();
    
    const cardRect = cardRef.current.getBoundingClientRect();
    
    // Calculate new position as percentage
    let newX = ((e.clientX - cardRect.left - dragOffset.x) / cardRect.width) * 100;
    let newY = ((e.clientY - cardRect.top - dragOffset.y) / cardRect.height) * 100;
    
    // Apply constraints
    newX = clamp(newX, MIN_X, MAX_X);
    newY = clamp(newY, MIN_Y, MAX_Y);
    
    // Apply grid snapping
    newX = snapToGrid(newX);
    newY = snapToGrid(newY);
    
    setDragPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset, isFullMode]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    setIsDragging(false);
    
    // Save final position with snap
    const finalX = snapToGrid(dragPosition.x);
    const finalY = snapToGrid(dragPosition.y);
    
    updateConfig({ 
      placement: "custom",
      customX: finalX,
      customY: finalY
    });
  }, [isDragging, dragPosition, updateConfig]);

  // Direction buttons for precise positioning
  const moveDirection = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const step = GRID_SIZE;
    let newX = dragPosition.x;
    let newY = dragPosition.y;
    
    switch (direction) {
      case 'up':
        newY = clamp(dragPosition.y - step, MIN_Y, MAX_Y);
        break;
      case 'down':
        newY = clamp(dragPosition.y + step, MIN_Y, MAX_Y);
        break;
      case 'left':
        newX = clamp(dragPosition.x - step, MIN_X, MAX_X);
        break;
      case 'right':
        newX = clamp(dragPosition.x + step, MIN_X, MAX_X);
        break;
    }
    
    setDragPosition({ x: newX, y: newY });
    updateConfig({ 
      placement: "custom",
      customX: newX,
      customY: newY
    });
  }, [dragPosition, updateConfig]);

  const handleCenterLogo = useCallback(() => {
    setDragPosition({ x: 50, y: 50 });
    updateConfig({ 
      placement: "center",
      customX: undefined,
      customY: undefined
    });
  }, [updateConfig]);

  const handlePresetClick = useCallback((placement: LogoPlacement) => {
    const newPos = getPresetPosition(placement);
    setDragPosition(newPos);
    updateConfig({ 
      placement, 
      customX: undefined, 
      customY: undefined 
    });
  }, [updateConfig]);

  const logoSize = getLogoSize(config.placement, config.scale);

  return (
    <div className="space-y-6">
      {/* Card Preview with Professional Positioning */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">Aperçu impression</span>
            </div>
            <button
              onClick={() => setShowGuides(!showGuides)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
                showGuides 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Eye size={14} />
              Guides
            </button>
          </div>

          {/* Card Preview */}
          <div
            ref={cardRef}
            className={`relative rounded-2xl overflow-hidden mx-auto select-none ${
              isDragging ? "cursor-grabbing" : !isFullMode ? "cursor-default" : ""
            }`}
            style={{
              aspectRatio: CARD_RATIO,
              maxWidth: "100%",
              backgroundColor: cardColor,
              boxShadow: `
                0 25px 50px -12px ${cardColor}30,
                0 0 0 1px ${isLightCard ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}
              `,
              transition: "box-shadow 0.3s ease-out",
            }}
          >
            {/* Visual guides */}
            <AnimatePresence>
              {showGuides && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                      borderColor: isLightCard ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
                    }}
                  />
                  {/* Center crosshair */}
                  <div 
                    className="absolute top-1/2 left-0 right-0 h-px"
                    style={{ backgroundColor: isLightCard ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}
                  />
                  <div 
                    className="absolute left-1/2 top-0 bottom-0 w-px"
                    style={{ backgroundColor: isLightCard ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}
                  />
                  
                  {/* Allowed zone indicator during drag */}
                  {isDragging && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="absolute border-2 border-primary/40 rounded-xl"
                      style={{
                        top: `${MIN_Y - 5}%`,
                        left: `${MIN_X - 5}%`,
                        right: `${100 - MAX_X - 5}%`,
                        bottom: `${100 - MAX_Y - 5}%`,
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
                        Veuillez télécharger un nouveau fichier
                      </p>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
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

            {/* Client Logo - Professional Drag System */}
            {isFullMode ? (
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
                  filter: isLightCard 
                    ? `drop-shadow(0 0 20px rgba(0,0,0,0.1))` 
                    : `drop-shadow(0 0 20px rgba(0,0,0,0.3))`,
                }}
              />
            ) : (
              <motion.div
                ref={logoRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                animate={{
                  left: `${dragPosition.x}%`,
                  top: `${dragPosition.y}%`,
                  opacity: loadingState === "loaded" ? 1 : 0,
                  scale: isDragging ? 1.02 : 1,
                }}
                transition={{
                  left: { type: "spring", stiffness: 400, damping: 35 },
                  top: { type: "spring", stiffness: 400, damping: 35 },
                  scale: { duration: 0.15, ease: "easeOut" },
                  opacity: { duration: 0.2 },
                }}
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  zIndex: isDragging ? 50 : 5,
                  cursor: isDragging ? "grabbing" : "grab",
                  touchAction: "none",
                }}
                className="select-none"
              >
                <motion.img
                  key={`logo-${imageKey}`}
                  src={logoUrl}
                  alt="Logo client"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  animate={{
                    opacity: loadingState === "loaded" ? config.opacity / 100 : 0,
                    boxShadow: isDragging 
                      ? "0 20px 40px -10px rgba(0,0,0,0.3)" 
                      : "0 8px 20px -8px rgba(0,0,0,0.2)",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: logoSize.width,
                    height: logoSize.height,
                    maxWidth: logoSize.maxWidth,
                    maxHeight: logoSize.maxHeight,
                    objectFit: "contain",
                    mixBlendMode: config.blendMode,
                    filter: isLightCard 
                      ? `drop-shadow(0 4px 12px rgba(0,0,0,0.15))` 
                      : `drop-shadow(0 4px 12px rgba(0,0,0,0.4))`,
                    borderRadius: "4px",
                  }}
                  className="object-contain pointer-events-none"
                  draggable={false}
                />
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
                  opacity: 0.6,
                }}
              />
            </div>

            {/* NFC indicator */}
            <div className="absolute bottom-3 left-3 z-20">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: `${textColor}12` }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: `${textColor}30` }}
                />
              </div>
            </div>

            {/* Premium reflection */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
              style={{
                background: isLightCard
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 100%)"
                  : "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Position Controls */}
          {!isFullMode && loadingState === "loaded" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2"
            >
              {/* Direction Buttons */}
              <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-background/80 active:scale-95 transition-all"
                  onClick={() => moveDirection('left')}
                >
                  <ArrowLeft size={16} />
                </Button>
                
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-9 rounded-lg hover:bg-background/80 active:scale-95 transition-all"
                    onClick={() => moveDirection('up')}
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-9 rounded-lg hover:bg-background/80 active:scale-95 transition-all"
                    onClick={() => moveDirection('down')}
                  >
                    <ArrowDown size={16} />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-background/80 active:scale-95 transition-all"
                  onClick={() => moveDirection('right')}
                >
                  <ArrowRight size={16} />
                </Button>
              </div>

              {/* Center Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl font-medium hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all duration-200"
                onClick={handleCenterLogo}
              >
                <AlignCenter size={14} className="mr-1.5" />
                Centrer
              </Button>
            </motion.div>
          )}

          {/* Position info */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground font-medium">
              Format CR80 • 85.6 × 54 mm
            </p>
            {config.placement === "custom" && (
              <p className="text-xs text-primary font-medium">
                {Math.round(dragPosition.x)}% × {Math.round(dragPosition.y)}%
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
