/**
 * OrderPreviewFinal - Page de prévisualisation finale premium
 * /order/preview
 * 
 * Affiche un mockup iPhone réaliste avec le profil dynamique
 * + Récapitulatif des informations + Confirmation avant paiement
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Star,
  Instagram,
  Edit2,
  Sparkles,
  CheckCircle2,
  Loader2
} from "lucide-react";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

function OrderPreviewFinalContent() {
  const navigate = useNavigate();
  const { state, prevStep, goToStep, markComplete } = useOrderFunnel();
  const [isLoading, setIsLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  // Simulate loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleProceedToPayment = () => {
    if (confirmed) {
      markComplete();
      navigate("/order/payment");
    }
  };

  const selectedPalette = state.designConfig?.cardColor || "#1A1A1A";
  const isLightColor = selectedPalette === "#FFFFFF";

  const colorName = {
    "#1A1A1A": "Noir Élégant",
    "#FFFFFF": "Blanc Minimal",
    "#0F172A": "Bleu Nuit"
  }[selectedPalette] || "Personnalisé";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-12 w-12 text-amber-400 mx-auto" />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Génération de votre aperçu...
            </h2>
            <p className="text-white/60 text-sm">
              Préparation de votre carte NFC personnalisée
            </p>
          </div>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] via-[#111113] to-[#0A0A0B]">
      <Navbar />
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Aperçu Final
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Votre carte NFC est prête
            </h1>
            <p className="text-white/60">
              Vérifiez les détails avant de valider votre commande
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: iPhone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* iPhone Frame */}
                <div className="relative w-[300px] bg-[#1C1C1E] border-[10px] border-[#2C2C2E] rounded-[3rem] shadow-2xl overflow-hidden">
                  {/* Dynamic Island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10" />
                  
                  {/* Screen */}
                  <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] min-h-[580px] pt-14 pb-6 px-5">
                    {/* IWASP Header */}
                    <div className="flex justify-between items-center mb-8">
                      <img 
                        src={iwaspLogo} 
                        alt="IWASP" 
                        className="h-4 opacity-70"
                      />
                      <span className="text-[10px] text-white/40">NFC CARD</span>
                    </div>

                    {/* Profile Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center mb-8"
                    >
                      {/* Profile Photo */}
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center border-2 border-amber-400/30">
                        <span className="text-3xl font-bold text-white/80">
                          {state.personalInfo?.firstName?.charAt(0)}
                          {state.personalInfo?.lastName?.charAt(0)}
                        </span>
                      </div>

                      {/* Name */}
                      <h2 className="text-xl font-semibold text-white mb-1">
                        {state.personalInfo?.firstName} {state.personalInfo?.lastName}
                      </h2>
                      
                      {/* Title & Company */}
                      {(state.personalInfo?.title || state.personalInfo?.company) && (
                        <p className="text-sm text-white/60">
                          {state.personalInfo?.title}
                          {state.personalInfo?.title && state.personalInfo?.company && " · "}
                          {state.personalInfo?.company}
                        </p>
                      )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3"
                    >
                      {state.personalInfo?.phone && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-green-400" />
                          </div>
                          <span className="text-sm text-white">Appeler</span>
                        </div>
                      )}
                      
                      {state.digitalInfo?.whatsapp && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span className="text-sm text-white">WhatsApp</span>
                        </div>
                      )}
                      
                      {state.personalInfo?.email && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Mail className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-sm text-white">Email</span>
                        </div>
                      )}
                      
                      {state.digitalInfo?.address && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-red-400" />
                          </div>
                          <span className="text-sm text-white">Localisation</span>
                        </div>
                      )}
                      
                      {state.digitalInfo?.instagram && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                            <Instagram className="h-4 w-4 text-pink-400" />
                          </div>
                          <span className="text-sm text-white">Instagram</span>
                        </div>
                      )}
                      
                      {state.digitalInfo?.googleReviews && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-400" />
                          </div>
                          <span className="text-sm text-white">Avis Google</span>
                        </div>
                      )}
                      
                      {state.digitalInfo?.website && (
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Globe className="h-4 w-4 text-purple-400" />
                          </div>
                          <span className="text-sm text-white">Site web</span>
                        </div>
                      )}
                    </motion.div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                      <p className="text-[10px] text-white/30">
                        Powered by IWASP
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone shadow */}
                <div className="absolute -bottom-4 left-8 right-8 h-16 bg-black/50 blur-2xl rounded-full" />
                
                {/* Live indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Aperçu en direct
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Summary & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="pt-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Récapitulatif</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => goToStep(2)}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Info list */}
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Nom complet</span>
                      <span className="text-white font-medium">
                        {state.personalInfo?.firstName} {state.personalInfo?.lastName}
                      </span>
                    </div>
                    
                    {state.personalInfo?.company && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Entreprise</span>
                        <span className="text-white">{state.personalInfo.company}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-white/60">Téléphone</span>
                      <span className="text-white">{state.personalInfo?.phone}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-white/60">Email</span>
                      <span className="text-white truncate max-w-[200px]">{state.personalInfo?.email}</span>
                    </div>
                    
                    {state.digitalInfo?.address && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Localisation</span>
                        <span className="text-white truncate max-w-[200px]">{state.digitalInfo.address}</span>
                      </div>
                    )}

                    <Separator className="bg-white/10" />
                    
                    <div className="flex justify-between">
                      <span className="text-white/60">Couleur carte</span>
                      <span className="text-white flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: selectedPalette }}
                        />
                        {colorName}
                      </span>
                    </div>
                    
                    {state.designConfig?.logoUrl && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Logo</span>
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Téléchargé
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-white/60">Quantité</span>
                      <span className="text-white">
                        {state.orderOptions?.quantity} carte{(state.orderOptions?.quantity || 0) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Confirmation checkbox */}
              <Card className="bg-amber-500/10 border-amber-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="confirm"
                      checked={confirmed}
                      onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                      className="mt-0.5 border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <label 
                      htmlFor="confirm" 
                      className="text-sm text-white/80 cursor-pointer leading-relaxed"
                    >
                      Je confirme que les informations sont correctes pour l'impression et l'encodage de ma carte NFC.
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button with glow effect */}
              <motion.div
                whileHover={{ scale: confirmed ? 1.02 : 1 }}
                whileTap={{ scale: confirmed ? 0.98 : 1 }}
              >
                <Button
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={!confirmed}
                  className={`
                    w-full h-16 text-lg font-semibold rounded-2xl relative overflow-hidden
                    ${confirmed 
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_40px_rgba(245,158,11,0.4)]" 
                      : "bg-white/10 text-white/40"
                    }
                    transition-all duration-300
                  `}
                >
                  {confirmed && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    COMMANDER MA CARTE
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Paiement sécurisé
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Livraison gratuite
                </span>
              </div>

              {/* Back button */}
              <Button 
                variant="ghost" 
                onClick={prevStep}
                className="w-full text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Modifier mes informations
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderPreviewFinal() {
  return (
    <OrderFunnelGuard step={6}>
      <OrderPreviewFinalContent />
    </OrderFunnelGuard>
  );
}
