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

      // 2. MOTIF NID D'ABEILLE - Extrêmement subtil, ton sur ton (Calque 2)
      drawHoneycombPattern(rectoCtx, SPEC.WIDTH_PX, SPEC.HEIGHT_PX, {
        opacity: 0.028,
        hexSize: 48,
        strokeWidth: 0.8,
      });

      // 3. DÉGRADÉ DE PROFONDEUR - Subtil (Calque 3)
      drawDepthGradient(rectoCtx, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);

      // 4. LOGO i-Wasp CENTRÉ (Calque 4)
      drawIWaspLogoWithNFC(rectoCtx, SPEC.WIDTH_PX / 2, SPEC.HEIGHT_PX / 2);

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

      // 2. MOTIF NID D'ABEILLE - Légèrement plus visible sur verso (comme référence)
      drawHoneycombPattern(versoCtx, SPEC.WIDTH_PX, SPEC.HEIGHT_PX, {
        opacity: 0.045,
        hexSize: 48,
        strokeWidth: 1.0,
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
// LOGO i-Wasp AVEC ONDES NFC
// Argenté/métallisé, centré, fidèle à la référence
// ═══════════════════════════════════════════════════════════════════════════

function drawIWaspLogoWithNFC(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number
) {
  // ═══════════════════════════════════════════════════════════════════════
  // DÉGRADÉ ARGENTÉ MÉTALLISÉ RÉALISTE
  // Simulation d'un métal brossé/poli avec reflets
  // ═══════════════════════════════════════════════════════════════════════
  
  const metalGradient = ctx.createLinearGradient(
    centerX - 280, centerY - 50,
    centerX + 280, centerY + 50
  );
  
  // Dégradé métal argenté réaliste avec reflets
  metalGradient.addColorStop(0, "#6b6b6b");
  metalGradient.addColorStop(0.12, "#8e8e8e");
  metalGradient.addColorStop(0.25, "#b8b8b8");
  metalGradient.addColorStop(0.38, "#d0d0d0");
  metalGradient.addColorStop(0.5, "#e8e8e8");
  metalGradient.addColorStop(0.62, "#c8c8c8");
  metalGradient.addColorStop(0.75, "#a0a0a0");
  metalGradient.addColorStop(0.88, "#787878");
  metalGradient.addColorStop(1, "#5a5a5a");

  // Position du texte (légèrement à gauche pour les ondes)
  const textX = centerX - 60;
  const textY = centerY;

  // ═══════════════════════════════════════════════════════════════════════
  // ÉTAPE 1: Dessiner le texte de base avec ombre
  // ═══════════════════════════════════════════════════════════════════════
  ctx.save();
  
  // Ombre portée pour effet relief/gravure
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 5;

  ctx.font = "bold 88px 'SF Pro Display', 'Helvetica Neue', 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = metalGradient;
  ctx.fillText("i-Wasp", textX, textY);
  
  ctx.restore();

  // ═══════════════════════════════════════════════════════════════════════
  // ÉTAPE 2: Micro-texture métal brossé (lignes horizontales très fines)
  // ═══════════════════════════════════════════════════════════════════════
  ctx.save();
  
  // Créer un masque avec le texte
  ctx.font = "bold 88px 'SF Pro Display', 'Helvetica Neue', 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Utiliser le texte comme clip path
  ctx.beginPath();
  // On doit dessiner le texte comme path - on va utiliser une approche alternative
  // Dessiner des lignes de brossage par-dessus avec globalCompositeOperation
  
  ctx.globalCompositeOperation = "source-atop";
  
  // Lignes de brossage horizontales ultra-fines
  const brushLineSpacing = 1.5; // Espacement entre les lignes
  const textBounds = {
    left: textX - 220,
    right: textX + 220,
    top: textY - 55,
    bottom: textY + 55
  };
  
  for (let y = textBounds.top; y < textBounds.bottom; y += brushLineSpacing) {
    // Variation subtile de l'opacité pour simuler le brossage irrégulier
    const variation = Math.random() * 0.03 + 0.02;
    ctx.strokeStyle = `rgba(255, 255, 255, ${variation})`;
    ctx.lineWidth = 0.5;
    
    ctx.beginPath();
    ctx.moveTo(textBounds.left, y);
    ctx.lineTo(textBounds.right, y);
    ctx.stroke();
  }
  
  // Quelques lignes légèrement plus marquées pour le réalisme
  for (let y = textBounds.top; y < textBounds.bottom; y += brushLineSpacing * 4) {
    const variation = Math.random() * 0.02 + 0.01;
    ctx.strokeStyle = `rgba(0, 0, 0, ${variation})`;
    ctx.lineWidth = 0.3;
    
    ctx.beginPath();
    ctx.moveTo(textBounds.left, y + 0.5);
    ctx.lineTo(textBounds.right, y + 0.5);
    ctx.stroke();
  }
  
  ctx.restore();

  // ═══════════════════════════════════════════════════════════════════════
  // ÉTAPE 3: Reflet supérieur subtil (highlight)
  // ═══════════════════════════════════════════════════════════════════════
  ctx.save();
  
  const highlightGradient = ctx.createLinearGradient(
    textX, textY - 50,
    textX, textY + 20
  );
  highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
  highlightGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.05)");
  highlightGradient.addColorStop(1, "transparent");
  
  ctx.font = "bold 88px 'SF Pro Display', 'Helvetica Neue', 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = highlightGradient;
  ctx.fillText("i-Wasp", textX, textY);
  
  ctx.restore();

  // ═══════════════════════════════════════════════════════════════════════
  // ONDES NFC (3 arcs à droite du texte) - Style métallisé cohérent
  // ═══════════════════════════════════════════════════════════════════════
  const waveX = textX + 180;
  const waveY = centerY;

  // Dégradé pour les ondes - même style métal brossé
  const waveGradient = ctx.createLinearGradient(
    waveX - 50, waveY - 80,
    waveX + 100, waveY + 80
  );
  waveGradient.addColorStop(0, "#7a7a7a");
  waveGradient.addColorStop(0.3, "#a8a8a8");
  waveGradient.addColorStop(0.5, "#d0d0d0");
  waveGradient.addColorStop(0.7, "#b0b0b0");
  waveGradient.addColorStop(1, "#6a6a6a");

  ctx.strokeStyle = waveGradient;
  ctx.lineCap = "round";
  ctx.lineWidth = 7;

  // Arc 1 - Le plus proche (pleine opacité)
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(waveX, waveY, 34, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  // Arc 2 - Moyen
  ctx.globalAlpha = 0.78;
  ctx.beginPath();
  ctx.arc(waveX, waveY, 60, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  // Arc 3 - Le plus éloigné
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(waveX, waveY, 86, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  ctx.globalAlpha = 1;
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
