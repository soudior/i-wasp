/**
 * StepDesign - Étape Template: Choix du template obligatoire
 * 
 * Design premium IWASP:
 * - Grille visuelle de templates
 * - Sélection obligatoire pour continuer
 * - Aperçu en temps réel
 * - Définition: layout, position logo, typographie, hiérarchie
 */

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CardFormData } from "../CardWizard";
import { templateInfo, TemplateType } from "@/components/templates/CardTemplates";
import { 
  Check, 
  Sparkles, 
  AlertCircle,
  Layout,
  Type,
  Image,
  Layers
} from "lucide-react";

interface StepDesignProps {
  data: CardFormData;
  onChange: (updates: Partial<CardFormData>) => void;
}

// Templates disponibles avec leurs caractéristiques complètes
const TEMPLATE_DETAILS: Record<string, {
  layout: string;
  logoPosition: string;
  typography: string;
  hierarchy: string;
  gradient: string;
  textColor: string;
}> = {
  signature: {
    layout: "Centré vertical",
    logoPosition: "En haut, centré",
    typography: "Sans-serif élégant",
    hierarchy: "Logo → Nom → Titre → Contact",
    gradient: "from-zinc-900 via-zinc-800 to-zinc-900",
    textColor: "text-white/80",
  },
  executive: {
    layout: "Aligné gauche",
    logoPosition: "Coin supérieur gauche",
    typography: "Serif professionnel",
    hierarchy: "Nom → Titre → Logo → Contact",
    gradient: "from-slate-800 via-slate-900 to-slate-950",
    textColor: "text-white/80",
  },
  boutique: {
    layout: "Élégant centré",
    logoPosition: "Centré avec cadre",
    typography: "Display luxe",
    hierarchy: "Logo → Tagline → Nom → Contact",
    gradient: "from-stone-100 via-stone-50 to-stone-100",
    textColor: "text-stone-700",
  },
  "hotel-concierge": {
    layout: "Premium hospitality",
    logoPosition: "Header complet",
    typography: "Serif classique",
    hierarchy: "Logo → Établissement → Nom → Services",
    gradient: "from-amber-50 via-stone-50 to-amber-50",
    textColor: "text-stone-800",
  },
};

const LUXURY_TEMPLATES: TemplateType[] = ["signature", "executive", "boutique"];
const ALL_TEMPLATES: TemplateType[] = ["signature", "executive", "boutique", "hotel-concierge"];

export function StepDesign({ data, onChange }: StepDesignProps) {
  const hasTemplateSelected = Boolean(data.template);
  const selectedDetails = data.template ? TEMPLATE_DETAILS[data.template] : null;

  return (
    <div className="space-y-6">
      {/* Header with requirement */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20"
      >
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium">Choisissez votre template</p>
          <p className="text-xs text-muted-foreground">
            Sélection obligatoire — Définit le style de votre carte
          </p>
        </div>
      </motion.div>

      {/* Warning if no template selected */}
      <AnimatePresence>
        {!hasTemplateSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20"
          >
            <AlertCircle size={18} className="text-destructive shrink-0" />
            <p className="text-sm text-destructive">
              Veuillez sélectionner un template pour continuer
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Grid */}
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-medium">Templates Premium</p>
            <span className="text-xs text-muted-foreground">
              {ALL_TEMPLATES.length} disponibles
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_TEMPLATES.map((templateId, index) => {
              const template = templateInfo.find(t => t.id === templateId);
              const details = TEMPLATE_DETAILS[templateId];
              if (!template || !details) return null;
              
              const isSelected = data.template === templateId;
              const isLuxury = LUXURY_TEMPLATES.includes(templateId);
              
              return (
                <motion.button
                  key={templateId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.08,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  onClick={() => onChange({ template: templateId })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-500 ${
                    isSelected
                      ? "border-accent bg-accent/5 shadow-xl shadow-accent/20"
                      : "border-border/50 hover:border-accent/50 bg-card/50 hover:shadow-lg"
                  }`}
                >
                  {/* Selected indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center shadow-lg z-10"
                      >
                        <Check size={14} className="text-accent-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Luxury badge */}
                  {isLuxury && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-medium">
                      Premium
                    </div>
                  )}
                  
                  {/* Template preview card */}
                  <div className={`h-28 rounded-xl mb-4 bg-gradient-to-br ${details.gradient} flex flex-col items-center justify-center overflow-hidden relative`}>
                    {/* Mock card content */}
                    <div className="w-8 h-8 rounded-lg bg-white/20 mb-2" />
                    <div className="w-16 h-2 rounded-full bg-white/30 mb-1" />
                    <div className="w-12 h-1.5 rounded-full bg-white/20" />
                    
                    {/* Overlay effect on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-accent/20 flex items-center justify-center"
                    >
                      <span className={`text-xs font-medium ${details.textColor}`}>
                        Aperçu
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Template info */}
                  <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected template details */}
      <AnimatePresence mode="wait">
        {hasTemplateSelected && selectedDetails && (
          <motion.div
            key={data.template}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="border-accent/20 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Check size={16} className="text-accent" />
                  <p className="text-sm font-medium">
                    Template sélectionné : {templateInfo.find(t => t.id === data.template)?.name}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30"
                  >
                    <Layout size={14} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Layout</p>
                      <p className="text-xs font-medium">{selectedDetails.layout}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30"
                  >
                    <Image size={14} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Position logo</p>
                      <p className="text-xs font-medium">{selectedDetails.logoPosition}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30"
                  >
                    <Type size={14} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Typographie</p>
                      <p className="text-xs font-medium">{selectedDetails.typography}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30"
                  >
                    <Layers size={14} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Hiérarchie</p>
                      <p className="text-xs font-medium">{selectedDetails.hierarchy}</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <p className="text-xs text-muted-foreground/70 italic">
          "L'élégance est la seule beauté qui ne se fane jamais."
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1">— Audrey Hepburn</p>
      </motion.div>
    </div>
  );
}

export default StepDesign;
