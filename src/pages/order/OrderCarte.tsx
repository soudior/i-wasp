/**
 * Step 3: Personnalisation carte physique
 * /order/carte
 * 
 * Official i-Wasp Card Design Editor with fixed branding
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
import { 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Sparkles,
  Eye,
  FlipHorizontal,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Import official i-Wasp logo for back preview
import iwaspLogo from "@/assets/iwasp-logo.png";

function OrderCarteContent() {
  const { state, setCardPersonalization, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showBack, setShowBack] = useState(false);
  
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
      className="relative rounded-xl overflow-hidden shadow-2xl"
      style={{
        aspectRatio: 85.6 / 54,
        backgroundColor: "#FFFFFF",
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
        <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 border-none">
          NFC activé
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
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
                className="text-sm text-primary tracking-widest uppercase mb-3"
                variants={itemVariants}
              >
                Étape 3 sur 6
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-2"
                variants={itemVariants}
              >
                Personnalisez votre carte
              </motion.h1>
              <motion.p 
                className="text-muted-foreground max-w-md mx-auto"
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
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Éditeur de carte</p>
                    <p className="text-xs text-muted-foreground">
                      Glissez pour positionner votre logo
                    </p>
                  </div>
                </div>

                <CardDesignEditor
                  value={cardDesign}
                  onChange={setCardDesign}
                />
              </motion.div>

              {/* Right: Preview & Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Preview Section */}
                <div className="bg-secondary/30 rounded-2xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                      {showBack ? "Verso" : "Recto"} • Aperçu fidèle
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBack(!showBack)}
                      className="h-8 gap-1 text-xs"
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
                            className="relative rounded-xl overflow-hidden shadow-2xl"
                            style={{
                              aspectRatio: 85.6 / 54,
                              backgroundColor: "#FFFFFF",
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
                                <p className="text-gray-400 text-sm">
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
                    <Badge variant="secondary" className="text-[10px]">
                      <Lock className="w-2.5 h-2.5 mr-1" />
                      i-Wasp protégé
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Format carte de crédit
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      PVC premium
                    </Badge>
                  </div>

                  {/* Zoom preview */}
                  {cardDesign.logoUrl && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                          <Eye className="w-4 h-4" />
                          Aperçu grande taille
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl p-6">
                        <div
                          className="relative rounded-xl overflow-hidden shadow-2xl"
                          style={{
                            aspectRatio: 85.6 / 54,
                            backgroundColor: "#FFFFFF",
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
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Voici exactement la carte que vous recevrez
                        </p>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Validation message */}
                {!canContinue && (
                  <div className="text-center text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
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
