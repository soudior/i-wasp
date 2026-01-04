/**
 * CardDesignEditor - Official i-Wasp Card Design Editor
 * 
 * Features:
 * - White card with fixed i-Wasp logo at top-right (never removable)
 * - User logo/photo upload with drag-to-position
 * - Optional full-bleed mode
 * - Real-time preview matching print output
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  Move,
  Maximize2,
  AlignCenter,
  Check,
  Loader2,
  X,
  RotateCcw,
  ZoomIn,
  Lock,
} from "lucide-react";

// Import the official i-Wasp logo
import iwaspLogo from "@/assets/iwasp-logo.png";

export interface CardDesignConfig {
  logoUrl: string | null;
  logoX: number; // 0-100 percentage
  logoY: number; // 0-100 percentage
  logoScale: number; // 0.5-2
  isFullBleed: boolean;
  fileName: string;
}

interface CardDesignEditorProps {
  value: CardDesignConfig;
  onChange: (config: CardDesignConfig) => void;
  className?: string;
}

const CARD_RATIO = 85.6 / 54;
const DRAG_MARGIN = 15;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];

export const defaultCardDesignConfig: CardDesignConfig = {
  logoUrl: null,
  logoX: 50,
  logoY: 50,
  logoScale: 1,
  isFullBleed: false,
  fileName: "",
};

export function CardDesignEditor({
  value,
  onChange,
  className = "",
}: CardDesignEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset image loaded state when URL changes
  useEffect(() => {
    if (value.logoUrl) {
      setImageLoaded(false);
    }
  }, [value.logoUrl]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG, SVG ou WebP");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Fichier trop volumineux (max 5 Mo)");
      return;
    }

    setIsUploading(true);

    try {
      const objectUrl = URL.createObjectURL(file);
      onChange({
        ...value,
        logoUrl: objectUrl,
        fileName: file.name,
        logoX: 50,
        logoY: 50,
        logoScale: 1,
        isFullBleed: false,
      });
      toast.success("Image prête pour personnalisation");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    onChange(defaultCardDesignConfig);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!cardRef.current || value.isFullBleed) return;

      const cardRect = cardRef.current.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;

      const newX = Math.max(
        DRAG_MARGIN,
        Math.min(100 - DRAG_MARGIN, value.logoX + (info.offset.x / cardWidth) * 100)
      );
      const newY = Math.max(
        DRAG_MARGIN,
        Math.min(100 - DRAG_MARGIN, value.logoY + (info.offset.y / cardHeight) * 100)
      );

      setIsDragging(false);
      onChange({ ...value, logoX: newX, logoY: newY });
    },
    [value, onChange]
  );

  const handleDragStart = useCallback(() => {
    if (!value.isFullBleed) {
      setIsDragging(true);
    }
  }, [value.isFullBleed]);

  const handleCenterLogo = () => {
    onChange({ ...value, logoX: 50, logoY: 50 });
  };

  const handleScaleChange = (newScale: number[]) => {
    onChange({ ...value, logoScale: newScale[0] });
  };

  const handleFullBleedToggle = (checked: boolean) => {
    onChange({
      ...value,
      isFullBleed: checked,
      logoX: 50,
      logoY: 50,
      logoScale: checked ? 1 : value.logoScale,
    });
  };

  // Calculate logo size based on scale
  const getLogoStyle = () => {
    if (value.isFullBleed) {
      return {
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
      };
    }
    const baseSize = 40 * value.logoScale;
    return {
      maxWidth: `${baseSize}%`,
      maxHeight: `${baseSize}%`,
      objectFit: "contain" as const,
    };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Section */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
        />

        {!value.logoUrl ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full p-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-all bg-muted/30"
          >
            <div className="flex flex-col items-center gap-3">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Uploadez votre logo ou photo</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, SVG ou WebP (max 5 Mo)
                    </p>
                  </div>
                </>
              )}
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <div className="w-14 h-14 rounded-lg bg-background flex items-center justify-center overflow-hidden border">
              <img
                src={value.logoUrl}
                alt="Votre logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{value.fileName}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Prêt pour personnalisation
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Changer
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRemoveLogo}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Card Preview with Drag & Drop */}
      {value.logoUrl && (
        <>
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Déplacez votre logo</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCenterLogo} className="h-8">
                <RotateCcw className="w-3 h-3 mr-1" />
                Centrer
              </Button>
            </div>

            {/* Official i-Wasp Card Preview */}
            <div
              ref={cardRef}
              className={`relative rounded-xl overflow-hidden shadow-2xl mx-auto ${
                isDragging ? "cursor-grabbing" : !value.isFullBleed ? "cursor-grab" : ""
              }`}
              style={{
                aspectRatio: CARD_RATIO,
                maxWidth: "100%",
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* Fixed i-Wasp Logo - ALWAYS top-right, never removable */}
              <div
                className="absolute z-30 pointer-events-none"
                style={{
                  top: "8%",
                  right: "5%",
                  width: "18%",
                  height: "auto",
                }}
              >
                <img
                  src={iwaspLogo}
                  alt="i-Wasp"
                  className="w-full h-auto object-contain"
                  style={{ opacity: 0.9 }}
                />
              </div>

              {/* Lock indicator for i-Wasp logo */}
              <div className="absolute top-2 right-2 z-40">
                <Badge variant="secondary" className="text-[9px] bg-black/60 text-white border-none gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  i-Wasp
                </Badge>
              </div>

              {/* Drag constraint indicator */}
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute border-2 border-primary/40 rounded-lg pointer-events-none z-10"
                  style={{
                    top: `${DRAG_MARGIN}%`,
                    left: `${DRAG_MARGIN}%`,
                    right: `${DRAG_MARGIN}%`,
                    bottom: `${DRAG_MARGIN}%`,
                  }}
                />
              )}

              {/* User Logo - Draggable */}
              {value.isFullBleed ? (
                <motion.img
                  src={value.logoUrl}
                  alt="Votre logo"
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    ...getLogoStyle(),
                    zIndex: 5,
                  }}
                  draggable={false}
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
                    opacity: imageLoaded ? 1 : 0,
                  }}
                  whileDrag={{ scale: 1.05, zIndex: 50 }}
                  style={{
                    position: "absolute",
                    left: `${value.logoX}%`,
                    top: `${value.logoY}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isDragging ? 50 : 5,
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                  className="touch-none"
                >
                  <motion.img
                    src={value.logoUrl}
                    alt="Votre logo"
                    onLoad={() => setImageLoaded(true)}
                    style={getLogoStyle()}
                    className={`object-contain pointer-events-none select-none ${
                      isDragging ? "drop-shadow-2xl" : "drop-shadow-lg"
                    }`}
                    draggable={false}
                  />

                  {imageLoaded && !isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap bg-black/70 text-white"
                    >
                      <Move size={10} />
                      Glissez
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Loading state */}
              {!imageLoaded && value.logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Position indicator */}
            {!value.isFullBleed && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                Position: {Math.round(value.logoX)}%, {Math.round(value.logoY)}%
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Scale Slider */}
            {!value.isFullBleed && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <ZoomIn className="w-4 h-4" />
                    Taille du logo
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(value.logoScale * 100)}%
                  </span>
                </div>
                <Slider
                  value={[value.logoScale]}
                  onValueChange={handleScaleChange}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}

            {/* Full Bleed Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Mode plein écran</p>
                  <p className="text-xs text-muted-foreground">
                    Votre image couvre toute la carte
                  </p>
                </div>
              </div>
              <Switch
                checked={value.isFullBleed}
                onCheckedChange={handleFullBleedToggle}
              />
            </div>

            {/* i-Wasp notice */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg">
              <Lock className="w-3 h-3 flex-shrink-0" />
              <span>
                Le logo i-Wasp reste visible en haut à droite sur toutes les cartes imprimées.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CardDesignEditor;
