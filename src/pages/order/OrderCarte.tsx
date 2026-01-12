/**
 * Step 3: Personnalisation carte physique
 * /order/carte
 * 
 * IWASP Premium Luxury — Simplified Card Editor
 * - Essentiel: Carte standard incluse (skip customization)
 * - Signature/Alliance: Model choice + Logo upload + Position
 */

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, CardPersonalization, OfferType } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STEALTH } from "@/lib/stealthPalette";
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Layers,
  CreditCard,
  AlignCenter,
  AlignStartVertical,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// Import official i-Wasp logo for preview
import iwaspLogo from "@/assets/iwasp-logo.png";

// Simplified card models
interface CardModel {
  id: string;
  label: string;
  description: string;
  price: number;
  badge?: string;
}

const CARD_MODELS: CardModel[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Carte PVC classique, résistante et élégante",
    price: 0,
  },
  {
    id: "soft-touch",
    label: "Soft-Touch",
    description: "Finition veloutée noir profond, toucher premium",
    price: 50,
    badge: "Populaire",
  },
  {
    id: "metal",
    label: "Métal",
    description: "Carte métal noir mat gravée, ultra-premium",
    price: 150,
    badge: "Premium",
  },
];

// Logo position options
type LogoPosition = "center" | "corner";

const LOGO_POSITIONS: { id: LogoPosition; label: string; icon: typeof AlignCenter }[] = [
  { id: "center", label: "Centré", icon: AlignCenter },
  { id: "corner", label: "Coin supérieur", icon: AlignStartVertical },
];

// Essentiel offer: Simple card included message
function EssentielCardView({ onContinue, isNavigating }: { onContinue: () => void; isNavigating: boolean }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            <OrderProgressBar currentStep={3} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Étape 3 sur 6
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-3"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Votre carte i‑wasp
              </motion.h1>
            </motion.div>

            {/* Standard Card Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl p-8 text-center"
              style={{ 
                backgroundColor: STEALTH.bgCard,
                border: `1px solid ${STEALTH.border}`
              }}
            >
              {/* Card Preview */}
              <div className="relative mx-auto mb-8 max-w-xs">
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    aspectRatio: 85.6 / 54,
                    backgroundColor: "#0B0B0B",
                    boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${STEALTH.accent}10`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={iwaspLogo}
                      alt="i-Wasp"
                      className="w-1/3 h-auto object-contain opacity-90"
                    />
                  </div>
                  <Badge 
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] border-none"
                    style={{ 
                      backgroundColor: STEALTH.accentMuted, 
                      color: STEALTH.textSecondary 
                    }}
                  >
                    NFC activé
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-6 h-6" style={{ color: STEALTH.success }} />
                  <h2 
                    className="text-xl font-semibold"
                    style={{ color: STEALTH.text }}
                  >
                    Carte standard incluse
                  </h2>
                </div>

                <p 
                  className="text-sm max-w-md mx-auto"
                  style={{ color: STEALTH.textSecondary }}
                >
                  Votre offre Essentiel inclut une carte PVC standard avec le branding i‑wasp. 
                  Vous recevrez votre carte prête à l'emploi.
                </p>

                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{ 
                    backgroundColor: STEALTH.accentMuted,
                    color: STEALTH.accent
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  Design officiel i‑wasp
                </div>

                <p 
                  className="text-xs italic pt-4"
                  style={{ color: STEALTH.textMuted }}
                >
                  Passez à l'offre Signature ou Alliance pour personnaliser votre carte avec votre logo.
                </p>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-between items-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="gap-2"
                style={{ color: STEALTH.textSecondary }}
              >
                <ArrowLeft size={18} />
                Retour
              </Button>
              <LoadingButton
                size="xl"
                onClick={onContinue}
                isLoading={isNavigating}
                loadingText="Chargement..."
                className="px-8 rounded-full font-semibold"
                style={{ 
                  backgroundColor: STEALTH.accent,
                  color: STEALTH.bg
                }}
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </LoadingButton>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

// Signature/Alliance: Full card customization
function CustomCardEditor() {
  const { state, setCardPersonalization, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [selectedModel, setSelectedModel] = useState<string>("soft-touch");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [logoPosition, setLogoPosition] = useState<LogoPosition>("center");
  const [isUploading, setIsUploading] = useState(false);

  // Handle file upload
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG ou SVG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 5 Mo)");
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
        setLogoFileName(file.name);
        setIsUploading(false);
        toast.success("Logo uploadé avec succès");
      };
      reader.onerror = () => {
        toast.error("Erreur lors de la lecture du fichier");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erreur lors de l'upload");
      setIsUploading(false);
    }
  }, []);

  const handleContinue = async () => {
    if (!logoUrl || isNavigating || state.isTransitioning) return;
    
    setIsNavigating(true);
    
    const cardData: CardPersonalization = {
      visualType: "logo",
      imageUrl: logoUrl,
      fileName: logoFileName,
    };
    
    setCardPersonalization(cardData);
    await nextStep();
  };

  const canContinue = logoUrl !== null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-3xl mx-auto">
            <OrderProgressBar currentStep={3} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Étape 3 sur 6
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-3"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Personnalisez votre carte
              </motion.h1>
              <motion.p 
                style={{ color: STEALTH.textSecondary }}
                variants={itemVariants}
              >
                Choisissez le modèle et ajoutez votre logo
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Options */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Model Selection */}
                <div 
                  className="rounded-2xl p-5"
                  style={{ 
                    backgroundColor: STEALTH.bgCard,
                    border: `1px solid ${STEALTH.border}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5" style={{ color: STEALTH.accent }} />
                    <span className="font-semibold" style={{ color: STEALTH.text }}>
                      Modèle de carte
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {CARD_MODELS.map((model) => {
                      const isSelected = selectedModel === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModel(model.id)}
                          className="w-full p-4 rounded-xl border-2 transition-all text-left"
                          style={{
                            borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                            backgroundColor: isSelected ? STEALTH.accentMuted : 'transparent',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="font-semibold"
                                  style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                                >
                                  {model.label}
                                </span>
                                {model.badge && (
                                  <Badge
                                    className="text-[10px] border-none"
                                    style={{ 
                                      backgroundColor: STEALTH.accent, 
                                      color: STEALTH.bg 
                                    }}
                                  >
                                    {model.badge}
                                  </Badge>
                                )}
                              </div>
                              <p 
                                className="text-xs mt-1"
                                style={{ color: STEALTH.textSecondary }}
                              >
                                {model.description}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              {model.price === 0 ? (
                                <span 
                                  className="text-xs font-medium"
                                  style={{ color: STEALTH.success }}
                                >
                                  Inclus
                                </span>
                              ) : (
                                <span 
                                  className="text-sm font-bold"
                                  style={{ color: STEALTH.accent }}
                                >
                                  +{model.price} MAD
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 ml-3" style={{ color: STEALTH.accent }} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logo Upload */}
                <div 
                  className="rounded-2xl p-5"
                  style={{ 
                    backgroundColor: STEALTH.bgCard,
                    border: `1px solid ${STEALTH.border}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5" style={{ color: STEALTH.accent }} />
                    <span className="font-semibold" style={{ color: STEALTH.text }}>
                      Votre logo
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!logoUrl ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full p-8 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-3"
                      style={{ 
                        borderColor: STEALTH.borderActive,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: STEALTH.accentMuted }}
                      >
                        <Upload className="w-6 h-6" style={{ color: STEALTH.accent }} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium" style={{ color: STEALTH.text }}>
                          {isUploading ? "Upload en cours..." : "Cliquez pour uploader"}
                        </p>
                        <p className="text-xs mt-1" style={{ color: STEALTH.textMuted }}>
                          PNG, JPG ou SVG • Max 5 Mo
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div 
                        className="relative p-4 rounded-xl flex items-center gap-4"
                        style={{ backgroundColor: STEALTH.bgInput }}
                      >
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: STEALTH.bg }}
                        >
                          <img 
                            src={logoUrl} 
                            alt="Logo" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p 
                            className="font-medium truncate"
                            style={{ color: STEALTH.text }}
                          >
                            {logoFileName}
                          </p>
                          <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.success }}>
                            <CheckCircle2 className="w-3 h-3" />
                            Uploadé avec succès
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          style={{ color: STEALTH.textSecondary }}
                        >
                          Changer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo Position */}
                {logoUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-5"
                    style={{ 
                      backgroundColor: STEALTH.bgCard,
                      border: `1px solid ${STEALTH.border}`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlignCenter className="w-5 h-5" style={{ color: STEALTH.accent }} />
                      <span className="font-semibold" style={{ color: STEALTH.text }}>
                        Position du logo
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {LOGO_POSITIONS.map((pos) => {
                        const isSelected = logoPosition === pos.id;
                        const Icon = pos.icon;
                        return (
                          <button
                            key={pos.id}
                            onClick={() => setLogoPosition(pos.id)}
                            className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
                            style={{
                              borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                              backgroundColor: isSelected ? STEALTH.accentMuted : 'transparent',
                            }}
                          >
                            <Icon 
                              className="w-6 h-6" 
                              style={{ color: isSelected ? STEALTH.accent : STEALTH.textSecondary }} 
                            />
                            <span 
                              className="text-sm font-medium"
                              style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                            >
                              {pos.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Right: Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:sticky lg:top-24"
              >
                <div 
                  className="rounded-2xl p-6"
                  style={{ 
                    backgroundColor: STEALTH.bgCard,
                    border: `1px solid ${STEALTH.border}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" style={{ color: STEALTH.accent }} />
                    <span className="font-semibold" style={{ color: STEALTH.text }}>
                      Aperçu de votre carte
                    </span>
                  </div>

                  {/* Card Preview */}
                  <div
                    className="relative rounded-2xl overflow-hidden mx-auto"
                    style={{
                      aspectRatio: 85.6 / 54,
                      backgroundColor: "#0B0B0B",
                      boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${STEALTH.accent}15`,
                    }}
                  >
                    {/* i-Wasp branding (top right corner) */}
                    <div
                      className="absolute z-20 pointer-events-none"
                      style={{
                        top: "8%",
                        right: "5%",
                        width: "15%",
                      }}
                    >
                      <img
                        src={iwaspLogo}
                        alt="i-Wasp"
                        className="w-full h-auto object-contain opacity-80"
                      />
                    </div>

                    {/* User Logo */}
                    {logoUrl && (
                      <div
                        className="absolute z-10"
                        style={{
                          ...(logoPosition === "center" ? {
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "40%",
                          } : {
                            left: "8%",
                            top: "12%",
                            width: "25%",
                          })
                        }}
                      >
                        <img
                          src={logoUrl}
                          alt="Votre logo"
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: logoPosition === "center" ? "60%" : "40%" }}
                        />
                      </div>
                    )}

                    {/* NFC indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                      <Badge 
                        className="text-[10px] border-none"
                        style={{ 
                          backgroundColor: STEALTH.accentMuted, 
                          color: STEALTH.textSecondary 
                        }}
                      >
                        NFC activé
                      </Badge>
                    </div>

                    {/* Empty state */}
                    {!logoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon 
                            className="w-10 h-10 mx-auto mb-2 opacity-30" 
                            style={{ color: STEALTH.textMuted }}
                          />
                          <p 
                            className="text-xs opacity-50"
                            style={{ color: STEALTH.textMuted }}
                          >
                            Votre logo ici
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Model info */}
                  <div 
                    className="mt-4 p-3 rounded-xl text-center"
                    style={{ backgroundColor: STEALTH.bgInput }}
                  >
                    <p className="text-sm" style={{ color: STEALTH.textSecondary }}>
                      Modèle: <span style={{ color: STEALTH.text, fontWeight: 500 }}>
                        {CARD_MODELS.find(m => m.id === selectedModel)?.label}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-between items-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={state.isTransitioning}
                className="gap-2"
                style={{ color: STEALTH.textSecondary }}
              >
                <ArrowLeft size={18} />
                Retour
              </Button>
              <LoadingButton
                size="xl"
                onClick={handleContinue}
                disabled={!canContinue || state.isTransitioning}
                isLoading={isNavigating}
                loadingText="Chargement..."
                className="px-8 rounded-full font-semibold disabled:opacity-50"
                style={{ 
                  backgroundColor: STEALTH.accent,
                  color: STEALTH.bg
                }}
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </LoadingButton>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

// Main component: Route based on selected offer
function OrderCarteContent() {
  const { state, setCardPersonalization, nextStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const selectedOffer = state.selectedOffer as OfferType;
  const isEssentiel = selectedOffer === "essentiel";

  const handleEssentielContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    setIsNavigating(true);
    
    // Set default card personalization for Essentiel
    const cardData: CardPersonalization = {
      visualType: "logo",
      imageUrl: "", // Standard card, no custom logo
      fileName: "standard-iwasp-card",
    };
    
    setCardPersonalization(cardData);
    await nextStep();
  };

  if (isEssentiel) {
    return <EssentielCardView onContinue={handleEssentielContinue} isNavigating={isNavigating} />;
  }

  return <CustomCardEditor />;
}

export default function OrderCarte() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderCarteContent />
    </OrderFunnelGuard>
  );
}
