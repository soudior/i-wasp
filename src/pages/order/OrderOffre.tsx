/**
 * Step 1: Choix de l'offre
 * /order/offre
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste, silencieux
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderFunnel, OfferType, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Check, ArrowLeft } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";

interface OfferDetail {
  id: OfferType;
  title: string;
  subtitle: string;
  priceMAD: number;
  features: string[];
  isSignature?: boolean;
}

const offers: OfferDetail[] = [
  {
    id: "essentiel",
    title: "Essentiel",
    subtitle: "Découverte",
    priceMAD: 277,
    features: [
      "1 carte NFC standard",
      "Profil numérique simple",
      "Jusqu'à 5 liens",
    ],
  },
  {
    id: "signature",
    title: "Signature",
    subtitle: "Tout débloqué",
    priceMAD: 555,
    isSignature: true,
    features: [
      "Carte NFC premium",
      "Stories 24h & galerie",
      "CRM & analytics",
      "Notifications push",
    ],
  },
  {
    id: "alliance",
    title: "Alliance",
    subtitle: "Équipes",
    priceMAD: 925,
    features: [
      "Pack cartes premium",
      "Admin centralisé",
      "Dashboard équipe",
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
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      {/* Honeycomb texture */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 transition-all duration-500"
            style={{ color: COUTURE.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = COUTURE.silk}
            onMouseLeave={(e) => e.currentTarget.style.color = COUTURE.textMuted}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.15em]">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="font-display text-lg tracking-[0.1em]"
            style={{ color: COUTURE.silk }}
          >
            i-wasp
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress indicator */}
      <div className="relative z-10 px-6 mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 justify-center">
            <span 
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: COUTURE.gold }}
            >
              01
            </span>
            <div 
              className="w-12 h-px"
              style={{ backgroundColor: `${COUTURE.gold}40` }}
            />
            <span 
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: COUTURE.textMuted }}
            >
              Offre
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 
              className="font-display text-2xl md:text-3xl font-light italic mb-4"
              style={{ color: COUTURE.silk }}
            >
              Choisissez votre <span style={{ color: COUTURE.gold }}>expérience.</span>
            </h1>
            <p 
              className="text-sm font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Carte NFC incluse dans toutes les offres.
            </p>
          </motion.div>

          {/* Offers */}
          <div className="space-y-4">
            {offers.map((offer, i) => {
              const isSelected = state.selectedOffer === offer.id;
              
              return (
                <motion.button
                  key={offer.id}
                  onClick={() => handleSelectOffer(offer.id)}
                  disabled={state.isTransitioning}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="w-full text-left p-6 md:p-8 transition-all duration-700 relative"
                  style={{
                    backgroundColor: isSelected ? `${COUTURE.gold}08` : 'transparent',
                    border: `1px solid ${isSelected ? `${COUTURE.gold}60` : COUTURE.jetSoft}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = `${COUTURE.gold}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = COUTURE.jetSoft;
                    }
                  }}
                >
                  {/* Signature badge */}
                  {offer.isSignature && (
                    <span 
                      className="absolute top-0 right-6 -translate-y-1/2 px-4 py-1 text-[9px] uppercase tracking-[0.2em]"
                      style={{ 
                        backgroundColor: COUTURE.gold,
                        color: COUTURE.jet,
                      }}
                    >
                      Populaire
                    </span>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Left: Title & features */}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-4 mb-4">
                        <h3 
                          className="font-display text-xl font-light"
                          style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
                        >
                          {offer.title}
                        </h3>
                        <span 
                          className="text-[10px] uppercase tracking-[0.15em]"
                          style={{ color: COUTURE.textMuted }}
                        >
                          {offer.subtitle}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {offer.features.map((feature, j) => (
                          <span 
                            key={j}
                            className="text-xs font-light flex items-center gap-2"
                            style={{ color: COUTURE.textMuted }}
                          >
                            <span style={{ color: COUTURE.gold }}>·</span>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Price & check */}
                    <div className="flex items-center gap-6">
                      <span 
                        className="text-2xl font-light tabular-nums"
                        style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
                      >
                        {formatAmount(offer.priceMAD)}
                      </span>
                      
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: COUTURE.gold }}
                        >
                          <Check className="w-4 h-4" style={{ color: COUTURE.jet }} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-6"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-3xl mx-auto flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!state.selectedOffer || isNavigating || state.isTransitioning}
            className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              color: state.selectedOffer ? COUTURE.gold : COUTURE.textMuted,
              borderBottom: `1px solid ${state.selectedOffer ? `${COUTURE.gold}60` : 'transparent'}`,
            }}
          >
            Continuer
          </button>
        </div>
      </div>
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
