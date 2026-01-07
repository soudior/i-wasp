/**
 * Step 1: Choix de l'offre
 * /order/offre
 * 
 * Design IWASP Stealth Luxury
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderFunnel, OfferType, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { STEALTH } from "@/lib/stealthPalette";
import { Check, ArrowRight, ArrowLeft, Star, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const offerDetails = [
  {
    id: "essentiel" as OfferType,
    icon: Star,
    title: "Essentiel",
    subtitle: "L'essentiel pour démarrer",
    priceMAD: 277, // ~27,69€
    features: [
      "Carte NFC blanche",
      "Profil digital essentiel",
      "Jusqu'à 3 liens",
      "QR Code intelligent",
    ],
  },
  {
    id: "signature" as OfferType,
    icon: Sparkles,
    title: "Signature",
    subtitle: "Le plus populaire",
    priceMAD: 555, // ~55,46€
    isPopular: true,
    features: [
      "Carte NFC Premium",
      "Liens illimités",
      "Galerie photo / vidéo",
      "Mise à jour illimitée",
      "Support prioritaire",
    ],
  },
  {
    id: "elite" as OfferType,
    icon: Crown,
    title: "Élite",
    subtitle: "L'excellence sur mesure",
    priceMAD: 925, // ~92,5€
    features: [
      "Carte NFC Elite",
      "Personnalisation avancée",
      "Gestion accompagnée",
      "Support dédié",
    ],
  },
];

function OrderOffreContent() {
  const navigate = useNavigate();
  const { state, setSelectedOffer, nextStep } = useOrderFunnel();
  const { formatAmount } = useCurrency();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSelectOffer = (offerId: OfferType) => {
    setSelectedOffer(offerId);
  };

  const handleContinue = async () => {
    if (!state.selectedOffer || isNavigating || state.isTransitioning) return;
    setIsNavigating(true);
    await nextStep();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-lg"
        style={{ 
          backgroundColor: `${STEALTH.bg}E6`,
          borderBottom: `1px solid ${STEALTH.border}`
        }}
      >
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/order/type")}
            className="flex items-center gap-2 transition-colors"
            style={{ color: STEALTH.textSecondary }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: STEALTH.accent }}
            >
              <span className="font-bold text-sm" style={{ color: STEALTH.bg }}>iW</span>
            </div>
            <span className="font-semibold" style={{ color: STEALTH.text }}>Offres</span>
          </div>
          
          <div className="w-20" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1" style={{ backgroundColor: STEALTH.border }}>
        <div 
          className="h-full w-[25%] transition-all" 
          style={{ background: STEALTH.gradientAccent }}
        />
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 py-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <p 
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: STEALTH.accent }}
            >
              Étape 1 sur 5
            </p>
            <h1 
              className="text-2xl font-bold tracking-tight mb-2"
              style={{ color: STEALTH.text }}
            >
              Choisissez votre offre
            </h1>
            <p style={{ color: STEALTH.textSecondary }}>
              La carte NFC est incluse
            </p>
          </div>

          {/* Offers List */}
          <div className="space-y-3 mb-8">
            {offerDetails.map((offer, index) => {
              const isSelected = state.selectedOffer === offer.id;
              const Icon = offer.icon;

              return (
                <motion.button
                  key={offer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectOffer(offer.id)}
                  disabled={state.isTransitioning}
                  className="relative w-full p-5 rounded-2xl text-left transition-all"
                  style={{
                    backgroundColor: STEALTH.bgCard,
                    border: `2px solid ${isSelected ? STEALTH.accent : STEALTH.border}`,
                    boxShadow: isSelected ? STEALTH.glow : 'none',
                  }}
                >
                  {/* Popular Badge */}
                  {offer.isPopular && (
                    <div 
                      className="absolute -top-2 right-4 px-3 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ 
                        background: STEALTH.gradientAccent, 
                        color: STEALTH.bg 
                      }}
                    >
                      Populaire
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: isSelected ? STEALTH.accent : STEALTH.accentMuted 
                      }}
                    >
                      <Icon 
                        className="w-5 h-5" 
                        style={{ color: isSelected ? STEALTH.bg : STEALTH.textSecondary }} 
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 
                            className="text-base font-semibold"
                            style={{ color: STEALTH.text }}
                          >
                            {offer.title}
                          </h3>
                          <p 
                            className="text-xs"
                            style={{ color: STEALTH.textSecondary }}
                          >
                            {offer.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-lg font-bold"
                            style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                          >
                            {formatAmount(offer.priceMAD)}
                          </span>
                          {isSelected && (
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: STEALTH.accent }}
                            >
                              <Check className="w-4 h-4" style={{ color: STEALTH.bg }} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {offer.features.slice(0, 3).map((feature, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: STEALTH.accentMuted, 
                              color: STEALTH.textSecondary 
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                        {offer.features.length > 3 && (
                          <span 
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: STEALTH.accentMuted, 
                              color: STEALTH.textSecondary 
                            }}
                          >
                            +{offer.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* CTA Desktop */}
          <div className="hidden md:flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!state.selectedOffer || state.isTransitioning || isNavigating}
              className="font-semibold gap-2 px-10 py-6 text-base rounded-full transition-all disabled:opacity-40"
              style={{ 
                backgroundColor: STEALTH.accent, 
                color: STEALTH.bg 
              }}
            >
              {isNavigating ? "Chargement..." : "Continuer"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Note */}
          <p 
            className="text-center text-[10px] mt-6"
            style={{ color: STEALTH.textMuted }}
          >
            Livraison gratuite au Maroc · Paiement à la livraison
          </p>
        </motion.div>
      </main>

      {/* Sticky CTA Mobile */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg md:hidden z-40 safe-area-bottom"
        style={{ 
          backgroundColor: `${STEALTH.bg}E6`,
          borderTop: `1px solid ${STEALTH.border}`
        }}
      >
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!state.selectedOffer || state.isTransitioning || isNavigating}
          className="w-full font-semibold gap-2 py-6 text-base rounded-full min-h-[56px] disabled:opacity-40"
          style={{ 
            backgroundColor: STEALTH.accent, 
            color: STEALTH.bg 
          }}
        >
          {isNavigating ? "Chargement..." : state.selectedOffer ? "Continuer" : "Sélectionnez une offre"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="h-24 md:hidden" />
    </div>
  );
}

export default function OrderOffre() {
  return (
    <OrderFunnelGuard step={1}>
      <OrderOffreContent />
    </OrderFunnelGuard>
  );
}
