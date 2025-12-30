/**
 * AI Template Generator Component
 * Allows users to generate card templates using AI
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Building2, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  Loader2, 
  Check,
  ArrowRight,
  Wand2
} from "lucide-react";

type TemplateType = "hotel" | "business" | "tourism";

interface GeneratedTemplate {
  type: TemplateType;
  template: Record<string, any>;
}

interface AITemplateGeneratorProps {
  onTemplateGenerated: (template: GeneratedTemplate) => void;
  onClose?: () => void;
}

const templateTypes = [
  {
    id: "hotel" as TemplateType,
    name: "Hôtel / Riad",
    description: "Carte concierge, WiFi, services, réservations",
    icon: Building2,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    id: "business" as TemplateType,
    name: "Business",
    description: "Carte de visite professionnelle classique",
    icon: Briefcase,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    id: "tourism" as TemplateType,
    name: "Tourisme",
    description: "Guide touristique, excursions, agence",
    icon: MapPin,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

const placeholders = {
  hotel: "Ex: Riad Maison Bleue, un riad 5 étoiles à Fès avec spa, restaurant gastronomique marocain, et terrasse panoramique. Le concierge s'appelle Mohammed. WiFi gratuit. Proche de la médina.",
  business: "Ex: Marie Dupont, architecte d'intérieur spécialisée en design éco-responsable à Paris. 10 ans d'expérience, projets résidentiels et commerciaux.",
  tourism: "Ex: Atlas Adventures, excursions dans le Haut Atlas au départ de Marrakech. Randonnées, cascades d'Ouzoud, villages berbères. Guide francophone et anglophone.",
};

export function AITemplateGenerator({ onTemplateGenerated, onClose }: AITemplateGeneratorProps) {
  const [selectedType, setSelectedType] = useState<TemplateType | null>(null);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<GeneratedTemplate | null>(null);

  const handleGenerate = async () => {
    if (!selectedType || !description.trim()) {
      toast.error("Veuillez sélectionner un type et décrire votre activité");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-template", {
        body: { type: selectedType, description, language: "fr" },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedTemplate(data);
      toast.success("Template généré avec succès !");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Erreur lors de la génération. Réessayez.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTemplate = () => {
    if (generatedTemplate) {
      onTemplateGenerated(generatedTemplate);
      toast.success("Template appliqué ! Vous pouvez le modifier.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">Génération IA</span>
        </div>
        <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
          Créez votre carte avec l'IA
        </h2>
        <p className="text-muted-foreground">
          Décrivez votre activité et notre IA génère automatiquement votre carte NFC
        </p>
      </div>

      {/* Step 1: Select Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          1. Choisissez votre type de carte
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {templateTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                selectedType === type.id
                  ? `${type.borderColor} ${type.bgColor}`
                  : "border-border hover:border-foreground/20 hover:bg-surface-2"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${type.bgColor} flex items-center justify-center mb-3`}>
                <type.icon className={`w-5 h-5 ${selectedType === type.id ? "text-foreground" : "text-muted-foreground"}`} />
              </div>
              <p className="font-medium text-foreground">{type.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
              
              {selectedType === type.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step 2: Description */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <label className="text-sm font-medium text-foreground">
              2. Décrivez votre activité
            </label>
            <Textarea
              placeholder={placeholders[selectedType]}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Plus votre description est détaillée, plus le résultat sera précis.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Générer ma carte
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Generated Template Preview */}
      <AnimatePresence>
        {generatedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-green-400">Template généré !</CardTitle>
                    <CardDescription>Vérifiez et personnalisez votre carte</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview of generated data */}
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 space-y-2">
                  {Object.entries(generatedTemplate.template).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="text-xs shrink-0">{key}</Badge>
                      <span className="text-muted-foreground truncate">
                        {typeof value === "object" ? JSON.stringify(value).slice(0, 50) + "..." : String(value)}
                      </span>
                    </div>
                  ))}
                  {Object.keys(generatedTemplate.template).length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      + {Object.keys(generatedTemplate.template).length - 5} autres champs...
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUseTemplate}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Utiliser ce template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
