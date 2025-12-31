/**
 * CardCreationSuccess - Success state after card creation
 * Shows celebration, WOW moment, and conversion-focused CTAs
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, ExternalLink, Smartphone, ShoppingBag, 
  Share2, QrCode, Scan, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { NFCValueProposition } from "./NFCValueProposition";
import { NFCEducation } from "./NFCEducation";
import { QRCodeSVG } from "qrcode.react";

interface CardCreationSuccessProps {
  cardSlug: string;
  cardName: string;
}

export function CardCreationSuccess({ cardSlug, cardName }: CardCreationSuccessProps) {
  const cardUrl = `${window.location.origin}/c/${cardSlug}`;
  const [showTestModal, setShowTestModal] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    toast.success("Lien copié !");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 py-8">
      {/* Success animation */}
      <div className="relative mb-6 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping" />
      </div>

      {/* Success message */}
      <div className="text-center mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Votre carte est prête !
        </h1>
        <p className="text-muted-foreground">
          {cardName}, votre carte NFC digitale est maintenant active
        </p>
      </div>

      {/* WOW Moment - Test your card */}
      <Card 
        className="w-full max-w-md p-5 mb-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 animate-fade-up"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Scan className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Testez votre carte maintenant</p>
            <p className="text-sm text-muted-foreground">Scannez le QR avec un autre téléphone</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowTestModal(true)}
          variant="outline"
          className="w-full h-11 gap-2 border-primary/30 hover:bg-primary/10"
        >
          <QrCode size={18} />
          Afficher le QR code
        </Button>
      </Card>

      {/* Card preview link */}
      <Card 
        className="w-full max-w-md p-4 mb-4 animate-fade-up"
        style={{ animationDelay: '0.35s' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Votre page publique</p>
            <p className="text-xs text-muted-foreground truncate">{cardUrl}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
            <Share2 size={14} />
          </Button>
        </div>
      </Card>

      {/* NFC Education */}
      <div className="w-full max-w-md mb-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <NFCEducation />
      </div>

      {/* Physical Card Value Proposition */}
      <div className="w-full max-w-md mb-6 animate-fade-up" style={{ animationDelay: '0.45s' }}>
        <NFCValueProposition />
      </div>

      {/* Main CTA - Order Physical Card */}
      <div className="w-full max-w-md space-y-3 animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <Link to="/checkout" className="block">
          <Button className="w-full h-14 gap-2 text-base font-semibold shadow-lg">
            <ShoppingBag size={20} />
            Commander ma carte NFC
          </Button>
        </Link>

        <Link to="/dashboard" className="block">
          <Button variant="ghost" className="w-full h-11 text-muted-foreground">
            Je ferai ça plus tard
          </Button>
        </Link>
      </div>

      {/* Test QR Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowTestModal(false)}
            className="absolute top-4 right-4"
          >
            <X size={24} />
          </Button>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-foreground mb-2">Scannez avec un autre téléphone</h2>
            <p className="text-muted-foreground text-sm">
              Ouvrez l'appareil photo et pointez vers le QR code
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
            <QRCodeSVG 
              value={cardUrl} 
              size={220}
              level="H"
              includeMargin
            />
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-xs">
            La personne qui scanne verra votre carte de visite numérique
          </p>

          <Link to={`/c/${cardSlug}`} className="mt-8">
            <Button variant="outline" className="gap-2">
              <ExternalLink size={16} />
              Voir ma carte
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
