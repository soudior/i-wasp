/**
 * Step 1: Choix de l'offre
 * /order/offre
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste, silencieux
 * + Optimisations conversion: CTA visible, preuve sociale, tracking
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderFunnel, OfferType, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Check, ArrowLeft, ArrowRight, Shield, Truck } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { NFC_PRICING, PRO_SUBSCRIPTION, formatCatalogAmount, packTeamSavingsPercent } from "@/lib/nfcPricing";
import { useMarketCurrency } from "@/contexts/CurrencyContext";
import { isLaunchOfferActive, LAUNCH_OFFER } from "@/lib/launchOffer";
import { LaunchOfferBanner, MarketShippingNote } from "@/components/LaunchOfferBanner";

interface OfferDetail {
  id: OfferType;
  title: string;
  subtitle: string;
  priceEUR: number;
  priceMAD: number;
  compareEUR?: number;
  compareMAD?: number;
  features: string[];
  isSignature?: boolean;
}

function buildOffers(): OfferDetail[] {
  const launch = isLaunchOfferActive();
  const rows: OfferDetail[] = [
  {
    id: "essentiel",
    title: "Essentielle",
    subtitle: "Découverte",
    priceEUR: NFC_PRICING.cards.ESSENTIELLE.priceEur,
    priceMAD: NFC_PRICING.cards.ESSENTIELLE.priceMad,
    features: [
      "1 carte NFC standard",
      "Profil numérique simple",
      "QR code personnalisé",
      "3 mois Pro inclus",
    ],
  },
  {
    id: "signature",
    title: "Professionnelle",
    subtitle: "Recommandé",
    priceEUR: launch ? LAUNCH_OFFER.professionnelle.priceEur : NFC_PRICING.cards.PROFESSIONNELLE.priceEur,
    priceMAD: launch ? LAUNCH_OFFER.professionnelle.priceMad : NFC_PRICING.cards.PROFESSIONNELLE.priceMad,
    compareEUR: launch ? LAUNCH_OFFER.professionnelle.compareEur : undefined,
    compareMAD: launch ? LAUNCH_OFFER.professionnelle.compareMad : undefined,
    isSignature: true,
    features: [
      "Carte NFC premium",
      "Design personnalisé",
      "Analytics avancés",
      "Support prioritaire",
      launch ? "1 an de Pro offert" : "3 mois Pro inclus",
    ],
  },
  {
    id: "alliance",
    title: "Prestige",
    subtitle: "Premium",
    priceEUR: NFC_PRICING.cards.PRESTIGE.priceEur,
    priceMAD: NFC_PRICING.cards.PRESTIGE.priceMad,
    features: [
      "Carte NFC luxe",
      "Personnalisation totale",
      "Analytics & CRM",
      "Support VIP dédié",
      "3 mois Pro inclus",
    ],
  },
  ];
  if (launch) {
    rows.push({
      id: "duo",
      title: "Pack DUO",
      subtitle: "Couple ou associés",
      priceEUR: LAUNCH_OFFER.duo.priceEur,
      priceMAD: LAUNCH_OFFER.duo.priceMad,
      compareEUR: LAUNCH_OFFER.duo.compareEur,
      compareMAD: LAUNCH_OFFER.duo.compareMad,
      features: [
        "2 cartes Professionnelle",
        "Pour un couple ou des associés",
        "Livraison offerte",
      ],
    });
    rows.push({
      id: "team",
      title: "Pack TEAM",
      subtitle: "5 cartes",
      priceEUR: LAUNCH_OFFER.team.priceEur,
      priceMAD: LAUNCH_OFFER.team.priceMad,
      compareEUR: LAUNCH_OFFER.team.compareEur,
      compareMAD: LAUNCH_OFFER.team.compareMad,
      features: [
        "5 cartes Professionnelle",
        "Pour une équipe",
        "Livraison offerte",
      ],
    });
  }
  return rows;
}

function OrderOffreContent() {
  const navigate = useNavigate();
  const { state, setSelectedOffer, nextStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Tracking conversions
  const marketCurrency = useMarketCurrency();
  const offers = buildOffers();
  const teamSavings = packTeamSavingsPercent(marketCurrency);
  const { trackOfferSelect, trackCheckoutStart, trackCTA } = useConversionTracking({
    pageName: 'OrderOffre',
  });

  const handleSelectOffer = (offerId: OfferType) => {
    const offer = offers.find(o => o.id === offerId);
    setSelectedOffer(offerId);
    if (offer) {
      trackOfferSelect(offer.title, offer.priceMAD);
    }
  };

  const handleContinue = async () => {
    if (!state.selectedOffer || isNavigating || state.isTransitioning) return;
    setIsNavigating(true);
    const offer = offers.find(o => o.id === state.selectedOffer);
    if (offer) {
      trackCheckoutStart(offer.title, offer.priceMAD);
      trackCTA('continue_to_identity', 'order_offre');
    }
    await nextStep();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      <LaunchOfferBanner />
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
              Carte NFC + 3 mois Pro inclus. Le profil gratuit reste actif ensuite.
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
                          {offer.id === "team" && teamSavings != null
                            ? `${teamSavings}% d'économie`
                            : offer.subtitle}
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
                        className="text-right font-light tabular-nums"
                        style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
                      >
                        {offer.compareEUR != null && offer.compareMAD != null && (
                          <span className="block text-sm line-through opacity-60">{formatCatalogAmount(offer.compareEUR, offer.compareMAD, marketCurrency)}</span>
                        )}
                        <span className="block text-2xl">{formatCatalogAmount(offer.priceEUR, offer.priceMAD, marketCurrency)}</span>
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

          <section
            className="mt-12 p-6 md:p-8"
            style={{ border: `1px solid ${COUTURE.gold}30`, backgroundColor: `${COUTURE.gold}05` }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: COUTURE.gold }}>
              {isLaunchOfferActive() ? "Après la période Pro offerte" : "Après vos 3 mois offerts"}
            </p>
            <h2 className="font-display text-xl md:text-2xl font-light mb-3" style={{ color: COUTURE.silk }}>
              Votre carte partage. Pro transforme chaque rencontre en opportunité.
            </h2>
            <p className="text-xs md:text-sm leading-relaxed mb-6" style={{ color: COUTURE.textMuted }}>
              Sans abonnement, votre carte, votre QR code, votre Wallet et votre profil essentiel restent actifs. Pro ajoute les outils qui font gagner des clients.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5" style={{ border: `1px solid ${COUTURE.jetSoft}` }}>
                <div className="flex items-baseline justify-between gap-3 mb-4">
                  <h3 className="text-sm uppercase tracking-[0.15em]" style={{ color: COUTURE.silk }}>Gratuit</h3>
                  <span className="text-lg" style={{ color: COUTURE.silk }}>Gratuit</span>
                </div>
                <p className="text-xs leading-6" style={{ color: COUTURE.textMuted }}>
                  Profil essentiel · NFC & QR · Apple/Google Wallet · partage illimité
                </p>
              </div>

              <div className="relative p-5" style={{ border: `1px solid ${COUTURE.gold}70` }}>
                <span className="absolute -top-3 right-4 px-3 py-1 text-[8px] uppercase tracking-[0.18em]" style={{ backgroundColor: COUTURE.gold, color: COUTURE.jet }}>
                  Meilleure valeur
                </span>
                <div className="flex items-baseline justify-between gap-3 mb-4">
                  <h3 className="text-sm uppercase tracking-[0.15em]" style={{ color: COUTURE.gold }}>Pro</h3>
                  <div className="text-right">
                    <span className="block text-lg" style={{ color: COUTURE.gold }}>{formatCatalogAmount(PRO_SUBSCRIPTION.yearlyEur, PRO_SUBSCRIPTION.yearlyMad, marketCurrency)}/an</span>
                    <span className="block text-[9px]" style={{ color: COUTURE.textMuted }}>ou {formatCatalogAmount(PRO_SUBSCRIPTION.monthlyEur, PRO_SUBSCRIPTION.monthlyMad, marketCurrency)}/mois</span>
                  </div>
                </div>
                <p className="text-xs leading-6" style={{ color: COUTURE.textMuted }}>
                  Design sans branding · analytics avancés · capture de leads · export contacts · automatisations CRM · support prioritaire
                </p>
              </div>
            </div>

            <p className="mt-5 text-[10px] leading-relaxed" style={{ color: COUTURE.textMuted }}>
              Aucun blocage : si vous ne renouvelez pas, seules les fonctions Pro s'arrêtent. Votre carte reste utilisable.
            </p>
          </section>
        </div>
      </main>

      {/* Fixed CTA - AMÉLIORE */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-4"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Trust badges mini */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" style={{ color: COUTURE.gold }} />
              <span className="text-[9px] uppercase tracking-wider" style={{ color: COUTURE.textMuted }}>
                Paiement sécurisé
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3 h-3" style={{ color: COUTURE.gold }} />
              <span className="text-[9px] tracking-wider" style={{ color: COUTURE.textMuted }}>
                <MarketShippingNote currency={marketCurrency} />
              </span>
            </div>
            <Link to="/cgv" className="text-[9px] uppercase tracking-wider underline underline-offset-4" style={{ color: COUTURE.textMuted }}>
              Prix et conditions
            </Link>
          </div>
          
          {/* CTA Button - Plus visible */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleContinue}
              disabled={!state.selectedOffer || isNavigating || state.isTransitioning}
              whileHover={{ scale: state.selectedOffer ? 1.02 : 1 }}
              whileTap={{ scale: state.selectedOffer ? 0.98 : 1 }}
              className="flex items-center gap-3 px-8 py-3 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: state.selectedOffer ? COUTURE.gold : 'transparent',
                color: state.selectedOffer ? COUTURE.jet : COUTURE.textMuted,
                border: `1px solid ${state.selectedOffer ? COUTURE.gold : COUTURE.jetSoft}`,
              }}
            >
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
                {isNavigating ? 'Chargement...' : 'Continuer'}
              </span>
              {!isNavigating && state.selectedOffer && (
                <ArrowRight className="w-4 h-4" />
              )}
            </motion.button>
          </div>
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
