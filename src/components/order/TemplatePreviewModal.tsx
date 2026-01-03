/**
 * Template Preview Modal
 * Full-screen preview of templates with details
 */

import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, Star, Smartphone, Wifi, MapPin, MessageSquare, Globe, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateDefinition } from "./TemplateGallery";

interface TemplatePreviewModalProps {
  template: TemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onSelect,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  const handleSelect = () => {
    onSelect(template.id);
    onClose();
  };

  // Feature icons mapping
  const featureIcons: Record<string, React.ReactNode> = {
    "WiFi": <Wifi size={14} />,
    "Carte": <MapPin size={14} />,
    "WhatsApp": <MessageSquare size={14} />,
    "Site web": <Globe size={14} />,
    "vCard": <User size={14} />,
    "Avis Google": <Star size={14} />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 overflow-hidden bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">{template.name}</DialogTitle>
              <div className="flex gap-2">
                {template.premium && (
                  <Badge className="bg-gradient-to-r from-[#d4af37] to-[#c4a030] text-black">
                    <Star size={10} className="mr-1" />
                    Premium
                  </Badge>
                )}
                {template.new && (
                  <Badge className="bg-emerald-500 text-white">Nouveau</Badge>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Preview */}
            <div className="flex-1 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-6 overflow-auto">
              <div className="w-full max-w-sm">
                {template.previewComponent}
              </div>
            </div>

            {/* Details Panel */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-card">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                      Description
                    </h3>
                    <p className="text-sm">{template.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                      Fonctionnalités
                    </h3>
                    <div className="space-y-2">
                      {template.features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                        >
                          <div className="w-7 h-7 rounded-md bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            {featureIcons[feature] || <Check size={14} />}
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                      Catégorie
                    </h3>
                    <Badge variant="secondary" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>

                  {/* Mobile Preview Note */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20">
                    <Smartphone size={18} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Ce template est optimisé pour mobile et s'adapte parfaitement à tous les écrans.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex items-center justify-between bg-card">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={handleSelect}
              className="bg-gradient-to-r from-[#d4af37] to-[#c4a030] text-black hover:opacity-90 gap-2"
            >
              <Check size={16} />
              Sélectionner ce template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
