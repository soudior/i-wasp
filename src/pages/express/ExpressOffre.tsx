/**
 * Express Step 1: Choix de l'offre
 * /express/offre
 * 
 * Optimisé conversion: CTA visible, social proof, urgence
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useExpressCheckout, ExpressOfferType, EXPRESS_OFFERS } from "@/contexts/ExpressCheckoutContext";
import { Check, ArrowRight, Shield, Truck, Star, Clock, Users } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { useExpressCheckoutTracking } from "@/hooks/useAnalyticsEvents";

export default function ExpressOffre() {
  const navigate = useNavigate();
  const { state, setSelectedOffer } = useExpressCheckout();
  const [isNavigating, setIsNavigating] = useState(false);
  const { trackOfferSelect } = useExpressCheckoutTracking('offre');

  const handleSelectOffer = (offerId: ExpressOfferType) => {
    setSelectedOffer(offerId);
    // Track offer selection
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
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      {/* Honeycomb texture */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      {/* Header simple */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-lg mx-auto flex items-center justify-center">
          <Link 
            to="/"
            className="font-display text-xl tracking-[0.1em]"
            style={{ color: COUTURE.silk }}
          >
            i-wasp
          </Link>
        </div>
      </header>

      {/* Progress bar simple */}
      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.jetSoft }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.jetSoft }} />
          </div>
          <p className="text-center mt-3 text-[11px] uppercase tracking-[0.15em]" style={{ color: COUTURE.textMuted }}>
            Étape 1/3 — Votre offre
          </p>
        </div>
      </div>

      {/* Social proof urgence */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-lg mx-auto">
          <motion.div 
            className="flex items-center justify-center gap-4 py-3 px-4 rounded-lg"
            style={{ backgroundColor: `${COUTURE.gold}10`, border: `1px solid ${COUTURE.gold}20` }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: COUTURE.gold }} />
              <span className="text-xs" style={{ color: COUTURE.gold }}>
                <strong>23 personnes</strong> commandent en ce moment
              </span>
            </div>
            <div className="w-px h-4" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: COUTURE.gold }} />
              <span className="text-xs" style={{ color: COUTURE.gold }}>
                Livraison <strong>48h</strong>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-40">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="font-display text-2xl font-light italic mb-2"
              style={{ color: COUTURE.silk }}
            >
              Choisissez votre <span style={{ color: COUTURE.gold }}>carte.</span>
            </h1>
            <p className="text-sm" style={{ color: COUTURE.textMuted }}>
              Carte NFC + Profil digital inclus
            </p>
          </motion.div>

          {/* Offers - Signature highlighted */}
          <div className="space-y-3">
            {EXPRESS_OFFERS.map((offer, i) => {
              const isSelected = state.selectedOffer === offer.id;
              const isSignature = offer.id === "signature";
              
              return (
                <motion.button
                  key={offer.id}
                  onClick={() => handleSelectOffer(offer.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full text-left p-5 transition-all duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: isSelected ? `${COUTURE.gold}15` : isSignature ? `${COUTURE.gold}08` : 'transparent',
                    border: `2px solid ${isSelected ? COUTURE.gold : isSignature ? `${COUTURE.gold}40` : COUTURE.jetSoft}`,
                  }}
                >
                  {/* Popular badge */}
                  {isSignature && (
                    <span 
                      className="absolute top-0 right-0 px-3 py-1 text-[9px] uppercase tracking-[0.15em] font-medium"
                      style={{ 
                        backgroundColor: COUTURE.gold,
                        color: COUTURE.jet,
                      }}
                    >
                      ⭐ Populaire
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Selection indicator */}
                      <div 
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                        style={{ 
                          borderColor: isSelected ? COUTURE.gold : COUTURE.jetSoft,
                          backgroundColor: isSelected ? COUTURE.gold : 'transparent',
                        }}
                      >
                        {isSelected && <Check className="w-3 h-3" style={{ color: COUTURE.jet }} />}
                      </div>
                      
                      <div>
                        <h3 
                          className="font-display text-lg font-light"
                          style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
                        >
                          {offer.name}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: COUTURE.textMuted }}>
                          {offer.id === "essentiel" && "Carte NFC + 5 liens"}
                          {offer.id === "signature" && "Tout débloqué · CRM · Analytics"}
                          {offer.id === "alliance" && "Pack équipe · Admin centralisé"}
                        </p>
                      </div>
                    </div>
                    
                    <span 
                      className="text-xl font-light tabular-nums"
                      style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
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
            className="mt-8 grid grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <Shield className="w-5 h-5 mx-auto mb-2" style={{ color: COUTURE.gold }} />
              <p className="text-[10px] uppercase tracking-wider" style={{ color: COUTURE.textMuted }}>
                Paiement sécurisé
              </p>
            </div>
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto mb-2" style={{ color: COUTURE.gold }} />
              <p className="text-[10px] uppercase tracking-wider" style={{ color: COUTURE.textMuted }}>
                Livraison 48h
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3 h-3" fill={COUTURE.gold} style={{ color: COUTURE.gold }} />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: COUTURE.textMuted }}>
                4.9 · 500+ avis
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA - Grand et visible */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-5"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={handleContinue}
            disabled={!state.selectedOffer || isNavigating}
            whileHover={{ scale: state.selectedOffer ? 1.02 : 1 }}
            whileTap={{ scale: state.selectedOffer ? 0.98 : 1 }}
            className="w-full flex items-center justify-center gap-3 py-4 transition-all duration-300 disabled:opacity-40"
            style={{ 
              backgroundColor: state.selectedOffer ? COUTURE.gold : COUTURE.jetSoft,
              color: state.selectedOffer ? COUTURE.jet : COUTURE.textMuted,
            }}
          >
            <span className="text-sm uppercase tracking-[0.15em] font-medium">
              {isNavigating ? "Chargement..." : selectedOffer ? `Continuer — ${selectedOffer.priceDisplay}` : "Choisir une offre"}
            </span>
            {!isNavigating && state.selectedOffer && (
              <ArrowRight className="w-5 h-5" />
            )}
          </motion.button>
          
          {/* Reassurance */}
          <p className="text-center mt-3 text-[10px]" style={{ color: COUTURE.textMuted }}>
            🔒 Aucun engagement · Satisfait ou remboursé
          </p>
        </div>
      </div>
    </div>
  );
}
