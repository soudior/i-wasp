import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  CARD_DIMENSIONS,
  PRINT_COLORS,
  PRINT_TEMPLATES,
  PrintSheetData,
  MM_TO_PX_300DPI,
} from "./printTypes";

// Generate print-ready PDF for a single card
export async function generateCardPDF(
  cardElement: HTMLElement,
  data: PrintSheetData
): Promise<Blob> {
  // Capture the card at high resolution
  const canvas = await html2canvas(cardElement, {
    scale: 3, // High quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });

  // Create PDF with bleed
  const pdfWidth = CARD_DIMENSIONS.WIDTH_WITH_BLEED_MM;
  const pdfHeight = CARD_DIMENSIONS.HEIGHT_WITH_BLEED_MM;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  // Add card image centered (with bleed margins)
  const bleed = CARD_DIMENSIONS.BLEED_MM;
  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    bleed,
    bleed,
    CARD_DIMENSIONS.WIDTH_MM,
    CARD_DIMENSIONS.HEIGHT_MM
  );

  // Add crop marks
  addCropMarks(pdf, pdfWidth, pdfHeight, bleed);

  return pdf.output("blob");
}

// Add crop marks to PDF
function addCropMarks(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  bleed: number
) {
  const markLength = 5; // mm
  const markOffset = 1; // mm from bleed edge

  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.1);

  // Corner marks
  const corners = [
    { x: bleed, y: bleed }, // Top-left
    { x: pageWidth - bleed, y: bleed }, // Top-right
    { x: bleed, y: pageHeight - bleed }, // Bottom-left
    { x: pageWidth - bleed, y: pageHeight - bleed }, // Bottom-right
  ];

  corners.forEach(({ x, y }, index) => {
    const xDir = index % 2 === 0 ? -1 : 1;
    const yDir = index < 2 ? -1 : 1;

    // Horizontal mark
    pdf.line(
      x + xDir * markOffset,
      y,
      x + xDir * (markOffset + markLength),
      y
    );
    // Vertical mark
    pdf.line(
      x,
      y + yDir * markOffset,
      x,
      y + yDir * (markOffset + markLength)
    );
  });
}

// Generate printer sheet PDF with all order information
export async function generatePrinterSheet(
  data: PrintSheetData,
  cardElement?: HTMLElement
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20;
  let y = margin;

  // Header
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("IWASP - Fiche d'impression", margin, y);
  y += 15;

  // Order info box
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 30, 3, 3, "F");
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Commande: ${data.orderNumber}`, margin + 5, y + 8);
  
  pdf.setFont("helvetica", "normal");
  pdf.text(`Date: ${new Date(data.createdAt).toLocaleDateString("fr-FR")}`, margin + 5, y + 16);
  pdf.text(`Statut: ${translateStatus(data.status)}`, margin + 5, y + 24);
  
  pdf.text(`Quantité: ${data.quantity} carte(s)`, pageWidth / 2, y + 8);
  y += 40;

  // Card specifications
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Spécifications de la carte", margin, y);
  y += 10;

  const colorConfig = PRINT_COLORS[data.cardColor];
  const templateConfig = PRINT_TEMPLATES[data.templateId];

  const specs = [
    { label: "Couleur", value: `${colorConfig.name} (${colorConfig.hex})` },
    { label: "CMYK", value: colorConfig.cmyk },
    { label: "Template", value: templateConfig.name },
    { label: "Dimensions", value: `${CARD_DIMENSIONS.WIDTH_MM} × ${CARD_DIMENSIONS.HEIGHT_MM} mm` },
  ];

  pdf.setFontSize(11);
  specs.forEach((spec) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${spec.label}:`, margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(spec.value, margin + 40, y);
    y += 7;
  });
  y += 5;

  // Printed content
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Contenu à imprimer", margin, y);
  y += 10;

  const content = [
    { label: "Nom", value: data.printedName },
    { label: "Titre", value: data.printedTitle || "-" },
    { label: "Entreprise", value: data.printedCompany || "-" },
    { label: "Logo", value: data.logoUrl ? "Oui (voir pièce jointe)" : "Non" },
  ];

  pdf.setFontSize(11);
  content.forEach((item) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${item.label}:`, margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(item.value, margin + 40, y);
    y += 7;
  });
  y += 10;

  // Card preview (if element provided)
  if (cardElement) {
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Aperçu de la carte", margin, y);
    y += 10;

    try {
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      // Calculate preview size to fit on page
      const previewWidth = 120;
      const previewHeight = (previewWidth / CARD_DIMENSIONS.WIDTH_MM) * CARD_DIMENSIONS.HEIGHT_MM;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        margin,
        y,
        previewWidth,
        previewHeight
      );
      y += previewHeight + 10;
    } catch (error) {
      console.error("Failed to capture card preview:", error);
    }
  }

  // Logo URL (if exists)
  if (data.logoUrl) {
    y += 5;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(`URL du logo: ${data.logoUrl}`, margin, y);
  }

  // Footer
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    `Généré le ${new Date().toLocaleString("fr-FR")} — IWASP Print System`,
    margin,
    290
  );

  return pdf.output("blob");
}

// Generate all assets for an order
export async function generatePrintPack(
  data: PrintSheetData,
  cardElement: HTMLElement
): Promise<{ printerSheet: Blob; cardPdf: Blob }> {
  const [printerSheet, cardPdf] = await Promise.all([
    generatePrinterSheet(data, cardElement),
    generateCardPDF(cardElement, data),
  ]);

  return { printerSheet, cardPdf };
}

// Translate status to French
function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    pending: "En attente",
    in_production: "En production",
    shipped: "Expédié",
    delivered: "Livré",
  };
  return translations[status] || status;
}

// Download helper
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
