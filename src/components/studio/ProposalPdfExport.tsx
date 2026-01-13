/**
 * ProposalPdfExport - Export PDF de la proposition
 * Génère un PDF téléchargeable avec tous les détails
 */

import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface Section {
  type: string;
  title: string;
  content: string;
  items?: string[];
}

interface Page {
  name: string;
  slug: string;
  sections: Section[];
}

interface WebsiteProposal {
  siteName: string;
  tagline: string;
  colorPalette: ColorPalette;
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  pages: Page[];
  features: string[];
  estimatedPages: number;
  complexity: "simple" | "standard" | "premium";
}

interface ProposalPdfExportProps {
  proposal: WebsiteProposal;
  priceEur: number;
  priceMad: number;
  isExpress: boolean;
  formData: {
    businessType: string;
    businessName?: string;
    description?: string;
  };
}

export function ProposalPdfExport({ 
  proposal, 
  priceEur, 
  priceMad, 
  isExpress,
  formData 
}: ProposalPdfExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Header with gradient-like effect
      doc.setFillColor(26, 26, 26);
      doc.rect(0, 0, pageWidth, 50, "F");
      
      // Logo / Brand
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("i-wasp", margin, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Studio Web - Proposition de site", margin, 35);

      // Date
      doc.setFontSize(8);
      doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, pageWidth - margin - 40, 35);

      yPos = 65;

      // Site Name
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(proposal.siteName, margin, yPos);
      
      yPos += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(proposal.tagline, margin, yPos);

      yPos += 15;

      // Complexity Badge
      const complexityColors: Record<string, [number, number, number]> = {
        simple: [34, 197, 94],
        standard: [59, 130, 246],
        premium: [168, 85, 247],
      };
      const badgeColor = complexityColors[proposal.complexity] || [100, 100, 100];
      doc.setFillColor(...badgeColor);
      doc.roundedRect(margin, yPos, 40, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(proposal.complexity.toUpperCase(), margin + 5, yPos + 5.5);

      yPos += 20;

      // Section: Projet
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("À propos du projet", margin, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      
      if (formData.businessType) {
        doc.text(`• Type d'activité: ${formData.businessType}`, margin, yPos);
        yPos += 6;
      }
      if (formData.businessName) {
        doc.text(`• Nom: ${formData.businessName}`, margin, yPos);
        yPos += 6;
      }

      yPos += 10;

      // Section: Palette de couleurs
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Palette de couleurs", margin, yPos);
      
      yPos += 10;
      const colors = Object.entries(proposal.colorPalette);
      const colorSize = 15;
      const colorGap = 25;
      
      colors.forEach(([name, hex], idx) => {
        const xPos = margin + idx * colorGap;
        const rgb = hexToRgb(hex);
        doc.setFillColor(...rgb);
        doc.roundedRect(xPos, yPos, colorSize, colorSize, 2, 2, "F");
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(name, xPos, yPos + colorSize + 4);
      });

      yPos += 30;

      // Section: Typographie
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Typographie", margin, yPos);
      
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`• Titres: ${proposal.typography.headingFont}`, margin, yPos);
      yPos += 6;
      doc.text(`• Corps: ${proposal.typography.bodyFont}`, margin, yPos);

      yPos += 15;

      // Section: Structure des pages
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Structure du site (${proposal.estimatedPages} pages)`, margin, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      
      proposal.pages.forEach((page) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`${page.name}`, margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`/${page.slug}`, margin + doc.getTextWidth(page.name) + 3, yPos);
        
        yPos += 6;
        doc.setFontSize(8);
        const sections = page.sections.map(s => s.type).join(", ");
        doc.text(`Sections: ${sections}`, margin + 5, yPos);
        yPos += 10;
        doc.setFontSize(10);
      });

      yPos += 5;

      // Section: Fonctionnalités
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Fonctionnalités incluses", margin, yPos);
      
      yPos += 8;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      
      proposal.features.forEach((feature) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`✓ ${feature}`, margin, yPos);
        yPos += 5;
      });

      // Pricing Section
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos += 15;
      doc.setFillColor(245, 245, 247);
      doc.roundedRect(margin - 5, yPos - 5, pageWidth - 2 * margin + 10, 45, 3, 3, "F");
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Estimation tarifaire", margin, yPos + 5);
      
      yPos += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      
      if (isExpress) {
        doc.text("• Option Express (24-48h): Oui", margin, yPos);
        yPos += 6;
      }
      
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 122, 255);
      doc.text(`${priceEur}€ / ${priceMad} DH`, margin, yPos + 8);

      yPos += 25;
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 150, 150);
      doc.text("* Prix indicatif. Le devis final dépend des fonctionnalités et personnalisations.", margin, yPos);

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setFillColor(26, 26, 26);
      doc.rect(0, footerY - 5, pageWidth, 25, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("i-wasp Studio • studio@i-wasp.com • +33 6 26 42 43 94", margin, footerY + 5);
      doc.text("www.i-wasp.com", pageWidth - margin - 30, footerY + 5);

      // Save
      const fileName = `proposition-${proposal.siteName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF téléchargé !",
        description: `Le fichier ${fileName} a été enregistré.`,
      });

    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Export...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          Télécharger PDF
        </>
      )}
    </Button>
  );
}
