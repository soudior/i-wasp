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
  Sparkles, Palette, Check
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
import { extractColorsFromLogo, type ColorPalette } from "@/lib/adaptiveTemplateEngine";

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

// Presets de palettes par défaut
const DEFAULT_PRESETS: GeneratedPalette[] = [
  { name: "Noir Élégant", backgroundColor: "#0B0B0C", accentColor: "#F4F2EF" },
  { name: "Ivoire Premium", backgroundColor: "#F4F2EF", accentColor: "#0B0B0C" },
  { name: "Gris Profond", backgroundColor: "#1C1C1E", accentColor: "#F4F2EF" },
];

export function PhysicalCardStudio({ 
  cardId,
  cardName = "carte",
  logoUrl,
  open,
  onOpenChange,
}: PhysicalCardStudioProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // État du design
  const [backgroundColor, setBackgroundColor] = useState("#0B0B0C");
  const [accentColor, setAccentColor] = useState("#F4F2EF");
  const [palettes, setPalettes] = useState<GeneratedPalette[]>(DEFAULT_PRESETS);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  // Extraction des couleurs du logo au chargement
  useEffect(() => {
    if (logoUrl && open) {
      extractColorsFromLogo(logoUrl)
        .then((palette) => {
          setBackgroundColor(`hsl(${palette.background})`);
          setAccentColor(`hsl(${palette.foreground})`);
        })
        .catch(console.error);
    }
  }, [logoUrl, open]);

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
          logoUrl: logoUrl || null,
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
              {logoUrl ? (
                <img 
                  src={logoUrl} 
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

          {/* Infos format */}
          <p className="text-center text-xs text-muted-foreground">
            Format CR80 · 85.6 × 54 mm · Prêt impression
          </p>

          {/* Modification par IA */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Palettes disponibles
            </Label>
            
            {/* Palettes générées ou presets */}
            <div className="flex flex-wrap gap-2">
              {palettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => applyPalette(palette)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors ${
                    selectedPalette === palette.name 
                      ? 'border-foreground bg-foreground/10' 
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-border/30"
                    style={{ background: palette.backgroundColor }}
                  />
                  <span className="text-muted-foreground">{palette.name}</span>
                  {selectedPalette === palette.name && (
                    <Check className="w-3 h-3 text-foreground" />
                  )}
                </button>
              ))}
            </div>

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
              {logoUrl ? "Analyser logo & générer palettes IA" : "Générer palettes IA"}
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
