/**
 * NFCPhysicalCardSection - Section de prévisualisation carte physique NFC
 * 
 * Affiche le template de carte physique comme un OBJET visuel
 * avec options d'export HD et PDF.
 */

import { useRef, useState } from "react";
import { Download, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFCPhysicalCard } from "./NFCPhysicalCard";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface NFCPhysicalCardSectionProps {
  logoUrl?: string;
  className?: string;
}

// Dimensions carte CR80 en mm
const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 54;
const MM_TO_PX_300DPI = 11.811; // 300 DPI

export function NFCPhysicalCardSection({ 
  logoUrl,
  className = "" 
}: NFCPhysicalCardSectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Export HD Image (PNG 300 DPI)
  const exportHDImage = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 4, // Haute résolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      // Télécharger
      const link = document.createElement("a");
      link.download = "carte-nfc-iwasp.png";
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

  // Export PDF prêt impression
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

      // Créer PDF aux dimensions exactes de la carte
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

      pdf.save("carte-nfc-iwasp.pdf");
      toast.success("PDF prêt impression exporté");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="max-w-xl mx-auto">
        {/* Titre section */}
        <h2 className="text-xl font-medium text-center mb-8 text-foreground">
          Template carte physique NFC
        </h2>

        {/* Carte physique - rendu visuel */}
        <div 
          ref={cardRef}
          className="w-full max-w-md mx-auto"
        >
          <NFCPhysicalCard logoUrl={logoUrl} />
        </div>

        {/* Dimensions */}
        <p className="text-center text-xs text-muted-foreground mt-4 mb-8">
          Format CR80 · 85.6 × 54 mm · Prêt impression
        </p>

        {/* Boutons export */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={exportHDImage}
            disabled={isExporting}
            variant="outline"
            className="gap-2 min-w-[160px]"
          >
            <FileImage className="w-4 h-4" />
            Exporter Image HD
          </Button>
          
          <Button
            onClick={exportPDF}
            disabled={isExporting}
            className="gap-2 min-w-[160px] bg-foreground text-background hover:bg-foreground/90"
          >
            <FileText className="w-4 h-4" />
            Exporter PDF
          </Button>
        </div>

        {/* Note technique */}
        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Export 300 DPI · Compatible imprimerie professionnelle
        </p>
      </div>
    </section>
  );
}
