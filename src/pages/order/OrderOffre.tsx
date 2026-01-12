/**
 * Step 1: Choix de l'offre
 * /order/offre
 * 
 * Design IWASP Deep Black & Soft Gold Luxury
 * Affiche clairement les différences entre offres pour aider l'utilisateur
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OfferType, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { 
  Check, ArrowRight, ArrowLeft, Star, Sparkles, Crown, 
  BarChart3, Users, RefreshCw, Headphones, Palette, Link2, 
  Image
} from "lucide-react";

interface OfferFeature {
  label: string;
  included: boolean;
  icon: React.ElementType;
  highlight?: boolean;
}

interface OfferDetail {
  id: OfferType;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  priceMAD: number;
  description: string;
  idealFor: string;
  features: OfferFeature[];
  limitations?: string[];
  highlights?: string[];
  isPopular?: boolean;
}

// Détails complets des offres avec textes optimisés
const offerDetails: OfferDetail[] = [
  {
    id: "essentiel",
    icon: Star,
    title: "Essentiel",
    subtitle: "Votre identité numérique de base",
    priceMAD: 277,
    description: "Parfait pour commencer avec le networking digital.",
    idealFor: "Idéal pour commencer",
    features: [
      { label: "Carte NFC standard", included: true, icon: Star },
      { label: "Profil numérique complet", included: true, icon: Link2 },
      { label: "Jusqu'à 3 liens", included: true, icon: Link2 },
      { label: "Accès à votre tableau de bord i‑wasp", included: true, icon: Check },
    ],
    limitations: [
      "Mises à jour limitées",
      "Design basique",
      "Pas de statistiques",
      "Pas de capture de contacts",
    ],
  },
  {
    id: "signature",
    icon: Sparkles,
    title: "Signature",
    subtitle: "L'expérience complète",
    priceMAD: 555,
    isPopular: true,
    description: "Pour les professionnels qui veulent maximiser leur impact.",
    idealFor: "Populaire",
    features: [
      { label: "Carte NFC premium", included: true, icon: Sparkles },
      { label: "Liens illimités (réseaux, WhatsApp, site, catalogue…)", included: true, icon: Link2 },
      { label: "Galerie photo/vidéo", included: true, icon: Image },
      { label: "Collecte de leads incluse", included: true, highlight: true, icon: Users },
      { label: "Statistiques de vos taps", included: true, highlight: true, icon: BarChart3 },
    ],
    highlights: [
      "Voyez qui consulte votre profil",
      "Exportez vos contacts en un clic",
      "Mises à jour en temps réel",
    ],
  },
  {
    id: "elite",
    icon: Crown,
    title: "Élite",
    subtitle: "Service sur-mesure",
    priceMAD: 925,
    description: "Accompagnement personnalisé pour votre équipe ou marque.",
    idealFor: "Sur devis possible pour entreprises",
    features: [
      { label: "Toute l'offre Signature", included: true, icon: Check },
      { label: "Design personnalisé de carte (avec votre équipe)", included: true, icon: Palette },
      { label: "Mise en place de scénarios de relance (email/WhatsApp)", included: true, icon: RefreshCw },
      { label: "Accompagnement personnalisé", included: true, icon: Headphones },
    ],
    highlights: [
      "Branding entreprise unifié",
      "Gestion centralisée",
      "Interlocuteur dédié",
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
    <div className="min-h-screen bg-deep-black">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-deep-black/90 border-b border-anthracite-light">
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 transition-colors text-soft-gray hover:text-off-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Accueil</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-soft-gold">
              <span className="font-bold text-sm text-deep-black">iW</span>
            </div>
            <span className="font-semibold text-off-white">Offres</span>
          </div>
          
          <div className="w-20" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="step-bar">
        <div className="step-bar-fill" style={{ width: '25%' }} />
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 py-10 max-w-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest mb-2 text-soft-gold">
              Étape 1 sur 5 – Choisissez votre expérience
            </p>
            <h1 className="text-display text-off-white mb-2">
              Choisissez votre expérience
            </h1>
            <p className="text-soft-gray">
              La carte NFC est incluse dans toutes les offres
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
                  className={`card-offer ${isSelected ? 'card-offer-selected' : ''}`}
                >
                  {/* Popular Badge */}
                  {offer.isPopular && (
                    <div className="badge-popular">
                      Populaire
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-soft-gold' : 'bg-anthracite-light'
                      }`}
                    >
                      <Icon 
                        className={`w-5 h-5 ${isSelected ? 'text-deep-black' : 'text-soft-gray'}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="text-base font-semibold text-off-white">
                            {offer.title}
                          </h3>
                          <p className="text-xs text-soft-gray">
                            {offer.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${isSelected ? 'text-soft-gold' : 'text-off-white'}`}>
                            {formatAmount(offer.priceMAD)}
                          </span>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-soft-gold">
                              <Check className="w-4 h-4 text-deep-black" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features preview */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {offer.features.slice(0, 3).map((feature, i) => {
                          const isHighlight = feature.highlight === true;
                          return (
                            <span 
                              key={i} 
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                isHighlight 
                                  ? 'font-medium bg-soft-gold/20 text-soft-gold' 
                                  : 'bg-anthracite-light text-soft-gray'
                              }`}
                            >
                              {feature.label}
                            </span>
                          );
                        })}
                        {offer.features.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-anthracite-light text-soft-gray">
                            +{offer.features.length - 3}
                          </span>
                        )}
                      </div>
                      
                      {/* Ideal for hint + limitations - shown when selected */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-anthracite-light"
                          >
                            <p className="text-[11px] mb-2 text-soft-gold">
                              💡 {offer.idealFor}
                            </p>
                            
                            {/* Subtle limitations for Essentiel */}
                            {offer.limitations && offer.limitations.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {offer.limitations.map((limitation, i) => (
                                  <span 
                                    key={i}
                                    className="text-[9px] px-2 py-0.5 rounded-full bg-muted-gray/15 text-muted-gray"
                                  >
                                    {limitation}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Highlights for Signature/Elite */}
                            {offer.highlights && offer.highlights.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {offer.highlights.map((highlight, i) => (
                                  <span 
                                    key={i}
                                    className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-soft-gold/15 text-soft-gold"
                                  >
                                    ✓ {highlight}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* CTA Desktop */}
          <div className="hidden md:flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!state.selectedOffer || state.isTransitioning || isNavigating}
              className="btn-premium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isNavigating ? "Chargement..." : "Continuer"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Note */}
          <p className="text-center text-[10px] mt-6 text-muted-gray">
            Livraison gratuite au Maroc · Paiement à la livraison
          </p>
        </motion.div>
      </main>

      {/* Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg md:hidden z-40 safe-area-bottom bg-deep-black/90 border-t border-anthracite-light">
        <button
          onClick={handleContinue}
          disabled={!state.selectedOffer || state.isTransitioning || isNavigating}
          className="btn-premium w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isNavigating ? "Chargement..." : state.selectedOffer ? "Continuer" : "Sélectionnez une offre"}
          <ArrowRight className="w-5 h-5" />
        </button>
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
