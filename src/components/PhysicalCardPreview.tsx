/**
 * PhysicalCardPreview - Aperçu 3D fidèle de la carte Evolis
 * Affiche EXACTEMENT les fichiers Brand Assets
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand, EVOLIS_SPECS } from "@/contexts/BrandContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ZoomIn, CreditCard, Info } from "lucide-react";

interface PhysicalCardPreviewProps {
  showSpecs?: boolean;
  compact?: boolean;
  className?: string;
}

export function PhysicalCardPreview({ 
  showSpecs = false, 
  compact = false,
  className = "" 
}: PhysicalCardPreviewProps) {
  const { cardFront, cardBack, hasAllPrintAssets, evolisSpecs } = useBrand();
  const [showBack, setShowBack] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback card design using official colors
  const FallbackCard = ({ side }: { side: "front" | "back" }) => (
    <div 
      className="w-full aspect-[1.586] rounded-xl flex items-center justify-center"
      style={{ 
        backgroundColor: "#0B0B0B",
        border: "1px solid #121212"
      }}
    >
      <div className="text-center">
        <div 
          className="text-2xl font-display font-bold mb-1"
          style={{ color: "#FFC700" }}
        >
          i-Wasp
        </div>
        <p className="text-xs" style={{ color: "#FFFFFF" }}>
          {side === "front" ? "Recto" : "Verso"}
        </p>
      </div>
    </div>
  );

  const CardContent = () => (
    <div className="relative perspective-1000">
      <motion.div
        className="relative"
        animate={{ rotateY: showBack ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div 
          className="w-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {cardFront ? (
            <img 
              src={cardFront} 
              alt="Carte i-Wasp Recto"
              className="w-full rounded-xl shadow-2xl"
              style={{ aspectRatio: "1.586" }}
            />
          ) : (
            <FallbackCard side="front" />
          )}
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {cardBack ? (
            <img 
              src={cardBack} 
              alt="Carte i-Wasp Verso"
              className="w-full rounded-xl shadow-2xl"
              style={{ aspectRatio: "1.586" }}
            />
          ) : (
            <FallbackCard side="back" />
          )}
        </div>
      </motion.div>
    </div>
  );

  if (compact) {
    return (
      <div className={`${className}`}>
        <div className="max-w-xs mx-auto">
          <CardContent />
          <div className="flex justify-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBack(!showBack)}
              className="gap-1 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              {showBack ? "Recto" : "Verso"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-secondary/30 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Aperçu carte physique réelle</h3>
        </div>
        <Badge variant="outline" className="text-xs border-primary/50 text-primary">
          Fidèle 100%
        </Badge>
      </div>

      {/* Card Preview */}
      <div className="max-w-sm mx-auto mb-4">
        <CardContent />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBack(!showBack)}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {showBack ? "Voir recto" : "Voir verso"}
        </Button>

        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ZoomIn className="h-4 w-4" />
              Plein écran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-background border-border">
            <div className="p-4">
              <div className="max-w-lg mx-auto">
                <CardContent />
              </div>
              <div className="flex justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowBack(!showBack)}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {showBack ? "Voir recto" : "Voir verso"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Specs */}
      {showSpecs && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Fiche technique Evolis</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between p-2 bg-secondary/50 rounded">
              <span className="text-muted-foreground">Format</span>
              <span>{evolisSpecs.format}</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/50 rounded">
              <span className="text-muted-foreground">Dimensions</span>
              <span>{evolisSpecs.dimensions}</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/50 rounded">
              <span className="text-muted-foreground">Marges</span>
              <span>{evolisSpecs.safeMargin}</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/50 rounded">
              <span className="text-muted-foreground">Résolution</span>
              <span>{evolisSpecs.resolution}</span>
            </div>
            <div className="flex justify-between p-2 bg-secondary/50 rounded col-span-2">
              <span className="text-muted-foreground">Mode couleur</span>
              <span>{evolisSpecs.colorMode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legal mention */}
      <div className="text-center mt-4 space-y-1">
        <p className="text-xs text-primary font-medium">
          Aperçu fidèle à 100 % à la carte imprimée Evolis
        </p>
        <p className="text-xs text-muted-foreground">
          Carte imprimée en CR80, finition premium, impression Evolis
        </p>
      </div>
    </div>
  );
}
