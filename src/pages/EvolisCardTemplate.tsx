/**
 * EVOLIS CARD TEMPLATE GENERATOR
 * 
 * REPRODUCTION FIDÈLE À 100% - Impression Retransfer 600 DPI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Format: CR80 – ISO 7810
 * Dimensions: 85.60 × 53.98 mm → 2025 × 1275 px @ 600 DPI
 * Technologie: Evolis Avansia (Retransfer)
 * 
 * Critère: Visuellement INDISCERNABLE des images de référence
 */

import { useState, useCallback } from "react";
import { Download, Printer, Loader2, Eye, Check, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import iwaspLogo from "@/assets/iwasp-logo.png";

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
  SAFE_MARGIN_MM: 3, // Aucun élément critique à moins de 3mm des bords
  CORNER_RADIUS_PX: 75, // ~3.18mm en 600 DPI
};

// Logo (référence utilisateur) : largeur exacte 3.5 cm = 827 px @ 600 DPI
const LOGO_PLACEMENT = {
  widthPx: 827,
  offsetXPx: 0,
  offsetYPx: 0,
};

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Impossible de charger l'image: ${src}`));
    img.src = src;
  });
}

function drawLogoFromAsset(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  img: HTMLImageElement
) {
  const destW = LOGO_PLACEMENT.widthPx;
  const aspect = (img.naturalHeight || img.height) / (img.naturalWidth || img.width);
  const destH = Math.round(destW * aspect);

  const x = Math.round(centerX - destW / 2 + LOGO_PLACEMENT.offsetXPx);
  const y = Math.round(centerY - destH / 2 + LOGO_PLACEMENT.offsetYPx);

  // Rendu net, sans lissage excessif
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    x,
    y,
    destW,
    destH
  );
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function EvolisCardTemplate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<"recto" | "verso">("recto");
  const [generatedImages, setGeneratedImages] = useState<{
    recto?: string;
    verso?: string;
  }>({});

  // ═══════════════════════════════════════════════════════════════════════════
  // GÉNÉRATION DES TEMPLATES 600 DPI - FIDÉLITÉ ABSOLUE
  // ═══════════════════════════════════════════════════════════════════════════

  const generateTemplates = useCallback(async () => {
    setIsGenerating(true);

    try {
      // ═══════════════════════════════════════════════════════════════════════
      // RECTO - Logo i-Wasp centré avec ondes NFC
      // ═══════════════════════════════════════════════════════════════════════
      const rectoCanvas = document.createElement("canvas");
      rectoCanvas.width = SPEC.WIDTH_PX;
      rectoCanvas.height = SPEC.HEIGHT_PX;
      const rectoCtx = rectoCanvas.getContext("2d", { alpha: false })!;

      // 1. FOND NOIR PROFOND (Calque 1)
      rectoCtx.fillStyle = "#0a0a0a";
      rectoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);

      // 2. PAS DE HONEYCOMB SUR LE RECTO - Fond noir uni premium

      // 3. DÉGRADÉ DE PROFONDEUR - Subtil (Calque 2)
      drawDepthGradient(rectoCtx, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);

       // 4. LOGO i-Wasp (Calque 4)
       try {
         const logoImg = await loadImage(iwaspLogo);
         drawLogoFromAsset(rectoCtx, SPEC.WIDTH_PX / 2, SPEC.HEIGHT_PX / 2, logoImg);
       } catch {
         // Fallback: ancien rendu vectoriel si l'image ne charge pas
         drawIWaspLogoWithNFC(rectoCtx, SPEC.WIDTH_PX / 2, SPEC.HEIGHT_PX / 2);
       }

      const rectoDataUrl = rectoCanvas.toDataURL("image/png", 1.0);

      // ═══════════════════════════════════════════════════════════════════════
      // VERSO - Honeycomb visible + petit logo NFC bas droite
      // ═══════════════════════════════════════════════════════════════════════
      const versoCanvas = document.createElement("canvas");
      versoCanvas.width = SPEC.WIDTH_PX;
      versoCanvas.height = SPEC.HEIGHT_PX;
      const versoCtx = versoCanvas.getContext("2d", { alpha: false })!;

      // 1. FOND NOIR PROFOND
      versoCtx.fillStyle = "#0a0a0a";
      versoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);

      // 2. MOTIF NID D'ABEILLE - Plus visible sur verso pour effet marqué
      drawHoneycombPattern(versoCtx, SPEC.WIDTH_PX, SPEC.HEIGHT_PX, {
        opacity: 0.075,
        hexSize: 48,
        strokeWidth: 1.4,
      });

      // 3. DÉGRADÉ DE PROFONDEUR
      drawDepthGradient(versoCtx, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);

      // 4. PETIT ICÔNE NFC - Bas droite (comme sur l'image de référence)
      drawSmallNFCWaves(versoCtx, SPEC.WIDTH_PX - 130, SPEC.HEIGHT_PX - 110);

      const versoDataUrl = versoCanvas.toDataURL("image/png", 1.0);

      setGeneratedImages({ recto: rectoDataUrl, verso: versoDataUrl });
    } catch (error) {
      console.error("Erreur génération:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Télécharger une image
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Télécharger les deux
  const downloadBoth = () => {
    if (generatedImages.recto) {
      downloadImage(generatedImages.recto, "IWASP-CARD-RECTO-600DPI-CR80.png");
    }
    setTimeout(() => {
      if (generatedImages.verso) {
        downloadImage(generatedImages.verso, "IWASP-CARD-VERSO-600DPI-CR80.png");
      }
    }, 300);
  };

  const currentPreview = previewMode === "recto" ? generatedImages.recto : generatedImages.verso;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-sm">
            <Layers className="w-4 h-4" />
            <span>EVOLIS AVANSIA • 600 DPI • RETRANSFER</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Template Carte NFC PVC
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm">
            Reproduction fidèle à l'identique • CR80 ISO 7810 • Prêt pour impression industrielle
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

        {/* Bouton Génération */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={generateTemplates}
            disabled={isGenerating}
            className="gap-3 px-8 py-6 text-lg bg-white text-black hover:bg-neutral-200"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Génération 600 DPI...
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                Générer Templates
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
                    ? "bg-white text-black"
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
                    ? "bg-white text-black"
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
                onClick={() => generatedImages.recto && downloadImage(generatedImages.recto, "IWASP-CARD-RECTO-600DPI-CR80.png")}
                variant="outline"
                className="gap-2 border-neutral-700 text-white hover:bg-neutral-800"
                disabled={!generatedImages.recto}
              >
                <Download className="w-4 h-4" />
                Recto
              </Button>
              <Button
                onClick={() => generatedImages.verso && downloadImage(generatedImages.verso, "IWASP-CARD-VERSO-600DPI-CR80.png")}
                variant="outline"
                className="gap-2 border-neutral-700 text-white hover:bg-neutral-800"
                disabled={!generatedImages.verso}
              >
                <Download className="w-4 h-4" />
                Verso
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
                  <p className="text-emerald-300 font-medium">Fichiers prêts pour Evolis Avansia</p>
                  <p className="text-emerald-400/70">
                    2025 × 1275 px @ 600 DPI • PNG sans compression • Compatible retransfer
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-neutral-500 text-xs space-y-1 pt-4 border-t border-neutral-800">
          <p>Format: CR80 ISO 7810 • Impression: Retransfer haute définition</p>
          <p>Logiciels compatibles: Evolis Designer, CardPresso, Badgy</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MOTIF NID D'ABEILLE (HONEYCOMB)
// Régulier, homogène, très subtil, ton sur ton noir
// ═══════════════════════════════════════════════════════════════════════════

interface HoneycombOptions {
  opacity: number;
  hexSize: number;
  strokeWidth: number;
}

function drawHoneycombPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: HoneycombOptions
) {
  const { opacity, hexSize, strokeWidth } = options;

  const hexWidth = hexSize * 2;
  const hexHeight = Math.sqrt(3) * hexSize;
  const horizontalSpacing = hexWidth * 0.75;
  const verticalSpacing = hexHeight;

  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Grille hexagonale régulière
  const cols = Math.ceil(width / horizontalSpacing) + 2;
  const rows = Math.ceil(height / verticalSpacing) + 2;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const offsetY = col % 2 === 0 ? 0 : hexHeight / 2;
      const cx = col * horizontalSpacing;
      const cy = row * verticalSpacing + offsetY;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + hexSize * Math.cos(angle);
        const y = cy + hexSize * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DÉGRADÉ DE PROFONDEUR
// Léger, sobre, pas de reflets agressifs
// ═══════════════════════════════════════════════════════════════════════════

function drawDepthGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(width * width + height * height) / 2;

  // Vignette subtile
  const gradient = ctx.createRadialGradient(
    centerX, centerY * 0.8, 0,
    centerX, centerY, maxRadius
  );
  gradient.addColorStop(0, "rgba(25, 25, 25, 0.1)");
  gradient.addColorStop(0.4, "transparent");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.15)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGO i-Wasp AVEC ONDES NFC - REPRODUCTION FIDÈLE À 100%
// Basé sur l'image de référence : taille 3.5 cm = 827 px @ 600 DPI
// ═══════════════════════════════════════════════════════════════════════════

function drawIWaspLogoWithNFC(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number
) {
  // Taille réduite : 2.8 cm = 661 px @ 600 DPI (au lieu de 3.5 cm)
  const logoWidth = 661;
  const scale = logoWidth / 400; // Facteur d'échelle basé sur design de base 400px
  
  // Position décalée vers le haut et vers la droite
  const baseX = centerX - 50 * scale; // Décalage droite (+30 par rapport à avant)
  const baseY = centerY - 40 * scale; // Décalage vers le haut

  // ═══════════════════════════════════════════════════════════════════════
  // DÉGRADÉ MÉTALLISÉ ARGENTÉ (fidèle à la référence)
  // ═══════════════════════════════════════════════════════════════════════
  const metalGradient = ctx.createLinearGradient(
    centerX - logoWidth / 2, centerY - 60 * scale,
    centerX + logoWidth / 2, centerY + 60 * scale
  );
  
  metalGradient.addColorStop(0, "#5a5a5a");
  metalGradient.addColorStop(0.15, "#7a7a7a");
  metalGradient.addColorStop(0.3, "#a8a8a8");
  metalGradient.addColorStop(0.45, "#c8c8c8");
  metalGradient.addColorStop(0.5, "#e0e0e0");
  metalGradient.addColorStop(0.55, "#d0d0d0");
  metalGradient.addColorStop(0.7, "#a0a0a0");
  metalGradient.addColorStop(0.85, "#707070");
  metalGradient.addColorStop(1, "#505050");

  // ═══════════════════════════════════════════════════════════════════════
  // ICÔNE WIFI/NFC AU-DESSUS DU "i" (3 petits arcs)
  // ═══════════════════════════════════════════════════════════════════════
  const wifiX = baseX - 145 * scale;
  const wifiY = baseY - 35 * scale;
  
  ctx.save();
  ctx.strokeStyle = metalGradient;
  ctx.lineCap = "round";
  ctx.lineWidth = 4 * scale;
  
  // Ombre pour les arcs WiFi
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 4 * scale;
  ctx.shadowOffsetX = 1 * scale;
  ctx.shadowOffsetY = 2 * scale;
  
  // Arc 1 (le plus petit, en bas)
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(wifiX, wifiY + 18 * scale, 8 * scale, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();
  
  // Arc 2 (moyen)
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(wifiX, wifiY + 18 * scale, 16 * scale, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();
  
  // Arc 3 (le plus grand, en haut)
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(wifiX, wifiY + 18 * scale, 24 * scale, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();
  
  ctx.globalAlpha = 1;
  ctx.restore();

  // ═══════════════════════════════════════════════════════════════════════
  // TEXTE "i-Wasp" - Police et taille fidèles
  // ═══════════════════════════════════════════════════════════════════════
  ctx.save();
  
  // Ombre portée pour relief
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 8 * scale;
  ctx.shadowOffsetX = 2 * scale;
  ctx.shadowOffsetY = 4 * scale;
  
  // Police - taille proportionnelle à 3.5 cm
  const fontSize = 72 * scale;
  ctx.font = `600 ${fontSize}px 'SF Pro Display', 'Helvetica Neue', 'Arial', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = metalGradient;
  
  ctx.fillText("i-Wasp", baseX, baseY);
  
  ctx.restore();

  // ═══════════════════════════════════════════════════════════════════════
  // ONDES NFC À DROITE (3 grands arcs courbés)
  // Position et forme exactes comme sur la référence
  // ═══════════════════════════════════════════════════════════════════════
  const waveX = baseX + 155 * scale;
  const waveY = baseY;
  
  ctx.save();
  ctx.strokeStyle = metalGradient;
  ctx.lineCap = "round";
  ctx.lineWidth = 8 * scale;
  
  // Ombre pour les ondes
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetX = 2 * scale;
  ctx.shadowOffsetY = 3 * scale;
  
  // Arc 1 - Le plus proche (pleine opacité)
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(waveX, waveY, 35 * scale, -Math.PI * 0.38, Math.PI * 0.38);
  ctx.stroke();
  
  // Arc 2 - Moyen
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.arc(waveX, waveY, 60 * scale, -Math.PI * 0.38, Math.PI * 0.38);
  ctx.stroke();
  
  // Arc 3 - Le plus éloigné
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(waveX, waveY, 85 * scale, -Math.PI * 0.38, Math.PI * 0.38);
  ctx.stroke();
  
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════════
// PETIT ICÔNE NFC POUR LE VERSO
// Bas droite, discret
// ═══════════════════════════════════════════════════════════════════════════

function drawSmallNFCWaves(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineCap = "round";
  ctx.lineWidth = 2.5;

  // Arc externe
  ctx.beginPath();
  ctx.arc(x, y, 35, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Arc moyen
  ctx.beginPath();
  ctx.arc(x, y, 24, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Arc interne
  ctx.beginPath();
  ctx.arc(x, y, 13, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  // Point central
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}
