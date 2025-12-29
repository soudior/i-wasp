import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  LogoBackgroundConfig,
  LogoBackgroundType,
  LOGO_REQUIREMENTS,
  validateLogoDimensions,
  checkLogoQuality,
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
  Image,
  AlertCircle,
  CheckCircle,
  Palette,
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
  const [logoQuality, setLogoQuality] = useState<{ valid: boolean; optimal: boolean; message?: string } | null>(null);
  
  // Logo background state
  const [logoBackground, setLogoBackground] = useState<LogoBackgroundConfig>(
    initialData?.logoBackground || { type: "solid", color: "rgba(0,0,0,0.05)", opacity: 100 }
  );
  const [bgImageUrl, setBgImageUrl] = useState<string | undefined>(initialData?.logoBackground?.imageUrl);
  
  const [template, setTemplate] = useState<PrintTemplateType>(initialData?.templateId || "iwasp-black");
  const [color, setColor] = useState<PrintColor>(initialData?.cardColor || PRINT_TEMPLATES["iwasp-black"].defaultColor);
  const [isValidated, setIsValidated] = useState(false);
  const [isLocked, setIsLocked] = useState(initialData?.isLocked || false);
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!LOGO_REQUIREMENTS.ALLOWED_FORMATS.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG, SVG ou WebP");
      return;
    }

    // Check file size
    if (file.size > LOGO_REQUIREMENTS.MAX_FILE_SIZE) {
      toast.error("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      
      // Check image dimensions
      const img = new window.Image();
      img.onload = () => {
        const validation = validateLogoDimensions(img.width, img.height);
        const quality = checkLogoQuality(img.width, img.height);
        
        setLogoQuality({
          valid: validation.valid,
          optimal: quality.isOptimal,
          message: validation.message || quality.message,
        });
        
        if (!validation.valid) {
          toast.error(validation.message);
          return;
        }
        
        if (!quality.isOptimal) {
          toast.warning(quality.message);
        }
        
        setLogoUrl(dataUrl);
        setLogoFile(file);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleBgImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 10MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setBgImageUrl(dataUrl);
      setLogoBackground(prev => ({ ...prev, type: "image", imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  }, []);

  const removeLogo = () => {
    setLogoUrl(undefined);
    setLogoFile(null);
    setLogoQuality(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeBgImage = () => {
    setBgImageUrl(undefined);
    setLogoBackground(prev => ({ ...prev, type: "solid", imageUrl: undefined }));
    if (bgFileInputRef.current) bgFileInputRef.current.value = "";
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
      logoBackground: logoUrl ? logoBackground : undefined,
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
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="info" disabled={isLocked}>Informations</TabsTrigger>
            <TabsTrigger value="logo" disabled={isLocked}>Logo & Brand</TabsTrigger>
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
          </TabsContent>

          {/* Logo & Brand Tab */}
          <TabsContent value="logo" className="space-y-6">
            {/* Logo upload - PRIMARY ELEMENT */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Image size={16} className="text-primary" />
                <span className="font-semibold">Logo Principal</span>
                <span className="text-xs text-muted-foreground">(élément visuel principal)</span>
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={isLocked}
              />
              {logoUrl ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-28 h-28 rounded-xl bg-background border-2 border-primary/20 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      {logoQuality && (
                        <div className={`flex items-center gap-2 text-sm ${logoQuality.optimal ? "text-green-600" : "text-amber-600"}`}>
                          {logoQuality.optimal ? (
                            <CheckCircle size={14} />
                          ) : (
                            <AlertCircle size={14} />
                          )}
                          <span>{logoQuality.optimal ? "Qualité optimale" : logoQuality.message}</span>
                        </div>
                      )}
                      {!isLocked && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            Changer
                          </Button>
                          <Button variant="outline" size="sm" onClick={removeLogo}>
                            <X size={14} className="mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLocked}
                  className="w-full py-8 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary/60 transition-colors flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed bg-primary/5"
                >
                  <Upload size={28} className="text-primary" />
                  <span className="font-medium">Téléchargez votre logo</span>
                  <span className="text-xs text-muted-foreground">
                    Min. {LOGO_REQUIREMENTS.MIN_WIDTH}x{LOGO_REQUIREMENTS.MIN_HEIGHT}px • PNG, JPG, SVG, WebP (max 10MB)
                  </span>
                </button>
              )}
            </div>

            {/* Logo Background Options */}
            {logoUrl && (
              <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <Label className="flex items-center gap-2">
                  <Palette size={14} className="text-muted-foreground" />
                  Fond du logo
                </Label>
                
                <RadioGroup
                  value={logoBackground.type}
                  onValueChange={(value: LogoBackgroundType) => {
                    setLogoBackground(prev => ({ 
                      ...prev, 
                      type: value,
                      imageUrl: value === "image" ? bgImageUrl : undefined,
                    }));
                  }}
                  disabled={isLocked}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solid" id="bg-solid" />
                    <Label htmlFor="bg-solid" className="cursor-pointer">Couleur unie</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="bg-image" />
                    <Label htmlFor="bg-image" className="cursor-pointer">Image de marque</Label>
                  </div>
                </RadioGroup>

                {/* Solid color options */}
                {logoBackground.type === "solid" && (
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Couleur de fond</Label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { name: "Transparent", value: "transparent" },
                        { name: "Subtil clair", value: "rgba(255,255,255,0.1)" },
                        { name: "Subtil sombre", value: "rgba(0,0,0,0.05)" },
                        { name: "Blanc", value: "rgba(255,255,255,0.9)" },
                        { name: "Noir léger", value: "rgba(0,0,0,0.15)" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setLogoBackground(prev => ({ ...prev, color: opt.value }))}
                          disabled={isLocked}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                            logoBackground.color === opt.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image background */}
                {logoBackground.type === "image" && (
                  <div className="space-y-4">
                    <input
                      ref={bgFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBgImageUpload}
                      className="hidden"
                      disabled={isLocked}
                    />
                    {bgImageUrl ? (
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                          <img src={bgImageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => bgFileInputRef.current?.click()} disabled={isLocked}>
                            Changer
                          </Button>
                          <Button variant="outline" size="sm" onClick={removeBgImage} disabled={isLocked}>
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => bgFileInputRef.current?.click()}
                        disabled={isLocked}
                        className="w-full py-4 border border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground"
                      >
                        <Upload size={16} />
                        Ajouter une image de fond
                      </button>
                    )}
                    
                    {/* Blur control for image background */}
                    {bgImageUrl && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Flou: {logoBackground.blur || 0}px</Label>
                        <Slider
                          value={[logoBackground.blur || 0]}
                          onValueChange={([value]) => setLogoBackground(prev => ({ ...prev, blur: value }))}
                          min={0}
                          max={20}
                          step={1}
                          disabled={isLocked}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Opacity control */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Opacité: {logoBackground.opacity || 100}%</Label>
                  <Slider
                    value={[logoBackground.opacity || 100]}
                    onValueChange={([value]) => setLogoBackground(prev => ({ ...prev, opacity: value }))}
                    min={0}
                    max={100}
                    step={5}
                    disabled={isLocked}
                  />
                </div>
              </div>
            )}
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
            logoBackground={logoUrl ? logoBackground : undefined}
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
          logoBackground={logoUrl ? logoBackground : undefined}
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
