/**
 * Pricing Page — Tarifs i-wasp
 * Grille tarifaire complète : Cartes NFC + Création Web
 * Style: Haute Couture Digitale - Noir & Or
 * Système de panier intégré avec calcul automatique
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  X, 
  Crown, 
  Star, 
  ArrowRight, 
  Shield, 
  Users,
  Globe,
  Sparkles,
  Zap,
  Package,
  Palette,
  Search,
  Languages,
  Clock,
  Wrench,
  MessageCircle,
  CreditCard,
  Loader2,
  ShoppingCart,
  Plus as PlusIcon
} from "lucide-react";
import { SUBSCRIPTION_PLANS, FEATURE_COMPARISON } from "@/lib/subscriptionPlans";
import { QuoteCalculator } from "@/components/pricing/QuoteCalculator";
import { FloatingCartSummary } from "@/components/pricing/FloatingCartSummary";
import { PricingCartProvider, usePricingCart, WEB_PACKAGES, WEB_OPTIONS as CART_OPTIONS, MAINTENANCE_PLANS as CART_MAINTENANCE } from "@/contexts/PricingCartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Palette Premium Noir & Or
const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
};

// Grille tarifaire Web Studio
const WEB_PLANS = [
  {
    name: "Starter",
    packageType: "STARTER" as const,
    pages: "1-3 pages",
    priceMAD: 2000,
    priceEUR: 200,
    description: "Idéal pour une présence simple",
    features: ["Design responsive", "Hébergement inclus", "Formulaire de contact", "Optimisation SEO de base"],
    icon: Globe,
    popular: false,
  },
  {
    name: "Standard",
    packageType: "STANDARD" as const,
    pages: "4-6 pages",
    priceMAD: 5000,
    priceEUR: 500,
    description: "Pour une présence professionnelle",
    features: ["Tout Starter +", "Galerie photos", "Intégration réseaux sociaux", "Google Analytics", "Blog intégré"],
    icon: Star,
    popular: true,
  },
  {
    name: "Premium",
    packageType: "PREMIUM" as const,
    pages: "7-10 pages",
    priceMAD: 10000,
    priceEUR: 1000,
    description: "Solution complète sur-mesure",
    features: ["Tout Standard +", "Design premium", "Animations avancées", "CMS personnalisé", "Support prioritaire"],
    icon: Crown,
    popular: false,
  },
];

const WEB_OPTIONS = [
  { name: "Page supplémentaire", priceMAD: 500, priceEUR: 50, unit: "/page", icon: Package },
  { name: "E-commerce", priceMAD: 1000, priceEUR: 100, unit: "", icon: Globe },
  { name: "SEO avancé", priceMAD: 500, priceEUR: 50, unit: "", icon: Search },
  { name: "Logo / Branding", priceMAD: 1500, priceEUR: 150, unit: "", icon: Palette },
  { name: "Multilingue", priceMAD: 800, priceEUR: 80, unit: "", icon: Languages },
  { name: "Express 24-48h", priceMAD: 500, priceEUR: 50, unit: "", icon: Zap },
];

const MAINTENANCE_PLANS = [
  { name: "Mensuelle", priceMAD: 200, priceEUR: 20, period: "/mois" },
  { name: "Annuelle", priceMAD: 2000, priceEUR: 200, period: "/an", savings: "2 mois offerts" },
];

const faqs = [
  {
    question: "La carte NFC est-elle incluse ?",
    answer: "Oui. La carte NFC premium est incluse dans chaque niveau de service.",
  },
  {
    question: "Quelle est la différence entre Essentiel et Signature ?",
    answer: "Essentiel vous donne accès à la conciergerie avec un profil standard. Signature débloque l'expérience complète : mises à jour illimitées, statistiques, capture de contacts, et support prioritaire.",
  },
  {
    question: "Combien de temps pour créer un site web ?",
    answer: "En mode standard, comptez 5 à 7 jours ouvrés. En mode Express, votre site est livré en 24-48h.",
  },
  {
    question: "Comment fonctionne la maintenance ?",
    answer: "La maintenance inclut les mises à jour de sécurité, sauvegardes régulières et support technique par WhatsApp.",
  },
];

type Tab = "nfc" | "web";

// Inner component that uses the cart context
function PricingContent() {
  const [activeTab, setActiveTab] = useState<Tab>("web");
  const { currency, setCurrency, addItem, items } = usePricingCart();
  const [loadingPayment, setLoadingPayment] = useState<string | null>(null);

  const handleAddPackage = (packageKey: keyof typeof WEB_PACKAGES) => {
    const pkg = WEB_PACKAGES[packageKey];
    addItem({
      id: pkg.id,
      name: pkg.name,
      type: 'package',
      priceMAD: pkg.priceMAD,
      priceEUR: pkg.priceEUR,
    });
    toast.success(`${pkg.name} ajouté au panier`);
  };

  const handleAddOption = (option: typeof CART_OPTIONS[0]) => {
    addItem({
      id: option.id,
      name: option.name,
      type: 'option',
      priceMAD: option.priceMAD,
      priceEUR: option.priceEUR,
      unit: option.unit,
    });
    toast.success(`${option.name} ajouté au panier`);
  };

  const handleAddMaintenance = (maintenance: typeof CART_MAINTENANCE[0]) => {
    addItem({
      id: maintenance.id,
      name: maintenance.name,
      type: 'maintenance',
      priceMAD: maintenance.priceMAD,
      priceEUR: maintenance.priceEUR,
      period: maintenance.period,
    });
    toast.success(`${maintenance.name} ajouté au panier`);
  };

  const isInCart = (id: string) => items.some(item => item.id === id);

  const handleDirectPayment = async (packageType: string) => {
    setLoadingPayment(packageType);
    try {
      const { data, error } = await supabase.functions.invoke('create-direct-webstudio-payment', {
        body: { 
          packageType,
          currency: currency,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Redirection vers le paiement sécurisé...');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Erreur lors de la création du paiement');
    } finally {
      setLoadingPayment(null);
    }
  };

  const renderValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm">{value}</span>;
    }
    return value ? (
      <Check className="w-5 h-5" style={{ color: COLORS.or }} />
    ) : (
      <X className="w-5 h-5" style={{ color: `${COLORS.gris}40` }} />
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.noir, color: COLORS.ivoire }}>
      <CoutureNavbar />
      
      {/* Floating Cart */}
      <FloatingCartSummary />
      
      {/* Hero */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background effects */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[250px] pointer-events-none"
          style={{ backgroundColor: `${COLORS.or}08` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{ backgroundColor: `${COLORS.or}15`, border: `1px solid ${COLORS.or}30` }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} style={{ color: COLORS.or }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.or }}>
                Tarifs transparents
              </span>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight mb-6">
              Nos{" "}
              <span style={{ color: COLORS.or }}>tarifs</span>
            </h1>
            
            <p className="text-lg font-light max-w-xl mx-auto" style={{ color: COLORS.gris }}>
              Des solutions adaptées à chaque besoin, de la carte NFC au site web complet.
            </p>
          </motion.div>
          
          {/* Tab Switcher */}
          <motion.div 
            className="mt-12 inline-flex p-1.5 rounded-2xl"
            style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { id: "web" as Tab, label: "Création Web", icon: Globe },
              { id: "nfc" as Tab, label: "Cartes NFC", icon: Package },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
                style={{
                  backgroundColor: activeTab === tab.id ? `${COLORS.or}15` : "transparent",
                  color: activeTab === tab.id ? COLORS.or : COLORS.gris,
                  border: activeTab === tab.id ? `1px solid ${COLORS.or}30` : "1px solid transparent",
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </motion.div>
          
          {/* Currency Toggle */}
          <motion.div 
            className="mt-6 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs" style={{ color: COLORS.gris }}>Devise :</span>
            <div 
              className="inline-flex p-1 rounded-lg"
              style={{ backgroundColor: COLORS.noirCard }}
            >
              {["MAD", "EUR"].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr as "MAD" | "EUR")}
                  className="px-4 py-1.5 rounded-md text-xs font-medium transition-all"
                  style={{
                    backgroundColor: currency === curr ? COLORS.or : "transparent",
                    color: currency === curr ? COLORS.noir : COLORS.gris,
                  }}
                >
                  {curr === "MAD" ? "🇲🇦 DH" : "🇫🇷 EUR"}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "web" ? (
          <motion.div
            key="web"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Web Plans */}
            <section className="py-12 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mb-4">
                    Création de Sites Web
                  </h2>
                  <p className="text-sm" style={{ color: COLORS.gris }}>
                    Sites professionnels clé en main, optimisés et responsive
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                  {WEB_PLANS.map((plan, index) => (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className={`relative flex flex-col rounded-[28px] overflow-hidden ${plan.popular ? "md:scale-105 z-10" : ""}`}
                      style={{ 
                        backgroundColor: plan.popular ? COLORS.noirCard : COLORS.noirCard,
                        border: `1px solid ${plan.popular ? COLORS.or : COLORS.border}`,
                        boxShadow: plan.popular 
                          ? `0 20px 60px -20px ${COLORS.or}30, 0 0 0 1px ${COLORS.or}20` 
                          : 'none',
                      }}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div 
                          className="text-center py-2.5"
                          style={{ 
                            background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                          }}
                        >
                          <span 
                            className="text-[11px] font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                            style={{ color: COLORS.noir }}
                          >
                            <Star size={12} fill={COLORS.noir} />
                            Recommandé
                          </span>
                        </div>
                      )}
                      
                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-8">
                        {/* Icon */}
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                          style={{ 
                            backgroundColor: plan.popular ? `${COLORS.or}15` : `${COLORS.gris}10`,
                            border: `1px solid ${plan.popular ? COLORS.or : COLORS.gris}20`,
                          }}
                        >
                          <plan.icon size={22} style={{ color: plan.popular ? COLORS.or : COLORS.gris }} />
                        </div>
                        
                        {/* Plan Info */}
                        <h3 
                          className="text-xl font-semibold mb-1 tracking-tight"
                          style={{ color: COLORS.ivoire }}
                        >
                          {plan.name}
                        </h3>
                        <p 
                          className="text-xs font-medium uppercase tracking-wider mb-2"
                          style={{ color: COLORS.or }}
                        >
                          {plan.pages}
                        </p>
                        <p 
                          className="text-sm font-light mb-6 leading-relaxed"
                          style={{ color: COLORS.gris }}
                        >
                          {plan.description}
                        </p>
                        
                        {/* Price */}
                        <div className="mb-8">
                          <div className="flex items-baseline gap-1.5">
                            <span 
                              className="text-4xl font-light tracking-tight"
                              style={{ color: plan.popular ? COLORS.or : COLORS.ivoire }}
                            >
                              {currency === "MAD" ? plan.priceMAD.toLocaleString('fr-FR') : plan.priceEUR.toLocaleString('fr-FR')}
                            </span>
                            <span 
                              className="text-base font-light"
                              style={{ color: COLORS.gris }}
                            >
                              {currency === "MAD" ? "DH" : "€"}
                            </span>
                          </div>
                          <p 
                            className="text-xs mt-1"
                            style={{ color: `${COLORS.gris}80` }}
                          >
                            Paiement unique
                          </p>
                        </div>
                        
                        {/* CTA Buttons */}
                        <div className="space-y-3 mb-8">
                          {/* Primary: Add to Cart */}
                          <Button 
                            className="w-full h-12 font-medium text-xs uppercase tracking-[0.15em] rounded-xl transition-all duration-300"
                            style={{ 
                              background: isInCart(`web-${plan.packageType.toLowerCase()}`)
                                ? '#22c55e'
                                : plan.popular 
                                  ? `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`
                                  : COLORS.ivoire,
                              color: COLORS.noir,
                              boxShadow: plan.popular 
                                ? `0 8px 24px -8px ${COLORS.or}60` 
                                : 'none',
                            }}
                            onClick={() => handleAddPackage(plan.packageType as keyof typeof WEB_PACKAGES)}
                            disabled={isInCart(`web-${plan.packageType.toLowerCase()}`)}
                          >
                            {isInCart(`web-${plan.packageType.toLowerCase()}`) ? (
                              <>
                                <Check size={14} className="mr-2" />
                                Ajouté au panier
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={14} className="mr-2" />
                                Ajouter au panier
                              </>
                            )}
                          </Button>

                          {/* Secondary: Direct Payment */}
                          <Button 
                            variant="ghost"
                            className="w-full h-10 font-normal text-[10px] uppercase tracking-[0.12em] rounded-xl transition-all duration-300 hover:bg-white/5"
                            style={{ 
                              color: COLORS.gris,
                              border: `1px solid ${COLORS.border}`,
                            }}
                            onClick={() => handleDirectPayment(plan.packageType)}
                            disabled={loadingPayment === plan.packageType}
                          >
                            {loadingPayment === plan.packageType ? (
                              <Loader2 size={12} className="mr-2 animate-spin" />
                            ) : (
                              <CreditCard size={12} className="mr-2" />
                            )}
                            {loadingPayment === plan.packageType ? 'Chargement...' : 'Payer ce forfait seul'}
                          </Button>
                        </div>

                        {/* Features Divider */}
                        <div 
                          className="border-t pt-6 mt-auto"
                          style={{ borderColor: COLORS.border }}
                        >
                          <p 
                            className="text-[10px] uppercase tracking-[0.15em] font-medium mb-4"
                            style={{ color: COLORS.gris }}
                          >
                            Inclus dans ce forfait
                          </p>
                          <ul className="space-y-3">
                            {plan.features.map((feature, i) => (
                              <li 
                                key={i} 
                                className="flex items-start gap-3 text-sm font-light"
                                style={{ color: `${COLORS.gris}CC` }}
                              >
                                <div 
                                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                  style={{ backgroundColor: `${COLORS.or}15` }}
                                >
                                  <Check size={12} style={{ color: COLORS.or }} />
                                </div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Options / Supplements */}
            <section className="py-20 px-4" style={{ backgroundColor: COLORS.noir }}>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mb-4">
                    Options & Suppléments
                  </h2>
                  <p className="text-sm" style={{ color: COLORS.gris }}>
                    Personnalisez votre projet avec nos options
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CART_OPTIONS.map((option, index) => {
                    const optionInCart = isInCart(option.id);
                    return (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => !optionInCart && handleAddOption(option)}
                        className={`p-5 rounded-2xl flex items-center gap-4 group cursor-pointer transition-all duration-300 ${optionInCart ? 'ring-2 ring-green-500' : ''}`}
                        style={{ 
                          backgroundColor: COLORS.noirCard,
                          border: `1px solid ${optionInCart ? '#22c55e' : COLORS.border}`,
                        }}
                        whileHover={{ 
                          borderColor: optionInCart ? '#22c55e' : `${COLORS.or}40`,
                          scale: 1.02,
                        }}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{ backgroundColor: optionInCart ? '#22c55e20' : `${COLORS.or}10` }}
                        >
                          {optionInCart ? (
                            <Check size={20} style={{ color: '#22c55e' }} />
                          ) : (
                            <PlusIcon size={20} style={{ color: COLORS.or }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1" style={{ color: optionInCart ? '#22c55e' : COLORS.ivoire }}>
                            {option.name}
                            {optionInCart && <span className="ml-2 text-xs">(ajouté)</span>}
                          </h4>
                          <p className="text-lg font-light" style={{ color: COLORS.or }}>
                            +{currency === "MAD" ? option.priceMAD : option.priceEUR}{" "}
                            <span className="text-sm" style={{ color: COLORS.gris }}>
                              {currency === "MAD" ? "DH" : "€"}{option.unit || ''}
                            </span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Maintenance */}
            <section className="py-20 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ backgroundColor: `${COLORS.or}10`, border: `1px solid ${COLORS.or}20` }}
                  >
                    <Wrench size={14} style={{ color: COLORS.or }} />
                    <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.or }}>
                      Maintenance
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mb-4">
                    Maintenance & Support
                  </h2>
                  <p className="text-sm" style={{ color: COLORS.gris }}>
                    Mises à jour, sauvegardes et support technique inclus
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {CART_MAINTENANCE.map((plan, index) => {
                    const maintenanceInCart = isInCart(plan.id);
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-8 rounded-3xl relative overflow-hidden ${maintenanceInCart ? 'ring-2 ring-green-500' : ''}`}
                        style={{ 
                          backgroundColor: COLORS.noirCard,
                          border: `1px solid ${maintenanceInCart ? '#22c55e' : plan.badge ? COLORS.or : COLORS.border}40`,
                        }}
                      >
                        {plan.badge && (
                          <div 
                            className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-medium uppercase"
                            style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}
                          >
                            {plan.badge}
                          </div>
                        )}
                        
                        <h3 className="text-xl font-medium mb-4" style={{ color: maintenanceInCart ? '#22c55e' : COLORS.ivoire }}>
                          {plan.name}
                          {maintenanceInCart && <span className="ml-2 text-sm">(ajouté)</span>}
                        </h3>
                        
                        <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-4xl font-light">
                            {currency === "MAD" ? plan.priceMAD.toLocaleString() : plan.priceEUR}
                          </span>
                          <span style={{ color: COLORS.gris }}>
                            {currency === "MAD" ? "DH" : "€"}{plan.period}
                          </span>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {["Mises à jour de sécurité", "Sauvegardes régulières", "Support technique WhatsApp"].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm font-light" style={{ color: COLORS.gris }}>
                              <Check size={14} style={{ color: COLORS.or }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className="w-full py-5 font-medium text-sm uppercase tracking-widest"
                          style={{ 
                            backgroundColor: maintenanceInCart ? '#22c55e' : 'transparent',
                            borderColor: maintenanceInCart ? '#22c55e' : COLORS.border, 
                            color: maintenanceInCart ? COLORS.noir : COLORS.ivoire,
                            border: maintenanceInCart ? 'none' : `1px solid ${COLORS.border}`,
                          }}
                          onClick={() => !maintenanceInCart && handleAddMaintenance(plan)}
                          disabled={maintenanceInCart}
                        >
                          {maintenanceInCart ? (
                            <>
                              <Check size={16} className="mr-2" />
                              Ajouté
                            </>
                          ) : (
                            <>
                              <PlusIcon size={16} className="mr-2" />
                              Ajouter au panier
                            </>
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Quote Calculator */}
            <QuoteCalculator currency={currency} />
          </motion.div>
        ) : (
          <motion.div
            key="nfc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* NFC Plans */}
            <section className="py-12 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mb-4">
                    Cartes NFC Premium
                  </h2>
                  <p className="text-sm" style={{ color: COLORS.gris }}>
                    La carte physique est incluse dans chaque service
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  {/* ESSENTIEL */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="p-8 rounded-3xl"
                    style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${COLORS.gris}15` }}
                    >
                      <Star size={22} style={{ color: COLORS.gris }} />
                    </div>
                    
                    <h3 className="text-2xl font-medium mb-1 tracking-tight">Essentiel</h3>
                    <p className="text-sm mb-6 font-light" style={{ color: COLORS.gris }}>Votre entrée dans la conciergerie</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-light">{currency === "MAD" ? "290" : "29"}</span>
                      <span className="text-lg ml-2" style={{ color: COLORS.gris }}>{currency === "MAD" ? "DH" : "€"}</span>
                      <p className="text-sm mt-1" style={{ color: COLORS.gris }}>mise en service</p>
                    </div>
                    
                    <a 
                      href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20accéder%20au%20service%20Essentiel%20i-Wasp."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="outline"
                        className="w-full py-6 font-medium text-sm uppercase tracking-widest"
                        style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                      >
                        Accéder au service
                      </Button>
                    </a>

                    <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <p className="text-[10px] font-medium uppercase tracking-widest mb-4" style={{ color: COLORS.gris }}>Inclus</p>
                      <ul className="space-y-3">
                        {SUBSCRIPTION_PLANS.ESSENTIEL.included.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-light" style={{ color: COLORS.gris }}>
                            <Check size={16} className="flex-shrink-0" style={{ color: COLORS.gris }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* SIGNATURE */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="relative p-8 rounded-3xl md:-mt-4 md:mb-4"
                    style={{ 
                      backgroundColor: `${COLORS.or}08`,
                      border: `1px solid ${COLORS.or}40`,
                    }}
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span 
                        className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider flex items-center gap-2"
                        style={{ 
                          background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                          color: COLORS.noir,
                        }}
                      >
                        <Crown size={12} />
                        Recommandé
                      </span>
                    </div>
                    
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 mt-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                      }}
                    >
                      <Crown size={24} style={{ color: COLORS.noir }} />
                    </div>
                    
                    <h3 className="text-2xl font-medium mb-1 tracking-tight">Signature</h3>
                    <p className="font-light text-sm mb-6" style={{ color: COLORS.ivoire }}>L'expérience conciergerie complète</p>
                    
                    <div className="mb-6 space-y-3">
                      <div 
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: `${COLORS.noirCard}80`, border: `1px solid ${COLORS.border}` }}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-light">{currency === "MAD" ? "490" : "49"}</span>
                          <span style={{ color: COLORS.gris }}>{currency === "MAD" ? "DH" : "€"}/an</span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: COLORS.gris }}>
                          soit {currency === "MAD" ? "41 DH" : "4€"}/mois
                        </p>
                      </div>
                    </div>
                    
                    <Link to="/order/type">
                      <Button 
                        className="w-full py-6 font-medium text-sm uppercase tracking-widest"
                        style={{ 
                          background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                          color: COLORS.noir,
                        }}
                      >
                        <Crown size={16} className="mr-2" />
                        Choisir Signature
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>

                    <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <p className="text-[10px] font-medium uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: COLORS.or }}>
                        <Star size={12} style={{ fill: COLORS.or }} />
                        Service complet
                      </p>
                      <ul className="space-y-3">
                        {SUBSCRIPTION_PLANS.SIGNATURE.included.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-light">
                            <Check size={16} className="flex-shrink-0" style={{ color: COLORS.or }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* ÉLITE */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="p-8 rounded-3xl"
                    style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: COLORS.ivoire }}
                    >
                      <Users size={22} style={{ color: COLORS.noir }} />
                    </div>
                    
                    <h3 className="text-2xl font-medium mb-1 tracking-tight">Élite</h3>
                    <p className="text-sm mb-6 font-light" style={{ color: COLORS.gris }}>Service sur-mesure entreprises</p>
                    
                    <div className="mb-6">
                      <span className="text-2xl font-medium">Sur devis</span>
                    </div>
                    
                    <a 
                      href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20en%20savoir%20plus%20sur%20le%20service%20Élite%20pour%20mon%20équipe."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button 
                        variant="outline"
                        className="w-full py-6 font-medium text-sm uppercase tracking-widest"
                        style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                      >
                        Nous contacter
                      </Button>
                    </a>

                    <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <p className="text-[10px] font-medium uppercase tracking-widest mb-4" style={{ color: COLORS.gris }}>Inclus</p>
                      <ul className="space-y-3">
                        {SUBSCRIPTION_PLANS.ELITE.included.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-light" style={{ color: COLORS.gris }}>
                            <Check size={16} className="flex-shrink-0" style={{ color: COLORS.gris }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
                
                <p className="text-center text-xs mt-8 font-light" style={{ color: COLORS.gris }}>
                  Taux de conversion : 1 EUR ≈ 10 MAD
                </p>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 px-4" style={{ backgroundColor: COLORS.noir }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="font-display text-2xl md:text-3xl font-light text-center mb-12 tracking-tight">
                  Comparaison des services
                </h2>
                
                <div 
                  className="rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${COLORS.border}` }}
                >
                  <div 
                    className="grid grid-cols-3"
                    style={{ backgroundColor: COLORS.noirCard }}
                  >
                    <div className="p-4 font-medium text-sm" style={{ color: COLORS.gris }}>Service</div>
                    <div 
                      className="p-4 text-center font-medium text-sm"
                      style={{ borderLeft: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}` }}
                    >
                      Essentiel
                    </div>
                    <div 
                      className="p-4 text-center font-medium text-sm"
                      style={{ backgroundColor: `${COLORS.or}10`, color: COLORS.or }}
                    >
                      Signature
                    </div>
                  </div>
                  
                  {FEATURE_COMPARISON.map((feature, index) => (
                    <div 
                      key={index}
                      className="grid grid-cols-3"
                      style={{ backgroundColor: index % 2 === 0 ? `${COLORS.gris}05` : COLORS.noir }}
                    >
                      <div className="p-4 text-sm font-light">{feature.name}</div>
                      <div 
                        className="p-4 flex justify-center items-center"
                        style={{ borderLeft: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}` }}
                      >
                        {renderValue(feature.free)}
                      </div>
                      <div 
                        className="p-4 flex justify-center items-center"
                        style={{ backgroundColor: `${COLORS.or}05` }}
                      >
                        {renderValue(feature.gold)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <section className="py-24 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-light text-center mb-12 tracking-tight">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
              >
                <h3 className="font-medium mb-3">{faq.question}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: COLORS.gris }}>
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4" style={{ backgroundColor: COLORS.noir }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mb-6">
              Prêt à démarrer ?
            </h2>
            <p className="text-sm mb-8" style={{ color: COLORS.gris }}>
              Contactez-nous pour discuter de votre projet
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20en%20savoir%20plus%20sur%20vos%20services."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  className="px-8 py-6 font-medium text-sm uppercase tracking-widest"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                    color: COLORS.noir,
                  }}
                >
                  <MessageCircle size={18} className="mr-2" />
                  Discuter sur WhatsApp
                </Button>
              </a>
              <Link to="/web-studio">
                <Button 
                  variant="outline"
                  className="px-8 py-6 font-medium text-sm uppercase tracking-widest"
                  style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                >
                  <Sparkles size={18} className="mr-2" />
                  Essayer le Web Studio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <CoutureFooter />
    </div>
  );
}

// Main export with Provider wrapper
export default function Pricing() {
  return (
    <PricingCartProvider>
      <PricingContent />
    </PricingCartProvider>
  );
}
