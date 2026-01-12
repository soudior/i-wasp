/**
 * Step 3: Personnalisation carte physique
 * /order/carte
 * 
 * IWASP Luxe Max — Premium Card Configurator
 * - Essentiel: Carte standard incluse (skip customization)
 * - Signature/Alliance: Luxury 2-column configurator with 3D preview
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Layers,
  CreditCard,
  AlignCenter,
  AlignStartVertical,
  RotateCcw,
  Palette,
  Type,
} from "lucide-react";
import { toast } from "sonner";

// Import official i-Wasp logo for preview
import iwaspLogo from "@/assets/iwasp-logo.png";

// Card materials with visual styling
interface CardMaterial {
  id: string;
  label: string;
  description: string;
  price: number;
  badge?: string;
  bgGradient: string;
  textColor: string;
  reflection: string;
}

const CARD_MATERIALS: CardMaterial[] = [
  {
    id: "standard",
    label: "PVC Standard",
    description: "Élégant et résistant",
    price: 0,
    bgGradient: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)",
    textColor: "#ffffff",
    reflection: "rgba(255,255,255,0.05)",
  },
  {
    id: "soft-touch",
    label: "Soft-Touch",
    description: "Toucher velouté premium",
    price: 50,
    badge: "Populaire",
    bgGradient: "linear-gradient(145deg, #0f0f0f 0%, #000000 50%, #0a0a0a 100%)",
    textColor: "#f0f0f0",
    reflection: "rgba(255,255,255,0.03)",
  },
  {
    id: "metal",
    label: "Métal",
    description: "Gravure laser premium",
    price: 150,
    badge: "Premium",
    bgGradient: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 40%, #0f0f0f 100%)",
    textColor: "#e8e8e8",
    reflection: "rgba(255,255,255,0.12)",
  },
];

// Card colors/finishes
interface CardFinish {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

const CARD_FINISHES: CardFinish[] = [
  { id: "noir", label: "Noir", color: "#0a0a0a", textColor: "#ffffff" },
  { id: "anthracite", label: "Anthracite", color: "#2d2d2d", textColor: "#ffffff" },
  { id: "marine", label: "Marine", color: "#0c1929", textColor: "#ffffff" },
  { id: "or", label: "Or", color: "#1a1710", textColor: "#d4af37" },
];

// Logo position options
type LogoPosition = "center" | "corner";

const LOGO_POSITIONS: { id: LogoPosition; label: string; icon: typeof AlignCenter }[] = [
  { id: "center", label: "Centré", icon: AlignCenter },
  { id: "corner", label: "Coin", icon: AlignStartVertical },
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

// 3D Card Preview Component
function Card3DPreview({
  material,
  finish,
  logoUrl,
  logoPosition,
  customText,
  showBack,
  onFlip,
}: {
  material: CardMaterial;
  finish: CardFinish;
  logoUrl: string | null;
  logoPosition: LogoPosition;
  customText: string;
  showBack: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="relative">
      {/* Card Container with 3D perspective */}
      <div 
        className="relative mx-auto"
        style={{ 
          perspective: "1200px",
          maxWidth: "380px",
        }}
      >
        {/* Ambient glow */}
        <div 
          className="absolute -inset-8 rounded-[60px] blur-3xl opacity-30 pointer-events-none"
          style={{ 
            background: `radial-gradient(ellipse at center, ${STEALTH.accent}20 0%, transparent 70%)` 
          }}
        />

        {/* Card flip container */}
        <motion.div
          className="relative w-full"
          style={{ 
            transformStyle: "preserve-3d",
            aspectRatio: 85.6 / 54,
          }}
          animate={{ 
            rotateY: showBack ? 180 : 0,
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Front of card */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              background: material.bgGradient,
              backgroundColor: finish.color,
              boxShadow: `
                0 25px 60px rgba(0,0,0,0.6),
                0 0 40px ${STEALTH.accent}10,
                inset 0 1px 0 ${material.reflection}
              `,
            }}
          >
            {/* Subtle texture overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: material.id === "metal" 
                  ? "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)"
                  : "none",
              }}
            />

            {/* Top light reflection */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, ${material.reflection} 0%, transparent 100%)`,
              }}
            />

            {/* i-Wasp branding (subtle corner) */}
            <motion.div
              className="absolute z-20 pointer-events-none"
              style={{
                top: "8%",
                right: "5%",
                width: "12%",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.3 }}
            >
              <img
                src={iwaspLogo}
                alt="i-Wasp"
                className="w-full h-auto object-contain"
                style={{ filter: "brightness(0.8)" }}
              />
            </motion.div>

            {/* User Logo */}
            <AnimatePresence mode="wait">
              {logoUrl && (
                <motion.div
                  key={`logo-${logoPosition}`}
                  className="absolute z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    ...(logoPosition === "center" ? {
                      left: "50%",
                      top: "45%",
                      transform: "translate(-50%, -50%)",
                      width: "45%",
                    } : {
                      left: "8%",
                      top: "15%",
                      width: "28%",
                    })
                  }}
                >
                  <img
                    src={logoUrl}
                    alt="Votre logo"
                    className="w-full h-auto object-contain drop-shadow-lg"
                    style={{ maxHeight: logoPosition === "center" ? "50%" : "35%" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom text */}
            <AnimatePresence>
              {customText && (
                <motion.div
                  className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <p 
                    className="text-xs font-medium tracking-wide text-center whitespace-nowrap"
                    style={{ 
                      color: finish.textColor,
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    {customText}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NFC indicator */}
            <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2">
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-medium tracking-wide uppercase"
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                NFC
              </div>
            </div>

            {/* Empty state */}
            {!logoUrl && !customText && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <p 
                    className="text-sm font-medium"
                    style={{ color: finish.textColor }}
                  >
                    Votre design
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: material.bgGradient,
              backgroundColor: finish.color,
              boxShadow: `
                0 25px 60px rgba(0,0,0,0.6),
                0 0 40px ${STEALTH.accent}10,
                inset 0 1px 0 ${material.reflection}
              `,
            }}
          >
            {/* Magnetic stripe */}
            <div 
              className="absolute top-[15%] left-0 right-0 h-[12%]"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            />

            {/* NFC chip area */}
            <div 
              className="absolute top-[40%] left-1/2 -translate-x-1/2 w-12 h-8 rounded-md"
              style={{ 
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* NFC icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M8.5 12a3.5 3.5 0 107 0 3.5 3.5 0 00-7 0z" />
                </svg>
              </div>
            </div>

            {/* i-Wasp branding */}
            <div 
              className="absolute bottom-[12%] left-1/2 -translate-x-1/2"
              style={{ width: "20%" }}
            >
              <img
                src={iwaspLogo}
                alt="i-Wasp"
                className="w-full h-auto object-contain opacity-50"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Flip button */}
      <motion.button
        onClick={onFlip}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{ 
          backgroundColor: STEALTH.bgCard,
          color: STEALTH.textSecondary,
          border: `1px solid ${STEALTH.border}`,
        }}
        whileHover={{ scale: 1.05, backgroundColor: STEALTH.bgInput }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-4 h-4" />
        {showBack ? "Voir recto" : "Voir verso"}
      </motion.button>
    </div>
  );
}

// Option Section Component
function OptionSection({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: typeof Layers; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <motion.div 
      className="rounded-2xl p-5"
      style={{ 
        backgroundColor: STEALTH.bgCard,
        border: `1px solid ${STEALTH.border}`
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4" style={{ color: STEALTH.accent }} />
        <span className="text-sm font-semibold tracking-wide" style={{ color: STEALTH.text }}>
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

// Signature/Alliance: Luxury Card Configurator
function LuxuryCardConfigurator() {
  const { state, setCardPersonalization, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Configuration State
  const [selectedMaterial, setSelectedMaterial] = useState<string>("soft-touch");
  const [selectedFinish, setSelectedFinish] = useState<string>("noir");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [logoPosition, setLogoPosition] = useState<LogoPosition>("center");
  const [customText, setCustomText] = useState<string>("");
  const [showBack, setShowBack] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get current selections
  const currentMaterial = CARD_MATERIALS.find(m => m.id === selectedMaterial) || CARD_MATERIALS[1];
  const currentFinish = CARD_FINISHES.find(f => f.id === selectedFinish) || CARD_FINISHES[0];

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
        toast.success("Logo ajouté");
      };
      reader.onerror = () => {
        toast.error("Erreur lors de la lecture du fichier");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Erreur lors de l'upload");
      setIsUploading(false);
    }
  }, []);

  const handleContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    
    setIsNavigating(true);
    
    const cardData: CardPersonalization = {
      visualType: "logo",
      imageUrl: logoUrl || "",
      fileName: logoFileName || "custom-card",
    };
    
    setCardPersonalization(cardData);
    await nextStep();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-6xl mx-auto">
            <OrderProgressBar currentStep={3} />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-xs tracking-[0.3em] uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Configurateur Carte
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-2"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Créez votre carte
              </motion.h1>
              <motion.p 
                className="text-sm"
                style={{ color: STEALTH.textSecondary }}
                variants={itemVariants}
              >
                Personnalisez chaque détail en temps réel
              </motion.p>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column: Options */}
              <motion.div
                className="space-y-5 order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Material Selection */}
                <OptionSection icon={Layers} title="Matériau">
                  <div className="space-y-2">
                    {CARD_MATERIALS.map((material) => {
                      const isSelected = selectedMaterial === material.id;
                      return (
                        <motion.button
                          key={material.id}
                          onClick={() => setSelectedMaterial(material.id)}
                          className="w-full p-3 rounded-xl border transition-all text-left"
                          style={{
                            borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                            backgroundColor: isSelected ? STEALTH.accentMuted : 'transparent',
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="text-sm font-medium"
                                  style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                                >
                                  {material.label}
                                </span>
                                {material.badge && (
                                  <Badge
                                    className="text-[9px] px-1.5 py-0 border-none"
                                    style={{ 
                                      backgroundColor: STEALTH.accent, 
                                      color: STEALTH.bg 
                                    }}
                                  >
                                    {material.badge}
                                  </Badge>
                                )}
                              </div>
                              <p 
                                className="text-xs mt-0.5"
                                style={{ color: STEALTH.textMuted }}
                              >
                                {material.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {material.price === 0 ? (
                                <span 
                                  className="text-xs"
                                  style={{ color: STEALTH.success }}
                                >
                                  Inclus
                                </span>
                              ) : (
                                <span 
                                  className="text-sm font-semibold"
                                  style={{ color: STEALTH.accent }}
                                >
                                  +{material.price}
                                </span>
                              )}
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4" style={{ color: STEALTH.accent }} />
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </OptionSection>

                {/* Color/Finish Selection */}
                <OptionSection icon={Palette} title="Finition">
                  <div className="flex gap-2">
                    {CARD_FINISHES.map((finish) => {
                      const isSelected = selectedFinish === finish.id;
                      return (
                        <motion.button
                          key={finish.id}
                          onClick={() => setSelectedFinish(finish.id)}
                          className="flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2"
                          style={{
                            borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                            backgroundColor: isSelected ? STEALTH.accentMuted : 'transparent',
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div 
                            className="w-8 h-8 rounded-full border-2"
                            style={{ 
                              backgroundColor: finish.color,
                              borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                            }}
                          />
                          <span 
                            className="text-xs font-medium"
                            style={{ color: isSelected ? STEALTH.accent : STEALTH.textSecondary }}
                          >
                            {finish.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </OptionSection>

                {/* Logo Upload */}
                <OptionSection icon={Upload} title="Votre logo">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!logoUrl ? (
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full p-6 rounded-xl border border-dashed transition-all flex flex-col items-center gap-2"
                      style={{ 
                        borderColor: STEALTH.borderActive,
                      }}
                      whileHover={{ borderColor: STEALTH.accent, scale: 1.01 }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: STEALTH.accentMuted }}
                      >
                        <Upload className="w-5 h-5" style={{ color: STEALTH.accent }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: STEALTH.text }}>
                          {isUploading ? "Upload..." : "Ajouter un logo"}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: STEALTH.textMuted }}>
                          PNG, JPG ou SVG
                        </p>
                      </div>
                    </motion.button>
                  ) : (
                    <div className="space-y-3">
                      <div 
                        className="p-3 rounded-xl flex items-center gap-3"
                        style={{ backgroundColor: STEALTH.bgInput }}
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
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
                            className="text-sm font-medium truncate"
                            style={{ color: STEALTH.text }}
                          >
                            {logoFileName}
                          </p>
                          <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.success }}>
                            <CheckCircle2 className="w-3 h-3" />
                            Ajouté
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

                      {/* Position */}
                      <div className="grid grid-cols-2 gap-2">
                        {LOGO_POSITIONS.map((pos) => {
                          const isSelected = logoPosition === pos.id;
                          const Icon = pos.icon;
                          return (
                            <motion.button
                              key={pos.id}
                              onClick={() => setLogoPosition(pos.id)}
                              className="p-3 rounded-xl border transition-all flex items-center justify-center gap-2"
                              style={{
                                borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                                backgroundColor: isSelected ? STEALTH.accentMuted : 'transparent',
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Icon 
                                className="w-4 h-4" 
                                style={{ color: isSelected ? STEALTH.accent : STEALTH.textSecondary }} 
                              />
                              <span 
                                className="text-xs font-medium"
                                style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                              >
                                {pos.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </OptionSection>

                {/* Custom Text (optional) */}
                <OptionSection icon={Type} title="Texte personnalisé">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.slice(0, 30))}
                    placeholder="Ex: Votre nom ou slogan..."
                    maxLength={30}
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                    style={{
                      backgroundColor: STEALTH.bgInput,
                      color: STEALTH.text,
                      border: `1px solid ${STEALTH.border}`,
                    }}
                  />
                  <p 
                    className="text-xs mt-2 text-right"
                    style={{ color: STEALTH.textMuted }}
                  >
                    {customText.length}/30 caractères
                  </p>
                </OptionSection>
              </motion.div>

              {/* Right Column: 3D Preview */}
              <motion.div
                className="order-1 lg:order-2 lg:sticky lg:top-28"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div 
                  className="rounded-3xl p-6 lg:p-8"
                  style={{ 
                    backgroundColor: STEALTH.bgCard,
                    border: `1px solid ${STEALTH.border}`,
                  }}
                >
                  {/* Preview header */}
                  <div className="text-center mb-6">
                    <p 
                      className="text-xs tracking-widest uppercase"
                      style={{ color: STEALTH.textMuted }}
                    >
                      Aperçu temps réel
                    </p>
                  </div>

                  {/* 3D Card */}
                  <div className="py-8">
                    <Card3DPreview
                      material={currentMaterial}
                      finish={currentFinish}
                      logoUrl={logoUrl}
                      logoPosition={logoPosition}
                      customText={customText}
                      showBack={showBack}
                      onFlip={() => setShowBack(!showBack)}
                    />
                  </div>

                  {/* Configuration summary */}
                  <div 
                    className="mt-8 pt-4 border-t"
                    style={{ borderColor: STEALTH.border }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: STEALTH.textSecondary }}>Configuration</span>
                      <span style={{ color: STEALTH.text }}>
                        {currentMaterial.label} · {currentFinish.label}
                      </span>
                    </div>
                    {currentMaterial.price > 0 && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span style={{ color: STEALTH.textSecondary }}>Supplément</span>
                        <span className="font-semibold" style={{ color: STEALTH.accent }}>
                          +{currentMaterial.price} MAD
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-between items-center mt-10 max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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
                disabled={state.isTransitioning}
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
      imageUrl: "",
      fileName: "standard-iwasp-card",
    };
    
    setCardPersonalization(cardData);
    await nextStep();
  };

  if (isEssentiel) {
    return <EssentielCardView onContinue={handleEssentielContinue} isNavigating={isNavigating} />;
  }

  return <LuxuryCardConfigurator />;
}

export default function OrderCarte() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderCarteContent />
    </OrderFunnelGuard>
  );
}
