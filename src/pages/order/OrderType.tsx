/**
 * Step 1: Product & Profile Selection (Discovery)
 * /order/type
 * 
 * Choix du produit (Carte NFC / Ongles NFC) + profil utilisateur
 * + Importation de site web pour auto-génération
 * Flow: Découverte → Prévisualisation → Personnalisation → Validation → Prix → Achat
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, CustomerType, ProductType } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { WebsiteImporter, ScrapedWebsiteData } from "@/components/order/WebsiteImporter";
import { User, Briefcase, Building2, Check, ArrowRight, Sparkles, CreditCard, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import nailsHero from "@/assets/nails/nails-hero.png";
import cardPreview from "@/assets/cards/card-black-matte.png";

const productTypes = [
  {
    id: "card" as ProductType,
    icon: CreditCard,
    title: "Carte NFC Premium",
    subtitle: "Le classique réinventé",
    description: "Une carte de visite élégante en PVC premium avec puce NFC intégrée.",
    image: cardPreview,
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "nails" as ProductType,
    icon: Hand,
    title: "Ongles NFC i-wasp",
    subtitle: "Innovation mode",
    description: "Le networking discret. Un accessoire mode qui cache une technologie révolutionnaire.",
    image: nailsHero,
    color: "from-rose-500 to-pink-500",
    isNew: true,
  },
];

const customerTypes = [
  {
    id: "particulier" as CustomerType,
    icon: User,
    title: "Particulier",
    subtitle: "Usage personnel",
    description: "Créez votre carte de visite digitale unique pour développer votre réseau.",
    benefits: ["Design sur mesure", "Partage instantané NFC", "Profil digital complet"],
    gradient: "from-amber-400 to-amber-600",
  },
  {
    id: "professionnel" as CustomerType,
    icon: Briefcase,
    title: "Professionnel",
    subtitle: "Indépendant & freelance",
    description: "Solution idéale pour les entrepreneurs qui veulent marquer les esprits.",
    benefits: ["Logo personnalisé", "Liens vers vos réseaux", "Géolocalisation"],
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "entreprise" as CustomerType,
    icon: Building2,
    title: "Équipe",
    subtitle: "PME & entreprises",
    description: "Équipez votre équipe avec des cartes professionnelles cohérentes.",
    benefits: ["Design unifié", "Quantités flexibles", "Gestion centralisée"],
    gradient: "from-yellow-400 to-amber-500",
  },
];

export default function OrderType() {
  const navigate = useNavigate();
  const { state, setProductType, setCustomerType, setDesignConfig, nextStep } = useOrderFunnel();
  const [importedData, setImportedData] = useState<ScrapedWebsiteData | null>(null);

  const handleSelectProduct = (type: ProductType) => {
    setProductType(type);
  };

  const handleSelectCustomer = (type: CustomerType) => {
    setCustomerType(type);
  };

  const handleWebsiteDataImported = (data: ScrapedWebsiteData) => {
    setImportedData(data);
    // Pre-fill design config with imported data
    setDesignConfig({
      logoUrl: data.logo || null,
      cardColor: data.colors?.primary || '#d4af37',
      template: 'herbalism-elite', // Default template for website imports
      importedData: {
        logo: data.logo,
        colors: data.colors,
        brandName: data.brandName,
        tagline: data.tagline,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        address: data.address,
        instagram: data.instagram,
        facebook: data.facebook,
        googleMapsUrl: data.googleMapsUrl,
        website: data.website,
        products: data.products,
        storyImages: data.storyImages,
      },
    });
  };

  const handleContinue = () => {
    if (state.productType && state.customerType) {
      nextStep();
    }
  };

  const selectedProduct = productTypes.find(p => p.id === state.productType);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={1} />

            {/* STEP 0: Product Selection */}
            <motion.div 
              className="mb-16"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Sparkles size={16} />
                  Étape 1 : Choisissez votre produit
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                  Que souhaitez-vous créer ?
                </h1>
              </motion.div>

              {/* Product Cards - Visual Selection */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {productTypes.map((product, index) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    onClick={() => handleSelectProduct(product.id)}
                    className={`relative overflow-hidden rounded-3xl border-2 text-left transition-all duration-300 hover:scale-[1.02] group ${
                      state.productType === product.id
                        ? "border-primary shadow-xl shadow-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* NEW Badge */}
                      {product.isNew && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold">
                          NOUVEAU
                        </div>
                      )}
                      
                      {/* Selection Indicator */}
                      {state.productType === product.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check size={18} className="text-primary-foreground" />
                        </motion.div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center mb-3`}>
                          <product.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-white mb-1">{product.title}</h3>
                        <p className="text-white/60 text-sm">{product.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="p-5 bg-card">
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Website Import Section - Only for card product */}
              {state.productType === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-3 text-muted-foreground">
                        ou importez votre site existant
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <WebsiteImporter 
                      onDataImported={handleWebsiteDataImported}
                    />
                  </div>

                  {/* Import Success Indicator */}
                  {importedData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3"
                    >
                      <Check className="text-emerald-500" size={20} />
                      <div>
                        <p className="text-sm font-medium text-emerald-400">
                          Site importé : {importedData.brandName || importedData.website}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Les données seront appliquées à votre template
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* STEP 1: Customer Type Selection - Only show after product selected */}
            <AnimatePresence>
              {state.productType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div className="text-center mb-8" variants={itemVariants}>
                    <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                      Qui êtes-vous ?
                    </h2>
                    <p className="text-muted-foreground">
                      Nous adapterons l'expérience à votre profil
                    </p>
                  </motion.div>

                  {/* Customer Type Options with Gold Icons */}
                  <div className="grid gap-4 md:grid-cols-3 mb-12">
                    {customerTypes.map((type, index) => (
                      <motion.button
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        onClick={() => handleSelectCustomer(type.id)}
                        className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] group ${
                          state.customerType === type.id
                            ? "border-amber-400 bg-amber-500/5 shadow-lg shadow-amber-500/10"
                            : "border-border hover:border-amber-400/50 bg-card"
                        }`}
                      >
                        {state.customerType === type.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg"
                          >
                            <Check size={14} className="text-black" />
                          </motion.div>
                        )}
                        
                        {/* Gold gradient icon */}
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all shadow-lg ${
                          state.customerType === type.id 
                            ? `bg-gradient-to-br ${type.gradient}` 
                            : `bg-gradient-to-br ${type.gradient} opacity-80`
                        }`}>
                          <type.icon className="w-7 h-7 text-black" />
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{type.title}</h3>
                        <p className="text-xs text-amber-500/80 uppercase tracking-wide font-medium mb-2">{type.subtitle}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                        
                        {/* Benefits chips */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {type.benefits.slice(0, 2).map((benefit, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Continue Button */}
                  <motion.div 
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      disabled={!state.customerType}
                      className={`px-10 h-14 text-lg rounded-full font-medium shadow-lg ${
                        state.productType === "nails" 
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600" 
                          : ""
                      }`}
                    >
                      {state.productType === "nails" ? "Créer mes ongles NFC" : "Créer ma carte"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Vous pourrez visualiser votre {state.productType === "nails" ? "création" : "carte"} avant toute décision
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
