/**
 * LogoCropper - Outil de recadrage pour logo carte NFC CR80
 * 
 * FONCTIONNALITÉS:
 * - Mode plein format carte NFC (ratio CR80: 85.6 x 54 mm)
 * - Guides d'impression (bord de coupe, zone de sécurité)
 * - Coins arrondis visibles
 * - Contrôles: ajuster, remplir, centrer, opacité
 * - Validation obligatoire avant ajout panier
 */

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Crop as CropIcon, 
  RotateCcw, 
  Check, 
  X,
  Square,
  RectangleHorizontal,
  Maximize2,
  Move,
  CreditCard,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Printer
} from "lucide-react";

// CR80 card dimensions (85.6 x 54 mm)
const CR80_WIDTH = 85.6;
const CR80_HEIGHT = 54;
const CR80_RATIO = CR80_WIDTH / CR80_HEIGHT; // ~1.585

// Safe zone margin (3mm)
const SAFE_ZONE_MM = 3;
const SAFE_ZONE_PERCENT = (SAFE_ZONE_MM / CR80_WIDTH) * 100;

// Bleed margin (2mm)
const BLEED_MM = 2;

interface LogoCropperProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  cardColor?: string;
}

type CropMode = "free" | "card-full" | "card-fit" | "card-center";

interface CropModeOption {
  id: CropMode;
  label: string;
  description: string;
  iconName: "maximize-2" | "move" | "square" | "crop";
  recommended?: boolean;
}

const CROP_MODES: CropModeOption[] = [
  { 
    id: "card-full", 
    label: "Plein format", 
    description: "Logo couvre 100% de la carte",
    iconName: "maximize-2",
    recommended: true,
  },
  { 
    id: "card-fit", 
    label: "Ajuster", 
    description: "Ajuste automatiquement",
    iconName: "move",
  },
  { 
    id: "card-center", 
    label: "Centrer", 
    description: "Centre sans déformation",
    iconName: "square",
  },
  { 
    id: "free", 
    label: "Libre", 
    description: "Recadrage manuel",
    iconName: "crop",
  },
];

function getModeIcon(iconName: string) {
  switch (iconName) {
    case "maximize-2": return Maximize2;
    case "move": return Move;
    case "square": return Square;
    case "crop": return CropIcon;
    default: return CropIcon;
  }
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
  widthPercent: number = 90
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: widthPercent,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function LogoCropper({
  imageUrl,
  isOpen,
  onClose,
  onCropComplete,
  cardColor = "#1A1A1A",
}: LogoCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [cropMode, setCropMode] = useState<CropMode>("card-full");
  const [opacity, setOpacity] = useState(100);
  const [showGuides, setShowGuides] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset validation when crop changes
  useEffect(() => {
    setIsValidated(false);
  }, [crop, opacity, cropMode]);

  const aspect = cropMode === "free" ? undefined : CR80_RATIO;

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImageLoaded(true);
    
    // Apply initial crop based on mode
    if (cropMode === "card-full" || cropMode === "card-fit") {
      setCrop(centerAspectCrop(width, height, CR80_RATIO, 95));
    } else if (cropMode === "card-center") {
      setCrop(centerAspectCrop(width, height, CR80_RATIO, 70));
    } else {
      setCrop({
        unit: "%",
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      });
    }
  }, [cropMode]);

  const handleModeChange = (mode: CropMode) => {
    setCropMode(mode);
    setIsValidated(false);
    
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      
      switch (mode) {
        case "card-full":
          setCrop(centerAspectCrop(width, height, CR80_RATIO, 98));
          break;
        case "card-fit":
          setCrop(centerAspectCrop(width, height, CR80_RATIO, 85));
          break;
        case "card-center":
          setCrop(centerAspectCrop(width, height, CR80_RATIO, 65));
          break;
        case "free":
          setCrop({
            unit: "%",
            x: 10,
            y: 10,
            width: 80,
            height: 80,
          });
          break;
      }
    }
  };

  const handleReset = () => {
    setOpacity(100);
    setIsValidated(false);
    handleModeChange("card-full");
  };

  const handleValidate = () => {
    if (!completedCrop || completedCrop.width === 0 || completedCrop.height === 0) {
      return;
    }
    setIsValidated(true);
  };

  const handleApplyCrop = async () => {
    if (!isValidated) {
      return;
    }

    if (!completedCrop || !imgRef.current) {
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      // Calculate scale between natural and display size
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // High resolution output for print (300 DPI equivalent)
      const outputWidth = Math.round(completedCrop.width * scaleX);
      const outputHeight = Math.round(completedCrop.height * scaleY);
      
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Apply opacity
      ctx.globalAlpha = opacity / 100;

      // Draw the cropped image
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        outputWidth,
        outputHeight
      );

      // Convert to blob and create URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedUrl = URL.createObjectURL(blob);
            onCropComplete(croppedUrl);
          }
          setIsProcessing(false);
        },
        "image/png",
        1
      );
    } catch (error) {
      console.error("Crop error:", error);
      setIsProcessing(false);
    }
  };

  const isLightCard = cardColor === "#FFFFFF" || cardColor === "#fafafa";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Design carte NFC – Recadrage logo
          </DialogTitle>
          <DialogDescription>
            Ajustez votre logo pour un rendu parfait sur carte CR80 (85.6 × 54 mm)
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Mode Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Mode de placement</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CROP_MODES.map((mode) => {
                const Icon = getModeIcon(mode.iconName);
                const isSelected = cropMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {mode.recommended && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-medium bg-amber-500 text-white rounded-full">
                        Recommandé
                      </span>
                    )}
                    {isSelected && (
                      <motion.div
                        layoutId="mode-check"
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check size={12} className="text-primary-foreground" />
                      </motion.div>
                    )}
                    <Icon size={20} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                    <span className={`text-xs font-medium ${isSelected ? "text-primary" : ""}`}>
                      {mode.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground text-center">
                      {mode.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content: Crop + Preview */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Crop Area */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Zone de recadrage</Label>
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
              
              <div className="relative bg-muted/50 rounded-xl p-4 flex items-center justify-center min-h-[280px]">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[350px]"
                  ruleOfThirds={showGuides}
                >
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Logo à recadrer"
                    onLoad={onImageLoad}
                    className="max-h-[350px] max-w-full object-contain"
                    crossOrigin="anonymous"
                    style={{ opacity: opacity / 100 }}
                  />
                </ReactCrop>
              </div>
            </div>

            {/* Card Preview */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                <Printer size={16} />
                Aperçu impression finale
              </Label>
              
              <div className="relative">
                {/* Card Frame */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    aspectRatio: CR80_RATIO,
                    backgroundColor: cardColor,
                    boxShadow: `0 20px 40px -12px ${cardColor}50`,
                  }}
                >
                  {/* Print guides overlay */}
                  <AnimatePresence>
                    {showGuides && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-20"
                      >
                        {/* Bleed zone (outer) */}
                        <div 
                          className="absolute border-2 border-dashed rounded-xl"
                          style={{
                            top: "-2%",
                            left: "-1.5%",
                            right: "-1.5%",
                            bottom: "-2%",
                            borderColor: "rgba(255,0,0,0.3)",
                          }}
                        />
                        
                        {/* Cut edge */}
                        <div 
                          className="absolute inset-0 border-2 rounded-2xl"
                          style={{
                            borderColor: isLightCard ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                          }}
                        />
                        
                        {/* Safe zone (inner) */}
                        <div 
                          className="absolute border border-dashed"
                          style={{
                            top: `${SAFE_ZONE_PERCENT * 1.5}%`,
                            left: `${SAFE_ZONE_PERCENT}%`,
                            right: `${SAFE_ZONE_PERCENT}%`,
                            bottom: `${SAFE_ZONE_PERCENT * 1.5}%`,
                            borderColor: isLightCard ? "rgba(0,150,0,0.4)" : "rgba(100,255,100,0.4)",
                            borderRadius: "12px",
                          }}
                        />

                        {/* Corner radius indicators */}
                        {[
                          { top: "6px", left: "6px" },
                          { top: "6px", right: "6px" },
                          { bottom: "6px", left: "6px" },
                          { bottom: "6px", right: "6px" },
                        ].map((pos, i) => (
                          <div
                            key={i}
                            className="absolute w-4 h-4"
                            style={{
                              ...pos,
                              borderColor: isLightCard ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
                              borderWidth: "2px",
                              borderStyle: "solid",
                              borderRadius: "6px",
                              borderTopColor: pos.bottom ? "transparent" : undefined,
                              borderBottomColor: pos.top ? "transparent" : undefined,
                              borderLeftColor: pos.right ? "transparent" : undefined,
                              borderRightColor: pos.left ? "transparent" : undefined,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Logo preview */}
                  {completedCrop && imgRef.current && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
                      style={{ opacity: opacity / 100 }}
                    >
                      <img
                        src={imageUrl}
                        alt="Aperçu logo"
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: `${crop?.x || 0}% ${crop?.y || 0}%`,
                        }}
                      />
                    </div>
                  )}

                  {/* i-wasp logo watermark */}
                  <div className="absolute top-2 right-2 z-30">
                    <span 
                      className="text-[8px] font-medium tracking-wider"
                      style={{ color: isLightCard ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}
                    >
                      i-wasp
                    </span>
                  </div>

                  {/* NFC indicator */}
                  <div className="absolute bottom-2 left-2 z-30">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: isLightCard ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: isLightCard ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }}
                      />
                    </div>
                  </div>

                  {/* Premium reflection */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/3 pointer-events-none rounded-t-2xl z-10"
                    style={{
                      background: isLightCard
                        ? "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 100%)"
                        : "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Dimensions label */}
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Format CR80 • {CR80_WIDTH} × {CR80_HEIGHT} mm • Coins arrondis
                </p>

                {/* Guide legend */}
                {showGuides && (
                  <div className="flex flex-wrap justify-center gap-4 mt-2 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: "rgba(255,0,0,0.5)" }} />
                      Zone de débordement
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-muted-foreground/50" />
                      Bord de coupe
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-0.5 border-t border-dashed border-green-500" />
                      Zone de sécurité
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Opacity Control */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Eye size={16} />
                Opacité du logo
              </Label>
              <span className="text-sm font-medium text-primary">{opacity}%</span>
            </div>
            <Slider
              value={[opacity]}
              onValueChange={([value]) => setOpacity(value)}
              min={30}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Validation Status */}
          <AnimatePresence mode="wait">
            {imageLoaded && completedCrop && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isValidated ? (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-400 font-medium">
                      ✓ Design validé – Cet aperçu correspond exactement à l'impression finale
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      Veuillez valider votre design avant de l'appliquer. L'aperçu ci-dessus représente le rendu final imprimé.
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 pt-4 border-t bg-muted/30">
          <Button variant="ghost" onClick={handleReset} className="gap-2 w-full sm:w-auto">
            <RotateCcw size={16} />
            Réinitialiser
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="gap-2 flex-1 sm:flex-initial">
              <X size={16} />
              Annuler
            </Button>
            
            {!isValidated ? (
              <Button 
                onClick={handleValidate}
                disabled={!completedCrop || completedCrop.width === 0}
                className="gap-2 flex-1 sm:flex-initial bg-gradient-to-r from-amber-500 to-amber-600"
              >
                <CheckCircle2 size={16} />
                Valider le design
              </Button>
            ) : (
              <Button 
                onClick={handleApplyCrop} 
                disabled={isProcessing}
                className="gap-2 flex-1 sm:flex-initial bg-gradient-to-r from-primary to-amber-500"
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <CropIcon size={16} />
                  </motion.div>
                ) : (
                  <Check size={16} />
                )}
                Appliquer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LogoCropper;
