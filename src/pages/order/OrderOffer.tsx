/**
 * Step 1: Offer Selection
 * /order
 * 
 * Choix de l'offre : particulier / pro / équipe
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, CustomerType } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User, Briefcase, Building2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const customerTypes = [
  {
    id: "particulier" as CustomerType,
    icon: User,
    title: "Particulier",
    description: "Commande individuelle pour usage personnel ou professionnel",
    priceHint: "À partir de 49€",
    features: ["1-2 cartes", "Design personnalisé", "Livraison standard"],
  },
  {
    id: "professionnel" as CustomerType,
    icon: Briefcase,
    title: "Professionnel",
    description: "Indépendant, freelance ou petite équipe",
    priceHint: "À partir de 44€/carte",
    features: ["3-9 cartes", "Prix dégressifs", "Support prioritaire"],
  },
  {
    id: "entreprise" as CustomerType,
    icon: Building2,
    title: "Entreprise",
    description: "Équipe, PME ou grande entreprise",
    priceHint: "À partir de 29€/carte",
    features: ["10+ cartes", "Account manager dédié", "Facturation entreprise"],
  },
];

export default function OrderOffer() {
  const navigate = useNavigate();
  const { state, setCustomerType, nextStep, resetFunnel } = useOrderFunnel();

  // Reset funnel when landing on this page (start fresh)
  const handleSelect = (type: CustomerType) => {
    setCustomerType(type);
  };

  const handleContinue = () => {
    if (state.customerType) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</span>
              <span className="hidden sm:inline text-muted-foreground">Offre</span>
            </div>
            {[2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground opacity-50">
                <div className="w-8 h-1 bg-muted rounded-full" />
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">{step}</span>
              </div>
            ))}
          </div>

          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Choisissez votre offre
            </h1>
            <p className="text-muted-foreground text-lg">
              Sélectionnez le profil qui correspond à vos besoins
            </p>
          </motion.div>

          {/* Options Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {customerTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelect(type.id)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                  state.customerType === type.id
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                {state.customerType === type.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check size={14} className="text-primary-foreground" />
                  </motion.div>
                )}
                
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <type.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="font-semibold text-xl mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {type.features.map((feature, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <p className="text-lg font-semibold text-primary">{type.priceHint}</p>
              </motion.button>
            ))}
          </div>

          {/* Continue Button */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!state.customerType}
              className="px-8 h-14 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
            >
              Continuer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
