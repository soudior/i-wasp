/**
 * Step 3: Personnalisation carte physique
 * /order/carte
 * 
 * Grille de templates cliquable + Aperçu temps réel
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, CardPersonalization, CardVisualType } from "@/contexts/OrderFunnelContext";
import { useBrand, OFFICIAL_COLORS } from "@/contexts/BrandContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PrintCardTemplate } from "@/components/print/PrintCardTemplate";
import { PRINT_TEMPLATES, PrintTemplateType, PrintColor } from "@/lib/printTypes";
import { 
  Image, 
  User, 
  Upload, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw,
  ZoomIn,
  Lock,
  AlertCircle,
  Sparkles,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Template grid data with preview colors
const TEMPLATE_OPTIONS = [
  { 
    id: "iwasp-signature" as PrintTemplateType, 
    color: "white" as PrintColor,
    name: "Signature Blanc",
    badge: "Premium",
    description: "Logo centré sur fond blanc premium"
  },
  { 
    id: "iwasp-signature" as PrintTemplateType, 
    color: "black" as PrintColor,
    name: "Signature Noir",
    badge: "Luxe",
    description: "Logo centré sur fond noir élégant"
  },
  { 
    id: "iwasp-signature" as PrintTemplateType, 
    color: "navy" as PrintColor,
    name: "Signature Navy",
    badge: null,
    description: "Logo sur fond bleu corporate"
  },
  { 
    id: "iwasp-signature" as PrintTemplateType, 
    color: "burgundy" as PrintColor,
    name: "Signature Bordeaux",
    badge: "New",
    description: "Élégance française raffinée"
  },
  { 
    id: "iwasp-signature" as PrintTemplateType, 
    color: "gold" as PrintColor,
    name: "Signature Or",
    badge: "VIP",
    description: "Prestige et distinction absolue"
  },
  { 
    id: "iwasp-signature" as PrintTemplateType, 
    color: "forest" as PrintColor,
    name: "Signature Forêt",
    badge: null,
    description: "Élégance naturelle et durable"
  },
  { 
    id: "iwasp-black" as PrintTemplateType, 
    color: "black" as PrintColor,
    name: "Black Premium",
    badge: "Top",
    description: "Design minimaliste haut de gamme"
  },
  { 
    id: "iwasp-black" as PrintTemplateType, 
    color: "burgundy" as PrintColor,
    name: "Burgundy Elite",
    badge: null,
    description: "Sophistication et caractère"
  },
  { 
    id: "iwasp-pure" as PrintTemplateType, 
    color: "white" as PrintColor,
    name: "Pure White",
    badge: null,
    description: "Esthétique épurée style Apple"
  },
  { 
    id: "iwasp-pure" as PrintTemplateType, 
    color: "gold" as PrintColor,
    name: "Pure Gold",
    badge: "Exclusif",
    description: "Minimalisme doré luxueux"
  },
  { 
    id: "iwasp-corporate" as PrintTemplateType, 
    color: "navy" as PrintColor,
    name: "Corporate Navy",
    badge: null,
    description: "Design B2B professionnel"
  },
  { 
    id: "iwasp-corporate" as PrintTemplateType, 
    color: "charcoal" as PrintColor,
    name: "Corporate Charcoal",
    badge: null,
    description: "Sobriété executive moderne"
  },
];

function OrderCarteContent() {
  const { state, setCardPersonalization, nextStep, prevStep } = useOrderFunnel();
  const { cardFront, cardBack } = useBrand();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: PrintTemplateType; color: PrintColor } | null>(
    state.cardPersonalization?.visualType === "logo" 
      ? { id: "iwasp-signature", color: "white" }
      : null
  );
  
  // Visual type for image upload
  const [visualType, setVisualType] = useState<CardVisualType | null>(
    state.cardPersonalization?.visualType || null
  );
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    state.cardPersonalization?.imageUrl || null
  );
  const [fileName, setFileName] = useState<string>(
    state.cardPersonalization?.fileName || ""
  );
  const [uploading, setUploading] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectTemplate = (template: { id: PrintTemplateType; color: PrintColor }) => {
    setSelectedTemplate(template);
    setVisualType("logo"); // Template = logo-based card
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Fichier trop volumineux (max 5MB)");
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG ou SVG");
      return;
    }

    setUploading(true);

    try {
      const objectUrl = URL.createObjectURL(file);
      setUploadedImage(objectUrl);
      setFileName(file.name);
      toast.success("Logo prêt pour l'impression");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedTemplate || !uploadedImage || isNavigating || state.isTransitioning) return;
    
    setIsNavigating(true);
    
    const cardData: CardPersonalization = {
      visualType: visualType || "logo",
      imageUrl: uploadedImage,
      fileName,
    };
    
    setCardPersonalization(cardData);
    await nextStep();
  };

  const canContinue = selectedTemplate !== null && uploadedImage !== null;

  // Template Card Component
  const TemplateCard = ({ 
    template, 
    isSelected, 
    onClick 
  }: { 
    template: typeof TEMPLATE_OPTIONS[0]; 
    isSelected: boolean; 
    onClick: () => void;
  }) => (
    <motion.button
      onClick={onClick}
      className={`relative w-full rounded-xl overflow-hidden border-2 transition-all ${
        isSelected 
          ? "border-primary ring-2 ring-primary/30 scale-[1.02]" 
          : "border-border hover:border-primary/50"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Template preview */}
      <div className="aspect-[1.586] w-full overflow-hidden bg-muted">
        <div className="scale-[0.4] origin-top-left w-[250%] h-[250%]">
          <PrintCardTemplate
            printedName={state.digitalIdentity?.firstName || "Prénom"}
            printedTitle={state.digitalIdentity?.title || "Titre"}
            printedCompany={state.digitalIdentity?.company || "Entreprise"}
            logoUrl={uploadedImage || undefined}
            color={template.color}
            template={template.id}
          />
        </div>
      </div>
      
      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-white font-medium text-sm">{template.name}</p>
            <p className="text-white/60 text-xs">{template.description}</p>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>
      </div>
      
      {/* Badge */}
      {template.badge && (
        <div className="absolute top-2 right-2">
          <Badge 
            variant="secondary" 
            className="text-[10px] bg-primary text-primary-foreground border-none"
          >
            {template.badge === "Premium" && <Crown className="w-3 h-3 mr-1" />}
            {template.badge === "Luxe" && <Sparkles className="w-3 h-3 mr-1" />}
            {template.badge}
          </Badge>
        </div>
      )}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={3} />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm text-primary tracking-widest uppercase mb-3"
                variants={itemVariants}
              >
                Étape 3 sur 6
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-2"
                variants={itemVariants}
              >
                Choisissez votre design
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                variants={itemVariants}
              >
                Sélectionnez un template et uploadez votre logo
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: Template Grid + Upload */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3 space-y-6"
              >
                {/* Upload Section - Always visible */}
                <div className="bg-secondary/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Image className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">1. Uploadez votre logo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou SVG (max 5MB)</p>
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />

                  {!uploadedImage ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        )}
                        <p className="text-sm text-muted-foreground">Cliquez pour uploader</p>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={uploadedImage} 
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{fileName}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Logo prêt
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Changer
                      </Button>
                    </div>
                  )}
                </div>

                {/* Template Grid */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">2. Choisissez un template</p>
                      <p className="text-xs text-muted-foreground">Cliquez pour sélectionner</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {TEMPLATE_OPTIONS.map((template, index) => (
                      <TemplateCard
                        key={`${template.id}-${template.color}-${index}`}
                        template={template}
                        isSelected={
                          selectedTemplate?.id === template.id && 
                          selectedTemplate?.color === template.color
                        }
                        onClick={() => handleSelectTemplate(template)}
                      />
                    ))}
                  </div>
                </div>

                {/* Lock notice */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Qualité impression garantie • Design IWASP exclusif</span>
                </div>
              </motion.div>

              {/* Right: Live Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 space-y-4"
              >
                <div className="bg-secondary/30 rounded-2xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                      Aperçu fidèle 100%
                    </Badge>
                    {selectedTemplate && (
                      <Badge variant="secondary" className="text-xs">
                        {TEMPLATE_OPTIONS.find(
                          t => t.id === selectedTemplate.id && t.color === selectedTemplate.color
                        )?.name}
                      </Badge>
                    )}
                  </div>

                  {/* Live Card Preview */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedTemplate?.id}-${selectedTemplate?.color}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      {selectedTemplate ? (
                        <div className="rounded-xl overflow-hidden shadow-2xl">
                          <PrintCardTemplate
                            printedName={state.digitalIdentity?.firstName 
                              ? `${state.digitalIdentity.firstName} ${state.digitalIdentity.lastName}`
                              : "Votre Nom"
                            }
                            printedTitle={state.digitalIdentity?.title || "Votre Titre"}
                            printedCompany={state.digitalIdentity?.company || "Votre Entreprise"}
                            logoUrl={uploadedImage || undefined}
                            color={selectedTemplate.color}
                            template={selectedTemplate.id}
                          />
                        </div>
                      ) : (
                        <div 
                          className="aspect-[1.586] rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border"
                        >
                          <div className="text-center p-6">
                            <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Sélectionnez un template
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Preview controls */}
                  {selectedTemplate && (
                    <div className="flex justify-center gap-3 mt-4">
                      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ZoomIn className="h-4 w-4" />
                            Agrandir
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-background border-border">
                          <div className="p-4">
                            <div className="rounded-xl overflow-hidden shadow-2xl">
                              <PrintCardTemplate
                                printedName={state.digitalIdentity?.firstName 
                                  ? `${state.digitalIdentity.firstName} ${state.digitalIdentity.lastName}`
                                  : "Votre Nom"
                                }
                                printedTitle={state.digitalIdentity?.title || "Votre Titre"}
                                printedCompany={state.digitalIdentity?.company || "Votre Entreprise"}
                                logoUrl={uploadedImage || undefined}
                                color={selectedTemplate.color}
                                template={selectedTemplate.id}
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Validation message */}
                  {!canContinue && (
                    <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-600">
                          {!uploadedImage 
                            ? "Uploadez votre logo pour continuer"
                            : "Sélectionnez un template pour continuer"
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 max-w-4xl mx-auto"
            >
              <Button
                variant="outline"
                onClick={prevStep}
                className="w-full sm:w-auto gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>

              <LoadingButton
                onClick={handleContinue}
                disabled={!canContinue}
                isLoading={isNavigating}
                className="w-full sm:w-auto gap-2"
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </LoadingButton>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function OrderCarte() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderCarteContent />
    </OrderFunnelGuard>
  );
}
