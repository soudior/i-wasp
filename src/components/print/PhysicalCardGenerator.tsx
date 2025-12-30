/**
 * PhysicalCardGenerator - Génère et exporte le visuel de carte physique NFC
 * 
 * Flux: Carte digitale → Générer visuel → Export PDF/Image
 */

import { useRef, useState } from "react";
import { FileImage, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NFCPhysicalCard, CardColorId } from "./NFCPhysicalCard";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PhysicalCardGeneratorProps {
  logoUrl?: string | null; // Kept for API compatibility
  cardName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Dimensions carte CR80 en mm
const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 54;

export function PhysicalCardGenerator({ 
  logoUrl,
  cardName = "carte",
  open,
  onOpenChange,
}: PhysicalCardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedColor, setSelectedColor] = useState<CardColorId>("black");

  // Export HD Image (PNG)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Template carte physique NFC</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Carte physique - rendu visuel */}
          <div 
            ref={cardRef}
            className="w-full max-w-sm mx-auto"
          >
            <NFCPhysicalCard 
              colorId={selectedColor} 
              interactive 
              onColorChange={setSelectedColor}
            />
          </div>

          {/* Dimensions */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Format CR80 · 85.6 × 54 mm
          </p>
        </div>

        {/* Boutons export */}
        <div className="flex gap-3">
          <Button
            onClick={exportHDImage}
            disabled={isExporting}
            variant="outline"
            className="flex-1 gap-2"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileImage className="w-4 h-4" />
            )}
            Image HD
          </Button>
          
          <Button
            onClick={exportPDF}
            disabled={isExporting}
            className="flex-1 gap-2 bg-foreground text-background hover:bg-foreground/90"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Export PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
