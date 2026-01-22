/**
 * Evolis Template Generator - 600 DPI CR80
 * 
 * Génère des templates haute résolution pour impression Evolis
 * Format: CR80 (85.6 × 54 mm)
 * Résolution: 600 DPI
 * Dimensions pixels: 2024 × 1276 px
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Printer, Check, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import iwaspLogoWhite from "@/assets/iwasp-logo-white.png";
import iwaspLogoDark from "@/assets/iwasp-logo.png";

// ═══════════════════════════════════════════════════════════════════════════
// SPÉCIFICATIONS EVOLIS 600 DPI
// ═══════════════════════════════════════════════════════════════════════════

const EVOLIS_600DPI = {
  FORMAT: "CR80",
  WIDTH_MM: 85.6,
  HEIGHT_MM: 54,
  DPI: 600,
  // Conversion: 1 inch = 25.4mm, donc pixels = (mm / 25.4) * DPI
  get WIDTH_PX() { return Math.round((this.WIDTH_MM / 25.4) * this.DPI); }, // ~2024px
  get HEIGHT_PX() { return Math.round((this.HEIGHT_MM / 25.4) * this.DPI); }, // ~1276px
  BLEED_MM: 3,
  get BLEED_PX() { return Math.round((this.BLEED_MM / 25.4) * this.DPI); }, // ~71px
  CORNER_RADIUS_MM: 3.18,
  get CORNER_RADIUS_PX() { return Math.round((this.CORNER_RADIUS_MM / 25.4) * this.DPI); }, // ~75px
};

// Palette de couleurs
const cardColors = [
  { id: "black", name: "Noir", bg: "#0a0a0a", logoVariant: "white" as const },
  { id: "white", name: "Blanc", bg: "#fafafa", logoVariant: "dark" as const },
  { id: "gold", name: "Or", bg: "#c9a962", logoVariant: "dark" as const },
] as const;

type CardColorId = typeof cardColors[number]["id"];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function EvolisTemplateGenerator() {
  const [selectedColor, setSelectedColor] = useState<CardColorId>("black");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ front?: string; back?: string }>({});
  const canvasFrontRef = useRef<HTMLCanvasElement>(null);
  const canvasBackRef = useRef<HTMLCanvasElement>(null);

  const color = cardColors.find(c => c.id === selectedColor) || cardColors[0];
  const logoSrc = color.logoVariant === "white" ? iwaspLogoWhite : iwaspLogoDark;

  // Génère les images PNG haute résolution
  const generateTemplates = async () => {
    setIsGenerating(true);
    
    try {
      // Charger le logo
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = reject;
        logoImg.src = logoSrc;
      });

      // === FACE AVANT ===
      const frontCanvas = document.createElement("canvas");
      frontCanvas.width = EVOLIS_600DPI.WIDTH_PX;
      frontCanvas.height = EVOLIS_600DPI.HEIGHT_PX;
      const frontCtx = frontCanvas.getContext("2d")!;

      // Background
      frontCtx.fillStyle = color.bg;
      frontCtx.fillRect(0, 0, frontCanvas.width, frontCanvas.height);

      // Reflet premium en haut (gradient subtil)
      const topGradient = frontCtx.createLinearGradient(0, 0, 0, frontCanvas.height * 0.35);
      if (color.logoVariant === "white") {
        topGradient.addColorStop(0, "rgba(255,255,255,0.12)");
      } else {
        topGradient.addColorStop(0, "rgba(255,255,255,0.25)");
      }
      topGradient.addColorStop(1, "transparent");
      frontCtx.fillStyle = topGradient;
      frontCtx.fillRect(0, 0, frontCanvas.width, frontCanvas.height * 0.35);

      // Logo centré (55% de la largeur)
      const logoWidth = frontCanvas.width * 0.55;
      const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
      const logoX = (frontCanvas.width - logoWidth) / 2;
      const logoY = (frontCanvas.height - logoHeight) / 2;
      frontCtx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

      // Indicateur NFC (bas droite)
      drawNFCIndicator(frontCtx, frontCanvas.width - 80, frontCanvas.height - 80, color.logoVariant === "white");

      // Ombre de profondeur en bas
      const bottomGradient = frontCtx.createLinearGradient(0, frontCanvas.height * 0.75, 0, frontCanvas.height);
      bottomGradient.addColorStop(0, "transparent");
      bottomGradient.addColorStop(1, "rgba(0,0,0,0.15)");
      frontCtx.fillStyle = bottomGradient;
      frontCtx.fillRect(0, frontCanvas.height * 0.75, frontCanvas.width, frontCanvas.height * 0.25);

      const frontDataUrl = frontCanvas.toDataURL("image/png", 1.0);

      // === FACE ARRIÈRE ===
      const backCanvas = document.createElement("canvas");
      backCanvas.width = EVOLIS_600DPI.WIDTH_PX;
      backCanvas.height = EVOLIS_600DPI.HEIGHT_PX;
      const backCtx = backCanvas.getContext("2d")!;

      // Background
      backCtx.fillStyle = color.bg;
      backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);

      // Zone NFC centrale (cercle)
      const centerX = backCanvas.width / 2;
      const centerY = backCanvas.height / 2;
      const circleRadius = 120;
      
      backCtx.strokeStyle = color.logoVariant === "white" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
      backCtx.lineWidth = 4;
      backCtx.beginPath();
      backCtx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
      backCtx.stroke();

      // NFC icon au centre
      drawNFCIndicator(backCtx, centerX - 30, centerY - 30, color.logoVariant === "white", 60);

      // Badge "i-wasp" en haut à droite
      backCtx.font = "bold 32px 'Inter', sans-serif";
      backCtx.fillStyle = color.logoVariant === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
      backCtx.textAlign = "right";
      backCtx.fillText("i-wasp", backCanvas.width - 60, 70);

      // Gradient surface effet
      const surfaceGradient = backCtx.createLinearGradient(0, 0, backCanvas.width, backCanvas.height);
      surfaceGradient.addColorStop(0, "rgba(255,255,255,0.06)");
      surfaceGradient.addColorStop(0.5, "transparent");
      surfaceGradient.addColorStop(1, "rgba(0,0,0,0.08)");
      backCtx.fillStyle = surfaceGradient;
      backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);

      const backDataUrl = backCanvas.toDataURL("image/png", 1.0);

      setGeneratedImages({ front: frontDataUrl, back: backDataUrl });
    } catch (error) {
      console.error("Erreur génération:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Télécharger une image
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Générateur Template Evolis
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Génère des fichiers PNG haute résolution prêts pour impression Evolis Primacy/Zenius
          </p>
        </div>

        {/* Spécifications techniques */}
        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-5 h-5 text-primary" />
              Spécifications Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Format</p>
                <p className="font-mono font-medium">{EVOLIS_600DPI.FORMAT}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Dimensions</p>
                <p className="font-mono font-medium">{EVOLIS_600DPI.WIDTH_MM} × {EVOLIS_600DPI.HEIGHT_MM} mm</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Résolution</p>
                <p className="font-mono font-medium text-primary">{EVOLIS_600DPI.DPI} DPI</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Pixels</p>
                <p className="font-mono font-medium">{EVOLIS_600DPI.WIDTH_PX} × {EVOLIS_600DPI.HEIGHT_PX} px</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélecteur de couleur */}
        <Card>
          <CardHeader>
            <CardTitle>Couleur de la carte</CardTitle>
            <CardDescription>Sélectionnez la palette pour votre carte physique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-8">
              {cardColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.id)}
                  className={`
                    flex flex-col items-center gap-3 p-4 rounded-xl transition-all
                    ${selectedColor === c.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:bg-muted/50"}
                  `}
                >
                  <div 
                    className="w-16 h-16 rounded-full shadow-lg border"
                    style={{ backgroundColor: c.bg }}
                  />
                  <span className="text-sm font-medium">{c.name}</span>
                  {selectedColor === c.id && (
                    <Badge variant="default" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Sélectionné
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bouton génération */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={generateTemplates}
            disabled={isGenerating}
            className="gap-2 px-8"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                Générer Templates 600 DPI
              </>
            )}
          </Button>
        </div>

        {/* Résultats */}
        {(generatedImages.front || generatedImages.back) && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Face avant */}
            {generatedImages.front && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Face Avant
                    <Badge variant="outline">PNG · {EVOLIS_600DPI.DPI} DPI</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative aspect-[1.585] bg-muted rounded-lg overflow-hidden border">
                    <img 
                      src={generatedImages.front} 
                      alt="Face avant" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button 
                    onClick={() => downloadImage(generatedImages.front!, `iwasp-card-front-${selectedColor}-600dpi.png`)}
                    className="w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger Face Avant
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Face arrière */}
            {generatedImages.back && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Face Arrière
                    <Badge variant="outline">PNG · {EVOLIS_600DPI.DPI} DPI</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative aspect-[1.585] bg-muted rounded-lg overflow-hidden border">
                    <img 
                      src={generatedImages.back} 
                      alt="Face arrière" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button 
                    onClick={() => downloadImage(generatedImages.back!, `iwasp-card-back-${selectedColor}-600dpi.png`)}
                    className="w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger Face Arrière
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Instructions Evolis */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Instructions pour Evolis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>1. Téléchargez les deux fichiers PNG (face avant et arrière)</p>
            <p>2. Importez-les dans le logiciel Evolis (cardPresso, Designer, etc.)</p>
            <p>3. Vérifiez que les dimensions correspondent au format CR80</p>
            <p>4. Lancez l'impression en mode "Pleine couleur" ou "Photo"</p>
            <p className="text-muted-foreground italic">
              💡 Les fichiers sont générés à 600 DPI pour une qualité optimale sur les imprimantes Evolis haute définition.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Dessine l'icône NFC
// ═══════════════════════════════════════════════════════════════════════════

function drawNFCIndicator(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  light: boolean,
  size: number = 60
) {
  const color = light ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)";
  
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  
  const scale = size / 60;
  
  // Ondes NFC stylisées
  ctx.beginPath();
  ctx.arc(x + 30 * scale, y + 30 * scale, 12 * scale, -Math.PI * 0.75, Math.PI * 0.25, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(x + 30 * scale, y + 30 * scale, 22 * scale, -Math.PI * 0.75, Math.PI * 0.25, false);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(x + 30 * scale, y + 30 * scale, 32 * scale, -Math.PI * 0.75, Math.PI * 0.25, false);
  ctx.stroke();
  
  // Point central
  ctx.beginPath();
  ctx.arc(x + 30 * scale, y + 30 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fill();
}
