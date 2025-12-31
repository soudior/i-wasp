/**
 * IWASP Lead Capture Sheet
 * Apple-level premium consent flow
 * RGPD compliant - Explicit consent with checkbox
 * Zero friction, mobile-first
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Check, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { leadCaptureSchema, validateForm, sanitizePhone } from "@/lib/validation";

interface LeadCaptureSheetProps {
  open: boolean;
  onClose: () => void;
  onComplete: (shared: boolean) => void;
  cardOwnerName: string;
  cardOwnerPhoto?: string | null;
  cardOwnerCompany?: string;
  cardId: string;
}

// Calculate lead score
function calculateLeadScore(data: { name?: string; email?: string; phone?: string; company?: string; message?: string }): number {
  let score = 0;
  if (data.email) score += 10;
  if (data.phone) score += 15;
  if (data.message) score += 10;
  if (data.company) score += 5;
  if (data.name) score += 5;
  return score;
}

// Detect device type
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  return "Other";
}

export function LeadCaptureSheet({ 
  open, 
  onClose, 
  onComplete, 
  cardOwnerName,
  cardOwnerPhoto,
  cardOwnerCompany,
  cardId 
}: LeadCaptureSheetProps) {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = async () => {
    if (!consentGiven) {
      toast.error("Veuillez accepter le traitement de vos données");
      return;
    }
    
    // Validate with zod schema
    const validation = validateForm(leadCaptureSchema, formData);
    
    if (validation.success === false) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      if (firstError) toast.error(String(firstError));
      return;
    }
    
    // Clear errors on successful validation
    setFieldErrors({});
    const sanitizedData = validation.data;

    setIsSubmitting(true);
    try {
      const leadScore = calculateLeadScore({ 
        name: sanitizedData.firstname, 
        email: sanitizedData.email, 
        phone: sanitizedData.phone 
      });
      const deviceType = getDeviceType();
      
      const { error } = await supabase.from("leads").insert({
        card_id: cardId,
        name: sanitizedData.firstname || null,
        email: sanitizedData.email || null,
        phone: sanitizedData.phone ? sanitizePhone(sanitizedData.phone) : null,
        company: null,
        message: null,
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
        source: "nfc",
        device_type: deviceType,
        lead_score: leadScore,
        status: "new",
      });

      if (error) throw error;
      
      toast.success("Merci, vos coordonnées ont été partagées.");
      onComplete(true);
      resetForm();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Erreur lors du partage");
      onComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    resetForm();
    onComplete(false);
  };

  const resetForm = () => {
    setFormData({ firstname: "", email: "", phone: "" });
    setFieldErrors({});
    setConsentGiven(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isFormValid = consentGiven && formData.firstname.trim();

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
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-background border-t border-border/30 rounded-t-[28px] shadow-2xl">
              {/* Handle - Subtle */}
              <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-background rounded-t-[28px]">
                <div className="w-9 h-1 rounded-full bg-foreground/15" />
              </div>
              
              <div className="px-6 pb-10">
                {/* Header with card owner info */}
                <div className="text-center mb-6 mt-2">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center ring-2 ring-foreground/10">
                      {cardOwnerPhoto ? (
                        <img src={cardOwnerPhoto} alt={cardOwnerName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-foreground/60">
                          {cardOwnerName.split(" ").map(n => n[0]).join("")}
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{cardOwnerName}</p>
                      {cardOwnerCompany && (
                        <p className="text-sm text-muted-foreground">{cardOwnerCompany}</p>
                      )}
                    </div>
                  </div>
                  
                  <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
                    Partager mes coordonnées
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vos informations seront partagées avec {cardOwnerName.split(" ")[0]}
                  </p>
                </div>
                
                {/* Form - Premium inputs - Minimal as requested */}
                <div className="space-y-3 mb-5">
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      value={formData.firstname}
                      onChange={handleChange("firstname")}
                      placeholder="Prénom *"
                      className="pl-12 h-14 bg-foreground/5 border-0 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
                      autoFocus
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      placeholder="Email (optionnel)"
                      className="pl-12 h-14 bg-foreground/5 border-0 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      placeholder="Téléphone (optionnel)"
                      className="pl-12 h-14 bg-foreground/5 border-0 rounded-2xl text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
                    />
                  </div>
                </div>
                
                {/* RGPD Consent Checkbox - Required */}
                <div className="flex items-start gap-3 p-4 bg-foreground/5 rounded-2xl mb-5">
                  <Checkbox 
                    id="consent" 
                    checked={consentGiven}
                    onCheckedChange={(checked) => setConsentGiven(checked === true)}
                    className="mt-0.5 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    J'accepte que mes informations soient utilisées à des fins de contact professionnel.
                  </label>
                </div>
                
                {/* Submit */}
                <div className="space-y-3">
                  <Button
                    onClick={handleShare}
                    disabled={isSubmitting || !isFormValid}
                    className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                        Envoi...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Check size={18} />
                        Partager mes coordonnées
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="w-full h-10 rounded-xl text-sm text-muted-foreground hover:text-foreground"
                  >
                    Annuler
                  </Button>
                </div>
                
                {/* RGPD Badge - Trust signal */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground/60">
                  <Shield size={12} />
                  <span>Conforme RGPD · Données sécurisées</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
