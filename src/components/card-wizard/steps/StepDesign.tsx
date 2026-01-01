/**
 * StepDesign - Étape 3: Template & Couleurs
 * 
 * Sélection élégante avec aperçu
 */

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CardFormData } from "../CardWizard";
import { templateInfo, TemplateType } from "@/components/templates/CardTemplates";
import { Check, Sparkles } from "lucide-react";

interface StepDesignProps {
  data: CardFormData;
  onChange: (updates: Partial<CardFormData>) => void;
}

const LUXURY_TEMPLATES: TemplateType[] = ["signature", "executive", "boutique"];

export function StepDesign({ data, onChange }: StepDesignProps) {
  return (
    <div className="space-y-6">
      {/* Luxury mode badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20"
      >
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Sparkles size={16} className="text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-medium">Mode Client Luxe</p>
          <p className="text-xs text-muted-foreground">
            Templates premium sélectionnés pour vous
          </p>
        </div>
      </motion.div>

      {/* Template Selection */}
      <Card className="border-border/50 shadow-xl">
        <CardContent className="p-6">
          <Label className="text-sm font-medium mb-4 block">
            Choisissez votre style
          </Label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templateInfo
              .filter(t => LUXURY_TEMPLATES.includes(t.id as TemplateType))
              .map((template, index) => {
                const isSelected = data.template === template.id;
                
                return (
                  <motion.button
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onChange({ template: template.id as TemplateType })}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                      isSelected
                        ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                        : "border-border/50 hover:border-border bg-card/50"
                    }`}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-lg"
                      >
                        <Check size={14} className="text-accent-foreground" />
                      </motion.div>
                    )}
                    
                    {/* Template preview */}
                    <div className={`h-24 rounded-xl mb-4 flex items-center justify-center ${
                      template.id === "signature" ? "bg-gradient-to-br from-zinc-900 to-zinc-800" :
                      template.id === "executive" ? "bg-gradient-to-br from-slate-800 to-slate-900" :
                      "bg-gradient-to-br from-stone-100 to-stone-200"
                    }`}>
                      <div className={`text-xs font-medium ${
                        template.id === "boutique" ? "text-stone-700" : "text-white/70"
                      }`}>
                        Aperçu
                      </div>
                    </div>
                    
                    {/* Info */}
                    <h4 className="font-semibold text-foreground">{template.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </motion.button>
                );
              })}
          </div>

          {/* Show all templates option */}
          <button
            onClick={() => {/* Could expand to show all templates */}}
            className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Voir tous les templates →
          </button>
        </CardContent>
      </Card>

      {/* Selected template info */}
      {data.template && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-muted/30 border border-border/30"
        >
          <p className="text-sm">
            <span className="text-muted-foreground">Template sélectionné : </span>
            <span className="font-medium">
              {templateInfo.find(t => t.id === data.template)?.name || data.template}
            </span>
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default StepDesign;