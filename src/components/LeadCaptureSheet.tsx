import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Building2, Check, X } from "lucide-react";
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

  const handleShare = async () => {
    // At least one field should be filled
    if (!formData.name && !formData.email && !formData.phone) {
      onComplete(false);
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
        notes: "Source: NFC/Card scan",
      });

      if (error) throw error;
      
      toast.success("Coordonnées partagées !");
      onComplete(true);
    } catch (error) {
      console.error("Error saving lead:", error);
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 rounded-t-3xl shadow-2xl">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              
              {/* Header */}
              <div className="px-6 pb-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User size={28} className="text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Souhaitez-vous partager vos coordonnées ?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Avec <span className="font-medium text-foreground">{cardOwnerName}</span>
                </p>
              </div>
              
              {/* Form */}
              <div className="px-6 pb-4 space-y-3">
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="Votre nom (optionnel)"
                    className="pl-10 h-12 bg-muted/30 border-0 rounded-xl"
                  />
                </div>
                
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    placeholder="Votre email (optionnel)"
                    className="pl-10 h-12 bg-muted/30 border-0 rounded-xl"
                  />
                </div>
                
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    placeholder="Votre téléphone (optionnel)"
                    className="pl-10 h-12 bg-muted/30 border-0 rounded-xl"
                  />
                </div>
                
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={formData.company}
                    onChange={handleChange("company")}
                    placeholder="Votre société (optionnel)"
                    className="pl-10 h-12 bg-muted/30 border-0 rounded-xl"
                  />
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-8 space-y-3">
                <Button
                  onClick={handleShare}
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check size={18} />
                      Partager & ajouter le contact
                    </span>
                  )}
                </Button>
                
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <X size={18} />
                    Ajouter sans partager
                  </span>
                </Button>
                
                <p className="text-xs text-muted-foreground text-center pt-2">
                  En partageant, vous acceptez d'être contacté par le propriétaire de cette carte.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
