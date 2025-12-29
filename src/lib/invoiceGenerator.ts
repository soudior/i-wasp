import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrderData {
  id: string;
  order_number: string;
  created_at: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
  order_type: string;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  shipping_phone: string | null;
}

// Format price in EUR
function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

// Generate invoice number from order number
function generateInvoiceNumber(orderNumber: string): string {
  return `INV-${orderNumber}`;
}

export async function generateInvoicePDF(order: OrderData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const primaryColor: [number, number, number] = [17, 24, 39]; // Dark gray
  const accentColor: [number, number, number] = [99, 102, 241]; // Indigo
  const mutedColor: [number, number, number] = [107, 114, 128]; // Gray

  // ===== HEADER =====
  // IWASP Logo / Brand
  pdf.setFillColor(...accentColor);
  pdf.rect(0, 0, pageWidth, 45, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.text("IWASP", margin, 25);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Cartes de visite NFC intelligentes", margin, 33);

  // Invoice title
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("FACTURE", pageWidth - margin, 28, { align: "right" });

  y = 60;

  // ===== INVOICE INFO BOX =====
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, y, contentWidth, 30, 3, 3, "F");

  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  
  const invoiceNumber = generateInvoiceNumber(order.order_number);
  const invoiceDate = format(new Date(order.created_at), "d MMMM yyyy", { locale: fr });

  pdf.text("N° Facture:", margin + 5, y + 10);
  pdf.text("N° Commande:", margin + 5, y + 18);
  pdf.text("Date:", margin + 5, y + 26);

  pdf.setFont("helvetica", "normal");
  pdf.text(invoiceNumber, margin + 40, y + 10);
  pdf.text(order.order_number, margin + 40, y + 18);
  pdf.text(invoiceDate, margin + 40, y + 26);

  y += 45;

  // ===== CLIENT INFO =====
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...accentColor);
  pdf.text("FACTURÉ À", margin, y);

  y += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont("helvetica", "bold");
  pdf.text(order.shipping_name || "Client", margin, y);

  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...mutedColor);
  
  if (order.shipping_address) {
    pdf.text(order.shipping_address, margin, y);
    y += 5;
  }
  if (order.shipping_postal_code || order.shipping_city) {
    pdf.text(`${order.shipping_postal_code || ""} ${order.shipping_city || ""}`.trim(), margin, y);
    y += 5;
  }
  if (order.shipping_country) {
    const countryName = order.shipping_country === "MA" ? "Maroc" : order.shipping_country;
    pdf.text(countryName, margin, y);
    y += 5;
  }
  if (order.shipping_phone) {
    pdf.text(`Tél: ${order.shipping_phone}`, margin, y);
    y += 5;
  }

  y += 15;

  // ===== PRODUCTS TABLE =====
  // Table header
  pdf.setFillColor(249, 250, 251);
  pdf.rect(margin, y, contentWidth, 10, "F");

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...primaryColor);
  pdf.text("Description", margin + 5, y + 7);
  pdf.text("Qté", margin + 100, y + 7);
  pdf.text("Prix unit.", margin + 120, y + 7);
  pdf.text("Total", pageWidth - margin - 5, y + 7, { align: "right" });

  y += 12;

  // Product row
  const productName = order.order_type === "personalized" 
    ? "Carte NFC IWASP - Personnalisée" 
    : "Carte NFC IWASP - Standard";

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(productName, margin + 5, y + 5);
  pdf.text(order.quantity.toString(), margin + 100, y + 5);
  pdf.text(formatPrice(order.unit_price_cents), margin + 120, y + 5);
  pdf.text(formatPrice(order.quantity * order.unit_price_cents), pageWidth - margin - 5, y + 5, { align: "right" });

  y += 12;

  // Separator line
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);

  y += 10;

  // ===== TOTALS =====
  const totalsX = pageWidth - margin - 60;

  pdf.setFontSize(10);
  pdf.setTextColor(...mutedColor);
  pdf.setFont("helvetica", "normal");
  pdf.text("Sous-total HT:", totalsX, y);
  pdf.setTextColor(...primaryColor);
  pdf.text(formatPrice(order.quantity * order.unit_price_cents), pageWidth - margin - 5, y, { align: "right" });

  y += 7;
  pdf.setTextColor(...mutedColor);
  pdf.text("Livraison:", totalsX, y);
  pdf.setTextColor(34, 197, 94); // Green
  pdf.text("Gratuite", pageWidth - margin - 5, y, { align: "right" });

  y += 7;
  pdf.setTextColor(...mutedColor);
  pdf.text("TVA (20%):", totalsX, y);
  pdf.setTextColor(...primaryColor);
  const tvaAmount = Math.round(order.total_price_cents * 0.1667); // Approximate TVA from TTC
  pdf.text(formatPrice(tvaAmount), pageWidth - margin - 5, y, { align: "right" });

  y += 12;

  // Total TTC box
  pdf.setFillColor(...accentColor);
  pdf.roundedRect(totalsX - 5, y - 5, 70, 14, 2, 2, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Total TTC:", totalsX, y + 5);
  pdf.text(formatPrice(order.total_price_cents), pageWidth - margin - 5, y + 5, { align: "right" });

  y += 25;

  // ===== PAYMENT METHOD =====
  pdf.setFillColor(254, 243, 199); // Yellow light
  pdf.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");

  pdf.setTextColor(146, 64, 14); // Yellow dark
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Mode de paiement:", margin + 5, y + 9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Paiement à la livraison (COD)", margin + 55, y + 9);
  pdf.text("Payez en espèces ou par carte à la réception de votre commande.", margin + 5, y + 16);

  y += 30;

  // ===== NOTES =====
  pdf.setTextColor(...mutedColor);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "italic");
  pdf.text("Merci pour votre confiance. Votre carte NFC sera produite et expédiée dans les 3-5 jours ouvrés.", margin, y);

  // ===== FOOTER =====
  const footerY = 280;

  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

  pdf.setTextColor(...mutedColor);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");

  const footerText = [
    "IWASP - Cartes de visite NFC intelligentes",
    "Email: contact@iwasp.ma | Web: www.iwasp.ma",
    "SIRET: 123 456 789 00010 | TVA: FR12345678901",
    `Facture générée le ${format(new Date(), "d MMMM yyyy à HH:mm", { locale: fr })}`
  ];

  footerText.forEach((line, index) => {
    pdf.text(line, pageWidth / 2, footerY + (index * 4), { align: "center" });
  });

  return pdf.output("blob");
}

export function downloadInvoice(blob: Blob, orderNumber: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `facture-${orderNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
