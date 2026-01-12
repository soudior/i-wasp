/**
 * Step 2: Choix du template
 * /order/template
 * 
 * Sélection du template de profil digital
 * Style Luxe Max
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STEALTH } from "@/lib/stealthPalette";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Sparkles,
  User,
  Building2,
  Briefcase,
  Crown,
  Hotel,
  Star,
  Palette
} from "lucide-react";

// Template options
interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  preview: string; // Color for preview
  badge?: string;
  forOffers?: string[]; // Restrict to certain offers
}

const templates: TemplateOption[] = [
  {
    id: "signature",
    name: "Signature",
    description: "Élégant et minimaliste, parfait pour les professionnels",
    icon: User,
    preview: "#1a1a2e",
  },
  {
    id: "dark-luxury",
    name: "Dark Luxury",
    description: "Fond sombre premium avec accents dorés",
    icon: Crown,
    preview: "#0d0d0d",
    badge: "Populaire",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Design corporate pour les dirigeants et entreprises",
    icon: Briefcase,
    preview: "#1e3a5f",
  },
  {
    id: "boutique",
    name: "Boutique",
    description: "Idéal pour les commerces et artisans",
    icon: Building2,
    preview: "#2d3436",
  },
  {
    id: "hotel-concierge",
    name: "Hôtel & Concierge",
    description: "Pour l'hôtellerie et les services VIP",
    icon: Hotel,
    preview: "#1a1a2e",
    forOffers: ["signature", "alliance"],
  },
  {
    id: "ultra-luxe",
    name: "Ultra Luxe",
    description: "Le summum du raffinement digital",
    icon: Sparkles,
    preview: "#050505",
    badge: "Premium",
    forOffers: ["alliance"],
  },
];

function OrderTemplateContent() {
  const navigate = useNavigate();
  const { state, setSelectedTemplate, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(state.selectedTemplate || "signature");

  // Filter templates based on selected offer
  const availableTemplates = templates.filter(t => {
    if (!t.forOffers) return true;
    return state.selectedOffer && t.forOffers.includes(state.selectedOffer);
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedId(templateId);
  };

  const handleContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    setIsNavigating(true);
    
    setSelectedTemplate(selectedId);
    await nextStep();
  };

  const handleBack = () => {
    if (isNavigating || state.isTransitioning) return;
    prevStep();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      {/* Subtle cyan halo */}
      <div 
        className="fixed top-1/4 right-0 w-[400px] h-[400px] rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{ backgroundColor: STEALTH.accent }}
      />

      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={2} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Étape 2 sur 7
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Choisissez votre template
              </motion.h1>
              <motion.p 
                className="text-base max-w-xl mx-auto"
                style={{ color: STEALTH.textSecondary }}
                variants={itemVariants}
              >
                Le design de votre profil digital. Vous pourrez le personnaliser ensuite.
              </motion.p>
            </motion.div>

            {/* Templates Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
            >
              {availableTemplates.map((template, index) => {
                const isSelected = selectedId === template.id;
                const Icon = template.icon;

                return (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => handleSelectTemplate(template.id)}
                    className="relative rounded-2xl overflow-hidden text-left transition-all duration-300"
                    style={{
                      border: isSelected 
                        ? `2px solid ${STEALTH.accent}` 
                        : `1px solid ${STEALTH.border}`,
                      backgroundColor: STEALTH.bgCard,
                      boxShadow: isSelected ? STEALTH.glow : "none",
                    }}
                  >
                    {/* Preview area */}
                    <div 
                      className="h-32 relative"
                      style={{ backgroundColor: template.preview }}
                    >
                      {/* Gradient overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)`
                        }}
                      />
                      
                      {/* Template icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ 
                            backgroundColor: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(8px)"
                          }}
                        >
                          <Icon className="w-8 h-8" style={{ color: "rgba(255,255,255,0.8)" }} />
                        </div>
                      </div>

                      {/* Badge */}
                      {template.badge && (
                        <Badge 
                          className="absolute top-3 right-3"
                          style={{ 
                            backgroundColor: STEALTH.accent, 
                            color: STEALTH.bg 
                          }}
                        >
                          {template.badge === "Premium" && <Star className="w-3 h-3 mr-1" />}
                          {template.badge}
                        </Badge>
                      )}

                      {/* Selection check */}
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: STEALTH.accent }}
                        >
                          <Check className="w-4 h-4" style={{ color: STEALTH.bg }} />
                        </motion.div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 
                        className="font-semibold mb-1"
                        style={{ color: STEALTH.text }}
                      >
                        {template.name}
                      </h3>
                      <p 
                        className="text-sm line-clamp-2"
                        style={{ color: STEALTH.textSecondary }}
                      >
                        {template.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 max-w-md mx-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={isNavigating || state.isTransitioning}
                className="flex-1 rounded-full py-6 gap-2"
                style={{ 
                  borderColor: STEALTH.border,
                  color: STEALTH.text
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </Button>
              
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!selectedId || isNavigating || state.isTransitioning}
                className="flex-[2] rounded-full py-6 gap-2 font-semibold"
                style={{ 
                  backgroundColor: STEALTH.accent,
                  color: STEALTH.bg
                }}
              >
                Continuer
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </main>
      </PageTransition>

      {/* Fixed bottom CTA for mobile */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50"
        style={{ 
          backgroundColor: STEALTH.bg,
          borderTop: `1px solid ${STEALTH.border}`,
          backdropFilter: "blur(20px)"
        }}
      >
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedId || isNavigating || state.isTransitioning}
          className="w-full rounded-full py-6 gap-2 font-semibold"
          style={{ 
            backgroundColor: STEALTH.accent,
            color: STEALTH.bg
          }}
        >
          Continuer
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default function OrderTemplate() {
  return (
    <OrderFunnelGuard step={2}>
      <OrderTemplateContent />
    </OrderFunnelGuard>
  );
}
