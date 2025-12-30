/**
 * PhysicalCardStudio - Studio complet pour carte physique NFC
 * 
 * - Lié à la carte digitale
 * - Modifiable par IA (Lovable AI)
 * - Visualisable
 * - Exportable (PDF/Image)
 * - Commandable
 */

import { useRef, useState, useEffect } from "react";
import { 
  FileImage, FileText, Loader2, ShoppingCart, 
  Sparkles, Palette, Check, Upload, ImagePlus, Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PhysicalCardStudioProps {
  cardId?: string;
  cardName?: string;
  logoUrl?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GeneratedPalette {
  name: string;
  backgroundColor: string;
  accentColor: string;
}

// Dimensions carte CR80 en mm
const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 54;
const CARD_RATIO = CARD_WIDTH_MM / CARD_HEIGHT_MM;

/**
 * Simulation de conversion RGB vers CMJN pour aperçu impression
 * Note: C'est une approximation visuelle, pas une vraie conversion ICC
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rPrime = r / 255;
  const gPrime = g / 255;
  const bPrime = b / 255;
  
  const k = 1 - Math.max(rPrime, gPrime, bPrime);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  
  const c = (1 - rPrime - k) / (1 - k);
  const m = (1 - gPrime - k) / (1 - k);
  const y = (1 - bPrime - k) / (1 - k);
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

/**
 * Simule le rendu CMJN en appliquant une légère désaturation
 * et un décalage de teinte typique de l'impression offset
 */
function simulateCmykRender(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  
  // Légère désaturation (les couleurs imprimées sont moins vives)
  const saturationFactor = 0.92;
  const avg = (r + g + b) / 3;
  
  const newR = Math.round(avg + (r - avg) * saturationFactor);
  const newG = Math.round(avg + (g - avg) * saturationFactor);
  const newB = Math.round(avg + (b - avg) * saturationFactor);
  
  // Légère teinte chaude (typique du papier)
  const warmR = Math.min(255, newR + 2);
  const warmG = Math.min(255, newG + 1);
  const warmB = Math.max(0, newB - 3);
  
  return `rgb(${warmR}, ${warmG}, ${warmB})`;
}

function getCmykValues(hex: string): { c: number; m: number; y: number; k: number } {
  const { r, g, b } = hexToRgb(hex);
  return rgbToCmyk(r, g, b);
}

// Palettes officielles i-wasp (basées sur le design system)
// PALETTE 3 — "Carte matière" est la palette par défaut pour les cartes physiques
const CARTE_MATIERE_COLORS = {
  blanc: "#F7F7F5",      // --carte-blanc
  chaud: "#EFEDEA",      // --carte-chaud  
  grisLeger: "#E2E2E0",  // --carte-gris-leger
  grisStruct: "#8E8E93", // --carte-gris-struct
  noirDoux: "#1C1C1E",   // --carte-noir-doux
};

const NUIT_COLORS = {
  noir: "#0B0B0C",       // --nuit-noir
  grisProfond: "#1C1C1E", // --nuit-gris-profond
  grisStruct: "#8E8E93", // --nuit-gris-struct
  blanc: "#F4F2EF",      // --nuit-blanc
  accent: "#8B1E1E",     // --nuit-accent
};

const DEFAULT_PRESETS: GeneratedPalette[] = [
  // Palette "Carte matière" (obligatoire pour carte physique - par défaut)
  { name: "Carte Matière", backgroundColor: CARTE_MATIERE_COLORS.blanc, accentColor: CARTE_MATIERE_COLORS.noirDoux },
  { name: "Carte Chaud", backgroundColor: CARTE_MATIERE_COLORS.chaud, accentColor: CARTE_MATIERE_COLORS.noirDoux },
  // Palette "Nuit" 
  { name: "Nuit Élégante", backgroundColor: NUIT_COLORS.noir, accentColor: NUIT_COLORS.blanc },
  { name: "Gris Profond", backgroundColor: NUIT_COLORS.grisProfond, accentColor: NUIT_COLORS.blanc },
];

export function PhysicalCardStudio({ 
  cardId,
  cardName = "carte",
  logoUrl,
  open,
  onOpenChange,
}: PhysicalCardStudioProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // État du design - Palette "Carte matière" par défaut (obligatoire pour carte physique)
  const [backgroundColor, setBackgroundColor] = useState(CARTE_MATIERE_COLORS.blanc);
  const [accentColor, setAccentColor] = useState(CARTE_MATIERE_COLORS.noirDoux);
  const [palettes, setPalettes] = useState<GeneratedPalette[]>(DEFAULT_PRESETS);
  const [selectedPalette, setSelectedPalette] = useState<string | null>("Carte Matière");
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  
  // Logo effectif (custom ou original)
  const effectiveLogoUrl = customLogoUrl || logoUrl;

  // Note: On n'extrait plus automatiquement les couleurs du logo
  // La palette "Carte matière" reste par défaut (obligatoire pour carte physique)
  // L'utilisateur peut changer manuellement ou via génération IA
  
  // Upload de logo
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validation du type
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    
    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }
    
    setIsUploading(true);
    try {
      // Convertir en base64 pour prévisualisation locale
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setCustomLogoUrl(dataUrl);
        toast.success("Logo uploadé");
        // Note: On garde la palette "Carte matière" par défaut
        // L'utilisateur peut générer des palettes IA si souhaité
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Erreur lors de la lecture du fichier");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload");
      setIsUploading(false);
    }
  };
  
  // Réinitialiser au logo original
  const resetToOriginalLogo = () => {
    setCustomLogoUrl(null);
    toast.success("Logo original restauré");
  };

  // Appliquer une palette
  const applyPalette = (palette: GeneratedPalette) => {
    setBackgroundColor(palette.backgroundColor);
    setAccentColor(palette.accentColor);
    setSelectedPalette(palette.name);
    toast.success(`Palette "${palette.name}" appliquée`);
  };

  // Génération IA de palettes via Edge Function
  const generateAIPalettes = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-palette', {
        body: { 
          logoUrl: effectiveLogoUrl || null,
          style: 'premium élégant minimal'
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.palettes && Array.isArray(data.palettes)) {
        setPalettes(data.palettes);
        // Appliquer la première palette générée
        if (data.palettes.length > 0) {
          applyPalette(data.palettes[0]);
        }
        toast.success("Palettes IA générées");
      } else if (data?.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('AI palette generation error:', error);
      toast.error("Erreur de génération IA");
    } finally {
      setIsGenerating(false);
    }
  };

  // Export HD Image
  const exportHDImage = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${cardName}-nfc-iwasp.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Image HD exportée");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  // Export PDF
  const exportPDF = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [CARD_WIDTH_MM, CARD_HEIGHT_MM],
      });

      pdf.addImage(
        canvas.toDataURL("image/png", 1.0),
        "PNG",
        0,
        0,
        CARD_WIDTH_MM,
        CARD_HEIGHT_MM
      );

      pdf.save(`${cardName}-nfc-iwasp.pdf`);
      toast.success("PDF exporté");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  // Commander
  const handleOrder = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Template carte physique NFC</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Carte physique - rendu visuel */}
          <div 
            ref={cardRef}
            className="relative rounded-xl overflow-hidden shadow-2xl mx-auto"
            style={{
              aspectRatio: CARD_RATIO,
              maxWidth: "400px",
              background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor} 100%)`,
            }}
          >
            {/* Badge i-wasp - Position fixe haut droite */}
            <div 
              className="absolute top-3 right-3 z-10 flex items-center gap-1 text-[10px] font-medium tracking-wide opacity-70"
              style={{ color: accentColor }}
            >
              <span>i-wasp</span>
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 12.5a4 4 0 0 1 0-5.5" strokeLinecap="round" />
                <path d="M5.5 15a7 7 0 0 1 0-10" strokeLinecap="round" />
                <path d="M15.5 12.5a4 4 0 0 0 0-5.5" strokeLinecap="round" />
                <path d="M18.5 15a7 7 0 0 0 0-10" strokeLinecap="round" />
              </svg>
            </div>

            {/* Logo client - Centré */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {effectiveLogoUrl ? (
                <img 
                  src={effectiveLogoUrl} 
                  alt="" 
                  className="max-w-[60%] max-h-[50%] object-contain opacity-95"
                  crossOrigin="anonymous"
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-full border-2 opacity-30 flex items-center justify-center"
                  style={{ borderColor: accentColor }}
                >
                  <span className="text-xs" style={{ color: accentColor }}>Logo</span>
                </div>
              )}
            </div>

            {/* Indicateur NFC - Discret, bas droite */}
            <div className="absolute bottom-3 right-3">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 opacity-40" stroke={accentColor} strokeWidth="1.5">
                <path d="M6 12a6 6 0 0 0 6 6" strokeLinecap="round" />
                <path d="M6 6a12 12 0 0 0 0 12" strokeLinecap="round" />
                <path d="M12 18a6 6 0 0 0 6-6" strokeLinecap="round" />
                <path d="M18 6a12 12 0 0 1 0 12" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill={accentColor} />
              </svg>
            </div>

            {/* Effet de surface premium */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
              }}
            />
          </div>

          {/* Aperçu rendu impression CMJN */}
          {(selectedPalette === "Carte Matière" || selectedPalette === "Carte Chaud") && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Aperçu impression (CMJN simulé)
              </Label>
              
              <div className="flex gap-4 items-start">
                {/* Mini aperçu CMJN */}
                <div 
                  className="relative rounded-lg overflow-hidden shadow-md flex-shrink-0"
                  style={{
                    aspectRatio: CARD_RATIO,
                    width: "120px",
                    background: simulateCmykRender(backgroundColor),
                    filter: "contrast(0.98) brightness(0.99)",
                  }}
                >
                  {/* Simulation texture papier */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  {/* Logo simulé */}
                  {effectiveLogoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <img 
                        src={effectiveLogoUrl} 
                        alt="" 
                        className="max-w-[50%] max-h-[40%] object-contain"
                        style={{ filter: "contrast(0.95) saturate(0.9)" }}
                      />
                    </div>
                  )}
                  <div 
                    className="absolute bottom-1 right-1 text-[6px] font-medium opacity-50"
                    style={{ color: simulateCmykRender(accentColor) }}
                  >
                    CMJN
                  </div>
                </div>
                
                {/* Valeurs CMJN */}
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div>
                      <span className="text-muted-foreground">Fond:</span>
                      <div className="flex gap-1 mt-0.5 font-mono text-[10px]">
                        {(() => {
                          const cmyk = getCmykValues(backgroundColor);
                          return (
                            <>
                              <span className="text-cyan-400">C{cmyk.c}</span>
                              <span className="text-pink-400">M{cmyk.m}</span>
                              <span className="text-yellow-400">Y{cmyk.y}</span>
                              <span className="text-foreground/70">K{cmyk.k}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Texte:</span>
                      <div className="flex gap-1 mt-0.5 font-mono text-[10px]">
                        {(() => {
                          const cmyk = getCmykValues(accentColor);
                          return (
                            <>
                              <span className="text-cyan-400">C{cmyk.c}</span>
                              <span className="text-pink-400">M{cmyk.m}</span>
                              <span className="text-yellow-400">Y{cmyk.y}</span>
                              <span className="text-foreground/70">K{cmyk.k}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60">
                    Simulation du rendu papier mat · Les couleurs réelles peuvent varier
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Infos format */}
          <p className="text-center text-xs text-muted-foreground">
            Format CR80 · 85.6 × 54 mm · Prêt impression
          </p>

          {/* Upload de logo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ImagePlus className="w-4 h-4" />
              Logo personnalisé
            </Label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
                size="sm"
                className="gap-2 flex-1"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Uploader un logo
              </Button>
              
              {customLogoUrl && (
                <Button
                  onClick={resetToOriginalLogo}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Restaurer original
                </Button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou SVG · Max 5 Mo
            </p>
          </div>

          {/* Modification par IA */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Palettes disponibles
            </Label>
            
            {/* Palettes générées ou presets */}
            <div className="flex flex-wrap gap-2">
              {palettes.map((palette) => {
                const isCarteMatiere = palette.name === "Carte Matière" || palette.name === "Carte Chaud";
                const isSelected = selectedPalette === palette.name;
                
                return (
                  <button
                    key={palette.name}
                    onClick={() => applyPalette(palette)}
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors ${
                      isSelected 
                        ? 'border-foreground bg-foreground/10' 
                        : 'border-border/50 hover:border-border'
                    } ${isCarteMatiere ? 'pr-4' : ''}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-border/30"
                      style={{ background: palette.backgroundColor }}
                    />
                    <span className="text-muted-foreground">{palette.name}</span>
                    {isCarteMatiere && (
                      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/70 ml-1">
                        <Printer className="w-3 h-3" />
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3 h-3 text-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Légende */}
            <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
              <Printer className="w-3 h-3" />
              <span>Recommandé pour l'impression</span>
            </p>

            {/* Génération IA */}
            <Button
              onClick={generateAIPalettes}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="gap-2 w-full"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {effectiveLogoUrl ? "Analyser logo & générer palettes IA" : "Générer palettes IA"}
            </Button>

            {/* Couleurs manuelles */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Fond</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-8 p-0 border-0"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 h-8 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Accent</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-8 p-0 border-0"
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Button
              onClick={exportHDImage}
              disabled={isExporting}
              variant="outline"
              className="gap-2"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileImage className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Image</span> HD
            </Button>
            
            <Button
              onClick={exportPDF}
              disabled={isExporting}
              variant="outline"
              className="gap-2"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              PDF
            </Button>

            <Button
              onClick={handleOrder}
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <ShoppingCart className="w-4 h-4" />
              Commander
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
