/**
 * Step 1: Profile Selection (Discovery)
 * /order
 * 
 * Choix du profil utilisateur - AUCUN PRIX, AUCUN ACHAT
 * Flow: Découverte → Prévisualisation → Personnalisation → Validation → Prix → Achat
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, CustomerType } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { User, Briefcase, Building2, Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const customerTypes = [
  {
    id: "particulier" as CustomerType,
    icon: User,
    title: "Particulier",
    subtitle: "Usage personnel",
    description: "Créez votre carte de visite digitale unique pour développer votre réseau personnel ou professionnel.",
    benefits: [
      "Design sur mesure",
      "Partage instantané NFC",
      "Profil digital complet",
    ],
  },
  {
    id: "professionnel" as CustomerType,
    icon: Briefcase,
    title: "Professionnel",
    subtitle: "Indépendant & freelance",
    description: "Solution idéale pour les entrepreneurs et indépendants qui veulent marquer les esprits.",
    benefits: [
      "Logo personnalisé",
      "Liens vers vos réseaux",
      "Géolocalisation intégrée",
    ],
  },
  {
    id: "entreprise" as CustomerType,
    icon: Building2,
    title: "Équipe",
    subtitle: "PME & grandes entreprises",
    description: "Équipez votre équipe avec des cartes professionnelles cohérentes et élégantes.",
    benefits: [
      "Design unifié",
      "Quantités flexibles",
      "Gestion centralisée",
    ],
  },
];

export default function OrderType() {
  const navigate = useNavigate();
  const { state, setCustomerType, nextStep } = useOrderFunnel();

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
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={1} />

            {/* Header - Focus on discovery, not purchase */}
            <motion.div 
              className="text-center mb-12"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                variants={itemVariants}
              >
                <Sparkles size={16} />
                Commençons par faire connaissance
              </motion.div>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Qui êtes-vous ?
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg max-w-lg mx-auto"
                variants={itemVariants}
              >
                Nous adapterons l'expérience de création à votre profil
              </motion.p>
            </motion.div>

            {/* Profile Options - NO PRICES */}
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              {customerTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelect(type.id)}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] group ${
                    state.customerType === type.id
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
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
                  
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    state.customerType === type.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-primary/10 text-primary group-hover:bg-primary/20"
                  }`}>
                    <type.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="font-semibold text-xl mb-1">{type.title}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">{type.subtitle}</p>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{type.description}</p>
                  
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.button>
              ))}
            </div>

            {/* Continue Button - No purchase language */}
            <motion.div 
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!state.customerType}
                className="px-10 h-14 text-lg rounded-full font-medium shadow-lg"
              >
                Créer ma carte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-muted-foreground">
                Vous pourrez visualiser votre carte avant toute décision
              </p>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
