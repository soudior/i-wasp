/**
 * Express Step 1: Choix de l'offre
 * /express/offre
 * 
 * Style: Apple/Cupertino - Minimal, airy, professional
 * Optimisé conversion: CTA visible, social proof, simplicité
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useExpressCheckout, ExpressOfferType, EXPRESS_OFFERS } from "@/contexts/ExpressCheckoutContext";
import { Check, ArrowRight, Shield, Truck, Star, Clock, Users } from "lucide-react";
import { APPLE } from "@/lib/applePalette";
import { useExpressCheckoutTracking } from "@/hooks/useAnalyticsEvents";

export default function ExpressOffre() {
  const navigate = useNavigate();
  const { state, setSelectedOffer } = useExpressCheckout();
  const [isNavigating, setIsNavigating] = useState(false);
  const { trackOfferSelect } = useExpressCheckoutTracking('offre');

  const handleSelectOffer = (offerId: ExpressOfferType) => {
    setSelectedOffer(offerId);
    const offer = EXPRESS_OFFERS.find(o => o.id === offerId);
    if (offer) {
      trackOfferSelect(offer.name, offer.price / 100);
    }
  };

  const handleContinue = async () => {
    if (!state.selectedOffer || isNavigating) return;
    setIsNavigating(true);
    navigate("/express/infos");
  };

  const selectedOffer = EXPRESS_OFFERS.find(o => o.id === state.selectedOffer);

  return (
    <div className="min-h-screen" style={{ backgroundColor: APPLE.background }}>
      {/* Header simple */}
      <header className="px-6 py-6">
        <div className="max-w-lg mx-auto flex items-center justify-center">
          <Link 
            to="/"
            className="text-xl font-semibold tracking-tight"
            style={{ color: APPLE.text }}
          >
            IWASP
          </Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6 mb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div 
              className="flex-1 h-1 rounded-full" 
              style={{ backgroundColor: APPLE.accent }} 
            />
            <div 
              className="flex-1 h-1 rounded-full" 
              style={{ backgroundColor: APPLE.border }} 
            />
            <div 
              className="flex-1 h-1 rounded-full" 
              style={{ backgroundColor: APPLE.border }} 
            />
          </div>
          <p 
            className="text-center mt-3 text-xs font-medium"
            style={{ color: APPLE.textMuted }}
          >
            Étape 1 sur 3
          </p>
        </div>
      </div>

      {/* Social proof */}
      <div className="px-6 mb-8">
        <div className="max-w-lg mx-auto">
          <motion.div 
            className="flex items-center justify-center gap-4 py-3 px-5 rounded-full"
            style={{ 
              backgroundColor: APPLE.accentSubtle,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: APPLE.accent }} />
              <span className="text-sm" style={{ color: APPLE.accent }}>
                <strong>23 personnes</strong> commandent
              </span>
            </div>
            <span style={{ color: APPLE.accent }}>•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: APPLE.accent }} />
              <span className="text-sm" style={{ color: APPLE.accent }}>
                Livraison <strong>48h</strong>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <main className="px-6 pb-44">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 
              className="text-2xl font-semibold tracking-tight mb-2"
              style={{ color: APPLE.text }}
            >
              Choisissez votre carte
            </h1>
            <p className="text-base" style={{ color: APPLE.textSecondary }}>
              Carte NFC + Profil digital inclus
            </p>
          </motion.div>

          {/* Offers */}
          <div className="space-y-3">
            {EXPRESS_OFFERS.map((offer, i) => {
              const isSelected = state.selectedOffer === offer.id;
              const isSignature = offer.id === "signature";
              
              return (
                <motion.button
                  key={offer.id}
                  onClick={() => handleSelectOffer(offer.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left p-5 transition-all duration-200 relative overflow-hidden"
                  style={{
                    backgroundColor: APPLE.card,
                    borderRadius: APPLE.radiusLg,
                    border: `2px solid ${isSelected ? APPLE.accent : APPLE.border}`,
                    boxShadow: isSelected ? `0 0 0 4px ${APPLE.accentSubtle}` : APPLE.shadowCard,
                  }}
                >
                  {/* Popular badge */}
                  {isSignature && (
                    <span 
                      className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full"
                      style={{ 
                        backgroundColor: APPLE.accent,
                        color: "#FFFFFF",
                      }}
                    >
                      Populaire
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Selection indicator */}
                      <div 
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{ 
                          borderColor: isSelected ? APPLE.accent : APPLE.border,
                          backgroundColor: isSelected ? APPLE.accent : 'transparent',
                        }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      
                      <div>
                        <h3 
                          className="text-lg font-semibold"
                          style={{ color: APPLE.text }}
                        >
                          {offer.name}
                        </h3>
                        <p className="text-sm mt-0.5" style={{ color: APPLE.textSecondary }}>
                          {offer.id === "essentiel" && "Carte NFC + 5 liens"}
                          {offer.id === "signature" && "Tout débloqué · CRM · Analytics"}
                          {offer.id === "alliance" && "Pack équipe · Admin centralisé"}
                        </p>
                      </div>
                    </div>
                    
                    <span 
                      className="text-xl font-semibold"
                      style={{ color: APPLE.text }}
                    >
                      {offer.priceDisplay}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Trust badges */}
          <motion.div 
            className="mt-10 grid grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <div 
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: APPLE.accentSubtle }}
              >
                <Shield className="w-5 h-5" style={{ color: APPLE.accent }} />
              </div>
              <p className="text-xs font-medium" style={{ color: APPLE.textSecondary }}>
                Paiement sécurisé
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: APPLE.accentSubtle }}
              >
                <Truck className="w-5 h-5" style={{ color: APPLE.accent }} />
              </div>
              <p className="text-xs font-medium" style={{ color: APPLE.textSecondary }}>
                Livraison 48h
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: APPLE.accentSubtle }}
              >
                <Star className="w-5 h-5" style={{ color: APPLE.accent }} />
              </div>
              <p className="text-xs font-medium" style={{ color: APPLE.textSecondary }}>
                4.9 · 500+ avis
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-5"
        style={{ 
          backgroundColor: APPLE.background,
          borderTop: `1px solid ${APPLE.border}`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={handleContinue}
            disabled={!state.selectedOffer || isNavigating}
            whileHover={{ scale: state.selectedOffer ? 1.02 : 1 }}
            whileTap={{ scale: state.selectedOffer ? 0.98 : 1 }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-200 disabled:opacity-50"
            style={{ 
              backgroundColor: state.selectedOffer ? APPLE.accent : APPLE.textMuted,
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            <span className="text-base">
              {isNavigating ? "Chargement..." : selectedOffer ? `Continuer — ${selectedOffer.priceDisplay}` : "Choisir une offre"}
            </span>
            {!isNavigating && state.selectedOffer && (
              <ArrowRight className="w-5 h-5" />
            )}
          </motion.button>
          
          {/* Reassurance */}
          <p 
            className="text-center mt-3 text-xs"
            style={{ color: APPLE.textMuted }}
          >
            Aucun engagement · Satisfait ou remboursé
          </p>
        </div>
      </div>
    </div>
  );
}
