/**
 * Quote Calculator — Calculateur de devis interactif
 * Style: Premium Noir & Or
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Globe, 
  Star, 
  Crown, 
  Package, 
  Search, 
  Palette, 
  Languages, 
  Zap,
  Wrench,
  Check,
  ArrowRight,
  MessageCircle,
  Sparkles,
  RotateCcw
} from "lucide-react";

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

type Plan = "starter" | "standard" | "premium";

interface QuoteCalculatorProps {
  currency: "MAD" | "EUR";
}

const PLANS = {
  starter: { name: "Starter", pages: "1-3 pages", priceMAD: 2000, priceEUR: 200, icon: Globe },
  standard: { name: "Standard", pages: "4-6 pages", priceMAD: 5000, priceEUR: 500, icon: Star },
  premium: { name: "Premium", pages: "7-10 pages", priceMAD: 10000, priceEUR: 1000, icon: Crown },
};

const OPTIONS = [
  { id: "extra_pages", name: "Pages supplémentaires", priceMAD: 500, priceEUR: 50, unit: "/page", icon: Package, hasQuantity: true },
  { id: "ecommerce", name: "E-commerce", priceMAD: 1000, priceEUR: 100, icon: Globe, hasQuantity: false },
  { id: "seo", name: "SEO avancé", priceMAD: 500, priceEUR: 50, icon: Search, hasQuantity: false },
  { id: "branding", name: "Logo / Branding", priceMAD: 1500, priceEUR: 150, icon: Palette, hasQuantity: false },
  { id: "multilingual", name: "Multilingue", priceMAD: 800, priceEUR: 80, icon: Languages, hasQuantity: false },
  { id: "express", name: "Express 24-48h", priceMAD: 500, priceEUR: 50, icon: Zap, hasQuantity: false },
];

const MAINTENANCE = [
  { id: "none", name: "Sans maintenance", priceMAD: 0, priceEUR: 0, period: "" },
  { id: "monthly", name: "Mensuelle", priceMAD: 200, priceEUR: 20, period: "/mois" },
  { id: "yearly", name: "Annuelle", priceMAD: 2000, priceEUR: 200, period: "/an", badge: "2 mois offerts" },
];

export function QuoteCalculator({ currency }: QuoteCalculatorProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("standard");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [extraPagesCount, setExtraPagesCount] = useState(0);
  const [selectedMaintenance, setSelectedMaintenance] = useState("none");
  const [isCalculating, setIsCalculating] = useState(false);
  
  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
    if (optionId === "extra_pages" && !selectedOptions[optionId]) {
      setExtraPagesCount(1);
    } else if (optionId === "extra_pages") {
      setExtraPagesCount(0);
    }
  };
  
  const resetCalculator = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setSelectedPlan("standard");
      setSelectedOptions({});
      setExtraPagesCount(0);
      setSelectedMaintenance("none");
      setIsCalculating(false);
    }, 300);
  };
  
  const { basePrice, optionsPrice, maintenancePrice, totalPrice, optionsList } = useMemo(() => {
    const plan = PLANS[selectedPlan];
    const base = currency === "MAD" ? plan.priceMAD : plan.priceEUR;
    
    let options = 0;
    const activeOptions: string[] = [];
    
    OPTIONS.forEach(opt => {
      if (selectedOptions[opt.id]) {
        if (opt.id === "extra_pages") {
          options += (currency === "MAD" ? opt.priceMAD : opt.priceEUR) * extraPagesCount;
          activeOptions.push(`${extraPagesCount} page(s) supp.`);
        } else {
          options += currency === "MAD" ? opt.priceMAD : opt.priceEUR;
          activeOptions.push(opt.name);
        }
      }
    });
    
    const maintenance = MAINTENANCE.find(m => m.id === selectedMaintenance);
    const maintPrice = maintenance ? (currency === "MAD" ? maintenance.priceMAD : maintenance.priceEUR) : 0;
    
    return {
      basePrice: base,
      optionsPrice: options,
      maintenancePrice: maintPrice,
      totalPrice: base + options,
      optionsList: activeOptions
    };
  }, [selectedPlan, selectedOptions, extraPagesCount, selectedMaintenance, currency]);
  
  const currencySymbol = currency === "MAD" ? "DH" : "€";
  
  const generateWhatsAppMessage = () => {
    const plan = PLANS[selectedPlan];
    let message = `Bonjour 👋\n\nJe souhaite un devis pour :\n\n📦 Formule : ${plan.name} (${plan.pages})\n`;
    
    if (optionsList.length > 0) {
      message += `\n🔧 Options :\n${optionsList.map(o => `  • ${o}`).join("\n")}\n`;
    }
    
    if (selectedMaintenance !== "none") {
      const maint = MAINTENANCE.find(m => m.id === selectedMaintenance);
      message += `\n🛠️ Maintenance : ${maint?.name}\n`;
    }
    
    message += `\n💰 Total estimé : ${totalPrice.toLocaleString()} ${currencySymbol}`;
    if (maintenancePrice > 0) {
      message += ` + ${maintenancePrice.toLocaleString()} ${currencySymbol}${selectedMaintenance === "monthly" ? "/mois" : "/an"} maintenance`;
    }
    
    return encodeURIComponent(message);
  };

  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.noir }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: `${COLORS.or}10`, border: `1px solid ${COLORS.or}20` }}
          >
            <Calculator size={14} style={{ color: COLORS.or }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.or }}>
              Calculateur
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mb-4" style={{ color: COLORS.ivoire }}>
            Estimez votre devis
          </h2>
          <p className="text-sm" style={{ color: COLORS.gris }}>
            Configurez votre projet et obtenez une estimation instantanée
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Configuration */}
          <div className="lg:col-span-3 space-y-8">
            {/* Step 1: Plan Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl"
              style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}
                >
                  1
                </div>
                <h3 className="font-medium" style={{ color: COLORS.ivoire }}>Choisissez votre formule</h3>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-3">
                {(Object.entries(PLANS) as [Plan, typeof PLANS.starter][]).map(([key, plan]) => (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className="relative p-4 rounded-2xl text-left transition-all duration-300"
                    style={{ 
                      backgroundColor: selectedPlan === key ? `${COLORS.or}15` : COLORS.noirSoft,
                      border: `1px solid ${selectedPlan === key ? COLORS.or : COLORS.border}`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedPlan === key && (
                      <motion.div
                        className="absolute top-3 right-3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={16} style={{ color: COLORS.or }} />
                      </motion.div>
                    )}
                    <plan.icon 
                      size={24} 
                      className="mb-3"
                      style={{ color: selectedPlan === key ? COLORS.or : COLORS.gris }}
                    />
                    <h4 className="font-medium mb-1" style={{ color: COLORS.ivoire }}>{plan.name}</h4>
                    <p className="text-xs mb-2" style={{ color: COLORS.or }}>{plan.pages}</p>
                    <p className="text-lg font-light" style={{ color: COLORS.ivoire }}>
                      {(currency === "MAD" ? plan.priceMAD : plan.priceEUR).toLocaleString()} {currencySymbol}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            {/* Step 2: Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl"
              style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}
                >
                  2
                </div>
                <h3 className="font-medium" style={{ color: COLORS.ivoire }}>Ajoutez des options</h3>
                <span className="text-xs ml-auto" style={{ color: COLORS.gris }}>(optionnel)</span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {OPTIONS.map((option) => (
                  <motion.div
                    key={option.id}
                    className="relative"
                  >
                    <motion.button
                      onClick={() => toggleOption(option.id)}
                      className="w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-4"
                      style={{ 
                        backgroundColor: selectedOptions[option.id] ? `${COLORS.or}15` : COLORS.noirSoft,
                        border: `1px solid ${selectedOptions[option.id] ? COLORS.or : COLORS.border}`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${COLORS.or}10` }}
                      >
                        <option.icon size={18} style={{ color: COLORS.or }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate" style={{ color: COLORS.ivoire }}>{option.name}</h4>
                        <p className="text-sm" style={{ color: COLORS.or }}>
                          +{currency === "MAD" ? option.priceMAD : option.priceEUR} {currencySymbol}{option.unit || ""}
                        </p>
                      </div>
                      <div 
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors`}
                        style={{ 
                          backgroundColor: selectedOptions[option.id] ? COLORS.or : "transparent",
                          border: `1px solid ${selectedOptions[option.id] ? COLORS.or : COLORS.gris}`,
                        }}
                      >
                        {selectedOptions[option.id] && <Check size={12} style={{ color: COLORS.noir }} />}
                      </div>
                    </motion.button>
                    
                    {/* Quantity selector for extra pages */}
                    <AnimatePresence>
                      {option.hasQuantity && selectedOptions[option.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex items-center justify-center gap-4 p-3 rounded-lg"
                          style={{ backgroundColor: COLORS.noirSoft }}
                        >
                          <span className="text-xs" style={{ color: COLORS.gris }}>Nombre:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExtraPagesCount(Math.max(1, extraPagesCount - 1))}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                              style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}`, color: COLORS.ivoire }}
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-medium" style={{ color: COLORS.ivoire }}>
                              {extraPagesCount}
                            </span>
                            <button
                              onClick={() => setExtraPagesCount(extraPagesCount + 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                              style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}`, color: COLORS.ivoire }}
                            >
                              +
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Step 3: Maintenance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl"
              style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}
                >
                  3
                </div>
                <h3 className="font-medium" style={{ color: COLORS.ivoire }}>Maintenance</h3>
                <span className="text-xs ml-auto" style={{ color: COLORS.gris }}>(recommandé)</span>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-3">
                {MAINTENANCE.map((maint) => (
                  <motion.button
                    key={maint.id}
                    onClick={() => setSelectedMaintenance(maint.id)}
                    className="relative p-4 rounded-xl text-left transition-all duration-300"
                    style={{ 
                      backgroundColor: selectedMaintenance === maint.id ? `${COLORS.or}15` : COLORS.noirSoft,
                      border: `1px solid ${selectedMaintenance === maint.id ? COLORS.or : COLORS.border}`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {maint.badge && (
                      <span 
                        className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: COLORS.or, color: COLORS.noir }}
                      >
                        {maint.badge}
                      </span>
                    )}
                    {selectedMaintenance === maint.id && (
                      <motion.div
                        className="absolute top-3 right-3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={14} style={{ color: COLORS.or }} />
                      </motion.div>
                    )}
                    <Wrench 
                      size={18} 
                      className="mb-2"
                      style={{ color: selectedMaintenance === maint.id ? COLORS.or : COLORS.gris }}
                    />
                    <h4 className="font-medium text-sm mb-1" style={{ color: COLORS.ivoire }}>{maint.name}</h4>
                    <p className="text-sm" style={{ color: maint.id === "none" ? COLORS.gris : COLORS.or }}>
                      {maint.id === "none" ? "—" : `${maint.priceMAD > 0 ? (currency === "MAD" ? maint.priceMAD : maint.priceEUR) : 0} ${currencySymbol}${maint.period}`}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 p-6 rounded-3xl"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.noirCard} 0%, ${COLORS.noirSoft} 100%)`,
                border: `1px solid ${COLORS.or}30`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: COLORS.or }} />
                  <h3 className="font-medium" style={{ color: COLORS.ivoire }}>Votre devis</h3>
                </div>
                <button
                  onClick={resetCalculator}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: `${COLORS.gris}20` }}
                  title="Réinitialiser"
                >
                  <RotateCcw size={14} style={{ color: COLORS.gris }} />
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedPlan}-${JSON.stringify(selectedOptions)}-${extraPagesCount}-${selectedMaintenance}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Selected Plan */}
                  <div className="mb-6 pb-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const PlanIcon = PLANS[selectedPlan].icon;
                          return <PlanIcon size={16} style={{ color: COLORS.or }} />;
                        })()}
                        <span className="text-sm" style={{ color: COLORS.ivoire }}>
                          Formule {PLANS[selectedPlan].name}
                        </span>
                      </div>
                      <span className="font-medium" style={{ color: COLORS.ivoire }}>
                        {basePrice.toLocaleString()} {currencySymbol}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: COLORS.gris }}>{PLANS[selectedPlan].pages}</p>
                  </div>
                  
                  {/* Selected Options */}
                  {optionsList.length > 0 && (
                    <div className="mb-6 pb-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <p className="text-xs uppercase tracking-wider mb-3" style={{ color: COLORS.gris }}>Options</p>
                      <div className="space-y-2">
                        {OPTIONS.filter(opt => selectedOptions[opt.id]).map(opt => (
                          <div key={opt.id} className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: COLORS.ivoire }}>
                              {opt.id === "extra_pages" ? `${extraPagesCount} page(s) supp.` : opt.name}
                            </span>
                            <span className="text-sm" style={{ color: COLORS.or }}>
                              +{((currency === "MAD" ? opt.priceMAD : opt.priceEUR) * (opt.id === "extra_pages" ? extraPagesCount : 1)).toLocaleString()} {currencySymbol}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Maintenance */}
                  {selectedMaintenance !== "none" && (
                    <div className="mb-6 pb-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <p className="text-xs uppercase tracking-wider mb-3" style={{ color: COLORS.gris }}>Maintenance</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: COLORS.ivoire }}>
                          {MAINTENANCE.find(m => m.id === selectedMaintenance)?.name}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.or }}>
                          {maintenancePrice.toLocaleString()} {currencySymbol}{selectedMaintenance === "monthly" ? "/mois" : "/an"}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="mb-8">
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-sm uppercase tracking-wider" style={{ color: COLORS.gris }}>Total projet</span>
                      <div className="text-right">
                        <motion.span 
                          className="text-3xl font-light"
                          style={{ color: COLORS.or }}
                          key={totalPrice}
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          {totalPrice.toLocaleString()}
                        </motion.span>
                        <span className="text-lg ml-2" style={{ color: COLORS.gris }}>{currencySymbol}</span>
                      </div>
                    </div>
                    {maintenancePrice > 0 && (
                      <p className="text-xs text-right" style={{ color: COLORS.gris }}>
                        + {maintenancePrice.toLocaleString()} {currencySymbol}{selectedMaintenance === "monthly" ? "/mois" : "/an"} maintenance
                      </p>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <a 
                    href={`https://wa.me/33626424394?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button 
                      className="w-full py-6 font-medium text-sm uppercase tracking-widest group"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                        color: COLORS.noir,
                      }}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Demander ce devis
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                  
                  <p className="text-center text-xs mt-4" style={{ color: COLORS.gris }}>
                    Devis gratuit • Réponse en 24h
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
