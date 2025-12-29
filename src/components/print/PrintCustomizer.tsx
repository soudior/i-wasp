import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintCardTemplate } from "./PrintCardTemplate";
import { PrintPreview } from "./PrintPreview";
import { PrintTemplateSelector } from "./PrintTemplateSelector";
import { 
  PrintColor, 
  PrintTemplateType, 
  PrintOrderData,
  PrintSheetData,
  PRINT_COLORS,
  PRINT_TEMPLATES,
} from "@/lib/printTypes";
import { generatePrintPack, downloadBlob } from "@/lib/pdfExport";
import { 
  User, 
  Briefcase, 
  Building2, 
  Upload, 
  X, 
  Download,
  FileText,
  Printer,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface PrintCustomizerProps {
  orderId?: string;
  quantity: number;
  initialData?: Partial<PrintOrderData>;
  onComplete?: (data: PrintOrderData) => void;
}

export function PrintCustomizer({
  orderId = "preview",
  quantity = 1,
  initialData,
  onComplete,
}: PrintCustomizerProps) {
  const [printedName, setPrintedName] = useState(initialData?.printedName || "");
  const [printedTitle, setPrintedTitle] = useState(initialData?.printedTitle || "");
  const [printedCompany, setPrintedCompany] = useState(initialData?.printedCompany || "");
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialData?.logoUrl);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [template, setTemplate] = useState<PrintTemplateType>(initialData?.templateId || "iwasp-black");
  const [color, setColor] = useState<PrintColor>(initialData?.cardColor || PRINT_TEMPLATES["iwasp-black"].defaultColor);
  const [isValidated, setIsValidated] = useState(false);
  const [isLocked, setIsLocked] = useState(initialData?.isLocked || false);
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
      setLogoFile(file);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoUrl(undefined);
    setLogoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleValidate = () => {
    if (!printedName.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }

    setIsValidated(true);
    toast.success("Design validé ! Prêt pour le paiement.");
  };

  const handleLock = () => {
    setIsLocked(true);
    
    const orderData: PrintOrderData = {
      orderId,
      quantity,
      cardColor: color,
      templateId: template,
      printedName,
      printedTitle: printedTitle || undefined,
      printedCompany: printedCompany || undefined,
      logoUrl,
      isLocked: true,
      lockedAt: new Date().toISOString(),
      validatedAt: new Date().toISOString(),
    };

    onComplete?.(orderData);
    toast.success("Design verrouillé et enregistré");
  };

  const handleExportPDF = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      const sheetData: PrintSheetData = {
        orderId,
        orderNumber: `ORD-${orderId.slice(0, 8).toUpperCase()}`,
        quantity,
        cardColor: color,
        colorName: PRINT_COLORS[color].name,
        colorCMYK: PRINT_COLORS[color].cmyk,
        templateId: template,
        templateName: PRINT_TEMPLATES[template].name,
        printedName,
        printedTitle: printedTitle || undefined,
        printedCompany: printedCompany || undefined,
        logoUrl,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      const { printerSheet, cardPdf } = await generatePrintPack(sheetData, cardRef.current);
      
      // Download both files
      downloadBlob(printerSheet, `IWASP_Fiche_${sheetData.orderNumber}.pdf`);
      setTimeout(() => {
        downloadBlob(cardPdf, `IWASP_Carte_${sheetData.orderNumber}.pdf`);
      }, 500);

      toast.success("Fichiers PDF téléchargés");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: Customization form */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="info" disabled={isLocked}>Informations</TabsTrigger>
            <TabsTrigger value="design" disabled={isLocked}>Design</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-5">
            {/* Printed name */}
            <div>
              <Label htmlFor="print-name" className="flex items-center gap-2 mb-2">
                <User size={14} className="text-muted-foreground" />
                Nom à imprimer *
              </Label>
              <Input
                id="print-name"
                value={printedName}
                onChange={(e) => setPrintedName(e.target.value)}
                placeholder="Jean Dupont"
                disabled={isLocked}
                className="bg-background/50 border-border/50"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {printedName.length}/30 caractères
              </p>
            </div>

            {/* Printed title */}
            <div>
              <Label htmlFor="print-title" className="flex items-center gap-2 mb-2">
                <Briefcase size={14} className="text-muted-foreground" />
                Titre / Poste
              </Label>
              <Input
                id="print-title"
                value={printedTitle}
                onChange={(e) => setPrintedTitle(e.target.value)}
                placeholder="Directeur Commercial"
                disabled={isLocked}
                className="bg-background/50 border-border/50"
                maxLength={40}
              />
            </div>

            {/* Printed company */}
            <div>
              <Label htmlFor="print-company" className="flex items-center gap-2 mb-2">
                <Building2 size={14} className="text-muted-foreground" />
                Entreprise
              </Label>
              <Input
                id="print-company"
                value={printedCompany}
                onChange={(e) => setPrintedCompany(e.target.value)}
                placeholder="Ma Société"
                disabled={isLocked}
                className="bg-background/50 border-border/50"
                maxLength={40}
              />
            </div>

            {/* Logo upload */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Upload size={14} className="text-muted-foreground" />
                Logo (optionnel)
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={isLocked}
              />
              {logoUrl ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-background/50 border border-border/50 overflow-hidden">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {!isLocked && (
                    <Button variant="outline" size="sm" onClick={removeLogo}>
                      <X size={14} className="mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLocked}
                  className="w-full py-6 border-2 border-dashed border-border/50 rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={20} />
                  <span className="text-sm">Cliquez pour télécharger votre logo</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG, SVG (max 5MB)</span>
                </button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="design">
            <PrintTemplateSelector
              selectedTemplate={template}
              selectedColor={color}
              printedName={printedName}
              printedTitle={printedTitle}
              printedCompany={printedCompany}
              logoUrl={logoUrl}
              onTemplateChange={setTemplate}
              onColorChange={setColor}
              disabled={isLocked}
            />
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        {isValidated && !isLocked && (
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleLock}
              className="w-full"
              size="lg"
            >
              <Lock size={18} className="mr-2" />
              Verrouiller et continuer
            </Button>
          </div>
        )}

        {isLocked && (
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="w-full"
              disabled={isExporting}
            >
              {isExporting ? (
                <>Génération en cours...</>
              ) : (
                <>
                  <Download size={18} className="mr-2" />
                  Télécharger le pack impression
                </>
              )}
            </Button>
            <div className="flex gap-2 text-xs text-muted-foreground justify-center">
              <span className="flex items-center gap-1">
                <FileText size={12} />
                Fiche imprimeur
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Printer size={12} />
                Carte PDF HD
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Right: Preview */}
      <div>
        {/* Hidden high-res card for PDF export */}
        <div className="hidden">
          <PrintCardTemplate
            ref={cardRef}
            printedName={printedName}
            printedTitle={printedTitle}
            printedCompany={printedCompany}
            logoUrl={logoUrl}
            color={color}
            template={template}
            forPrint
          />
        </div>

        <PrintPreview
          printedName={printedName}
          printedTitle={printedTitle}
          printedCompany={printedCompany}
          logoUrl={logoUrl}
          color={color}
          template={template}
          onValidate={handleValidate}
          isValidated={isValidated}
          isLocked={isLocked}
        />
      </div>
    </div>
  );
}
