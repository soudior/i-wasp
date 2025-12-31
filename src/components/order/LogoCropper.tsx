/**
 * LogoCropper - Outil de recadrage pour le logo
 * 
 * Permet de :
 * - Recadrer le logo avant placement
 * - Conserver les proportions ou libre
 * - Prévisualiser le résultat
 */

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Crop as CropIcon, 
  RotateCcw, 
  Check, 
  X,
  Square,
  RectangleHorizontal,
  Circle
} from "lucide-react";

interface LogoCropperProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
}

type AspectRatioOption = "free" | "1:1" | "16:9" | "4:3";

const ASPECT_OPTIONS: { id: AspectRatioOption; label: string; icon: React.ElementType; value?: number }[] = [
  { id: "free", label: "Libre", icon: CropIcon },
  { id: "1:1", label: "Carré", icon: Square, value: 1 },
  { id: "16:9", label: "16:9", icon: RectangleHorizontal, value: 16 / 9 },
  { id: "4:3", label: "4:3", icon: RectangleHorizontal, value: 4 / 3 },
];

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 80,
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
}: LogoCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspectOption, setAspectOption] = useState<AspectRatioOption>("free");
  const [isProcessing, setIsProcessing] = useState(false);

  const aspect = ASPECT_OPTIONS.find(o => o.id === aspectOption)?.value;

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Default crop at 80% centered
    const newCrop = aspect
      ? centerAspectCrop(width, height, aspect)
      : {
          unit: "%" as const,
          x: 10,
          y: 10,
          width: 80,
          height: 80,
        };
    
    setCrop(newCrop);
  }, [aspect]);

  const handleAspectChange = (option: AspectRatioOption) => {
    setAspectOption(option);
    
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newAspect = ASPECT_OPTIONS.find(o => o.id === option)?.value;
      
      if (newAspect) {
        setCrop(centerAspectCrop(width, height, newAspect));
      }
    }
  };

  const handleReset = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop({
        unit: "%",
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      });
      setAspectOption("free");
    }
  };

  const handleApplyCrop = async () => {
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

      // Set canvas dimensions to the cropped area
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      // Draw the cropped image
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="h-5 w-5 text-primary" />
            Recadrer le logo
          </DialogTitle>
          <DialogDescription>
            Ajustez la zone de recadrage pour optimiser l'affichage sur la carte
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {/* Aspect Ratio Options */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Proportions</Label>
            <div className="flex gap-2">
              {ASPECT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = aspectOption === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAspectChange(option.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon size={16} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crop Area */}
          <div className="relative bg-muted/50 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-h-[400px]"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Logo à recadrer"
                onLoad={onImageLoad}
                className="max-h-[400px] max-w-full object-contain"
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>

          {/* Preview */}
          <AnimatePresence>
            {completedCrop && completedCrop.width > 0 && completedCrop.height > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-muted/30 rounded-lg"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Dimensions du recadrage : {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} px
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={handleReset} className="gap-2">
            <RotateCcw size={16} />
            Réinitialiser
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="gap-2">
              <X size={16} />
              Annuler
            </Button>
            <Button 
              onClick={handleApplyCrop} 
              disabled={isProcessing}
              className="gap-2 bg-gradient-to-r from-primary to-amber-500"
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LogoCropper;
