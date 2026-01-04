/**
 * Step 1: Choix de l'offre
 * /order/offre
 * 
 * Essentiel / Signature / Élite
 * Cadre jaune #FFC700 sur l'offre sélectionnée
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OFFERS, OfferType, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { PhysicalCardPreview } from "@/components/PhysicalCardPreview";
import { Check, ArrowRight, Star, Sparkles, Crown } from "lucide-react";

const offerDetails = [
  {
    id: "essentiel" as OfferType,
    icon: Star,
    title: "Essentiel",
    subtitle: "L'essentiel pour démarrer",
    price: "299 MAD",
    features: [
      "Carte NFC i-Wasp blanche",
      "Profil digital essentiel",
      "Nom, poste, entreprise",
      "Téléphone & WhatsApp",
      "Jusqu'à 3 liens",
      "QR Code intelligent",
    ],
  },
  {
    id: "signature" as OfferType,
    icon: Sparkles,
    title: "Signature",
    subtitle: "Le plus populaire",
    price: "599 MAD",
    isPopular: true,
    features: [
      "Carte NFC i-Wasp Premium",
      "Profil digital complet",
      "Liens illimités",
      "WhatsApp direct",
      "Galerie photo / vidéo",
      "Mise à jour illimitée",
      "Reprogrammation carte",
      "Support prioritaire",
    ],
  },
  {
    id: "elite" as OfferType,
    icon: Crown,
    title: "Élite",
    subtitle: "L'excellence i-Wasp",
    price: "999 MAD",
    features: [
      "Carte NFC i-Wasp Elite",
      "Profil digital sur mesure",
      "Personnalisation avancée",
      "Gestion accompagnée",
      "Mise à jour prise en charge",
      "Support dédié",
      "Priorité absolue",
    ],
  },
];

function OrderOffreContent() {
  const { state, setSelectedOffer, nextStep } = useOrderFunnel();
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={1} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm text-primary tracking-widest uppercase mb-3"
                variants={itemVariants}
              >
                Étape 1 sur 6
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Choisissez votre offre
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg max-w-md mx-auto"
                variants={itemVariants}
              >
                La carte NFC est incluse. Le service fait la différence.
              </motion.p>
            </motion.div>

            {/* Offer Cards */}
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {offerDetails.map((offer, index) => {
                const isSelected = state.selectedOffer === offer.id;
                const Icon = offer.icon;
                
                return (
                  <motion.button
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => handleSelectOffer(offer.id)}
                    disabled={state.isTransitioning}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#FFC700] bg-[#FFC700]/5 shadow-lg shadow-[#FFC700]/20"
                        : "border-border bg-card hover:border-[#FFC700]/50"
                    } ${state.isTransitioning ? "pointer-events-none opacity-50" : ""}`}
                  >
                    {/* Popular Badge */}
                    {offer.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFC700] text-black text-xs font-semibold">
                        Le plus choisi
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#FFC700] flex items-center justify-center"
                      >
                        <Check size={14} className="text-black" />
                      </motion.div>
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      isSelected ? "bg-[#FFC700]" : "bg-muted"
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? "text-black" : "text-muted-foreground"}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-1">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{offer.subtitle}</p>
                    <p className="text-2xl font-bold mb-4">{offer.price}</p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {offer.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check size={14} className={isSelected ? "text-[#FFC700]" : "text-primary"} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <LoadingButton
                size="xl"
                onClick={handleContinue}
                disabled={!state.selectedOffer || state.isTransitioning}
                isLoading={isNavigating}
                loadingText="Chargement..."
                className="px-12 rounded-full bg-[#FFC700] hover:bg-[#FFC700]/90 text-black font-semibold disabled:opacity-50"
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </LoadingButton>
            </motion.div>

            {/* Physical Card Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10"
            >
              <PhysicalCardPreview compact />
            </motion.div>

            {/* Price Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-xs text-muted-foreground mt-6"
            >
              Prix en dirhams marocains (MAD). Livraison gratuite au Maroc.
            </motion.p>
            
            {/* Payment notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex justify-center mt-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs text-muted-foreground">
                <span className="text-primary">💳</span>
                <span>Paiement en ligne bientôt disponible · Paiement à la livraison activé</span>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
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
