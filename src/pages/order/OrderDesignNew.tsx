/**
 * Step 3: Design Configuration
 * /order/design
 * 
 * - Upload logo client
 * - Choix couleur carte (3 palettes verrouillées)
 * - Aperçu carte physique en temps réel
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  Palette,
  Image,
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

// i-wasp logo
import iwaspLogo from "@/assets/iwasp-logo-white.png";

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
  const [logoBlendMode, setLogoBlendMode] = useState<"normal" | "multiply" | "screen">("normal");

  const selectedPalette = COLOR_PALETTES.find(p => p.color === selectedColor) || COLOR_PALETTES[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-logo.${fileExt}`;
      const filePath = `order-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("card-assets")
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast.success("Logo téléchargé avec succès");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContinue = () => {
    setDesignConfig({
      logoUrl,
      cardColor: selectedColor,
    });
    nextStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                {step > 1 && <div className={`w-8 h-1 rounded-full ${step <= 3 ? "bg-primary" : "bg-muted"}`} />}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step < 3 ? "bg-primary/20 text-primary" : 
                  step === 3 ? "bg-primary text-primary-foreground" : 
                  "bg-muted text-muted-foreground"
                }`}>
                  {step < 3 ? <Check size={16} /> : step}
                </span>
              </div>
            ))}
          </div>

          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Personnalisez votre carte
            </h1>
            <p className="text-muted-foreground text-lg">
              Ajoutez votre logo et choisissez la couleur
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Live Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-2 lg:order-1"
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-center">Aperçu en temps réel</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Card Preview */}
                  <div
                    className="relative aspect-[1.6/1] rounded-2xl shadow-2xl overflow-hidden mx-auto max-w-md transition-all duration-500"
                    style={{ 
                      backgroundColor: selectedColor,
                      boxShadow: `0 25px 50px -12px ${selectedColor}40`
                    }}
                  >
                    {/* i-wasp logo - fixed top right */}
                    <div className="absolute top-4 right-4 w-16 h-8 flex items-center justify-end">
                      <img
                        src={iwaspLogo}
                        alt="i-wasp"
                        className="h-5 object-contain"
                        style={{ 
                          filter: selectedColor === "#FFFFFF" ? "invert(1)" : "none",
                          opacity: 0.8
                        }}
                      />
                    </div>

                    {/* Client logo - center */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Votre logo"
                          className="max-w-[60%] max-h-[50%] object-contain transition-all duration-300"
                          style={{ 
                            mixBlendMode: logoBlendMode,
                            opacity: logoBlendMode === "normal" ? 1 : 0.9
                          }}
                        />
                      ) : (
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
                            Votre logo ici
                          </p>
                        </div>
                      )}
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
                    accept="image/*"
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

                      {/* Blend mode options */}
                      <div>
                        <Label className="text-sm mb-2 block">Mode d'affichage</Label>
                        <div className="flex gap-2">
                          {[
                            { id: "normal", label: "Normal" },
                            { id: "multiply", label: "Fondu" },
                            { id: "screen", label: "Lumineux" },
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              onClick={() => setLogoBlendMode(mode.id as "normal" | "multiply" | "screen")}
                              className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                logoBlendMode === mode.id
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        Changer le logo
                      </Button>
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
                          <p className="text-xs text-muted-foreground">PNG, JPG, SVG (max 5 Mo)</p>
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
                        onClick={() => setSelectedColor(palette.color)}
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
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10">
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ArrowLeft size={18} />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              className="px-8 h-14 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500"
            >
              Continuer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderDesignNew() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderDesignContent />
    </OrderFunnelGuard>
  );
}
