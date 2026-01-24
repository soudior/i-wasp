/**
 * IWASP SIGNATURE CARD GENERATOR
 * 
 * Génération automatique du design signature IWASP
 * ═══════════════════════════════════════════════════════════════
 * 
 * Format: CR80 – ISO 7810
 * Dimensions: 85.60 × 53.98 mm → 2025 × 1275 px @ 600 DPI
 * Design: Noir premium + Logo métallisé + Honeycomb
 */

import { useState, useCallback } from "react";
import { Download, Printer, Loader2, Eye, Check, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════════════════
// SPÉCIFICATIONS CR80 - 600 DPI EXACTES
// ═══════════════════════════════════════════════════════════════════════════

const SPEC = {
  FORMAT: "CR80 – ISO 7810",
  WIDTH_MM: 85.60,
  HEIGHT_MM: 53.98,
  DPI: 600,
  WIDTH_PX: 2025,
  HEIGHT_PX: 1275,
  CORNER_RADIUS_PX: 75,
};

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS DE DESSIN
// ═══════════════════════════════════════════════════════════════════════════

function drawHoneycombPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number = 0.08
) {
  const hexSize = 40;
  const hexHeight = hexSize * Math.sqrt(3);
  const hexWidth = hexSize * 2;

  ctx.save();
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.lineWidth = 1.5;

  for (let row = -1; row < height / hexHeight + 1; row++) {
    for (let col = -1; col < width / hexWidth + 1; col++) {
      const x = col * hexWidth * 0.75 + (row % 2 === 0 ? 0 : hexWidth * 0.375);
      const y = row * hexHeight * 0.5;
      drawHexagon(ctx, x, y, hexSize);
    }
  }

  ctx.restore();
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

function drawIwaspLogo(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  scale: number = 1
) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);

  // Créer le gradient métallisé
  const gradient = ctx.createLinearGradient(-150, -80, 150, 80);
  gradient.addColorStop(0, "#8B7355");
  gradient.addColorStop(0.15, "#C9B896");
  gradient.addColorStop(0.3, "#E8DCC8");
  gradient.addColorStop(0.45, "#F5EDE0");
  gradient.addColorStop(0.5, "#FFFFFF");
  gradient.addColorStop(0.55, "#F5EDE0");
  gradient.addColorStop(0.7, "#E8DCC8");
  gradient.addColorStop(0.85, "#C9B896");
  gradient.addColorStop(1, "#8B7355");

  // Ombre portée subtile
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  // Texte "i-WASP"
  ctx.fillStyle = gradient;
  ctx.font = "bold 120px 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("i-WASP", 0, 0);

  // Ondes NFC
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;

  const nfcX = 180;
  const nfcY = -30;

  for (let i = 0; i < 3; i++) {
    const radius = 18 + i * 14;
    ctx.beginPath();
    ctx.arc(nfcX, nfcY, radius, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNfcIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number = 60
) {
  ctx.save();
  ctx.translate(x, y);

  const gradient = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0.3)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  // Trois arcs NFC
  for (let i = 0; i < 3; i++) {
    const radius = size * 0.25 + i * size * 0.2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, -Math.PI / 3.5, Math.PI / 3.5);
    ctx.stroke();
  }

  // Point central
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function IwaspCardGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<"recto" | "verso">("recto");
  const [generatedImages, setGeneratedImages] = useState<{
    recto?: string;
    verso?: string;
  }>({});

  const generateSignatureCard = useCallback(async () => {
    setIsGenerating(true);

    try {
      // ═══════════════════════════════════════════════════════════════════════
      // RECTO - Design signature noir + logo métallisé
      // ═══════════════════════════════════════════════════════════════════════
      const rectoCanvas = document.createElement("canvas");
      rectoCanvas.width = SPEC.WIDTH_PX;
      rectoCanvas.height = SPEC.HEIGHT_PX;
      const rectoCtx = rectoCanvas.getContext("2d", { alpha: false })!;

      // Fond noir premium avec léger gradient
      const bgGradient = rectoCtx.createRadialGradient(
        SPEC.WIDTH_PX / 2,
        SPEC.HEIGHT_PX / 2,
        0,
        SPEC.WIDTH_PX / 2,
        SPEC.HEIGHT_PX / 2,
        SPEC.WIDTH_PX * 0.7
      );
      bgGradient.addColorStop(0, "#0a0a0a");
      bgGradient.addColorStop(0.5, "#050505");
      bgGradient.addColorStop(1, "#000000");
      rectoCtx.fillStyle = bgGradient;
      rectoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);

      // Logo i-WASP centré avec effet métallisé
      drawIwaspLogo(rectoCtx, SPEC.WIDTH_PX / 2, SPEC.HEIGHT_PX / 2, 2.5);

      const rectoDataUrl = rectoCanvas.toDataURL("image/png", 1.0);

      // ═══════════════════════════════════════════════════════════════════════
      // VERSO - Honeycomb + NFC icon discret
      // ═══════════════════════════════════════════════════════════════════════
      const versoCanvas = document.createElement("canvas");
      versoCanvas.width = SPEC.WIDTH_PX;
      versoCanvas.height = SPEC.HEIGHT_PX;
      const versoCtx = versoCanvas.getContext("2d", { alpha: false })!;

      // Fond noir premium
      const versoBgGradient = versoCtx.createRadialGradient(
        SPEC.WIDTH_PX / 2,
        SPEC.HEIGHT_PX / 2,
        0,
        SPEC.WIDTH_PX / 2,
        SPEC.HEIGHT_PX / 2,
        SPEC.WIDTH_PX * 0.7
      );
      versoBgGradient.addColorStop(0, "#0a0a0a");
      versoBgGradient.addColorStop(0.5, "#050505");
      versoBgGradient.addColorStop(1, "#000000");
      versoCtx.fillStyle = versoBgGradient;
      versoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);

      // Motif honeycomb subtil
      drawHoneycombPattern(versoCtx, SPEC.WIDTH_PX, SPEC.HEIGHT_PX, 0.075);

      // Icône NFC en bas à droite
      drawNfcIcon(versoCtx, SPEC.WIDTH_PX - 120, SPEC.HEIGHT_PX - 100, 80);

      // Tagline discret en bas
      versoCtx.fillStyle = "rgba(255, 255, 255, 0.25)";
      versoCtx.font = "24px 'SF Pro Display', -apple-system, sans-serif";
      versoCtx.textAlign = "center";
      versoCtx.textBaseline = "bottom";
      versoCtx.fillText("Tap. Connect. Empower.", SPEC.WIDTH_PX / 2, SPEC.HEIGHT_PX - 60);

      const versoDataUrl = versoCanvas.toDataURL("image/png", 1.0);

      setGeneratedImages({ recto: rectoDataUrl, verso: versoDataUrl });
      toast.success("Design signature IWASP généré avec succès !");
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBoth = () => {
    if (generatedImages.recto) {
      downloadImage(generatedImages.recto, "IWASP-SIGNATURE-RECTO-600DPI.png");
    }
    setTimeout(() => {
      if (generatedImages.verso) {
        downloadImage(generatedImages.verso, "IWASP-SIGNATURE-VERSO-600DPI.png");
      }
    }, 300);
  };

  const currentPreview = previewMode === "recto" ? generatedImages.recto : generatedImages.verso;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>DESIGN SIGNATURE • 600 DPI • PRÊT À IMPRIMER</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Carte IWASP Signature
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm">
            Génération automatique du design premium • Noir mat + Logo métallisé + Honeycomb
          </p>
        </div>

        {/* Spécifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Format", value: "CR80" },
            { label: "Dimensions", value: `${SPEC.WIDTH_MM} × ${SPEC.HEIGHT_MM} mm` },
            { label: "Résolution", value: `${SPEC.DPI} DPI`, highlight: true },
            { label: "Pixels", value: `${SPEC.WIDTH_PX} × ${SPEC.HEIGHT_PX}` },
          ].map((spec) => (
            <div
              key={spec.label}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-center"
            >
              <p className="text-neutral-500 text-xs uppercase tracking-wide">{spec.label}</p>
              <p className={`font-mono font-semibold mt-1 ${spec.highlight ? "text-amber-400" : "text-white"}`}>
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        {/* Design Preview Card */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Layers className="w-5 h-5" />
              <span>Design Signature IWASP</span>
              <Badge variant="outline" className="ml-auto border-amber-500/50 text-amber-400">
                Premium
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm text-neutral-400">
              <div className="space-y-2">
                <p className="text-white font-medium">RECTO</p>
                <ul className="space-y-1 text-xs">
                  <li>• Fond noir premium avec gradient radial</li>
                  <li>• Logo "i-WASP" avec effet métallisé 9 stops</li>
                  <li>• Ondes NFC intégrées au logo</li>
                  <li>• Ombre portée subtile</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">VERSO</p>
                <ul className="space-y-1 text-xs">
                  <li>• Fond noir assorti</li>
                  <li>• Motif honeycomb subtil (7.5% opacité)</li>
                  <li>• Icône NFC discrète en bas à droite</li>
                  <li>• Tagline "Tap. Connect. Empower."</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton Génération */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={generateSignatureCard}
            disabled={isGenerating}
            className="gap-3 px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Génération 600 DPI...
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                Générer Design Signature
              </>
            )}
          </Button>
        </div>

        {/* Résultats */}
        {(generatedImages.recto || generatedImages.verso) && (
          <div className="space-y-6">
            {/* Toggle Recto/Verso */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPreviewMode("recto")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  previewMode === "recto"
                    ? "bg-amber-500 text-black"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Recto
              </button>
              <button
                onClick={() => setPreviewMode("verso")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  previewMode === "verso"
                    ? "bg-amber-500 text-black"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Verso
              </button>
            </div>

            {/* Aperçu Principal */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <span>{previewMode === "recto" ? "RECTO" : "VERSO"}</span>
                  <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                    PNG • 600 DPI • Sans compression
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPreview && (
                  <div className="relative aspect-[1.588] bg-black rounded-xl overflow-hidden border border-neutral-700 shadow-2xl">
                    <img
                      src={currentPreview}
                      alt={`Face ${previewMode}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Boutons de téléchargement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => generatedImages.recto && downloadImage(generatedImages.recto, "IWASP-SIGNATURE-RECTO-600DPI.png")}
                variant="outline"
                className="gap-2 border-neutral-700 text-white hover:bg-neutral-800"
                disabled={!generatedImages.recto}
              >
                <Download className="w-4 h-4" />
                Télécharger Recto
              </Button>
              <Button
                onClick={() => generatedImages.verso && downloadImage(generatedImages.verso, "IWASP-SIGNATURE-VERSO-600DPI.png")}
                variant="outline"
                className="gap-2 border-neutral-700 text-white hover:bg-neutral-800"
                disabled={!generatedImages.verso}
              >
                <Download className="w-4 h-4" />
                Télécharger Verso
              </Button>
              <Button
                onClick={downloadBoth}
                className="gap-2 bg-amber-500 text-black hover:bg-amber-400"
              >
                <Download className="w-4 h-4" />
                Télécharger Tout
              </Button>
            </div>

            {/* Validation */}
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <p className="text-emerald-300 font-medium">Fichiers prêts pour impression</p>
                  <p className="text-emerald-400/70">
                    2025 × 1275 px @ 600 DPI • PNG sans compression • Compatible Evolis, Zebra, Fargo
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-neutral-500 text-xs space-y-1 pt-4 border-t border-neutral-800">
          <p>Format: CR80 ISO 7810 • Design: IWASP Signature Premium</p>
          <p>Logiciels compatibles: Evolis Designer, CardPresso, Badgy</p>
        </div>
      </div>
    </div>
  );
}
