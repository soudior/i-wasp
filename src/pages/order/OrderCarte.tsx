/**
 * Step 3: Personnalisation carte physique
 * /order/carte
 * 
 * Choix Logo ou Photo + Aperçu temps réel
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard, CardPersonalization, CardVisualType } from "@/contexts/OrderFunnelContext";
import { useBrand, OFFICIAL_COLORS } from "@/contexts/BrandContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
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
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function OrderCarteContent() {
  const { state, setCardPersonalization, nextStep, prevStep } = useOrderFunnel();
  const { cardFront, cardBack } = useBrand();
  const [isNavigating, setIsNavigating] = useState(false);
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

  const handleSelectType = (type: CardVisualType) => {
    setVisualType(type);
    // Reset image when changing type
    if (type !== visualType) {
      setUploadedImage(null);
      setFileName("");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !visualType) return;

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
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setUploadedImage(objectUrl);
      setFileName(file.name);
      
      toast.success(visualType === "logo" 
        ? "Logo prêt pour l'impression" 
        : "Photo prête pour l'impression"
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!visualType || !uploadedImage || isNavigating || state.isTransitioning) return;
    
    setIsNavigating(true);
    
    const cardData: CardPersonalization = {
      visualType,
      imageUrl: uploadedImage,
      fileName,
    };
    
    setCardPersonalization(cardData);
    await nextStep();
  };

  const canContinue = visualType !== null && uploadedImage !== null;

  // Card Preview Component
  const CardPreview = () => (
    <div className="relative">
      <motion.div
        className="relative w-full max-w-sm mx-auto"
        animate={{ rotateY: showBack ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div 
          className="w-full aspect-[1.586] rounded-xl overflow-hidden shadow-2xl"
          style={{ 
            backgroundColor: OFFICIAL_COLORS.primary,
            backfaceVisibility: "hidden"
          }}
        >
          {cardFront ? (
            <img 
              src={cardFront} 
              alt="Carte recto"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
              {/* Logo i-Wasp placeholder */}
              <div 
                className="text-2xl font-display font-bold mb-4"
                style={{ color: OFFICIAL_COLORS.accent }}
              >
                i-Wasp
              </div>
              
              {/* User visual */}
              {uploadedImage && (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 mb-3"
                  style={{ borderColor: OFFICIAL_COLORS.accent }}
                >
                  <img 
                    src={uploadedImage} 
                    alt={visualType === "logo" ? "Logo" : "Photo"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* User name from identity */}
              {state.digitalIdentity && (
                <p className="text-white text-center font-medium">
                  {state.digitalIdentity.firstName} {state.digitalIdentity.lastName}
                </p>
              )}
              {state.digitalIdentity?.title && (
                <p className="text-white/70 text-sm text-center">
                  {state.digitalIdentity.title}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full aspect-[1.586] rounded-xl overflow-hidden shadow-2xl"
          style={{ 
            backgroundColor: OFFICIAL_COLORS.primary,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {cardBack ? (
            <img 
              src={cardBack} 
              alt="Carte verso"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="text-lg font-bold"
                  style={{ color: OFFICIAL_COLORS.accent }}
                >
                  NFC
                </div>
                <p className="text-white/50 text-xs mt-1">Tap to connect</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
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
                Votre carte de visite
              </motion.h1>
              <motion.p 
                className="text-muted-foreground"
                variants={itemVariants}
              >
                Choisissez le visuel principal de votre carte physique
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
                {/* Choice: Logo or Photo */}
                <div className="space-y-4">
                  <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Visuel principal (obligatoire)
                  </p>

                  {/* Logo Option */}
                  <button
                    onClick={() => handleSelectType("logo")}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      visualType === "logo"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        visualType === "logo" ? "bg-primary" : "bg-muted"
                      }`}>
                        <Image className={`w-6 h-6 ${
                          visualType === "logo" ? "text-black" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Utiliser mon LOGO</span>
                          {visualType === "logo" && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Idéal pour les professionnels et entreprises
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Photo Option */}
                  <button
                    onClick={() => handleSelectType("photo")}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      visualType === "photo"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        visualType === "photo" ? "bg-primary" : "bg-muted"
                      }`}>
                        <User className={`w-6 h-6 ${
                          visualType === "photo" ? "text-black" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Utiliser ma PHOTO</span>
                          {visualType === "photo" && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Parfait pour un contact personnel et mémorable
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Upload Section */}
                {visualType && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
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
                        className="w-full p-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors"
                      >
                        <div className="flex flex-col items-center gap-3">
                          {uploading ? (
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          )}
                          <div className="text-center">
                            <p className="font-medium">
                              {visualType === "logo" ? "Uploader votre logo" : "Uploader votre photo"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              PNG, JPG ou SVG (max 5MB)
                            </p>
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-background">
                            <img 
                              src={uploadedImage} 
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate">{fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {visualType === "logo" ? "Logo" : "Photo"} prêt pour impression
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
                      </div>
                    )}

                    {/* Info message */}
                    <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-primary">
                        {visualType === "logo" 
                          ? "Le logo sera imprimé tel quel sur votre carte physique"
                          : "Votre photo sera imprimée sur la carte physique"
                        }
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Lock notice */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Couleurs et design verrouillés selon la charte i-Wasp</span>
                </div>
              </motion.div>

              {/* Right: Card Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-secondary/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                        Aperçu fidèle 100%
                      </Badge>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <CardPreview />

                  {/* Controls */}
                  <div className="flex justify-center gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBack(!showBack)}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {showBack ? "Voir recto" : "Voir verso"}
                    </Button>

                    <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ZoomIn className="h-4 w-4" />
                          Plein écran
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-background border-border">
                        <div className="p-4">
                          <CardPreview />
                          <div className="flex justify-center gap-3 mt-6">
                            <Button
                              variant="outline"
                              onClick={() => setShowBack(!showBack)}
                              className="gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              {showBack ? "Voir recto" : "Voir verso"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Tech mention */}
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Carte imprimée en CR80, finition premium, impression Evolis
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between mt-10"
            >
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={state.isTransitioning || isNavigating}
                className="gap-2"
              >
                <ArrowLeft size={18} />
                Retour
              </Button>

              <LoadingButton
                size="lg"
                onClick={handleContinue}
                disabled={!canContinue || state.isTransitioning}
                isLoading={isNavigating}
                loadingText="Chargement..."
                className="px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
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

export default function OrderCarte() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderCarteContent />
    </OrderFunnelGuard>
  );
}
