/**
 * Step 4: Design Configuration
 * /order/card-design
 * 
 * - Template gallery with real-time preview
 * - Upload logo client (PNG/JPG/SVG, max 15Mo)
 * - Choix couleur carte (3 palettes verrouillées)
 * - Placement logo: Centré, Coin, Auto, PLEIN FORMAT
 * - Aperçu carte physique temps réel avec guides
 * - Validation obligatoire avant ajout panier
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, DesignConfig } from "@/contexts/OrderFunnelContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  OrderProgressBar, 
  AutoSaveIndicator, 
  RestoreDraftBanner,
  PageTransition,
  contentVariants,
  itemVariants 
} from "@/components/order";
import { LogoPlacementEditor, LogoPlacementConfig, LogoPlacement, BlendMode } from "@/components/order/LogoPlacementEditor";
import { LogoCropper } from "@/components/order/LogoCropper";
import { TemplateGallery, TemplateDefinition } from "@/components/order/TemplateGallery";
import { TemplatePreviewModal } from "@/components/order/TemplatePreviewModal";
import { LuxuryHotelTemplate } from "@/components/templates/LuxuryHotelTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  Palette,
  Image,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Crop,
  LayoutGrid
} from "lucide-react";
import { toast } from "sonner";

// Extended design state for auto-save
interface DesignFormData extends DesignConfig {
  logoPlacement: LogoPlacement;
  logoOpacity: number;
  logoBlendMode: BlendMode;
  logoScale: number;
  isValidated: boolean;
  selectedTemplate?: string;
}

// Available templates for the gallery
const AVAILABLE_TEMPLATES: TemplateDefinition[] = [
  {
    id: "luxury-hotel",
    name: "Luxury Hotel",
    category: "hotel",
    description: "Template ultra-premium pour hôtels 5 étoiles avec design noir & or, modules WiFi, carte interactive et avis Google.",
    features: ["WiFi", "Carte", "WhatsApp", "Avis Google", "Site web", "vCard"],
    premium: true,
    new: true,
    previewComponent: <LuxuryHotelTemplate data={{} as any} isPreview={true} />,
  },
  {
    id: "executive",
    name: "Executive",
    category: "business",
    description: "Design professionnel avec accents dorés pour dirigeants et entrepreneurs.",
    features: ["vCard", "LinkedIn", "WhatsApp", "Site web"],
    premium: true,
    previewComponent: (
      <div className="w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="w-16 h-16 rounded-xl bg-[#d4af37]/20 mx-auto mb-4 flex items-center justify-center">
          <span className="text-[#d4af37] text-2xl font-serif">E</span>
        </div>
        <h3 className="text-center font-semibold">Executive Template</h3>
        <p className="text-center text-white/50 text-sm mt-1">Directeur • Entreprise</p>
        <div className="mt-4 space-y-2">
          <div className="h-10 rounded-lg bg-white/10" />
          <div className="h-10 rounded-lg bg-[#d4af37]/20" />
        </div>
      </div>
    ),
  },
  {
    id: "minimal-white",
    name: "Minimal Blanc",
    category: "minimal",
    description: "Design épuré et moderne avec fond blanc et typographie élégante.",
    features: ["vCard", "Réseaux sociaux", "Site web"],
    previewComponent: (
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg border">
        <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4" />
        <h3 className="text-center font-medium text-gray-900">Prénom Nom</h3>
        <p className="text-center text-gray-500 text-sm mt-1">Titre • Entreprise</p>
        <div className="mt-4 space-y-2">
          <div className="h-10 rounded-lg bg-gray-100" />
          <div className="h-10 rounded-lg bg-gray-100" />
        </div>
      </div>
    ),
  },
  {
    id: "boutique",
    name: "Boutique Luxe",
    category: "retail",
    description: "Template élégant pour boutiques et commerces premium.",
    features: ["Localisation", "Horaires", "WhatsApp", "Instagram"],
    previewComponent: (
      <div className="w-full max-w-sm bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-6 border border-rose-100">
        <div className="w-14 h-14 rounded-xl bg-rose-100 mx-auto mb-4 flex items-center justify-center">
          <span className="text-rose-500 text-xl">✦</span>
        </div>
        <h3 className="text-center font-serif text-gray-900">Ma Boutique</h3>
        <p className="text-center text-rose-500 text-sm mt-1">Mode & Accessoires</p>
        <div className="mt-4 space-y-2">
          <div className="h-10 rounded-lg bg-white/60" />
          <div className="h-10 rounded-lg bg-rose-100" />
        </div>
      </div>
    ),
  },
  {
    id: "creative",
    name: "Creative Studio",
    category: "creative",
    description: "Design audacieux avec dégradés vibrants pour créatifs et artistes.",
    features: ["Portfolio", "Réseaux sociaux", "Contact"],
    previewComponent: (
      <div className="w-full max-w-sm bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-6 text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mx-auto mb-4" />
        <h3 className="text-center font-bold">Creative Studio</h3>
        <p className="text-center text-white/70 text-sm mt-1">Designer • Artiste</p>
        <div className="mt-4 space-y-2">
          <div className="h-10 rounded-lg bg-white/20" />
          <div className="h-10 rounded-lg bg-white/10" />
        </div>
      </div>
    ),
  },
];

// Locked color palettes
const COLOR_PALETTES = [
  {
    id: "noir-elegant",
    name: "Noir Élégant",
    color: "#1A1A1A",
    textColor: "#FFFFFF",
    description: "Classique et professionnel",
  },
  {
    id: "blanc-minimal",
    name: "Blanc Minimal",
    color: "#FFFFFF",
    textColor: "#1A1A1A",
    description: "Épuré et moderne",
  },
  {
    id: "bleu-nuit",
    name: "Bleu Nuit",
    color: "#0F172A",
    textColor: "#FFFFFF",
    description: "Sophistiqué et premium",
  },
];

// Max file size: 15MB
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_FORMATS = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

function OrderDesignContent() {
  const { state, setDesignConfig, nextStep, prevStep } = useOrderFunnel();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = useState(
    state.designConfig?.cardColor || COLOR_PALETTES[0].color
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(
    state.designConfig?.logoUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalLogoUrl, setOriginalLogoUrl] = useState<string | null>(null);
  
  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "custom">("templates");

  // Logo placement configuration
  const [logoConfig, setLogoConfig] = useState<LogoPlacementConfig>({
    placement: "center",
    opacity: 100,
    blendMode: "normal",
    scale: 1,
  });

  // Memoize form data for auto-save
  const formData = useMemo<DesignFormData>(() => ({
    logoUrl,
    cardColor: selectedColor,
    logoPlacement: logoConfig.placement,
    logoOpacity: logoConfig.opacity,
    logoBlendMode: logoConfig.blendMode,
    logoScale: logoConfig.scale,
    isValidated,
    selectedTemplate: selectedTemplate || undefined,
  }), [logoUrl, selectedColor, logoConfig, isValidated, selectedTemplate]);

  // Auto-save hook
  const { 
    status: saveStatus, 
    lastSaved, 
    hasSavedData, 
    getSavedData, 
    clearSaved 
  } = useAutoSave<DesignFormData>({
    key: "order_design",
    data: formData,
    enabled: true,
  });

  // Check for saved draft on mount
  useEffect(() => {
    if (!state.designConfig && hasSavedData()) {
      setShowRestoreBanner(true);
    }
  }, [state.designConfig, hasSavedData]);

  // Reset validation when design changes
  useEffect(() => {
    setIsValidated(false);
  }, [logoUrl, selectedColor, logoConfig]);

  const handleRestoreDraft = () => {
    const savedData = getSavedData();
    if (savedData) {
      setLogoUrl(savedData.logoUrl);
      setSelectedColor(savedData.cardColor);
      setLogoConfig({
        placement: savedData.logoPlacement || "center",
        opacity: savedData.logoOpacity || 100,
        blendMode: savedData.logoBlendMode || "normal",
        scale: savedData.logoScale || 1,
      });
      setIsValidated(savedData.isValidated || false);
      toast.success("Brouillon restauré");
    }
    setShowRestoreBanner(false);
  };

  const handleDismissDraft = () => {
    clearSaved();
    setShowRestoreBanner(false);
  };

  const selectedPalette = COLOR_PALETTES.find(p => p.color === selectedColor) || COLOR_PALETTES[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file later
    e.target.value = "";

    if (!file) return;

    // Validate file type
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG ou SVG");
      return;
    }

    // Validate file size (max 15MB)
    if (file.size > MAX_FILE_SIZE) {
      toast.error("L'image ne doit pas dépasser 15 Mo");
      return;
    }

    setIsUploading(true);

    try {
      // Local-only preview (no server upload): instant feedback + no RLS issues
      const localUrl = URL.createObjectURL(file);

      // Revoke previous blob URLs to avoid leaks
      if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
      if (originalLogoUrl?.startsWith("blob:")) URL.revokeObjectURL(originalLogoUrl);

      setLogoUrl(localUrl);
      setOriginalLogoUrl(localUrl);
      setIsValidated(false);
      toast.success("Logo chargé (prévisualisation)");
    } catch (error: any) {
      console.error("[OrderDesign] Local logo preview error:", error);
      toast.error("Erreur de lecture du fichier");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
    if (originalLogoUrl?.startsWith("blob:")) URL.revokeObjectURL(originalLogoUrl);

    setLogoUrl(null);
    setOriginalLogoUrl(null);
    setIsValidated(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = (croppedUrl: string) => {
    setLogoUrl(croppedUrl);
    setShowCropper(false);
    setIsValidated(false);
    toast.success("Logo recadré avec succès");
  };

  const handleValidateDesign = () => {
    // Template mode: just need template selection
    if (activeTab === "templates" && selectedTemplate) {
      setIsValidated(true);
      toast.success("Template sélectionné !");
      return;
    }
    // Custom mode: need logo
    if (activeTab === "custom" && !logoUrl) {
      toast.error("Veuillez d'abord télécharger votre logo");
      return;
    }
    setIsValidated(true);
    toast.success("Design validé !");
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsValidated(false);
  };

  const handlePreviewTemplate = (templateId: string) => {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setPreviewTemplate(template);
    }
  };

  const handleContinue = () => {
    if (!isValidated) {
      toast.error("Veuillez valider votre design avant de continuer");
      return;
    }

    setDesignConfig({
      logoUrl,
      cardColor: selectedColor,
      template: selectedTemplate || undefined,
    });
    clearSaved(); // Clear draft on successful submit
    nextStep();
  };

  const canContinue = (activeTab === "templates" && selectedTemplate && isValidated) || 
                      (activeTab === "custom" && logoUrl && isValidated);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={4} />

            {/* Restore Draft Banner */}
            <AnimatePresence>
              {showRestoreBanner && (
                <RestoreDraftBanner
                  lastSaved={lastSaved}
                  onRestore={handleRestoreDraft}
                  onDismiss={handleDismissDraft}
                />
              )}
            </AnimatePresence>

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Choisissez votre design
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Sélectionnez un template ou personnalisez votre carte
              </motion.p>
              {/* Auto-save indicator */}
              <motion.div 
                className="flex justify-center mt-2"
                variants={itemVariants}
              >
                <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
              </motion.div>
            </motion.div>

            {/* Design Mode Tabs */}
            <Tabs 
              value={activeTab} 
              onValueChange={(v) => {
                setActiveTab(v as "templates" | "custom");
                setIsValidated(false);
              }}
              className="mb-8"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
                <TabsTrigger value="templates" className="gap-2 text-sm">
                  <LayoutGrid size={16} />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="custom" className="gap-2 text-sm">
                  <Palette size={16} />
                  Personnalisé
                </TabsTrigger>
              </TabsList>

              {/* Templates Tab */}
              <TabsContent value="templates" className="mt-6">
                <TemplateGallery
                  templates={AVAILABLE_TEMPLATES}
                  selectedTemplateId={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                  onPreviewTemplate={handlePreviewTemplate}
                />

                {/* Template Validation */}
                {selectedTemplate && !isValidated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Button
                      size="lg"
                      onClick={handleValidateDesign}
                      className="w-full max-w-md mx-auto h-14 text-lg rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 hover:opacity-90 flex"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirmer ce template
                    </Button>
                  </motion.div>
                )}

                {selectedTemplate && isValidated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20 max-w-md mx-auto">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        Template "{AVAILABLE_TEMPLATES.find(t => t.id === selectedTemplate)?.name}" sélectionné !
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </TabsContent>

              {/* Custom Design Tab */}
              <TabsContent value="custom" className="mt-6">

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Live Preview with Placement Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-2 lg:order-1"
            >
              {logoUrl ? (
                <LogoPlacementEditor
                  logoUrl={logoUrl}
                  cardColor={selectedColor}
                  textColor={selectedPalette.textColor}
                  config={logoConfig}
                  onChange={setLogoConfig}
                />
              ) : (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-center">Aperçu en temps réel</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Empty Card Preview */}
                    <div
                      className="relative aspect-[1.6/1] rounded-2xl shadow-2xl overflow-hidden mx-auto max-w-md transition-all duration-500"
                      style={{ 
                        backgroundColor: selectedColor,
                        boxShadow: `0 25px 50px -12px ${selectedColor}40`
                      }}
                    >
                      {/* Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center">
                          <Image
                            size={48}
                            style={{ color: selectedPalette.textColor }}
                            className="mx-auto mb-2 opacity-30"
                          />
                          <p 
                            className="text-sm opacity-50"
                            style={{ color: selectedPalette.textColor }}
                          >
                            Téléchargez votre logo
                          </p>
                        </div>
                      </div>

                      {/* NFC indicator */}
                      <div className="absolute bottom-4 left-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                          style={{ backgroundColor: `${selectedPalette.textColor}20` }}
                        >
                          <div 
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: `${selectedPalette.textColor}60` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Color name */}
                    <p className="text-center mt-4 text-sm text-muted-foreground">
                      {selectedPalette.name} • {selectedPalette.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Validation Status */}
              <AnimatePresence mode="wait">
                {logoUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4"
                  >
                    {isValidated ? (
                      <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 dark:text-green-400">
                          Design validé ! Vous pouvez continuer.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-700 dark:text-amber-400">
                          Ajustez le placement et validez votre design avant de continuer.
                        </AlertDescription>
                      </Alert>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Configuration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-1 lg:order-2 space-y-6"
            >
              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Upload size={20} className="text-primary" />
                    Votre logo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-upload"
                  />

                  {logoUrl ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={logoUrl}
                          alt="Logo prévisualisé"
                          className="max-w-full max-h-full object-contain"
                        />
                        <button
                          onClick={handleRemoveLogo}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowCropper(true)}
                          className="gap-2"
                        >
                          <Crop size={16} />
                          Recadrer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Changer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="text-sm font-medium mb-1">Cliquez pour télécharger</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, SVG (max 15 Mo)</p>
                        </>
                      )}
                    </label>
                  )}

                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Un logo avec fond transparent donnera le meilleur rendu
                  </p>
                </CardContent>
              </Card>

              {/* Color Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Palette size={20} className="text-primary" />
                    Couleur de la carte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {COLOR_PALETTES.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => {
                          setSelectedColor(palette.color);
                          setIsValidated(false);
                        }}
                        className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                          selectedColor === palette.color
                            ? "border-primary shadow-lg"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {selectedColor === palette.color && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check size={14} className="text-primary-foreground" />
                          </motion.div>
                        )}
                        <div
                          className="w-full aspect-[1.6/1] rounded-lg mb-2 shadow-inner"
                          style={{ 
                            backgroundColor: palette.color,
                            border: palette.color === "#FFFFFF" ? "1px solid #e5e5e5" : "none"
                          }}
                        />
                        <p className="text-xs font-medium text-center">{palette.name}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Validate Design Button */}
              {logoUrl && !isValidated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    size="lg"
                    onClick={handleValidateDesign}
                    className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Valider mon design
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
              </TabsContent>
            </Tabs>

          {/* Navigation */}
          <motion.div 
            className="flex justify-between items-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ArrowLeft size={18} />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!canContinue}
              className={`px-8 h-14 text-lg rounded-full ${
                canContinue 
                  ? "bg-gradient-to-r from-primary to-amber-500"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Continuer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          </div>
        </main>
      </PageTransition>

      {/* Logo Cropper Modal */}
      {originalLogoUrl && (
        <LogoCropper
          imageUrl={originalLogoUrl}
          isOpen={showCropper}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={(templateId) => {
          setSelectedTemplate(templateId);
          setPreviewTemplate(null);
        }}
      />

      <Footer />
    </div>
  );
}

export default function OrderDesign() {
  return (
    <OrderFunnelGuard step={4}>
      <OrderDesignContent />
    </OrderFunnelGuard>
  );
}
