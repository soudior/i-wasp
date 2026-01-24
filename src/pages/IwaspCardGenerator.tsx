/**
 * IWASP SIGNATURE CARD GENERATOR
 * 
 * Génération à partir des vrais templates IWASP
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

// Import des vrais templates IWASP
import cardRectoTemplate from "@/assets/cards/card-base-front.png";
import cardVersoTemplate from "@/assets/cards/card-base-back.png";

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
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Impossible de charger l'image: ${src}`));
    img.src = src;
  });
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
      // RECTO - Template réel avec logo i-Wasp métallisé
      // ═══════════════════════════════════════════════════════════════════════
      const rectoCanvas = document.createElement("canvas");
      rectoCanvas.width = SPEC.WIDTH_PX;
      rectoCanvas.height = SPEC.HEIGHT_PX;
      const rectoCtx = rectoCanvas.getContext("2d", { alpha: false })!;

      // Charger et dessiner le template recto
      try {
        const rectoImg = await loadImage(cardRectoTemplate);
        rectoCtx.drawImage(rectoImg, 0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      } catch (error) {
        console.error("Erreur chargement recto:", error);
        // Fallback: fond noir
        rectoCtx.fillStyle = "#0a0a0a";
        rectoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      }

      const rectoDataUrl = rectoCanvas.toDataURL("image/png", 1.0);

      // ═══════════════════════════════════════════════════════════════════════
      // VERSO - Template réel avec honeycomb
      // ═══════════════════════════════════════════════════════════════════════
      const versoCanvas = document.createElement("canvas");
      versoCanvas.width = SPEC.WIDTH_PX;
      versoCanvas.height = SPEC.HEIGHT_PX;
      const versoCtx = versoCanvas.getContext("2d", { alpha: false })!;

      // Charger et dessiner le template verso
      try {
        const versoImg = await loadImage(cardVersoTemplate);
        versoCtx.drawImage(versoImg, 0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      } catch (error) {
        console.error("Erreur chargement verso:", error);
        // Fallback: fond noir
        versoCtx.fillStyle = "#0a0a0a";
        versoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      }

      const versoDataUrl = versoCanvas.toDataURL("image/png", 1.0);

      setGeneratedImages({ recto: rectoDataUrl, verso: versoDataUrl });
      toast.success("Templates IWASP générés en 600 DPI !");
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
      downloadImage(generatedImages.recto, "IWASP-RECTO-600DPI-CR80.png");
    }
    setTimeout(() => {
      if (generatedImages.verso) {
        downloadImage(generatedImages.verso, "IWASP-VERSO-600DPI-CR80.png");
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
            Export haute résolution de ton design réel • Noir mat + Logo métallisé + Honeycomb
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

        {/* Preview des templates source */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Layers className="w-5 h-5" />
              <span>Design Original IWASP</span>
              <Badge variant="outline" className="ml-auto border-amber-500/50 text-amber-400">
                Signature
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Aperçu Recto */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-300">RECTO</p>
                <div className="aspect-[1.588] rounded-lg overflow-hidden border border-neutral-700 bg-black">
                  <img 
                    src={cardRectoTemplate} 
                    alt="Template Recto" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  Noir + Honeycomb + Logo i-Wasp)) métallisé
                </p>
              </div>
              
              {/* Aperçu Verso */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-300">VERSO</p>
                <div className="aspect-[1.588] rounded-lg overflow-hidden border border-neutral-700 bg-black">
                  <img 
                    src={cardVersoTemplate} 
                    alt="Template Verso" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  Noir + Honeycomb subtil
                </p>
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
                Générer en 600 DPI
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
                  <span>{previewMode === "recto" ? "RECTO" : "VERSO"} - Export 600 DPI</span>
                  <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                    PNG • {SPEC.WIDTH_PX} × {SPEC.HEIGHT_PX}
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
                onClick={() => generatedImages.recto && downloadImage(generatedImages.recto, "IWASP-RECTO-600DPI-CR80.png")}
                variant="outline"
                className="gap-2 border-neutral-700 text-white hover:bg-neutral-800"
                disabled={!generatedImages.recto}
              >
                <Download className="w-4 h-4" />
                Télécharger Recto
              </Button>
              <Button
                onClick={() => generatedImages.verso && downloadImage(generatedImages.verso, "IWASP-VERSO-600DPI-CR80.png")}
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
                    {SPEC.WIDTH_PX} × {SPEC.HEIGHT_PX} px @ {SPEC.DPI} DPI • PNG sans compression • Compatible Evolis, Zebra, Fargo
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
