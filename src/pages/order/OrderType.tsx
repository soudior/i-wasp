/**
 * Step 1: Product & Profile Selection (Discovery)
 * /order/type
 * 
 * i-Wasp : La conciergerie digitale de votre identité professionnelle.
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import nailsHero from "@/assets/nails/nails-hero.png";
import cardPreview from "@/assets/cards/card-black-matte.png";

const serviceLevels = [
  {
    id: "decouverte",
    title: "Découverte",
    subtitle: "L'essentiel",
    price: "299 DH",
    features: [
      "Carte NFC i-Wasp blanche",
      "Profil digital essentiel",
      "Nom, poste, entreprise",
      "Téléphone & WhatsApp",
      "Jusqu'à 3 liens",
      "QR Code intelligent",
      "Accès conciergerie i-Wasp",
    ],
  },
  {
    id: "signature",
    title: "Signature",
    subtitle: "Le plus populaire",
    price: "599 DH",
    isPopular: true,
    features: [
      "Carte NFC i-Wasp Premium",
      "Profil digital complet",
      "Liens illimités",
      "WhatsApp direct",
      "Galerie photo / vidéo",
      "Mise à jour illimitée",
      "Reprogrammation de la carte",
      "Support prioritaire",
    ],
  },
  {
    id: "elite",
    title: "Élite",
    subtitle: "L'excellence",
    price: "999 DH",
    features: [
      "Carte NFC i-Wasp Elite",
      "Profil digital sur mesure",
      "Personnalisation avancée",
      "Gestion accompagnée par i-Wasp",
      "Mise à jour prise en charge",
      "Support dédié",
      "Priorité absolue",
    ],
  },
];

const productTypes = [
  {
    id: "card" as ProductType,
    icon: CreditCard,
    title: "Carte NFC i-Wasp",
    subtitle: "Votre clé d'accès",
    description: "Une carte élégante qui ouvre les portes de votre conciergerie digitale.",
    image: cardPreview,
  },
  {
    id: "nails" as ProductType,
    icon: Hand,
    title: "Ongles NFC i-Wasp",
    subtitle: "L'accessoire signature",
    description: "Le networking invisible. La technologie se fond dans votre style.",
    image: nailsHero,
    isNew: true,
  },
];

const customerTypes = [
  {
    id: "particulier" as CustomerType,
    icon: User,
    title: "Particulier",
    subtitle: "Usage personnel",
    description: "Votre identité digitale, élégante et toujours à jour.",
    benefits: ["Design sur mesure", "Partage instantané", "Profil complet"],
  },
  {
    id: "professionnel" as CustomerType,
    icon: Briefcase,
    title: "Professionnel",
    subtitle: "Indépendant",
    description: "Une présence professionnelle qui marque les esprits.",
    benefits: ["Logo personnalisé", "Réseaux intégrés", "Géolocalisation"],
  },
  {
    id: "entreprise" as CustomerType,
    icon: Building2,
    title: "Équipe",
    subtitle: "PME & entreprises",
    description: "Une identité cohérente pour toute votre équipe.",
    benefits: ["Design unifié", "Gestion centralisée", "Quantités flexibles"],
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
              <motion.div className="text-center mb-10" variants={itemVariants}>
                <p className="text-sm text-muted-foreground tracking-widest uppercase mb-3">
                  Conciergerie digitale
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  Choisissez votre niveau de conciergerie digitale
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  La carte physique est incluse. Le service fait toute la différence.
                </p>
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
                    className={`relative overflow-hidden rounded-2xl border text-left transition-all duration-300 group ${
                      state.productType === product.id
                        ? "border-primary shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* NEW Badge */}
                      {product.isNew && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
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
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
                          <product.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-xl text-white mb-1">{product.title}</h3>
                        <p className="text-white/70 text-sm">{product.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="p-5 bg-card">
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Service Levels Selection - After product selection */}
              {state.productType === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {serviceLevels.map((level, index) => (
                      <motion.div
                        key={level.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`relative p-6 rounded-2xl border-2 bg-card ${
                          level.isPopular 
                            ? "border-primary shadow-lg" 
                            : "border-border"
                        }`}
                      >
                        {level.isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            La plus choisie
                          </div>
                        )}
                        
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-semibold mb-1">{level.title}</h3>
                          <p className="text-sm text-muted-foreground">{level.subtitle}</p>
                          <p className="text-2xl font-bold mt-2">{level.price}</p>
                        </div>
                        
                        <ul className="space-y-2">
                          {level.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check size={14} className="text-primary flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <Button
                          className={`w-full mt-6 ${level.isPopular ? "" : "variant-outline"}`}
                          variant={level.isPopular ? "default" : "outline"}
                          onClick={handleContinue}
                        >
                          {level.id === "elite" ? "Accéder à" : "Choisir"} {level.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* i-wasp Magic Import Section - Only for card product */}
              {state.productType === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  {/* Divider with Gold accent */}
                  <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#d4af37]/30" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-4 text-sm font-medium text-[#d4af37] flex items-center gap-2">
                        <Sparkles size={14} />
                        MAGIE i-wasp
                        <Sparkles size={14} />
                      </span>
                    </div>
                  </div>
                  
                  {/* Website Importer Component */}
                  <WebsiteImporter 
                    onDataImported={handleWebsiteDataImported}
                    onEditImportedData={importedData ? () => {
                      // Open edit modal or scroll to import section
                      toast.info("Modifiez les données à l'étape Design");
                    } : undefined}
                  />

                  {/* Import Success Summary */}
                  {importedData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 p-5 rounded-2xl border-2 border-[#d4af37]/40 bg-gradient-to-r from-[#d4af37]/10 via-transparent to-[#d4af37]/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
                          <Check className="text-black" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#d4af37]">
                            {importedData.brandName || "Site importé"} ✨
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {importedData.products?.length || 0} produits • {importedData.storyImages?.length || 0} stories • 
                            {importedData.colors?.primary ? " Couleurs" : ""}{importedData.logo ? " • Logo" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Template suggéré</p>
                          <p className="text-sm font-medium text-[#d4af37]">Herbalism Élite</p>
                        </div>
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
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                      Qui êtes-vous ?
                    </h2>
                    <p className="text-muted-foreground">
                      Nous adapterons le service à votre profil.
                    </p>
                  </motion.div>

                  {/* Customer Type Options */}
                  <div className="grid gap-4 md:grid-cols-3 mb-12">
                    {customerTypes.map((type, index) => (
                      <motion.button
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        onClick={() => handleSelectCustomer(type.id)}
                        className={`relative p-5 rounded-xl border text-left transition-all duration-300 group ${
                          state.customerType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        {state.customerType === type.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check size={14} className="text-primary-foreground" />
                          </motion.div>
                        )}
                        
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
                          state.customerType === type.id 
                            ? "bg-primary" 
                            : "bg-secondary"
                        }`}>
                          <type.icon className={`w-6 h-6 ${
                            state.customerType === type.id 
                              ? "text-primary-foreground" 
                              : "text-foreground"
                          }`} />
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1">{type.title}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{type.subtitle}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                        
                        {/* Benefits chips */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {type.benefits.slice(0, 2).map((benefit, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
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
                      className="px-10 h-14 text-lg rounded-xl font-medium"
                    >
                      Choisir Découverte
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Visualisez votre profil avant toute décision.
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
