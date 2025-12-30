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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Wand2,
  User,
  Phone,
  Mail,
  Globe,
  Wifi,
  Gift,
  MapPinned,
  MessageCircle,
  Star,
  Languages,
  Calendar
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

// Visual Preview Component for generated templates
function TemplatePreviewContent({ type, template }: { type: TemplateType; template: Record<string, any> }) {
  if (type === "hotel") {
    return (
      <div className="space-y-4">
        {/* Hotel Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{template.hotelName || "Nom de l'hôtel"}</h3>
          {template.conciergeRole && (
            <p className="text-sm text-muted-foreground">{template.conciergeRole}</p>
          )}
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="space-y-3">
          {template.receptionPhone && (
            <PreviewItem icon={Phone} label="Réception" value={template.receptionPhone} />
          )}
          {template.email && (
            <PreviewItem icon={Mail} label="Email" value={template.email} />
          )}
          {template.website && (
            <PreviewItem icon={Globe} label="Site web" value={template.website} />
          )}
        </div>

        {/* WiFi */}
        {template.wifiSsid && (
          <>
            <Separator />
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">WiFi Gratuit</span>
              </div>
              <p className="text-xs text-muted-foreground">Réseau: {template.wifiSsid}</p>
              {template.wifiPassword && (
                <p className="text-xs text-muted-foreground">Mot de passe: {template.wifiPassword}</p>
              )}
            </div>
          </>
        )}

        {/* Daily Offer */}
        {template.dailyOffer && (
          <>
            <Separator />
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Offre du jour</span>
              </div>
              <p className="text-sm text-foreground">{template.dailyOffer.title}</p>
              <p className="text-xs text-muted-foreground">{template.dailyOffer.description}</p>
            </div>
          </>
        )}

        {/* Places to Visit */}
        {template.placesToVisit && template.placesToVisit.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPinned className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">À découvrir</span>
              </div>
              {template.placesToVisit.slice(0, 3).map((place: any, i: number) => (
                <div key={i} className="p-2 rounded bg-surface-2 text-xs">
                  <p className="font-medium text-foreground">{place.name}</p>
                  <p className="text-muted-foreground">{place.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (type === "business") {
    return (
      <div className="space-y-4">
        {/* Business Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {template.firstName} {template.lastName}
          </h3>
          {template.title && (
            <p className="text-sm text-muted-foreground">{template.title}</p>
          )}
          {template.company && (
            <Badge variant="secondary" className="text-xs">{template.company}</Badge>
          )}
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="space-y-3">
          {template.phone && (
            <PreviewItem icon={Phone} label="Téléphone" value={template.phone} />
          )}
          {template.email && (
            <PreviewItem icon={Mail} label="Email" value={template.email} />
          )}
          {template.website && (
            <PreviewItem icon={Globe} label="Site web" value={template.website} />
          )}
          {template.location && (
            <PreviewItem icon={MapPin} label="Localisation" value={template.location} />
          )}
        </div>

        {/* Social Links */}
        {template.linkedin && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">LinkedIn</Badge>
            </div>
          </>
        )}
      </div>
    );
  }

  if (type === "tourism") {
    return (
      <div className="space-y-4">
        {/* Tourism Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {template.businessName || template.guideName || "Guide touristique"}
          </h3>
          {template.guideName && template.businessName && (
            <p className="text-sm text-muted-foreground">Guide: {template.guideName}</p>
          )}
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="space-y-3">
          {template.phone && (
            <PreviewItem icon={Phone} label="Téléphone" value={template.phone} />
          )}
          {template.whatsapp && (
            <PreviewItem icon={MessageCircle} label="WhatsApp" value={template.whatsapp} />
          )}
          {template.email && (
            <PreviewItem icon={Mail} label="Email" value={template.email} />
          )}
          {template.location && (
            <PreviewItem icon={MapPin} label="Localisation" value={template.location} />
          )}
        </div>

        {/* Languages */}
        {template.languages && template.languages.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center gap-2 flex-wrap">
              <Languages className="w-4 h-4 text-muted-foreground" />
              {template.languages.map((lang: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">{lang}</Badge>
              ))}
            </div>
          </>
        )}

        {/* Tours */}
        {template.tours && template.tours.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">Excursions</span>
              </div>
              {template.tours.slice(0, 3).map((tour: any, i: number) => (
                <div key={i} className="p-2 rounded bg-surface-2 text-xs">
                  <p className="font-medium text-foreground">{tour.name}</p>
                  {tour.duration && <p className="text-muted-foreground">{tour.duration}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Reviews */}
        {(template.googleReviewsUrl || template.tripAdvisorUrl) && (
          <>
            <Separator />
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-muted-foreground">Avis clients disponibles</span>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}

// Helper component for preview items
function PreviewItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-2">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

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

      {/* Generated Template Visual Preview */}
      <AnimatePresence>
        {generatedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Success Header */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-green-400">Template généré avec succès !</p>
                <p className="text-xs text-muted-foreground">Aperçu de votre carte ci-dessous</p>
              </div>
            </div>

            {/* Visual Card Preview */}
            <Card className="overflow-hidden border-border/50 bg-gradient-to-b from-surface-2 to-background">
              <div className="p-6">
                {/* Mock Phone Frame */}
                <div className="max-w-[280px] mx-auto">
                  <div className="bg-background rounded-[2rem] border-4 border-foreground/10 shadow-2xl overflow-hidden">
                    {/* Phone Notch */}
                    <div className="h-8 bg-foreground/5 flex items-center justify-center">
                      <div className="w-20 h-5 bg-foreground/10 rounded-full" />
                    </div>
                    
                    {/* Card Content Preview */}
                    <ScrollArea className="h-[400px]">
                      <div className="p-4 space-y-4">
                        <TemplatePreviewContent 
                          type={generatedTemplate.type} 
                          template={generatedTemplate.template} 
                        />
                      </div>
                    </ScrollArea>
                    
                    {/* Phone Bottom Bar */}
                    <div className="h-6 bg-foreground/5 flex items-center justify-center">
                      <div className="w-24 h-1 bg-foreground/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setGeneratedTemplate(null)}
                className="flex-1"
              >
                Régénérer
              </Button>
              <Button
                onClick={handleUseTemplate}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                Utiliser ce template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
