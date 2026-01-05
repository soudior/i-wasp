/**
 * Step 1: Choix de l'offre
 * /order/offre
 * 
 * Design IWASP Cupertino
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderFunnel, OfferType, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Check, ArrowRight, ArrowLeft, Star, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const offerDetails = [
  {
    id: "essentiel" as OfferType,
    icon: Star,
    title: "Essentiel",
    subtitle: "L'essentiel pour démarrer",
    priceMAD: 299,
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
    priceMAD: 599,
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
    priceMAD: 999,
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
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header - Style IWASP */}
      <header className="sticky top-0 z-40 bg-[#F5F5F7]/95 backdrop-blur-lg border-b border-[#E5E5E5]">
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/order/type")}
            className="flex items-center gap-2 text-[#8E8E93] hover:text-[#1D1D1F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1D1D1F] flex items-center justify-center">
              <span className="text-white font-bold text-sm">iW</span>
            </div>
            <span className="text-[#1D1D1F] font-semibold">Offres</span>
          </div>
          
          <div className="w-20" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#E5E5E5]">
        <div className="h-full bg-[#007AFF] w-[25%] transition-all" />
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
            <p className="text-xs uppercase tracking-widest text-[#8E8E93] mb-2">
              Étape 1 sur 5
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] mb-2">
              Choisissez votre offre
            </h1>
            <p className="text-[#8E8E93] text-sm">
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
                  className={`relative w-full p-5 rounded-2xl text-left transition-all ${
                    isSelected 
                      ? "bg-white ring-2 ring-[#007AFF] shadow-lg" 
                      : "bg-white shadow-sm"
                  }`}
                >
                  {/* Popular Badge */}
                  {offer.isPopular && (
                    <div className="absolute -top-2 right-4 px-3 py-0.5 rounded-full text-[10px] font-semibold bg-[#007AFF] text-white">
                      Populaire
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-[#007AFF]" : "bg-[#F5F5F7]"
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#8E8E93]"}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="text-base font-semibold text-[#1D1D1F]">
                            {offer.title}
                          </h3>
                          <p className="text-xs text-[#8E8E93]">{offer.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${isSelected ? "text-[#007AFF]" : "text-[#1D1D1F]"}`}>
                            {formatAmount(offer.priceMAD)}
                          </span>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {offer.features.slice(0, 3).map((feature, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#8E8E93]"
                          >
                            {feature}
                          </span>
                        ))}
                        {offer.features.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#8E8E93]">
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
              className="bg-[#007AFF] text-white hover:bg-[#0066D6] font-semibold gap-2 px-10 py-6 text-base rounded-xl transition-all disabled:opacity-40 disabled:bg-[#8E8E93]"
            >
              {isNavigating ? "Chargement..." : "Continuer"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Note */}
          <p className="text-center text-[10px] text-[#8E8E93] mt-6">
            Livraison gratuite au Maroc · Paiement à la livraison
          </p>
        </motion.div>
      </main>

      {/* Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F5F5F7]/95 backdrop-blur-lg border-t border-[#E5E5E5] md:hidden z-40 safe-area-bottom">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!state.selectedOffer || state.isTransitioning || isNavigating}
          className="w-full bg-[#007AFF] text-white hover:bg-[#0066D6] font-semibold gap-2 py-6 text-base rounded-xl min-h-[56px] disabled:opacity-40 disabled:bg-[#8E8E93]"
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
