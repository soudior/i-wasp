/**
 * IWASP Lead Capture Sheet
 * Apple-level premium consent flow
 * RGPD compliant - Explicit consent
 * Zero friction, mobile-first
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Building2, Check, ArrowRight, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeadCaptureSheetProps {
  open: boolean;
  onClose: () => void;
  onComplete: (shared: boolean) => void;
  cardOwnerName: string;
  cardId: string;
}

export function LeadCaptureSheet({ 
  open, 
  onClose, 
  onComplete, 
  cardOwnerName,
  cardId 
}: LeadCaptureSheetProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"consent" | "form">("consent");

  const handleShare = async () => {
    if (!formData.name && !formData.email && !formData.phone) {
      toast.error("Veuillez remplir au moins un champ");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        card_id: cardId,
        name: formData.name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        company: formData.company || null,
        notes: `Source: NFC/Card scan | Device: ${navigator.userAgent.includes("iPhone") ? "iOS" : navigator.userAgent.includes("Android") ? "Android" : "Desktop"}`,
      });

      if (error) throw error;
      
      toast.success("Coordonnées partagées avec succès !");
      onComplete(true);
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Erreur lors du partage");
      onComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onComplete(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAcceptConsent = () => {
    setStep("form");
  };

  const resetAndClose = () => {
    setStep("consent");
    setFormData({ name: "", email: "", phone: "", company: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - Premium blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={handleSkip}
          />
          
          {/* Bottom Sheet - Luxury Apple-style */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 400 }}
            className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
          >
            <div className="bg-background border-t border-border/30 rounded-t-[28px] shadow-2xl">
              {/* Handle - Subtle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full bg-foreground/15" />
              </div>
              
              <AnimatePresence mode="wait">
                {step === "consent" ? (
                  <motion.div
                    key="consent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-10"
                  >
                    {/* Icon - Premium handshake/exchange vibe */}
                    <div className="flex justify-center mb-6 mt-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-foreground/10 flex items-center justify-center">
                          <User size={28} className="text-foreground/70" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Title - Clear, direct */}
                    <h2 className="font-display text-xl font-semibold text-foreground text-center mb-3 tracking-tight">
                      Échanger vos coordonnées ?
                    </h2>
                    
                    {/* Description - RGPD compliant */}
                    <p className="text-muted-foreground text-center text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                      Souhaitez-vous partager vos informations avec{" "}
                      <span className="font-medium text-foreground">{cardOwnerName}</span>{" "}
                      afin qu'il puisse vous recontacter ?
                    </p>
                    
                    {/* Actions - Large touch targets */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleAcceptConsent}
                        className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium text-base"
                      >
                        <span className="flex items-center gap-2">
                          Partager mes coordonnées
                          <ArrowRight size={18} />
                        </span>
                      </Button>
                      
                      <Button
                        onClick={handleSkip}
                        variant="ghost"
                        className="w-full h-12 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                      >
                        Continuer sans partager
                      </Button>
                    </div>
                    
                    {/* RGPD Badge - Subtle trust signal */}
                    <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground/60">
                      <Shield size={12} />
                      <span>Conforme RGPD · Vous gardez le contrôle</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-10"
                  >
                    {/* Header - Minimal */}
                    <div className="text-center mb-6 mt-2">
                      <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">
                        Vos coordonnées
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pour {cardOwnerName}
                      </p>
                    </div>
                    
                    {/* Form - Premium inputs */}
                    <div className="space-y-3 mb-6">
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                        <Input
                          value={formData.name}
                          onChange={handleChange("name")}
                          placeholder="Votre nom"
                          className="pl-12 h-14 bg-foreground/5 border-0 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
                          autoFocus
                        />
                      </div>
                      
                      <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={handleChange("email")}
                          placeholder="Votre email"
                          className="pl-12 h-14 bg-foreground/5 border-0 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
                        />
                      </div>
                      
                      <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange("phone")}
                          placeholder="Votre téléphone"
                          className="pl-12 h-14 bg-foreground/5 border-0 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
                        />
                      </div>
                      
                      <div className="relative">
                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                        <Input
                          value={formData.company}
                          onChange={handleChange("company")}
                          placeholder="Votre société (optionnel)"
                          className="pl-12 h-14 bg-foreground/5 border-0 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
                        />
                      </div>
                    </div>
                    
                    {/* Submit */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleShare}
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium text-base disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                            Envoi...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Check size={18} />
                            Confirmer le partage
                          </span>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => setStep("consent")}
                        variant="ghost"
                        className="w-full h-10 rounded-xl text-sm text-muted-foreground hover:text-foreground"
                      >
                        Retour
                      </Button>
                    </div>
                    
                    {/* Legal notice */}
                    <p className="text-[11px] text-muted-foreground/50 text-center mt-4 leading-relaxed">
                      Vos données seront uniquement utilisées pour être recontacté par {cardOwnerName}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
