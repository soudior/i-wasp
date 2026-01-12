/**
 * Step 1: Choix de l'offre
 * /order/offre
 * 
 * Nouvelle structure premium:
 * - 3 offres principales: Essentiel, Signature, Alliance
 * - 2 packs vitrine en upsell
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, OfferType, VitrinePackType, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { 
  Check, ArrowRight, ArrowLeft, Star, Sparkles, Crown, 
  BarChart3, Users, RefreshCw, Headphones, Palette, Link2, 
  Image, Building2, Globe, X, Zap, Bell, MessageSquare,
  FileText, UserCheck, Shield, Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  tagline: string;
  priceMAD: number;
  priceLabel?: string;
  target: string;
  keyFeatures: string[];
  features: OfferFeature[];
  limitations?: string[];
  highlights?: string[];
  isPopular?: boolean;
  isPremium?: boolean;
}

interface VitrinePack {
  id: VitrinePackType;
  icon: React.ElementType;
  title: string;
  description: string;
  priceMAD: number;
  forOffer: OfferType[];
  features: string[];
}

// Détails des 3 offres principales
const offerDetails: OfferDetail[] = [
  {
    id: "essentiel",
    icon: Star,
    title: "Essentiel",
    tagline: "Découverte",
    priceMAD: 277,
    target: "Particulier, freelance, auto-entrepreneur",
    keyFeatures: [
      "1 carte NFC standard",
      "Profil numérique simple",
      "3 à 5 liens maximum",
    ],
    features: [
      { label: "Carte NFC standard", included: true, icon: Star },
      { label: "Profil numérique simple", included: true, icon: Link2 },
      { label: "Jusqu'à 5 liens", included: true, icon: Link2 },
      { label: "Tableau de bord basique", included: true, icon: BarChart3 },
    ],
    limitations: [
      "Pas de stories 24h",
      "Pas de notifications push",
      "Analyses basiques",
      "Pas de capture de leads",
    ],
  },
  {
    id: "signature",
    icon: Sparkles,
    title: "Signature",
    tagline: "Tout débloqué Solo",
    priceMAD: 555,
    isPopular: true,
    target: "Pro, coach, agent immo, commercial, PDG",
    keyFeatures: [
      "1 carte NFC premium",
      "Toutes fonctionnalités",
      "CRM & analyses avancées",
    ],
    features: [
      { label: "Carte NFC premium (matériau au choix)", included: true, icon: Sparkles, highlight: true },
      { label: "Stories 24h & galerie média", included: true, icon: Image, highlight: true },
      { label: "Liens illimités", included: true, icon: Link2 },
      { label: "Collecte de leads + mini-CRM", included: true, icon: Users, highlight: true },
      { label: "Notifications push", included: true, icon: Bell, highlight: true },
      { label: "Statistiques avancées", included: true, icon: BarChart3, highlight: true },
      { label: "Relances intelligentes", included: true, icon: RefreshCw },
    ],
    highlights: [
      "Concierge de réseau complet",
      "Voyez qui consulte votre profil",
      "Exportez vos contacts en 1 clic",
    ],
  },
  {
    id: "alliance",
    icon: Crown,
    title: "Alliance",
    tagline: "Équipe & B2B",
    priceMAD: 925,
    priceLabel: "par utilisateur",
    isPremium: true,
    target: "Entreprises, équipes commerciales, agences, hôtels",
    keyFeatures: [
      "Pack de cartes NFC premium",
      "Admin centralisé",
      "Dashboard équipe",
    ],
    features: [
      { label: "Pack cartes NFC premium (5, 10, 20+)", included: true, icon: Briefcase, highlight: true },
      { label: "Toutes fonctionnalités Signature", included: true, icon: Check },
      { label: "Admin centralisé", included: true, icon: Building2, highlight: true },
      { label: "Dashboard par personne/équipe", included: true, icon: BarChart3, highlight: true },
      { label: "Branding entreprise unifié", included: true, icon: Palette, highlight: true },
      { label: "Scénarios de relance équipe", included: true, icon: MessageSquare },
      { label: "Interlocuteur dédié", included: true, icon: Headphones },
    ],
    highlights: [
      "Gestion centralisée des profils",
      "Statistiques par équipe",
      "Support prioritaire",
    ],
  },
];

// Packs Vitrine (upsell)
const vitrinePacks: VitrinePack[] = [
  {
    id: "solo",
    icon: Globe,
    title: "Pack Vitrine Solo",
    description: "Signature + page vitrine simple",
    priceMAD: 1500,
    forOffer: ["signature"],
    features: [
      "Page vitrine ultra simple",
      "Présentation + offres principales",
      "Formulaire de contact",
      "Liée à votre carte NFC",
    ],
  },
  {
    id: "equipe",
    icon: Building2,
    title: "Pack Vitrine Équipe",
    description: "Alliance + mini-site entreprise",
    priceMAD: 3000,
    forOffer: ["alliance"],
    features: [
      "Mini-site entreprise (3-4 pages)",
      "Accueil, équipe, services, contact",
      "Chaque carte → page perso + lien entreprise",
      "Branding unifié",
    ],
  },
];

function OrderOffreContent() {
  const navigate = useNavigate();
  const { state, setSelectedOffer, nextStep } = useOrderFunnel();
  const { formatAmount } = useCurrency();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedVitrine, setSelectedVitrine] = useState<VitrinePackType>("none");

  const handleSelectOffer = (offerId: OfferType) => {
    setSelectedOffer(offerId);
    // Reset vitrine pack if not compatible
    if (offerId === "essentiel") {
      setSelectedVitrine("none");
    } else if (offerId === "signature" && selectedVitrine === "equipe") {
      setSelectedVitrine("none");
    } else if (offerId === "alliance" && selectedVitrine === "solo") {
      setSelectedVitrine("none");
    }
  };

  const handleContinue = async () => {
    if (!state.selectedOffer || isNavigating || state.isTransitioning) return;
    setIsNavigating(true);
    await nextStep();
  };

  const canShowVitrine = state.selectedOffer === "signature" || state.selectedOffer === "alliance";
  const applicableVitrinePacks = vitrinePacks.filter(pack => 
    state.selectedOffer && pack.forOffer.includes(state.selectedOffer)
  );

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
        <div className="step-bar-fill" style={{ width: '16.6%' }} />
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest mb-2 text-soft-gold">
              Étape 1 sur 7 – Choisissez votre expérience
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-off-white mb-2">
              Choisissez votre expérience
            </h1>
            <p className="text-soft-gray text-sm">
              La carte NFC est incluse dans toutes les offres
            </p>
          </div>

          {/* Main Offers - 3 Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
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
                  className={`relative rounded-2xl p-5 text-left transition-all border-2 ${
                    isSelected 
                      ? 'border-soft-gold bg-soft-gold/10' 
                      : 'border-anthracite-light bg-anthracite-dark/50 hover:border-anthracite-light/80'
                  } ${offer.isPopular ? 'ring-2 ring-soft-gold/30' : ''}`}
                >
                  {/* Badges */}
                  {offer.isPopular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-soft-gold text-deep-black text-[10px] font-semibold px-3">
                      Populaire
                    </Badge>
                  )}
                  {offer.isPremium && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-deep-black text-[10px] font-semibold px-3">
                      B2B
                    </Badge>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-soft-gold' : 'bg-anthracite-light'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-deep-black' : 'text-soft-gray'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-off-white">{offer.title}</h3>
                      <p className="text-[10px] uppercase tracking-wider text-soft-gold">{offer.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className={`text-2xl font-bold ${isSelected ? 'text-soft-gold' : 'text-off-white'}`}>
                      {formatAmount(offer.priceMAD)}
                    </span>
                    {offer.priceLabel && (
                      <span className="text-xs text-soft-gray ml-1">/{offer.priceLabel}</span>
                    )}
                  </div>

                  {/* Target */}
                  <p className="text-xs text-soft-gray mb-3 line-clamp-2">
                    {offer.target}
                  </p>

                  {/* Key Features */}
                  <div className="space-y-1.5 mb-3">
                    {offer.keyFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-soft-gold flex-shrink-0" />
                        <span className="text-xs text-soft-gray">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations (Essentiel only) */}
                  {offer.limitations && (
                    <div className="pt-2 border-t border-anthracite-light">
                      <div className="flex flex-wrap gap-1">
                        {offer.limitations.slice(0, 2).map((limit, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-muted-gray/15 text-muted-gray">
                            <X className="w-2 h-2 inline mr-0.5" />{limit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  {offer.highlights && isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2 border-t border-anthracite-light mt-2"
                    >
                      <div className="flex flex-wrap gap-1">
                        {offer.highlights.map((highlight, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-soft-gold/15 text-soft-gold">
                            ✓ {highlight}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 rounded-full bg-soft-gold flex items-center justify-center">
                        <Check className="w-4 h-4 text-deep-black" />
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Vitrine Packs Upsell */}
          <AnimatePresence>
            {canShowVitrine && applicableVitrinePacks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="rounded-2xl p-5 bg-gradient-to-br from-anthracite-dark to-deep-black border border-anthracite-light">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-soft-gold" />
                    <h3 className="font-semibold text-off-white">Ajoutez un pack carte + site vitrine</h3>
                    <Badge variant="outline" className="ml-auto text-[10px] border-soft-gold/30 text-soft-gold">
                      Optionnel
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {applicableVitrinePacks.map((pack) => {
                      const isSelected = selectedVitrine === pack.id;
                      const PackIcon = pack.icon;

                      return (
                        <button
                          key={pack.id}
                          onClick={() => setSelectedVitrine(isSelected ? "none" : pack.id)}
                          className={`relative rounded-xl p-4 text-left transition-all border-2 ${
                            isSelected 
                              ? 'border-soft-gold bg-soft-gold/10' 
                              : 'border-anthracite-light hover:border-anthracite-light/80'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-soft-gold' : 'bg-anthracite-light'
                            }`}>
                              <PackIcon className={`w-5 h-5 ${isSelected ? 'text-deep-black' : 'text-soft-gray'}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-off-white text-sm">{pack.title}</h4>
                              <p className="text-xs text-soft-gray mb-2">{pack.description}</p>
                              <div className="space-y-1">
                                {pack.features.slice(0, 3).map((feature, i) => (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <Check className="w-3 h-3 text-soft-gold" />
                                    <span className="text-[10px] text-soft-gray">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold ${isSelected ? 'text-soft-gold' : 'text-off-white'}`}>
                                +{formatAmount(pack.priceMAD)}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3">
                              <div className="w-5 h-5 rounded-full bg-soft-gold flex items-center justify-center">
                                <Check className="w-3 h-3 text-deep-black" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            Livraison gratuite au Maroc · Paiement à la livraison · Devis sur demande pour entreprises
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
