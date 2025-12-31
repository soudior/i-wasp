/**
 * CardCreationSuccess - Success state after card creation
 * Shows celebration and next steps
 */

import { Link } from "react-router-dom";
import { CheckCircle2, ExternalLink, Smartphone, ShoppingBag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface CardCreationSuccessProps {
  cardSlug: string;
  cardName: string;
}

export function CardCreationSuccess({ cardSlug, cardName }: CardCreationSuccessProps) {
  const cardUrl = `${window.location.origin}/c/${cardSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    toast.success("Lien copié !");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Success animation */}
      <div className="relative mb-6 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping" />
      </div>

      {/* Success message */}
      <div className="text-center mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Votre carte est prête !
        </h1>
        <p className="text-muted-foreground">
          {cardName}, votre carte NFC digitale est maintenant active
        </p>
      </div>

      {/* Card preview link */}
      <Card 
        className="w-full max-w-md p-5 mb-6 animate-fade-up"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ExternalLink className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-0.5">Votre page publique</p>
            <p className="text-xs text-muted-foreground truncate">{cardUrl}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Share2 size={14} />
          </Button>
        </div>
      </Card>

      {/* Next actions */}
      <div className="w-full max-w-md space-y-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <Link to={`/c/${cardSlug}`} className="block">
          <Button variant="outline" className="w-full h-12 gap-2">
            <ExternalLink size={18} />
            Voir ma carte
          </Button>
        </Link>

        <Link to="/checkout" className="block">
          <Button className="w-full h-12 gap-2">
            <ShoppingBag size={18} />
            Commander ma carte NFC physique
          </Button>
        </Link>

        <Link to="/dashboard" className="block">
          <Button variant="ghost" className="w-full text-muted-foreground">
            Aller au tableau de bord
          </Button>
        </Link>
      </div>

      {/* Tips */}
      <div className="mt-10 w-full max-w-md animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <p className="text-xs text-muted-foreground text-center mb-4">Prochaines étapes recommandées</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <Smartphone size={20} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Programmer votre tag NFC</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <ShoppingBag size={20} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Commander carte physique</p>
          </div>
        </div>
      </div>
    </div>
  );
}
