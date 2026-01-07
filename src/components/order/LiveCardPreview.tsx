/**
 * LiveCardPreview - Aperçu temps réel haute-fidélité de la carte imprimée
 * 
 * Design IWASP:
 * - Simulation réaliste du rendu d'impression final
 * - Affichage recto/verso avec animation flip
 * - Indicateurs de zone de sécurité et repères de coupe
 * - Zoom interactif
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Printer,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Ruler,
  Grid3X3,
  Check,
  Eye,
  Layers,
  Lock,
} from "lucide-react";
import { CardDesignConfig } from "./CardDesignEditor";

// Import templates
import iwaspLogoCard from "@/assets/cards/iwasp-logo-card.png";
import cardRectoTemplate from "@/assets/cards/card-recto-template.png";
import cardVersoPattern from "@/assets/cards/card-verso-pattern.png";

interface LiveCardPreviewProps {
  config: CardDesignConfig;
  className?: string;
}

const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 54;
const BLEED_MM = 3;
const SAFE_ZONE_MM = 5;
const CARD_RATIO = CARD_WIDTH_MM / CARD_HEIGHT_MM;

export function LiveCardPreview({ config, className = "" }: LiveCardPreviewProps) {
  const [showBack, setShowBack] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGuides, setShowGuides] = useState(false);
  const [showBleed, setShowBleed] = useState(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  // Calculate logo position and size for print
  const getLogoStyle = (): React.CSSProperties => {
    if (config.isFullBleed) {
      return {
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        left: 0,
        top: 0,
        transform: "none",
      };
    }
    const baseSize = 40 * config.logoScale;
    return {
      position: "absolute",
      maxWidth: `${baseSize}%`,
      maxHeight: `${baseSize}%`,
      objectFit: "contain",
      left: `${config.logoX}%`,
      top: `${config.logoY}%`,
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Printer className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Aperçu impression finale</h3>
            <p className="text-xs text-muted-foreground">
              {CARD_WIDTH_MM} × {CARD_HEIGHT_MM} mm — Rendu haute fidélité
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1 text-[10px]">
          <Eye className="w-3 h-3" />
          Temps réel
        </Badge>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-muted/30 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBack(!showBack)}
            className="h-8 gap-1"
          >
            <RotateCw className="w-3 h-3" />
            {showBack ? "Recto" : "Verso"}
          </Button>
          
          <div className="flex items-center border rounded-md bg-background">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 px-2" disabled={zoomLevel <= 0.5}>
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs px-2 border-x min-w-[50px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 px-2" disabled={zoomLevel >= 2}>
              <ZoomIn className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Switch
              id="guides-preview"
              checked={showGuides}
              onCheckedChange={setShowGuides}
              className="scale-75"
            />
            <Label htmlFor="guides-preview" className="text-[11px] cursor-pointer flex items-center gap-1">
              <Grid3X3 className="w-3 h-3" />
              Repères
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch
              id="bleed-preview"
              checked={showBleed}
              onCheckedChange={setShowBleed}
              className="scale-75"
            />
            <Label htmlFor="bleed-preview" className="text-[11px] cursor-pointer flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Fond perdu
            </Label>
          </div>
        </div>
      </div>

      {/* Print Preview Card */}
      <div className="relative bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl p-6 md:p-8 flex items-center justify-center overflow-hidden min-h-[280px]">
        {/* Checkerboard pattern background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%),
              linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%),
              linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)
            `,
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
        />

        {/* Card Container with zoom */}
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
          style={{ 
            width: "min(90%, 340px)",
            aspectRatio: CARD_RATIO,
          }}
        >
          {/* Bleed area indicator */}
          {showBleed && (
            <div 
              className="absolute border-2 border-dashed border-red-400/70 pointer-events-none z-50 rounded-xl"
              style={{
                inset: `-${(BLEED_MM / CARD_WIDTH_MM) * 100}%`,
              }}
            >
              <span className="absolute -top-5 left-1 text-[9px] text-red-500 font-medium bg-background px-1 rounded shadow-sm">
                Fond perdu +{BLEED_MM}mm
              </span>
            </div>
          )}

          {/* Card with 3D flip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={showBack ? "back" : "front"}
              initial={{ rotateY: showBack ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: showBack ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
              style={{ perspective: "1000px" }}
            >
              {/* Card Surface */}
              <div 
                className="relative w-full h-full rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 10px 20px -5px rgba(0, 0, 0, 0.15)",
                }}
              >
                {!showBack ? (
                  /* Front Side */
                  <>
                    {/* Template Background */}
                    <img
                      src={cardRectoTemplate}
                      alt="Template recto"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Fixed i-Wasp Logo */}
                    <div
                      className="absolute z-20 pointer-events-none"
                      style={{
                        top: "8%",
                        right: "4%",
                        width: "20%",
                      }}
                    >
                      <img
                        src={iwaspLogoCard}
                        alt="i-Wasp"
                        className="w-full h-auto object-contain"
                      />
                    </div>

                    {/* Lock badge for i-Wasp logo */}
                    <div className="absolute top-1.5 right-1.5 z-30">
                      <Badge variant="secondary" className="text-[8px] bg-black/60 text-white border-none gap-0.5 py-0.5 px-1.5">
                        <Lock className="w-2 h-2" />
                        i-Wasp
                      </Badge>
                    </div>

                    {/* User Logo */}
                    {config.logoUrl && (
                      <motion.img
                        src={config.logoUrl}
                        alt="Logo client"
                        className="z-10 pointer-events-none"
                        style={getLogoStyle()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Safe Zone Guide */}
                    {showGuides && (
                      <div 
                        className="absolute border border-dashed border-blue-400/60 pointer-events-none z-30"
                        style={{
                          inset: `${(SAFE_ZONE_MM / CARD_HEIGHT_MM) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-4 left-1 text-[8px] text-blue-500 font-medium bg-background/90 px-1 rounded shadow-sm">
                          Zone sécurité {SAFE_ZONE_MM}mm
                        </span>
                      </div>
                    )}

                    {/* Center guides */}
                    {showGuides && (
                      <>
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-300/40 pointer-events-none z-30" />
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-300/40 pointer-events-none z-30" />
                      </>
                    )}

                    {/* Placeholder when no logo */}
                    {!config.logoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center z-5">
                        <div className="text-center opacity-40">
                          <div className="w-16 h-16 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Printer className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">Votre logo ici</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Back Side */
                  <>
                    <img
                      src={cardVersoPattern}
                      alt="Pattern verso"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Centered watermark logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={iwaspLogoCard}
                        alt="i-Wasp"
                        className="w-1/3 h-auto object-contain opacity-15"
                      />
                    </div>

                    {/* Safe Zone Guide */}
                    {showGuides && (
                      <div 
                        className="absolute border border-dashed border-blue-400/60 pointer-events-none z-30"
                        style={{
                          inset: `${(SAFE_ZONE_MM / CARD_HEIGHT_MM) * 100}%`,
                        }}
                      />
                    )}

                    {/* Back label */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <Badge variant="outline" className="text-[9px] bg-white/80 border-border/50">
                        Verso · Pattern i-Wasp
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Crop marks */}
          {showGuides && (
            <>
              <div className="absolute -top-4 -left-4 w-4 h-4 border-l-2 border-t-2 border-foreground/50 pointer-events-none z-40" />
              <div className="absolute -top-4 -right-4 w-4 h-4 border-r-2 border-t-2 border-foreground/50 pointer-events-none z-40" />
              <div className="absolute -bottom-4 -left-4 w-4 h-4 border-l-2 border-b-2 border-foreground/50 pointer-events-none z-40" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-r-2 border-b-2 border-foreground/50 pointer-events-none z-40" />
            </>
          )}
        </motion.div>
      </div>

      {/* Info Footer */}
      <div className="flex flex-wrap gap-3 justify-between items-center text-xs">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Ruler className="w-3 h-3" />
            {CARD_WIDTH_MM} × {CARD_HEIGHT_MM} mm
          </span>
          <span className="text-muted-foreground/50">•</span>
          <span>{showBack ? "Verso" : "Recto"}</span>
          {config.logoUrl && !config.isFullBleed && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span>Position: {Math.round(config.logoX)}%, {Math.round(config.logoY)}%</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {config.logoUrl && (
            <Badge variant="outline" className="text-[10px] gap-1 border-green-200 bg-green-50 text-green-700">
              <Check className="w-2.5 h-2.5" />
              Logo prêt
            </Badge>
          )}
          <Badge variant="secondary" className="text-[10px]">
            <Printer className="w-2.5 h-2.5 mr-1" />
            Prêt pour impression
          </Badge>
        </div>
      </div>

      {/* Legend */}
      {showGuides && (
        <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border border-dashed border-blue-400 rounded-sm" />
            <span>Zone de sécurité ({SAFE_ZONE_MM}mm)</span>
          </div>
          {showBleed && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-dashed border-red-400 rounded-sm" />
              <span>Fond perdu ({BLEED_MM}mm)</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-foreground/50" />
            <span>Repères de coupe</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveCardPreview;
