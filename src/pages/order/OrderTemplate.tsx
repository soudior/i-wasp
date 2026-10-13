import { ORDER_PALETTES } from "@/lib/orderPalette";
/**
 * Step 2: Choix du template
 * /order/template
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste, silencieux
 */

import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Check, ArrowLeft } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  accent?: string;
  pattern?: "diagonal" | "honeycomb" | "grid" | "dots";
  isSignature?: boolean;
}

const templates: TemplateOption[] = [
  {
    id: "signature",
    name: "Signature",
    description: "Élégant et minimaliste",
    preview: "linear-gradient(145deg, #2a2a4a 0%, #1a1a2e 50%, #0d0d1a 100%)",
    pattern: "diagonal",
  },
  {
    id: "dark-luxury",
    name: "Dark Luxury",
    description: "Noir premium, accents dorés",
    preview: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #050505 100%)",
    accent: "#D4AF37",
    pattern: "honeycomb",
    isSignature: true,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Design corporate",
    preview: "linear-gradient(145deg, #1e4a6f 0%, #1e3a5f 50%, #0d1f35 100%)",
    accent: "#87CEEB",
    pattern: "grid",
  },
  {
    id: "boutique",
    name: "Boutique",
    description: "Commerces et artisans",
    preview: "linear-gradient(145deg, #4a3f35 0%, #2d2620 50%, #1a1512 100%)",
    accent: "#C9A96E",
    pattern: "dots",
  },
];

function OrderTemplateContent() {
  const reducedMotion = useReducedMotion();
  const lock = useRef(false);
  const navigate = useNavigate();
  const { state, setSelectedTemplate, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(state.selectedTemplate || "dark-luxury");

  const handleSelectTemplate = (templateId: string) => {
    setSelectedId(templateId);
  };

  const handleContinue = async () => {
    if (lock.current || isNavigating || state.isTransitioning) return;
    lock.current = true;
    setIsNavigating(true);
    setSelectedTemplate(selectedId);
    await nextStep();
  };

  const handleBack = () => {
    if (isNavigating || state.isTransitioning) return;
    prevStep();
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
            onClick={handleBack}
            className="flex items-center gap-2 transition-all duration-500"
            style={{ color: "#bcb8b0" }}
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
              03
            </span>
            <div 
              className="w-12 h-px"
              style={{ backgroundColor: `${COUTURE.gold}40` }}
            />
            <span 
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "#bcb8b0" }}
            >
              Template
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
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 
              className="font-display text-2xl md:text-3xl font-light italic mb-4"
              style={{ color: COUTURE.silk }}
            >
              Votre <span style={{ color: COUTURE.gold }}>univers visuel.</span>
            </h1>
            <p 
              className="text-sm font-light"
              style={{ color: "#bcb8b0" }}
            >
              Choisissez la palette de votre profil public. La mise en page reste commune ; la carte physique se personnalise à l’étape suivante.
            </p>
          </motion.div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template, i) => {
              const isSelected = selectedId === template.id;
              
              return (
                <motion.button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  aria-pressed={isSelected}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.8 }}
                  className="text-left transition-all duration-700 relative overflow-hidden"
                  style={{
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
                  {/* Preview area */}
                  <div 
                    className="min-h-36 relative overflow-hidden"
                    style={{ background: ORDER_PALETTES[template.id as keyof typeof ORDER_PALETTES].backgroundColor }}
                  >
                    <div className="m-4 p-3 rounded-xl" style={{ background: '#1D1D1F', color: '#FFFFFF' }}>
                      <p className="text-sm">Votre nom</p>
                      <p className="text-xs" style={{color:'#C7C7CC'}}>Profil public</p>
                      <span className="block text-xs mt-2 px-2 py-1 rounded" style={{background: ORDER_PALETTES[template.id as keyof typeof ORDER_PALETTES].accentColor}}>Ajouter au contact</span>
                    </div>

                    {/* Selection check */}
                    {isSelected && (
                      <motion.div 
                        initial={reducedMotion ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COUTURE.gold }}
                      >
                        <Check className="w-3 h-3" style={{ color: COUTURE.jet }} />
                      </motion.div>
                    )}
                  </div>

                  {/* Info */}
                  <div 
                    className="p-4"
                    style={{ backgroundColor: isSelected ? `${COUTURE.gold}08` : 'transparent' }}
                  >
                    <h3 
                      className="font-display text-sm font-light mb-1"
                      style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
                    >
                      {template.name}
                    </h3>
                    <p 
                      className="text-[11px]"
                      style={{ color: "#bcb8b0" }}
                    >
                      {template.description}
                    </p>
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
            disabled={!selectedId || isNavigating || state.isTransitioning}
            className="text-[11px] uppercase tracking-[0.25em] min-h-12 px-8 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              color: selectedId ? "#d6c6ac" : "#bcb8b0",
              borderBottom: `1px solid ${selectedId ? `${COUTURE.gold}60` : 'transparent'}`,
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderTemplate() {
  return (
    <OrderFunnelGuard step={3}>
      <OrderTemplateContent />
    </OrderFunnelGuard>
  );
}
