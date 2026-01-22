/**
 * Evolis Template Generator - 600 DPI CR80
 * 
 * REPRODUCTION FIDÈLE pour impression retransfer Evolis Avansia
 * Format: CR80 ISO 7810 (85.60 × 53.98 mm)
 * Résolution: 600 DPI réels
 * Dimensions: 2025 × 1275 px
 */

import { useState } from "react";
import { Download, Printer, Loader2, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ═══════════════════════════════════════════════════════════════════════════
// SPÉCIFICATIONS EVOLIS AVANSIA 600 DPI - CR80
// ═══════════════════════════════════════════════════════════════════════════

const EVOLIS_SPEC = {
  FORMAT: "CR80 – ISO 7810",
  WIDTH_MM: 85.60,
  HEIGHT_MM: 53.98,
  DPI: 600,
  // Dimensions exactes demandées
  WIDTH_PX: 2025,
  HEIGHT_PX: 1275,
  // Coins arrondis CR80 standard
  CORNER_RADIUS_MM: 3.18,
  get CORNER_RADIUS_PX() { return Math.round((this.CORNER_RADIUS_MM / 25.4) * this.DPI); }, // ~75px
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function EvolisTemplateGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ front?: string; back?: string }>({});

  // ═══════════════════════════════════════════════════════════════════════════
  // GÉNÉRATION DES TEMPLATES 600 DPI
  // ═══════════════════════════════════════════════════════════════════════════

  const generateTemplates = async () => {
    setIsGenerating(true);

    try {
      // === FACE RECTO (Logo i-Wasp centré) ===
      const frontCanvas = document.createElement("canvas");
      frontCanvas.width = EVOLIS_SPEC.WIDTH_PX;
      frontCanvas.height = EVOLIS_SPEC.HEIGHT_PX;
      const frontCtx = frontCanvas.getContext("2d")!;

      // Fond noir profond
      frontCtx.fillStyle = "#0a0a0a";
      frontCtx.fillRect(0, 0, frontCanvas.width, frontCanvas.height);

      // Motif nid d'abeille subtil (noir sur noir)
      drawHoneycombPattern(frontCtx, frontCanvas.width, frontCanvas.height, 0.035);

      // Dégradé subtil pour la profondeur
      drawSubtleDepthGradient(frontCtx, frontCanvas.width, frontCanvas.height);

      // Logo i-Wasp avec ondes NFC - centré
      drawIWaspLogo(frontCtx, frontCanvas.width / 2, frontCanvas.height / 2, 1);

      const frontDataUrl = frontCanvas.toDataURL("image/png", 1.0);

      // === FACE VERSO (Honeycomb + petit logo bas droite) ===
      const backCanvas = document.createElement("canvas");
      backCanvas.width = EVOLIS_SPEC.WIDTH_PX;
      backCanvas.height = EVOLIS_SPEC.HEIGHT_PX;
      const backCtx = backCanvas.getContext("2d")!;

      // Fond noir profond
      backCtx.fillStyle = "#0a0a0a";
      backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);

      // Motif nid d'abeille plus visible sur le verso
      drawHoneycombPattern(backCtx, backCanvas.width, backCanvas.height, 0.06);

      // Dégradé subtil
      drawSubtleDepthGradient(backCtx, backCanvas.width, backCanvas.height);

      // Petit logo NFC en bas à droite
      drawSmallNFCIcon(backCtx, backCanvas.width - 120, backCanvas.height - 100);

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

  // Télécharger les deux faces
  const downloadBoth = () => {
    if (generatedImages.front) {
      downloadImage(generatedImages.front, "iwasp-card-RECTO-600dpi-CR80.png");
    }
    setTimeout(() => {
      if (generatedImages.back) {
        downloadImage(generatedImages.back, "iwasp-card-VERSO-600dpi-CR80.png");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Template Evolis Avansia
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Génère des fichiers PNG 600 DPI prêts pour impression retransfer
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
                <p className="font-mono font-medium">{EVOLIS_SPEC.FORMAT}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Dimensions</p>
                <p className="font-mono font-medium">{EVOLIS_SPEC.WIDTH_MM} × {EVOLIS_SPEC.HEIGHT_MM} mm</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Résolution</p>
                <p className="font-mono font-medium text-primary">{EVOLIS_SPEC.DPI} DPI</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Pixels</p>
                <p className="font-mono font-medium">{EVOLIS_SPEC.WIDTH_PX} × {EVOLIS_SPEC.HEIGHT_PX} px</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aperçu du design */}
        <Card>
          <CardHeader>
            <CardTitle>Design Final</CardTitle>
            <CardDescription>
              Carte NFC PVC haut de gamme avec motif nid d'abeille subtil et logo i-Wasp argenté
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded bg-[#0a0a0a] border border-border" />
                <span>Fond noir profond</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-[#888] to-[#aaa] border border-border" />
                <span>Logo argenté</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-green-500" />
                <span>Honeycomb subtil</span>
              </div>
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
                Génération 600 DPI...
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                Générer Templates Evolis
              </>
            )}
          </Button>
        </div>

        {/* Résultats */}
        {(generatedImages.front || generatedImages.back) && (
          <div className="space-y-6">
            {/* Bouton télécharger tout */}
            <div className="flex justify-center">
              <Button onClick={downloadBoth} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Télécharger Recto + Verso
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Face Recto */}
              {generatedImages.front && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      RECTO
                      <Badge variant="outline">PNG · 600 DPI</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-[1.588] bg-neutral-900 rounded-xl overflow-hidden border border-border">
                      <img
                        src={generatedImages.front}
                        alt="Face recto"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      onClick={() => downloadImage(generatedImages.front!, "iwasp-card-RECTO-600dpi-CR80.png")}
                      className="w-full gap-2"
                      variant="secondary"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger Recto
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Face Verso */}
              {generatedImages.back && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      VERSO
                      <Badge variant="outline">PNG · 600 DPI</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-[1.588] bg-neutral-900 rounded-xl overflow-hidden border border-border">
                      <img
                        src={generatedImages.back}
                        alt="Face verso"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      onClick={() => downloadImage(generatedImages.back!, "iwasp-card-VERSO-600dpi-CR80.png")}
                      className="w-full gap-2"
                      variant="secondary"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger Verso
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Instructions Evolis Avansia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>1. Téléchargez les deux fichiers PNG (Recto et Verso)</p>
            <p>2. Importez-les dans le logiciel Evolis ou CardPresso</p>
            <p>3. Format cible : CR80 ISO 7810 — Impression retransfer</p>
            <p>4. Mode d'impression : Pleine couleur haute définition</p>
            <p className="text-muted-foreground italic pt-2">
              💡 Fichiers optimisés 2025 × 1275 px @ 600 DPI pour Evolis Avansia
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Motif nid d'abeille (Honeycomb) - très subtil, ton sur ton
// ═══════════════════════════════════════════════════════════════════════════

function drawHoneycombPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.04
) {
  const hexRadius = 38; // Taille des hexagones
  const hexWidth = hexRadius * 2;
  const hexHeight = Math.sqrt(3) * hexRadius;
  const horizontalSpacing = hexWidth * 0.75;
  const verticalSpacing = hexHeight;

  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Dessiner les hexagones en grille
  for (let row = -1; row < height / verticalSpacing + 2; row++) {
    for (let col = -1; col < width / horizontalSpacing + 2; col++) {
      const offsetY = col % 2 === 0 ? 0 : hexHeight / 2;
      const x = col * horizontalSpacing;
      const y = row * verticalSpacing + offsetY;

      drawHexagon(ctx, x, y, hexRadius);
    }
  }
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Dégradé subtil de profondeur
// ═══════════════════════════════════════════════════════════════════════════

function drawSubtleDepthGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // Dégradé radial depuis le centre pour effet de profondeur
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, maxRadius
  );
  gradient.addColorStop(0, "rgba(30, 30, 30, 0.15)");
  gradient.addColorStop(0.5, "transparent");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Logo i-Wasp avec ondes NFC intégrées (style argenté/métallisé)
// ═══════════════════════════════════════════════════════════════════════════

function drawIWaspLogo(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  scale: number = 1
) {
  const s = scale;

  // Couleur argentée/métallisée avec dégradé
  const gradient = ctx.createLinearGradient(
    centerX - 200 * s, centerY - 50 * s,
    centerX + 200 * s, centerY + 50 * s
  );
  gradient.addColorStop(0, "#9a9a9a");
  gradient.addColorStop(0.3, "#d4d4d4");
  gradient.addColorStop(0.5, "#ffffff");
  gradient.addColorStop(0.7, "#c8c8c8");
  gradient.addColorStop(1, "#8a8a8a");

  ctx.fillStyle = gradient;
  ctx.strokeStyle = gradient;

  // Texte "i-Wasp" avec police premium
  ctx.font = `bold ${72 * s}px 'SF Pro Display', 'Helvetica Neue', 'Inter', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Ombre subtile pour effet relief
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 4 * s;
  ctx.shadowOffsetX = 2 * s;
  ctx.shadowOffsetY = 2 * s;

  // Position du texte (légèrement à gauche pour laisser place aux ondes)
  const textX = centerX - 40 * s;
  ctx.fillText("i-Wasp", textX, centerY);

  // Réinitialiser l'ombre
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Ondes NFC (3 arcs à droite du texte)
  const waveStartX = textX + 140 * s;
  const waveY = centerY;

  ctx.lineWidth = 5 * s;
  ctx.lineCap = "round";
  ctx.strokeStyle = gradient;

  // Arc 1 (le plus proche)
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(waveStartX, waveY, 28 * s, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  // Arc 2 (moyen)
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(waveStartX, waveY, 52 * s, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  // Arc 3 (le plus éloigné)
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.arc(waveStartX, waveY, 76 * s, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  ctx.globalAlpha = 1;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Petit icône NFC pour le verso (bas droite)
// ═══════════════════════════════════════════════════════════════════════════

function drawSmallNFCIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  const scale = 0.6;

  // Couleur grise subtile
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = "round";

  // Arc externe (onde)
  ctx.beginPath();
  ctx.arc(x, y, 45 * scale, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Arc moyen
  ctx.beginPath();
  ctx.arc(x, y, 30 * scale, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Arc interne
  ctx.beginPath();
  ctx.arc(x, y, 15 * scale, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Point central
  ctx.beginPath();
  ctx.arc(x, y, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
}
