/**
 * LogoEditor - Éditeur de logo avec drag & drop
 * 
 * Composant réutilisable pour:
 * - Upload de logo
 * - Positionnement drag & drop
 * - Aperçu temps réel sur carte
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  AlignCenter, 
  Maximize2, 
  Eye,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Hand,
  RotateCcw,
  Upload,
  X,
  Move
} from "lucide-react";

export type LogoPlacement = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "full" | "custom";

export interface LogoConfig {
  url: string | null;
  placement: LogoPlacement;
  opacity: number;
  scale: number;
  customX?: number;
  customY?: number;
}

interface LogoEditorProps {
  value: LogoConfig;
  onChange: (config: LogoConfig) => void;
  cardColor?: string;
  textColor?: string;
  showUpload?: boolean;
  compact?: boolean;
}

const PLACEMENTS = [
  { id: "center" as const, label: "Centre", icon: AlignCenter },
  { id: "top-left" as const, label: "Haut G.", icon: AlignCenter },
  { id: "top-right" as const, label: "Haut D.", icon: AlignCenter },
  { id: "bottom-left" as const, label: "Bas G.", icon: AlignCenter },
  { id: "bottom-right" as const, label: "Bas D.", icon: AlignCenter },
  { id: "full" as const, label: "Plein", icon: Maximize2 },
];

const CARD_RATIO = 85.6 / 54;
const DRAG_MARGIN = 10;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

type LoadingState = "idle" | "loading" | "loaded" | "error";

function getPresetPosition(placement: LogoPlacement): { x: number; y: number } {
  switch (placement) {
    case "center": return { x: 50, y: 50 };
    case "top-left": return { x: 20, y: 25 };
    case "top-right": return { x: 80, y: 25 };
    case "bottom-left": return { x: 20, y: 75 };
    case "bottom-right": return { x: 80, y: 75 };
    case "full": return { x: 50, y: 50 };
    default: return { x: 50, y: 50 };
  }
}

function getLogoSize(placement: LogoPlacement, scale: number): { maxWidth: string; maxHeight: string } {
  if (placement === "full") {
    return { maxWidth: "100%", maxHeight: "100%" };
  }
  const baseSize = placement === "center" || placement === "custom" ? 50 : 35;
  return { 
    maxWidth: `${baseSize * scale}%`, 
    maxHeight: `${baseSize * scale}%` 
  };
}

export function LogoEditor({
  value,
  onChange,
  cardColor = "#1A1A1A",
  textColor = "#FFFFFF",
  showUpload = true,
  compact = false,
}: LogoEditorProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>(value.url ? "loading" : "idle");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 });
  const [imageKey, setImageKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isLightCard = cardColor === "#FFFFFF" || cardColor === "#fafafa";
  const isFullMode = value.placement === "full";

  // Initialize drag position
  useEffect(() => {
    if (value.placement === "custom" && value.customX !== undefined && value.customY !== undefined) {
      setDragPosition({ x: value.customX, y: value.customY });
    } else {
      setDragPosition(getPresetPosition(value.placement));
    }
  }, [value.placement, value.customX, value.customY]);

  // Reset loading state when URL changes
  useEffect(() => {
    if (value.url) {
      setLoadingState("loading");
      setImageKey(prev => prev + 1);
    } else {
      setLoadingState("idle");
    }
  }, [value.url]);

  const handleImageLoad = useCallback(() => {
    setLoadingState("loaded");
  }, []);

  const handleImageError = useCallback(() => {
    setLoadingState("error");
  }, []);

  const handleRetry = useCallback(() => {
    setLoadingState("loading");
    setImageKey(prev => prev + 1);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG ou SVG");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("L'image ne doit pas dépasser 15 Mo");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("card-assets")
        .getPublicUrl(filePath);

      onChange({ ...value, url: publicUrl });
      toast.success("Logo téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    onChange({ ...value, url: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!cardRef.current || isFullMode) return;
    
    const cardRect = cardRef.current.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    
    const newX = Math.max(DRAG_MARGIN, Math.min(100 - DRAG_MARGIN, 
      dragPosition.x + (info.offset.x / cardWidth) * 100
    ));
    const newY = Math.max(DRAG_MARGIN, Math.min(100 - DRAG_MARGIN, 
      dragPosition.y + (info.offset.y / cardHeight) * 100
    ));
    
    setDragPosition({ x: newX, y: newY });
    setIsDragging(false);
    
    onChange({ 
      ...value,
      placement: "custom",
      customX: newX,
      customY: newY
    });
  }, [dragPosition, isFullMode, onChange, value]);

  const handleDragStart = useCallback(() => {
    if (!isFullMode) {
      setIsDragging(true);
    }
  }, [isFullMode]);

  const handlePresetClick = (placement: LogoPlacement) => {
    const newPos = getPresetPosition(placement);
    setDragPosition(newPos);
    onChange({ 
      ...value,
      placement, 
      customX: undefined, 
      customY: undefined 
    });
  };

  const handleCenterLogo = () => {
    setDragPosition({ x: 50, y: 50 });
    onChange({ 
      ...value,
      placement: "center",
      customX: undefined,
      customY: undefined
    });
  };

  const logoSize = getLogoSize(value.placement, value.scale);

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {showUpload && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
            id="logo-editor-upload"
          />

          {value.url ? (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center overflow-hidden">
                <img
                  src={value.url}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Logo chargé</p>
                <p className="text-xs text-muted-foreground">Glissez pour positionner</p>
              </div>
              <button
                onClick={handleRemoveLogo}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="logo-editor-upload"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Télécharger un logo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, SVG (max 15 Mo)</p>
                </>
              )}
            </label>
          )}
        </div>
      )}

      {/* Card Preview with Drag & Drop */}
      {value.url && (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <Hand size={12} />
                  Glissez le logo
                </span>
                <button
                  onClick={handleCenterLogo}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  <RotateCcw size={10} />
                  Centrer
                </button>
              </div>

              {/* Card Preview */}
              <div
                ref={cardRef}
                className={`relative rounded-xl overflow-hidden shadow-lg mx-auto ${
                  isDragging ? "cursor-grabbing" : !isFullMode ? "cursor-grab" : ""
                }`}
                style={{
                  aspectRatio: CARD_RATIO,
                  maxWidth: "100%",
                  backgroundColor: cardColor,
                }}
              >
                {/* Drag constraint indicator */}
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute border-2 border-primary/30 rounded-lg pointer-events-none z-10"
                    style={{
                      top: `${DRAG_MARGIN}%`,
                      left: `${DRAG_MARGIN}%`,
                      right: `${DRAG_MARGIN}%`,
                      bottom: `${DRAG_MARGIN}%`,
                    }}
                  />
                )}

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
                      <Loader2 
                        className="w-6 h-6 animate-spin"
                        style={{ color: textColor }}
                      />
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
                      <button
                        onClick={handleRetry}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                        style={{ 
                          backgroundColor: `${textColor}20`,
                          color: textColor 
                        }}
                      >
                        <RefreshCw size={12} />
                        Réessayer
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Logo - Draggable */}
                {isFullMode ? (
                  <motion.img
                    key={`logo-${imageKey}`}
                    src={value.url}
                    alt="Logo"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: loadingState === "loaded" ? value.opacity / 100 : 0,
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: `scale(${value.scale})`,
                      zIndex: 5,
                    }}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <motion.div
                    drag
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
                      src={value.url}
                      alt="Logo"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      style={{
                        opacity: value.opacity / 100,
                        ...logoSize,
                        objectFit: "contain",
                      }}
                      className={`object-contain pointer-events-none select-none ${
                        isDragging ? "drop-shadow-2xl" : ""
                      }`}
                      crossOrigin="anonymous"
                      draggable={false}
                    />
                    
                    {loadingState === "loaded" && !isDragging && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: isLightCard ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)",
                          color: isLightCard ? "#fff" : "#000",
                        }}
                      >
                        <Move size={8} />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Position info */}
              {value.placement === "custom" && (
                <p className="text-center text-[10px] text-primary mt-2">
                  Position: {Math.round(dragPosition.x)}%, {Math.round(dragPosition.y)}%
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Presets */}
          {!compact && (
            <div>
              <Label className="text-xs font-medium mb-2 block">Positions</Label>
              <div className="grid grid-cols-6 gap-1.5">
                {PLACEMENTS.map((p) => {
                  const isSelected = value.placement === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePresetClick(p.id)}
                      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-lg border transition-all text-center ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="logo-placement-check"
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check size={8} className="text-primary-foreground" />
                        </motion.div>
                      )}
                      <span className={`text-[9px] font-medium ${isSelected ? "text-primary" : ""}`}>
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scale & Opacity Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Taille</Label>
                <span className="text-xs text-muted-foreground">{Math.round(value.scale * 100)}%</span>
              </div>
              <Slider
                value={[value.scale * 100]}
                onValueChange={([v]) => onChange({ ...value, scale: v / 100 })}
                min={50}
                max={isFullMode ? 150 : 120}
                step={5}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Opacité</Label>
                <span className="text-xs text-muted-foreground">{value.opacity}%</span>
              </div>
              <Slider
                value={[value.opacity]}
                onValueChange={([v]) => onChange({ ...value, opacity: v })}
                min={20}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LogoEditor;