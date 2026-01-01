/**
 * StepComplete - Étape 5: Carte créée
 * 
 * Confirmation avec actions
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardFormData } from "../CardWizard";
import { 
  Check, 
  ExternalLink, 
  CreditCard, 
  Share2,
  Copy,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface StepCompleteProps {
  cardId: string | null;
  data: CardFormData;
}

export function StepComplete({ cardId, data }: StepCompleteProps) {
  const navigate = useNavigate();

  const handleCopyLink = () => {
    if (cardId) {
      // Generate a slug or use the ID
      const cardUrl = `${window.location.origin}/c/${cardId}`;
      navigator.clipboard.writeText(cardUrl);
      toast.success("Lien copié !");
    }
  };

  const handleOrderNFC = () => {
    if (cardId) {
      // Navigate to order flow with card linked
      navigate(`/order/type?cardId=${cardId}`);
    }
  };

  const handleViewCard = () => {
    if (cardId) {
      navigate(`/c/${cardId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="flex flex-col items-center text-center py-8"
      >
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6 shadow-lg shadow-accent/30">
          <Check size={40} className="text-accent-foreground" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Félicitations !</h2>
        <p className="text-muted-foreground max-w-sm">
          Votre carte digitale <span className="font-medium text-foreground">{data.firstName} {data.lastName}</span> est maintenant active.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-accent via-accent/50 to-accent" />
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {(data.photoUrl || data.logoUrl) && (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                  <img 
                    src={data.photoUrl || data.logoUrl || ""} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold">{data.firstName} {data.lastName}</p>
                {data.title && <p className="text-sm text-muted-foreground">{data.title}</p>}
                {data.company && <p className="text-xs text-muted-foreground">{data.company}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {/* Primary: Order NFC */}
        <Button
          onClick={handleOrderNFC}
          className="w-full h-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base gap-2"
        >
          <CreditCard size={20} />
          Commander une carte NFC
          <ArrowRight size={18} />
        </Button>

        {/* Secondary actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleViewCard}
            className="h-12 rounded-xl gap-2"
          >
            <ExternalLink size={16} />
            Voir la carte
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="h-12 rounded-xl gap-2"
          >
            <Copy size={16} />
            Copier le lien
          </Button>
        </div>

        {/* Go to dashboard */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="w-full h-12 text-muted-foreground"
        >
          Retour au tableau de bord
        </Button>
      </motion.div>

      {/* Premium footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-6 border-t border-border/30"
      >
        <p className="text-xs text-muted-foreground">
          Votre carte est désormais partageable et prête à impressionner.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-accent">IWASP</span> — Tap. Connect. Empower.
        </p>
      </motion.div>
    </div>
  );
}

export default StepComplete;