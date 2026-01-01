/**
 * AISuggestions - Suggestions intelligentes IA pour la carte IWASP
 * 
 * Analyse le profil et propose des modules pertinents:
 * - Avis Google
 * - Géolocalisation
 * - WhatsApp
 * - Instagram
 * - Site web
 * - vCard
 * 
 * L'utilisateur garde le contrôle: accepter, ignorer ou modifier
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Sparkles, 
  Loader2, 
  Plus,
  X,
  Check,
  MapPin,
  Star,
  MessageCircle,
  Instagram,
  Globe,
  Phone,
  Mail,
  FileUser,
  Calendar,
  Wifi,
  ChevronDown,
  ChevronUp,
  Wand2,
  RefreshCw
} from "lucide-react";
import { CardFormData } from "./CardWizard";
import { SocialLink, socialNetworks } from "@/lib/socialNetworks";

interface AISuggestionsProps {
  data: CardFormData;
  onChange: (updates: Partial<CardFormData>) => void;
}

interface Suggestion {
  id: string;
  title: string;
  icon: string;
  reason: string;
  priority: "high" | "medium" | "low";
  type: string;
  defaultValue?: string | null;
}

interface SuggestionsResponse {
  businessType: string;
  country: string;
  suggestions: Suggestion[];
}

const iconMap: Record<string, React.ElementType> = {
  MapPin,
  Star,
  MessageCircle,
  Instagram,
  Globe,
  Phone,
  Mail,
  FileUser,
  Calendar,
  Wifi,
};

const priorityColors: Record<string, string> = {
  high: "bg-accent/20 text-accent border-accent/30",
  medium: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  low: "bg-muted text-muted-foreground border-border/50",
};

const priorityLabels: Record<string, string> = {
  high: "Recommandé",
  medium: "Utile",
  low: "Optionnel",
};

export function AISuggestions({ data, onChange }: AISuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [businessType, setBusinessType] = useState<string>("");
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Check if we have enough data to generate suggestions
  const canGenerate = Boolean(data.firstName && data.lastName);

  const generateSuggestions = async () => {
    if (!canGenerate) {
      toast.error("Renseignez au moins votre prénom et nom");
      return;
    }

    setIsLoading(true);
    setHasGenerated(true);

    try {
      const { data: result, error } = await supabase.functions.invoke('smart-suggestions', {
        body: {
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.title,
            company: data.company,
            location: data.location,
            email: data.email,
            phone: data.phone,
          },
          language: 'fr'
        }
      });

      if (error) {
        throw error;
      }

      if (result.error) {
        if (result.code === 'RATE_LIMITED') {
          toast.error("Limite atteinte. Réessayez dans quelques instants.");
        } else if (result.code === 'PAYMENT_REQUIRED') {
          toast.error("Crédits IA épuisés.");
        } else {
          throw new Error(result.error);
        }
        return;
      }

      const response = result as SuggestionsResponse;
      setSuggestions(response.suggestions || []);
      setBusinessType(response.businessType || "");
      setAcceptedIds(new Set());
      setIgnoredIds(new Set());
      
      toast.success(`${response.suggestions?.length || 0} suggestions générées`);

    } catch (error) {
      console.error("AI suggestions error:", error);
      toast.error("Erreur lors de la génération des suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = (suggestion: Suggestion) => {
    setAcceptedIds(prev => new Set([...prev, suggestion.id]));
    setIgnoredIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(suggestion.id);
      return newSet;
    });

    // Apply the suggestion to form data
    switch (suggestion.type) {
      case 'whatsapp':
        if (data.phone) {
          const whatsappLink: SocialLink = {
            id: `whatsapp-${Date.now()}`,
            networkId: 'whatsapp',
            value: data.phone,
          };
          onChange({ 
            socialLinks: [...(data.socialLinks || []).filter(l => l.networkId !== 'whatsapp'), whatsappLink] 
          });
        }
        break;
      case 'instagram':
        // Just mark as accepted, user will fill in StepPreview
        break;
      case 'website':
        // Mark as accepted
        break;
      case 'vcard':
        // vCard is always generated from the card data
        break;
      case 'geolocation':
      case 'address':
        // Location will be filled
        break;
      case 'google_reviews':
        // Will need URL input
        break;
    }

    toast.success(`"${suggestion.title}" ajouté à votre carte`);
  };

  const handleIgnore = (suggestion: Suggestion) => {
    setIgnoredIds(prev => new Set([...prev, suggestion.id]));
    setAcceptedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(suggestion.id);
      return newSet;
    });
  };

  const handleUndo = (suggestion: Suggestion) => {
    setAcceptedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(suggestion.id);
      return newSet;
    });
    setIgnoredIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(suggestion.id);
      return newSet;
    });
  };

  const pendingSuggestions = suggestions.filter(
    s => !acceptedIds.has(s.id) && !ignoredIds.has(s.id)
  );
  const acceptedSuggestions = suggestions.filter(s => acceptedIds.has(s.id));

  return (
    <div className="space-y-4">
      {/* Header with generate button */}
      <Card className="border-accent/20 shadow-lg bg-gradient-to-r from-accent/5 to-accent/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Wand2 size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">Assistant IA IWASP</p>
                <p className="text-xs text-muted-foreground">
                  Suggestions personnalisées pour votre carte
                </p>
              </div>
            </div>

            <Button
              onClick={generateSuggestions}
              disabled={isLoading || !canGenerate}
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span className="hidden sm:inline">Analyse...</span>
                </>
              ) : hasGenerated ? (
                <>
                  <RefreshCw size={14} />
                  <span className="hidden sm:inline">Régénérer</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">Analyser mon profil</span>
                </>
              )}
            </Button>
          </div>

          {businessType && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 pt-3 border-t border-border/30"
            >
              <p className="text-xs text-muted-foreground">
                Type détecté: <span className="font-medium text-foreground capitalize">{businessType}</span>
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions list */}
      <AnimatePresence mode="popLayout">
        {pendingSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-4">
                <button 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <p className="text-sm font-medium">
                    Suggestions ({pendingSuggestions.length})
                  </p>
                  {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {pendingSuggestions.map((suggestion, index) => {
                        const IconComponent = iconMap[suggestion.icon] || Globe;
                        
                        return (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10, height: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30"
                          >
                            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                              <IconComponent size={16} className="text-accent" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-medium">{suggestion.title}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priorityColors[suggestion.priority]}`}>
                                  {priorityLabels[suggestion.priority]}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAccept(suggestion)}
                                className="w-8 h-8 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors"
                              >
                                <Plus size={14} className="text-accent" />
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleIgnore(suggestion)}
                                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                              >
                                <X size={14} className="text-muted-foreground" />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accepted suggestions summary */}
      <AnimatePresence>
        {acceptedSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-accent/20 shadow-md bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Check size={14} className="text-accent" />
                  <p className="text-sm font-medium">Modules ajoutés ({acceptedSuggestions.length})</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {acceptedSuggestions.map(suggestion => {
                    const IconComponent = iconMap[suggestion.icon] || Globe;
                    
                    return (
                      <motion.div
                        key={suggestion.id}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent/10 rounded-lg border border-accent/20"
                      >
                        <IconComponent size={12} className="text-accent" />
                        <span className="text-xs font-medium">{suggestion.title}</span>
                        <button
                          onClick={() => handleUndo(suggestion)}
                          className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!isLoading && !hasGenerated && canGenerate && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-muted-foreground py-4"
        >
          Cliquez sur "Analyser mon profil" pour recevoir des suggestions personnalisées
        </motion.p>
      )}
    </div>
  );
}

export default AISuggestions;
