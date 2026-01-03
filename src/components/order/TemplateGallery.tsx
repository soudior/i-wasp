/**
 * Template Gallery Component
 * Real-time preview gallery for order funnel Design step
 * 
 * Features:
 * - Grid of available templates with live previews
 * - Category filtering
 * - Selection with visual feedback
 * - Responsive mobile-first design
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, Briefcase, Store, Users, Sparkles, 
  Check, Eye, Star, Hotel, Globe, Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

// Template definition
export interface TemplateDefinition {
  id: string;
  name: string;
  category: "hotel" | "business" | "retail" | "creative" | "minimal";
  description: string;
  features: string[];
  previewComponent: React.ReactNode;
  premium?: boolean;
  new?: boolean;
}

export interface TemplateGalleryProps {
  templates: TemplateDefinition[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onPreviewTemplate: (templateId: string) => void;
}

// Category configuration
const CATEGORIES = [
  { id: "all", name: "Tous", icon: Palette },
  { id: "hotel", name: "Hôtel", icon: Hotel },
  { id: "business", name: "Business", icon: Briefcase },
  { id: "retail", name: "Boutique", icon: Store },
  { id: "creative", name: "Créatif", icon: Sparkles },
  { id: "minimal", name: "Minimal", icon: Globe },
];

export function TemplateGallery({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onPreviewTemplate,
}: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return templates;
    return templates.filter((t) => t.category === activeCategory);
  }, [templates, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-gradient-to-r from-[#d4af37] to-[#c4a030] text-black shadow-lg"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              <Icon size={16} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <TemplateCard
                template={template}
                isSelected={selectedTemplateId === template.id}
                onSelect={() => onSelectTemplate(template.id)}
                onPreview={() => onPreviewTemplate(template.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun template dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}

// Individual Template Card
interface TemplateCardProps {
  template: TemplateDefinition;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function TemplateCard({ template, isSelected, onSelect, onPreview }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer",
        isSelected
          ? "border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          : "border-transparent hover:border-[#d4af37]/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
    >
      {/* Preview Container */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {/* Template Preview - Scaled down */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-[200px] transform scale-[0.55] origin-center pointer-events-none">
            {template.previewComponent}
          </div>
        </div>

        {/* Selection Overlay */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#d4af37]/10 backdrop-blur-[1px]"
          >
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center shadow-lg">
              <Check size={16} className="text-black" />
            </div>
          </motion.div>
        )}

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && !isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
            >
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview();
                }}
              >
                <Eye size={14} />
                Aperçu
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {template.premium && (
            <Badge className="bg-gradient-to-r from-[#d4af37] to-[#c4a030] text-black text-[10px] px-2">
              <Star size={10} className="mr-1" />
              Premium
            </Badge>
          )}
          {template.new && (
            <Badge className="bg-emerald-500 text-white text-[10px] px-2">
              Nouveau
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-card">
        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1 mt-3">
          {template.features.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              +{template.features.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Export template category type
export type TemplateCategory = "hotel" | "business" | "retail" | "creative" | "minimal";
