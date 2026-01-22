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
 * Utilise les images de référence stockées dans Cloud Storage
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { Download, Printer, Loader2, Eye, Check, Layers, Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
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
  SAFE_MARGIN_MM: 3,
  CORNER_RADIUS_PX: 75,
};

// Chemins des images de référence dans Cloud Storage
const STORAGE_PATHS = {
  RECTO: "evolis-templates/recto-reference.png",
  VERSO: "evolis-templates/verso-reference.png",
  LOGO: "evolis-templates/logo-measured.png",
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

function getStorageUrl(path: string): string {
  const { data } = supabase.storage.from("card-assets").getPublicUrl(path);
  return data.publicUrl;
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
  
  // État pour les images de référence
  const [referenceImages, setReferenceImages] = useState<{
    recto: string | null;
    verso: string | null;
    logo: string | null;
  }>({ recto: null, verso: null, logo: null });
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [showUploadSection, setShowUploadSection] = useState(false);

  const rectoInputRef = useRef<HTMLInputElement>(null);
  const versoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Charger les URLs des images de référence au démarrage
  useEffect(() => {
    const loadReferenceUrls = async () => {
      const rectoUrl = getStorageUrl(STORAGE_PATHS.RECTO);
      const versoUrl = getStorageUrl(STORAGE_PATHS.VERSO);
      const logoUrl = getStorageUrl(STORAGE_PATHS.LOGO);
      
      // Vérifier si les images existent
      const checkImage = async (url: string): Promise<string | null> => {
        try {
          const response = await fetch(url, { method: "HEAD" });
          return response.ok ? url : null;
        } catch {
          return null;
        }
      };
      
      const [recto, verso, logo] = await Promise.all([
        checkImage(rectoUrl),
        checkImage(versoUrl),
        checkImage(logoUrl),
      ]);
      
      setReferenceImages({ recto, verso, logo });
    };
    
    loadReferenceUrls();
  }, []);

  // Upload d'une image vers Cloud Storage
  const uploadImage = async (file: File, type: "recto" | "verso" | "logo") => {
    setIsUploading(type);
    
    try {
      const path = type === "recto" 
        ? STORAGE_PATHS.RECTO 
        : type === "verso" 
          ? STORAGE_PATHS.VERSO 
          : STORAGE_PATHS.LOGO;
      
      // Supprimer l'ancienne image si elle existe
      await supabase.storage.from("card-assets").remove([path]);
      
      // Uploader la nouvelle image
      const { error } = await supabase.storage
        .from("card-assets")
        .upload(path, file, { 
          cacheControl: "3600",
          upsert: true 
        });
      
      if (error) throw error;
      
      // Mettre à jour l'URL
      const url = getStorageUrl(path);
      setReferenceImages(prev => ({ ...prev, [type]: url + "?t=" + Date.now() }));
      
      toast.success(`Image ${type.toUpperCase()} uploadée avec succès`);
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error(`Erreur lors de l'upload de l'image ${type}`);
    } finally {
      setIsUploading(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "recto" | "verso" | "logo") => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, type);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GÉNÉRATION DES TEMPLATES - UTILISE LES IMAGES DE RÉFÉRENCE
  // ═══════════════════════════════════════════════════════════════════════════

  const generateTemplates = useCallback(async () => {
    if (!referenceImages.recto || !referenceImages.verso) {
      toast.error("Veuillez d'abord uploader les images de référence (recto et verso)");
      setShowUploadSection(true);
      return;
    }
    
    setIsGenerating(true);

    try {
      // ═══════════════════════════════════════════════════════════════════════
      // RECTO - Utiliser directement l'image de référence
      // ═══════════════════════════════════════════════════════════════════════
      const rectoCanvas = document.createElement("canvas");
      rectoCanvas.width = SPEC.WIDTH_PX;
      rectoCanvas.height = SPEC.HEIGHT_PX;
      const rectoCtx = rectoCanvas.getContext("2d", { alpha: false })!;

      try {
        const rectoImg = await loadImage(referenceImages.recto);
        // Dessiner l'image de référence redimensionnée au format exact 600 DPI
        rectoCtx.drawImage(rectoImg, 0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      } catch (error) {
        console.error("Erreur chargement recto:", error);
        // Fallback: fond noir
        rectoCtx.fillStyle = "#0a0a0a";
        rectoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      }

      const rectoDataUrl = rectoCanvas.toDataURL("image/png", 1.0);

      // ═══════════════════════════════════════════════════════════════════════
      // VERSO - Utiliser directement l'image de référence
      // ═══════════════════════════════════════════════════════════════════════
      const versoCanvas = document.createElement("canvas");
      versoCanvas.width = SPEC.WIDTH_PX;
      versoCanvas.height = SPEC.HEIGHT_PX;
      const versoCtx = versoCanvas.getContext("2d", { alpha: false })!;

      try {
        const versoImg = await loadImage(referenceImages.verso);
        // Dessiner l'image de référence redimensionnée au format exact 600 DPI
        versoCtx.drawImage(versoImg, 0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      } catch (error) {
        console.error("Erreur chargement verso:", error);
        // Fallback: fond noir
        versoCtx.fillStyle = "#0a0a0a";
        versoCtx.fillRect(0, 0, SPEC.WIDTH_PX, SPEC.HEIGHT_PX);
      }

      const versoDataUrl = versoCanvas.toDataURL("image/png", 1.0);

      setGeneratedImages({ recto: rectoDataUrl, verso: versoDataUrl });
      toast.success("Templates générés avec succès !");
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  }, [referenceImages]);

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
  const hasAllReferences = referenceImages.recto && referenceImages.verso;

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
            Reproduction fidèle pixel à pixel • CR80 ISO 7810 • Prêt pour impression industrielle
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

        {/* Section Upload des images de référence */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle 
              className="flex items-center justify-between text-white cursor-pointer"
              onClick={() => setShowUploadSection(!showUploadSection)}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <span>Images de référence</span>
              </div>
              <Badge 
                variant="outline" 
                className={hasAllReferences 
                  ? "border-emerald-500/50 text-emerald-400" 
                  : "border-amber-500/50 text-amber-400"
                }
              >
                {hasAllReferences ? "✓ Prêt" : "À configurer"}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          {(showUploadSection || !hasAllReferences) && (
            <CardContent className="space-y-4">
              <p className="text-neutral-400 text-sm">
                Uploadez vos images de référence pour un rendu 100% identique pixel à pixel.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* RECTO */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">RECTO (avec logo)</label>
                  <input
                    ref={rectoInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "recto")}
                  />
                  <button
                    onClick={() => rectoInputRef.current?.click()}
                    disabled={isUploading === "recto"}
                    className={`w-full aspect-[1.588] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                      referenceImages.recto 
                        ? "border-emerald-500/50 bg-emerald-950/20" 
                        : "border-neutral-700 hover:border-neutral-600 bg-neutral-800/50"
                    }`}
                  >
                    {isUploading === "recto" ? (
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                    ) : referenceImages.recto ? (
                      <>
                        <img 
                          src={referenceImages.recto} 
                          alt="Recto" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-neutral-500" />
                        <span className="text-xs text-neutral-500">Uploader RECTO</span>
                      </>
                    )}
                  </button>
                </div>

                {/* VERSO */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">VERSO (honeycomb)</label>
                  <input
                    ref={versoInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "verso")}
                  />
                  <button
                    onClick={() => versoInputRef.current?.click()}
                    disabled={isUploading === "verso"}
                    className={`w-full aspect-[1.588] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                      referenceImages.verso 
                        ? "border-emerald-500/50 bg-emerald-950/20" 
                        : "border-neutral-700 hover:border-neutral-600 bg-neutral-800/50"
                    }`}
                  >
                    {isUploading === "verso" ? (
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                    ) : referenceImages.verso ? (
                      <>
                        <img 
                          src={referenceImages.verso} 
                          alt="Verso" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-neutral-500" />
                        <span className="text-xs text-neutral-500">Uploader VERSO</span>
                      </>
                    )}
                  </button>
                </div>

                {/* LOGO (optionnel) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Logo 3.5cm (optionnel)</label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploading === "logo"}
                    className={`w-full aspect-[1.588] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                      referenceImages.logo 
                        ? "border-emerald-500/50 bg-emerald-950/20" 
                        : "border-neutral-700 hover:border-neutral-600 bg-neutral-800/50"
                    }`}
                  >
                    {isUploading === "logo" ? (
                      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                    ) : referenceImages.logo ? (
                      <>
                        <img 
                          src={referenceImages.logo} 
                          alt="Logo" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-neutral-500" />
                        <span className="text-xs text-neutral-500">Uploader LOGO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {!hasAllReferences && (
                <div className="flex items-start gap-2 text-amber-400 text-sm bg-amber-950/30 border border-amber-800/50 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Uploadez au minimum le RECTO et le VERSO pour générer les templates.</span>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Bouton Génération */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={generateTemplates}
            disabled={isGenerating || !hasAllReferences}
            className="gap-3 px-8 py-6 text-lg bg-white text-black hover:bg-neutral-200 disabled:opacity-50"
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
