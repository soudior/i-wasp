/**
 * Evolis Print-Ready PDF Generator
 * Professional card printing for Evolis Primacy/Zenius printers
 * 
 * Specifications:
 * - Format: CR80 (ISO 7810)
 * - Dimensions: 85.6 × 54 mm
 * - Resolution: 300 DPI
 * - Bleed: 3mm
 * - Color Mode: CMYK simulation
 * - Safe Zone: 3mm from edges
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  FileDown,
  Loader2,
  Printer,
  Check,
  Eye,
  RotateCcw,
  CreditCard,
  Info,
  Download,
  FileText,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  CARD_DIMENSIONS, 
  CARD_PIXELS_300DPI,
  MM_TO_PX_300DPI,
  PRINT_COLORS,
  PrintColor
} from "@/lib/printTypes";

// Evolis-specific constants
const EVOLIS_SPECS = {
  FORMAT: "CR80",
  WIDTH_MM: 85.6,
  HEIGHT_MM: 54,
  DPI: 300,
  BLEED_MM: 3,
  SAFE_ZONE_MM: 3,
  COLOR_MODE: "CMYK",
  CORNER_RADIUS_MM: 3.18,
  // Pixel dimensions at 300 DPI
  get WIDTH_PX() { return Math.round(this.WIDTH_MM * MM_TO_PX_300DPI); }, // 1011px
  get HEIGHT_PX() { return Math.round(this.HEIGHT_MM * MM_TO_PX_300DPI); }, // 638px
  get BLEED_PX() { return Math.round(this.BLEED_MM * MM_TO_PX_300DPI); }, // 35px
  get TOTAL_WIDTH_PX() { return this.WIDTH_PX + (this.BLEED_PX * 2); },
  get TOTAL_HEIGHT_PX() { return this.HEIGHT_PX + (this.BLEED_PX * 2); },
};

interface CardDesign {
  logoUrl?: string;
  backgroundColor: PrintColor;
  qrCodeUrl?: string;
  nfcEnabled?: boolean;
  customText?: string;
}

interface EvolisPDFGeneratorProps {
  design?: CardDesign;
  cardName?: string;
  orderId?: string;
  onExportComplete?: (blob: Blob) => void;
}

export function EvolisPDFGenerator({ 
  design,
  cardName = "iwasp-card",
  orderId,
  onExportComplete
}: EvolisPDFGeneratorProps) {
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");
  const [selectedColor, setSelectedColor] = useState<PrintColor>(design?.backgroundColor || "black");

  const colorConfig = PRINT_COLORS[selectedColor];

  // Generate print-ready PDF for Evolis
  const generateEvolisPDF = async () => {
    if (!cardFrontRef.current) return;

    setIsExporting(true);
    setExportProgress(10);

    try {
      // Capture front at 300 DPI quality
      setExportProgress(20);
      const frontCanvas = await html2canvas(cardFrontRef.current, {
        scale: 4, // High resolution for print
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 300,
        height: 189,
      });

      setExportProgress(50);

      // Create PDF with exact Evolis dimensions (with bleed)
      const pdfWidthMM = EVOLIS_SPECS.WIDTH_MM + (EVOLIS_SPECS.BLEED_MM * 2);
      const pdfHeightMM = EVOLIS_SPECS.HEIGHT_MM + (EVOLIS_SPECS.BLEED_MM * 2);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pdfWidthMM, pdfHeightMM],
      });

      setExportProgress(60);

      // Add card image with bleed margin
      pdf.addImage(
        frontCanvas.toDataURL("image/png", 1.0),
        "PNG",
        EVOLIS_SPECS.BLEED_MM,
        EVOLIS_SPECS.BLEED_MM,
        EVOLIS_SPECS.WIDTH_MM,
        EVOLIS_SPECS.HEIGHT_MM
      );

      // Add crop marks
      addCropMarks(pdf, pdfWidthMM, pdfHeightMM, EVOLIS_SPECS.BLEED_MM);

      setExportProgress(80);

      // Add technical metadata page
      pdf.addPage([210, 297], "portrait"); // A4 for tech sheet
      addTechnicalSheet(pdf, colorConfig, orderId);

      setExportProgress(90);

      // Generate blob and trigger download
      const blob = pdf.output("blob");
      
      if (onExportComplete) {
        onExportComplete(blob);
      }

      // Download file
      const fileName = orderId 
        ? `evolis-${orderId}-${cardName}.pdf`
        : `evolis-${cardName}-${Date.now()}.pdf`;
      
      downloadBlob(blob, fileName);

      setExportProgress(100);
      toast.success("PDF Evolis généré ✓");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Erreur génération PDF");
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    }
  };

  // Export high-res PNG for direct printing
  const exportPrintPNG = async () => {
    if (!cardFrontRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardFrontRef.current, {
        scale: 6, // Ultra-high resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${cardName}-evolis-print.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Image HD exportée (300 DPI)");
    } catch (error) {
      toast.error("Erreur export image");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div 
      className="min-h-dvh w-full p-4"
      style={{ backgroundColor: '#0B0B0B' }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Printer size={24} style={{ color: '#FFC700' }} />
            <div>
              <h1 
                className="text-xl font-bold"
                style={{ color: '#F5F5F5' }}
              >
                Générateur PDF Evolis
              </h1>
              <p 
                className="text-sm"
                style={{ color: 'rgba(245, 245, 245, 0.5)' }}
              >
                Export fichier d'impression professionnel
              </p>
            </div>
          </div>
          <Badge 
            className="px-3 py-1"
            style={{ backgroundColor: 'rgba(255, 199, 0, 0.15)', color: '#FFC700' }}
          >
            Format CR80
          </Badge>
        </div>

        {/* Technical Specs Card */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 199, 0, 0.2)'
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle 
              className="text-sm flex items-center gap-2"
              style={{ color: '#FFC700' }}
            >
              <Info size={16} />
              Fiche technique Evolis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "Format", value: "CR80" },
                { label: "Dimensions", value: "85.6 × 54 mm" },
                { label: "Résolution", value: "300 DPI" },
                { label: "Fond perdu", value: "3 mm" },
                { label: "Mode", value: "CMYK" },
                { label: "Coins", value: "R3.18" },
              ].map((spec) => (
                <div key={spec.label} className="text-center">
                  <p 
                    className="text-xs mb-1"
                    style={{ color: 'rgba(245, 245, 245, 0.5)' }}
                  >
                    {spec.label}
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: '#F5F5F5' }}
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card 
          className="border overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(245, 245, 245, 0.1)'
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle 
                className="text-sm flex items-center gap-2"
                style={{ color: '#F5F5F5' }}
              >
                <Eye size={16} />
                Aperçu carte physique
              </CardTitle>
              <Tabs value={previewSide} onValueChange={(v) => setPreviewSide(v as "front" | "back")}>
                <TabsList 
                  className="h-8"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <TabsTrigger 
                    value="front" 
                    className="text-xs data-[state=active]:bg-[#FFC700] data-[state=active]:text-black"
                  >
                    Recto
                  </TabsTrigger>
                  <TabsTrigger 
                    value="back"
                    className="text-xs data-[state=active]:bg-[#FFC700] data-[state=active]:text-black"
                  >
                    Verso
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Card Preview Container */}
            <div 
              className="relative mx-auto"
              style={{ 
                width: 300,
                height: 189,
                perspective: "1000px"
              }}
            >
              {/* Front Face */}
              <motion.div
                ref={cardFrontRef}
                initial={false}
                animate={{ 
                  rotateY: previewSide === "front" ? 0 : 180,
                  opacity: previewSide === "front" ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ 
                  backgroundColor: colorConfig.hex,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Card Content - Front */}
                <div className="w-full h-full flex items-center justify-center p-6 relative">
                  {/* Logo Placeholder */}
                  <div 
                    className="w-32 h-20 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'rgba(255, 199, 0, 0.1)',
                      border: '2px dashed rgba(255, 199, 0, 0.3)'
                    }}
                  >
                    {design?.logoUrl ? (
                      <img 
                        src={design.logoUrl} 
                        alt="Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span 
                        className="text-xs font-medium"
                        style={{ color: '#FFC700' }}
                      >
                        LOGO
                      </span>
                    )}
                  </div>

                  {/* NFC Icon */}
                  <div 
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 199, 0, 0.2)' }}
                  >
                    <CreditCard size={12} style={{ color: '#FFC700' }} />
                  </div>

                  {/* IWASP Branding */}
                  <div 
                    className="absolute bottom-3 right-3 text-xs font-medium"
                    style={{ color: 'rgba(255, 199, 0, 0.6)' }}
                  >
                    iWASP
                  </div>
                </div>
              </motion.div>

              {/* Back Face */}
              <motion.div
                ref={cardBackRef}
                initial={false}
                animate={{ 
                  rotateY: previewSide === "back" ? 0 : -180,
                  opacity: previewSide === "back" ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ 
                  backgroundColor: colorConfig.hex,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Card Content - Back */}
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  {/* QR Code Placeholder */}
                  <div 
                    className="w-20 h-20 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="grid grid-cols-3 gap-1 p-2">
                      {[...Array(9)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-3 h-3"
                          style={{ 
                            backgroundColor: i % 2 === 0 ? '#0B0B0B' : 'transparent'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p 
                    className="text-xs text-center"
                    style={{ color: colorConfig.textColor }}
                  >
                    Scanner pour voir le profil
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Color Selector */}
            <div className="flex justify-center gap-2 mt-6">
              {(Object.keys(PRINT_COLORS) as PrintColor[]).slice(0, 6).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{ 
                    backgroundColor: PRINT_COLORS[color].hex,
                    borderColor: selectedColor === color ? '#FFC700' : 'transparent',
                    transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)'
                  }}
                  title={PRINT_COLORS[color].name}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={generateEvolisPDF}
            disabled={isExporting}
            className="h-14 rounded-xl font-semibold text-black"
            style={{ backgroundColor: '#FFC700' }}
          >
            {isExporting ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                {exportProgress}%
              </>
            ) : (
              <>
                <FileDown size={20} className="mr-2" />
                Export PDF Evolis
              </>
            )}
          </Button>

          <Button
            onClick={exportPrintPNG}
            disabled={isExporting}
            className="h-14 rounded-xl font-medium border-2"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 199, 0, 0.5)',
              color: '#FFC700'
            }}
          >
            <Download size={20} className="mr-2" />
            Image HD 300 DPI
          </Button>
        </div>

        {/* Production Notes */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgba(255, 199, 0, 0.05)',
            borderColor: 'rgba(255, 199, 0, 0.2)'
          }}
        >
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Layers size={18} style={{ color: '#FFC700', marginTop: 2 }} />
              <div>
                <p 
                  className="text-sm font-medium mb-1"
                  style={{ color: '#FFC700' }}
                >
                  Instructions production
                </p>
                <ul 
                  className="text-xs space-y-1"
                  style={{ color: 'rgba(245, 245, 245, 0.7)' }}
                >
                  <li>• Imprimante compatible: Evolis Primacy / Zenius / Avansia</li>
                  <li>• Ruban: YMCKO ou YMCKOK pour impression recto-verso</li>
                  <li>• Carte PVC blanche CR80 avec puce NFC intégrée</li>
                  <li>• Vérifier alignement avec la carte test avant production</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add crop marks to PDF
function addCropMarks(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  bleed: number
) {
  const markLength = 4;
  const markOffset = 1;

  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.15);

  const corners = [
    { x: bleed, y: bleed },
    { x: pageWidth - bleed, y: bleed },
    { x: bleed, y: pageHeight - bleed },
    { x: pageWidth - bleed, y: pageHeight - bleed },
  ];

  corners.forEach(({ x, y }, index) => {
    const xDir = index % 2 === 0 ? -1 : 1;
    const yDir = index < 2 ? -1 : 1;

    pdf.line(x + xDir * markOffset, y, x + xDir * (markOffset + markLength), y);
    pdf.line(x, y + yDir * markOffset, x, y + yDir * (markOffset + markLength));
  });
}

// Add technical sheet page
function addTechnicalSheet(
  pdf: jsPDF,
  colorConfig: typeof PRINT_COLORS[PrintColor],
  orderId?: string
) {
  const margin = 20;
  let y = margin;

  // Header
  pdf.setFillColor(255, 199, 0);
  pdf.rect(0, 0, 210, 30, "F");
  
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(11, 11, 11);
  pdf.text("IWASP - Fiche d'impression Evolis", margin, 20);

  y = 45;

  // Order Info
  pdf.setFontSize(12);
  pdf.setTextColor(50, 50, 50);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, margin, y);
  if (orderId) {
    pdf.text(`Commande: ${orderId}`, 120, y);
  }
  y += 15;

  // Technical Specifications Box
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(margin, y, 170, 60, 3, 3, "F");
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(11, 11, 11);
  pdf.text("Spécifications techniques", margin + 5, y + 12);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const specs = [
    ["Format carte", "CR80 (ISO 7810)"],
    ["Dimensions", "85.6 × 54 mm"],
    ["Résolution", "300 DPI"],
    ["Fond perdu", "3 mm"],
    ["Zone de sécurité", "3 mm"],
    ["Mode couleur", "CMYK"],
    ["Rayon coins", "3.18 mm"],
  ];

  let specY = y + 22;
  specs.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}:`, margin + 5, specY);
    pdf.setFont("helvetica", "normal");
    pdf.text(value, margin + 50, specY);
    specY += 7;
  });

  y += 70;

  // Color Information
  pdf.setFillColor(
    parseInt(colorConfig.hex.slice(1, 3), 16),
    parseInt(colorConfig.hex.slice(3, 5), 16),
    parseInt(colorConfig.hex.slice(5, 7), 16)
  );
  pdf.roundedRect(margin, y, 30, 20, 3, 3, "F");
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(11, 11, 11);
  pdf.text(`Couleur: ${colorConfig.name}`, margin + 35, y + 8);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`HEX: ${colorConfig.hex}`, margin + 35, y + 15);
  pdf.text(`CMYK: ${colorConfig.cmyk}`, margin + 85, y + 15);

  y += 35;

  // Printer Compatibility
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Imprimantes compatibles", margin, y);
  y += 8;
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const printers = [
    "Evolis Primacy 2",
    "Evolis Zenius",
    "Evolis Avansia",
    "Evolis Primacy (1ère génération)"
  ];
  printers.forEach((printer) => {
    pdf.text(`• ${printer}`, margin + 5, y);
    y += 6;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    `Généré par IWASP Print System — ${new Date().toLocaleString("fr-FR")}`,
    margin,
    285
  );
}

// Download helper
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default EvolisPDFGenerator;
