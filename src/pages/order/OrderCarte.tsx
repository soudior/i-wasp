/**
 * Step 3: Personnalisation carte physique
 * /order/carte
 * 
 * IWASP Stealth Luxury Design
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, CardPersonalization } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardDesignEditor, CardDesignConfig, defaultCardDesignConfig } from "@/components/order/CardDesignEditor";
import { STEALTH } from "@/lib/stealthPalette";
import { 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Sparkles,
  Eye,
  FlipHorizontal,
  Layers,
  Package,
  CheckCircle2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Import official i-Wasp logo for back preview
import iwaspLogo from "@/assets/iwasp-logo.png";

// Premium card material definitions with marketing copy
interface CardMaterial {
  id: string;
  label: string;
  tagline: string;
  description: string;
  price: number;
  badge?: string;
  features: string[];
}

const PREMIUM_MATERIALS: Record<string, CardMaterial> = {
  "pvc-soft-touch": {
    id: "pvc-soft-touch",
    label: "Luxe Soft-Touch",
    tagline: "La discrétion haut de gamme",
    description: "Carte PVC soft-touch noir profond + profil numérique complet i-Wasp, idéale pour les marques haut de gamme qui aiment la discrétion.",
    price: 0,
    features: ["PVC soft-touch noir", "Finition veloutée", "Logo doré ou vernis sélectif"],
  },
  "metal-noir": {
    id: "metal-noir",
    label: "Signature Métal",
    tagline: "L'excellence gravée",
    description: "Carte métal NFC noir mat gravée + profil digital complet i-Wasp. Pensée pour les décideurs qui veulent une présence physique et digitale irréprochable.",
    price: 150,
    badge: "Premium",
    features: ["Métal noir mat", "Gravure laser or/argent", "Finition ultra-premium"],
  },
  "bois-eco-luxe": {
    id: "bois-eco-luxe",
    label: "Éco-Luxe Bois",
    tagline: "L'élégance responsable",
    description: "Carte bois foncé gravée pour une option éco-luxe. L'alliance parfaite entre raffinement et responsabilité environnementale.",
    price: 120,
    badge: "Éco",
    features: ["Bois foncé naturel", "Gravure laser", "Finition éco-responsable"],
  },
  "metal-gold": {
    id: "metal-gold",
    label: "Prestige Or",
    tagline: "L'ultime expression du luxe",
    description: "Carte métal avec finition or 24 carats. L'édition la plus exclusive pour ceux qui n'acceptent que l'excellence absolue.",
    price: 300,
    badge: "Exclusive",
    features: ["Métal premium", "Finition or 24 carats", "Édition limitée"],
  },
};

// Card materials by client type with marketing positioning
const CARD_MATERIALS = {
  particulier: [
    PREMIUM_MATERIALS["pvc-soft-touch"],
  ],
  independant: [
    PREMIUM_MATERIALS["pvc-soft-touch"],
    PREMIUM_MATERIALS["metal-noir"],
    PREMIUM_MATERIALS["bois-eco-luxe"],
  ],
  entreprise: [
    PREMIUM_MATERIALS["pvc-soft-touch"],
    PREMIUM_MATERIALS["metal-noir"],
    PREMIUM_MATERIALS["bois-eco-luxe"],
    PREMIUM_MATERIALS["metal-gold"],
  ],
};

// Pack definitions for B2B
const PACK_OPTIONS = {
  particulier: [
    { qty: 1, label: "1 carte", pricePerCard: 0 },
    { qty: 2, label: "2 cartes", pricePerCard: 0, discount: "-10%" },
    { qty: 3, label: "3 cartes", pricePerCard: 0, discount: "-15%" },
  ],
  independant: [
    { qty: 1, label: "1 carte", pricePerCard: 0 },
    { qty: 5, label: "Pack Pro 5", pricePerCard: 0, discount: "-15%", badge: "Pro" },
    { qty: 10, label: "Pack Pro 10", pricePerCard: 0, discount: "-20%", badge: "Pro" },
    { qty: 25, label: "Pack Pro 25", pricePerCard: 0, discount: "-25%", badge: "Best" },
  ],
  entreprise: [
    { qty: 10, label: "Équipe 10", pricePerCard: 0, badge: "Start" },
    { qty: 25, label: "Équipe 25", pricePerCard: 0, discount: "-15%", badge: "Pro" },
    { qty: 50, label: "Équipe 50", pricePerCard: 0, discount: "-25%", badge: "Best" },
    { qty: 100, label: "Prestige 100", pricePerCard: 0, discount: "-35%", badge: "Elite" },
    { qty: 250, label: "Enterprise 250+", pricePerCard: 0, discount: "-40%", badge: "VIP" },
  ],
};

const QUANTITY_OPTIONS = {
  particulier: [1, 2, 3],
  independant: [1, 5, 10, 25],
  entreprise: [10, 25, 50, 100, 250],
};

function OrderCarteContent() {
  const { state, setCardPersonalization, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showBack, setShowBack] = useState(false);
  
  // Get client type from state
  const clientType = state.digitalIdentity?.clientType || "particulier";
  const cardMaterials = CARD_MATERIALS[clientType];
  const quantityOptions = QUANTITY_OPTIONS[clientType];
  
  // Selected material and quantity
  const [selectedMaterial, setSelectedMaterial] = useState(cardMaterials[0].id);
  const [selectedQuantity, setSelectedQuantity] = useState(quantityOptions[0]);
  
  // Card design config
  const [cardDesign, setCardDesign] = useState<CardDesignConfig>(() => {
    if (state.cardPersonalization?.imageUrl) {
      return {
        logoUrl: state.cardPersonalization.imageUrl,
        logoX: 50,
        logoY: 50,
        logoScale: 1,
        isFullBleed: false,
        fileName: state.cardPersonalization.fileName || "",
      };
    }
    return defaultCardDesignConfig;
  });

  const handleContinue = async () => {
    if (!cardDesign.logoUrl || isNavigating || state.isTransitioning) return;
    
    setIsNavigating(true);
    
    const cardData: CardPersonalization = {
      visualType: "logo",
      imageUrl: cardDesign.logoUrl,
      fileName: cardDesign.fileName,
    };
    
    setCardPersonalization(cardData);
    await nextStep();
  };

  const canContinue = cardDesign.logoUrl !== null;

  // Card back preview component
  const CardBackPreview = () => (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        aspectRatio: 85.6 / 54,
        backgroundColor: STEALTH.bgCard,
        boxShadow: STEALTH.shadowLg,
      }}
    >
      {/* Centered i-Wasp logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={iwaspLogo}
          alt="i-Wasp"
          className="w-1/2 h-auto object-contain opacity-90"
        />
      </div>
      
      {/* NFC indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
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
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-4xl mx-auto">
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
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Étape 3 sur 6
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-2"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Personnalisez votre carte
              </motion.h1>
              <motion.p 
                style={{ color: STEALTH.textSecondary }}
                variants={itemVariants}
              >
                Uploadez votre logo et positionnez-le sur la carte officielle i-Wasp
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Card Design Editor */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: STEALTH.accentMuted }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: STEALTH.accent }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: STEALTH.text }}>
                      Éditeur de carte
                    </p>
                    <p className="text-xs" style={{ color: STEALTH.textSecondary }}>
                      Glissez pour positionner votre logo
                    </p>
                  </div>
                </div>

                <CardDesignEditor
                  value={cardDesign}
                  onChange={setCardDesign}
                />

                {/* Premium Material Selection */}
                {cardMaterials.length > 1 && (
                  <div 
                    className="rounded-2xl p-5"
                    style={{ 
                      backgroundColor: STEALTH.bgCard,
                      border: `1px solid ${STEALTH.border}`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-4 h-4" style={{ color: STEALTH.accent }} />
                      <span className="text-sm font-semibold" style={{ color: STEALTH.text }}>
                        Choisissez votre finition
                      </span>
                      <span 
                        className="ml-auto text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: STEALTH.accentMuted, 
                          color: STEALTH.accent 
                        }}
                      >
                        {clientType === "entreprise" ? "Collection B2B" : "Collection Pro"}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {cardMaterials.map((material) => {
                        const isSelected = selectedMaterial === material.id;
                        return (
                          <button
                            key={material.id}
                            onClick={() => setSelectedMaterial(material.id)}
                            className="w-full p-4 rounded-xl border-2 transition-all text-left group"
                            style={{
                              borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                              backgroundColor: isSelected ? STEALTH.accentMuted : 'transparent',
                              boxShadow: isSelected ? `0 0 20px ${STEALTH.accent}20` : 'none',
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span 
                                    className="font-semibold"
                                    style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                                  >
                                    {material.label}
                                  </span>
                                  {material.badge && (
                                    <span 
                                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                      style={{ 
                                        backgroundColor: material.badge === "Exclusive" ? "#C68B5F" : STEALTH.accent, 
                                        color: STEALTH.bg 
                                      }}
                                    >
                                      {material.badge}
                                    </span>
                                  )}
                                </div>
                                <p 
                                  className="text-xs italic"
                                  style={{ color: STEALTH.accent }}
                                >
                                  "{material.tagline}"
                                </p>
                                <p 
                                  className="text-xs leading-relaxed"
                                  style={{ color: STEALTH.textSecondary }}
                                >
                                  {material.description}
                                </p>
                                {/* Features */}
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {material.features.map((feature, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-2 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: `${STEALTH.border}50`,
                                        color: STEALTH.textSecondary,
                                      }}
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-2">
                                {material.price === 0 ? (
                                  <span 
                                    className="text-xs font-medium px-2 py-1 rounded-lg"
                                    style={{ 
                                      backgroundColor: `${STEALTH.success}20`,
                                      color: STEALTH.success 
                                    }}
                                  >
                                    Inclus
                                  </span>
                                ) : (
                                  <span 
                                    className="text-sm font-bold"
                                    style={{ color: STEALTH.accent }}
                                  >
                                    +{material.price} MAD
                                  </span>
                                )}
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5" style={{ color: STEALTH.accent }} />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pack/Quantity Selection with B2B badges */}
                {quantityOptions.length > 3 && (
                  <div 
                    className="rounded-2xl p-5"
                    style={{ 
                      backgroundColor: STEALTH.bgCard,
                      border: `1px solid ${STEALTH.border}`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4" style={{ color: STEALTH.accent }} />
                      <span className="text-sm font-semibold" style={{ color: STEALTH.text }}>
                        {clientType === "entreprise" ? "Pack Équipe Prestige" : "Quantité"}
                      </span>
                      {clientType === "entreprise" && (
                        <span 
                          className="ml-auto text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: STEALTH.accentMuted, 
                            color: STEALTH.accent 
                          }}
                        >
                          + Dashboard Manager inclus
                        </span>
                      )}
                    </div>
                    <p 
                      className="text-xs mb-3"
                      style={{ color: STEALTH.textSecondary }}
                    >
                      {clientType === "entreprise" 
                        ? "Pack de cartes premium coordonnées pour votre équipe + Dashboard Manager pour suivre l'utilisation et les contacts générés."
                        : "Sélectionnez la quantité souhaitée"}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PACK_OPTIONS[clientType].map((pack) => {
                        const isSelected = selectedQuantity === pack.qty;
                        return (
                          <button
                            key={pack.qty}
                            onClick={() => setSelectedQuantity(pack.qty)}
                            className="p-3 rounded-xl border-2 transition-all text-center relative"
                            style={{
                              borderColor: isSelected ? STEALTH.accent : STEALTH.border,
                              backgroundColor: isSelected ? STEALTH.accentMuted : 'transparent',
                            }}
                          >
                            {pack.badge && (
                              <span 
                                className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full font-medium"
                                style={{ 
                                  backgroundColor: pack.badge === "Best" || pack.badge === "VIP" ? STEALTH.accent : STEALTH.border, 
                                  color: pack.badge === "Best" || pack.badge === "VIP" ? STEALTH.bg : STEALTH.text 
                                }}
                              >
                                {pack.badge}
                              </span>
                            )}
                            <span 
                              className="text-lg font-bold block"
                              style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                            >
                              {pack.qty}
                            </span>
                            <span 
                              className="text-[10px] block"
                              style={{ color: STEALTH.textSecondary }}
                            >
                              {pack.label}
                            </span>
                            {pack.discount && (
                              <span 
                                className="text-[10px] font-medium"
                                style={{ color: STEALTH.success }}
                              >
                                {pack.discount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedQuantity >= 25 && (
                      <p 
                        className="text-xs mt-3 text-center p-2 rounded-lg"
                        style={{ 
                          backgroundColor: `${STEALTH.success}15`,
                          color: STEALTH.success 
                        }}
                      >
                        ✨ Tarif dégressif appliqué • Dashboard Manager offert
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Right: Preview & Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Preview Section */}
                <div 
                  className="rounded-2xl p-6 sticky top-24"
                  style={{ 
                    backgroundColor: STEALTH.bgCard,
                    border: `1px solid ${STEALTH.border}`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      className="text-xs"
                      style={{ 
                        backgroundColor: STEALTH.accentMuted, 
                        color: STEALTH.accent,
                        border: `1px solid ${STEALTH.borderActive}`
                      }}
                    >
                      {showBack ? "Verso" : "Recto"} • Aperçu fidèle
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBack(!showBack)}
                      className="h-8 gap-1 text-xs"
                      style={{ color: STEALTH.textSecondary }}
                    >
                      <FlipHorizontal className="w-3 h-3" />
                      {showBack ? "Voir recto" : "Voir verso"}
                    </Button>
                  </div>

                  {/* Card Preview with 3D Flip */}
                  <div 
                    className="relative"
                    style={{ perspective: "1000px" }}
                  >
                    <motion.div
                      className="relative w-full"
                      animate={{ rotateY: showBack ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front Side */}
                      <div style={{ backfaceVisibility: "hidden" }}>
                        {!showBack && (
                          <div
                            className="relative rounded-xl overflow-hidden"
                            style={{
                              aspectRatio: 85.6 / 54,
                              backgroundColor: "#0B0B0B",
                              boxShadow: STEALTH.shadowLg,
                            }}
                          >
                            {/* Fixed i-Wasp Logo */}
                            <div
                              className="absolute z-30 pointer-events-none"
                              style={{
                                top: "8%",
                                right: "5%",
                                width: "18%",
                              }}
                            >
                              <img
                                src={iwaspLogo}
                                alt="i-Wasp"
                                className="w-full h-auto object-contain"
                                style={{ opacity: 0.9 }}
                              />
                            </div>

                            {/* User Logo */}
                            {cardDesign.logoUrl && (
                              cardDesign.isFullBleed ? (
                                <img
                                  src={cardDesign.logoUrl}
                                  alt="Votre logo"
                                  className="absolute inset-0 w-full h-full object-cover"
                                  style={{ zIndex: 5 }}
                                />
                              ) : (
                                <div
                                  className="absolute"
                                  style={{
                                    left: `${cardDesign.logoX}%`,
                                    top: `${cardDesign.logoY}%`,
                                    transform: "translate(-50%, -50%)",
                                    zIndex: 5,
                                    maxWidth: `${40 * cardDesign.logoScale}%`,
                                    maxHeight: `${40 * cardDesign.logoScale}%`,
                                  }}
                                >
                                  <img
                                    src={cardDesign.logoUrl}
                                    alt="Votre logo"
                                    className="max-w-full max-h-full object-contain drop-shadow-lg"
                                  />
                                </div>
                              )
                            )}

                            {/* Placeholder if no logo */}
                            {!cardDesign.logoUrl && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <p style={{ color: STEALTH.textMuted }}>
                                  Uploadez votre logo
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Back Side */}
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        {showBack && <CardBackPreview />}
                      </div>
                    </motion.div>
                  </div>

                  {/* Info badges */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <Badge 
                      className="text-[10px]"
                      style={{ 
                        backgroundColor: STEALTH.accentMuted, 
                        color: STEALTH.textSecondary 
                      }}
                    >
                      <Lock className="w-2.5 h-2.5 mr-1" />
                      i-Wasp protégé
                    </Badge>
                    <Badge 
                      className="text-[10px]"
                      style={{ 
                        backgroundColor: STEALTH.accentMuted, 
                        color: STEALTH.textSecondary 
                      }}
                    >
                      Format carte de crédit
                    </Badge>
                    <Badge 
                      className="text-[10px]"
                      style={{ 
                        backgroundColor: STEALTH.accentMuted, 
                        color: STEALTH.textSecondary 
                      }}
                    >
                      PVC premium
                    </Badge>
                  </div>

                  {/* Zoom preview */}
                  {cardDesign.logoUrl && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4 gap-2"
                          style={{ 
                            borderColor: STEALTH.border,
                            color: STEALTH.text,
                            backgroundColor: 'transparent'
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Aperçu grande taille
                        </Button>
                      </DialogTrigger>
                      <DialogContent 
                        className="max-w-2xl p-6"
                        style={{ 
                          backgroundColor: STEALTH.bg,
                          borderColor: STEALTH.border
                        }}
                      >
                        <div
                          className="relative rounded-xl overflow-hidden"
                          style={{
                            aspectRatio: 85.6 / 54,
                            backgroundColor: "#0B0B0B",
                            boxShadow: STEALTH.shadowLg,
                          }}
                        >
                          {/* Fixed i-Wasp Logo */}
                          <div
                            className="absolute z-30"
                            style={{
                              top: "8%",
                              right: "5%",
                              width: "18%",
                            }}
                          >
                            <img
                              src={iwaspLogo}
                              alt="i-Wasp"
                              className="w-full h-auto object-contain"
                              style={{ opacity: 0.9 }}
                            />
                          </div>

                          {/* User Logo */}
                          {cardDesign.isFullBleed ? (
                            <img
                              src={cardDesign.logoUrl}
                              alt="Votre logo"
                              className="absolute inset-0 w-full h-full object-cover"
                              style={{ zIndex: 5 }}
                            />
                          ) : (
                            <div
                              className="absolute"
                              style={{
                                left: `${cardDesign.logoX}%`,
                                top: `${cardDesign.logoY}%`,
                                transform: "translate(-50%, -50%)",
                                zIndex: 5,
                                maxWidth: `${40 * cardDesign.logoScale}%`,
                                maxHeight: `${40 * cardDesign.logoScale}%`,
                              }}
                            >
                              <img
                                src={cardDesign.logoUrl}
                                alt="Votre logo"
                                className="max-w-full max-h-full object-contain drop-shadow-lg"
                              />
                            </div>
                          )}
                        </div>
                        <p 
                          className="text-center text-sm mt-4"
                          style={{ color: STEALTH.textSecondary }}
                        >
                          Voici exactement la carte que vous recevrez
                        </p>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Validation message */}
                {!canContinue && (
                  <div 
                    className="text-center text-sm p-4 rounded-xl"
                    style={{ 
                      backgroundColor: STEALTH.accentMuted,
                      color: STEALTH.textSecondary
                    }}
                  >
                    <p>Uploadez votre logo pour continuer</p>
                  </div>
                )}
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
                style={{ 
                  borderColor: STEALTH.border,
                  color: STEALTH.textSecondary,
                  backgroundColor: 'transparent'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>

              <LoadingButton
                onClick={handleContinue}
                disabled={!canContinue}
                isLoading={isNavigating}
                className="w-full sm:w-auto gap-2 rounded-full"
                style={{ 
                  backgroundColor: STEALTH.accent,
                  color: STEALTH.bg
                }}
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
