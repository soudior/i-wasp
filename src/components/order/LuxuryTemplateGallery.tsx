/**
 * Luxury Template Gallery - Dark Luxury Design
 * 
 * Présentation des templates comme "Tablettes de Luxe"
 * avec ombres dorées et aperçus HD pleine largeur
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, Briefcase, Store, Sparkles, 
  Check, Eye, Star, Hotel, Globe, Palette,
  MapPin, Wifi, MessageCircle, User, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

// Template definition
export interface LuxuryTemplateDefinition {
  id: string;
  name: string;
  category: "hotel" | "business" | "retail" | "creative" | "minimal";
  description: string;
  features: string[];
  previewComponent: React.ReactNode;
  premium?: boolean;
  new?: boolean;
  hasStories?: boolean;
}

export interface LuxuryTemplateGalleryProps {
  templates: LuxuryTemplateDefinition[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onPreviewTemplate: (templateId: string) => void;
}

// Category configuration with gold icons
const CATEGORIES = [
  { id: "all", name: "Tous", icon: Palette },
  { id: "hotel", name: "Hébergement", icon: Hotel },
  { id: "retail", name: "Commerce", icon: Store },
  { id: "business", name: "Guide", icon: Briefcase },
];

// Feature icons mapping
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "vCard Gold": <User size={12} />,
  "WhatsApp": <MessageCircle size={12} />,
  "WiFi": <Wifi size={12} />,
  "Carte": <MapPin size={12} />,
  "Stories": <Sparkles size={12} />,
  "Calendrier": <Calendar size={12} />,
};

export function LuxuryTemplateGallery({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onPreviewTemplate,
}: LuxuryTemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return templates;
    return templates.filter((t) => t.category === activeCategory);
  }, [templates, activeCategory]);

  // Auto-scroll to selected template
  useEffect(() => {
    if (selectedTemplateId && containerRef.current) {
      const selectedElement = containerRef.current.querySelector(`[data-template-id="${selectedTemplateId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedTemplateId]);

  return (
    <div className="space-y-8">
      {/* Category Filter - Glassmorphism Gold */}
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "bg-gradient-to-r from-[#d4af37] via-[#f5c542] to-[#d4af37] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                  : "glass-gold-btn"
              )}
            >
              <Icon size={16} className={isActive ? "" : "icon-gold"} />
              {cat.name}
            </motion.button>
          );
        })}
      </div>

      {/* Section Title with Gold Shimmer */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gold-shimmer mb-2">
          Templates Élite
        </h2>
        <p className="text-white/50 text-sm">
          Sélectionnez votre design premium
        </p>
      </div>

      {/* Templates Grid - Luxury Tablets */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              data-template-id={template.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <LuxuryTemplateCard
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
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 mx-auto mb-4 icon-gold" />
          <p className="text-white/50">Aucun template dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}

// Individual Luxury Template Card
interface LuxuryTemplateCardProps {
  template: LuxuryTemplateDefinition;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function LuxuryTemplateCard({ template, isSelected, onSelect, onPreview }: LuxuryTemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "luxury-tablet cursor-pointer",
        isSelected && "ring-2 ring-[#d4af37] ring-offset-2 ring-offset-black"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
    >
      {/* Preview Container - Full Width HD */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Dark Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        
        {/* Template Preview - Scaled for tablet view */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-full transform scale-[0.65] origin-center pointer-events-none">
            {template.previewComponent}
          </div>
        </div>

        {/* Stories Indicator - Gold Ring */}
        {template.hasStories && (
          <div className="absolute top-4 left-4">
            <div className="stories-ring-gold w-12 h-12">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Sparkles className="w-5 h-5 icon-gold" />
              </div>
            </div>
          </div>
        )}

        {/* Selection Overlay */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/20 to-transparent"
          >
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              <Check size={20} className="text-black" />
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <Button
                size="lg"
                className="gap-2 btn-gold-gradient"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview();
                }}
              >
                <Eye size={18} />
                Aperçu HD
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium & New Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {template.premium && !isSelected && (
            <Badge className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black text-[10px] px-3 py-1 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <Star size={10} className="mr-1 fill-current" />
              Premium
            </Badge>
          )}
          {template.new && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] px-3 py-1">
              Nouveau
            </Badge>
          )}
        </div>

        {/* Golden Glow Effect at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Info Section - Dark with Gold Accents */}
      <div className="p-5 border-t border-[#d4af37]/20 bg-gradient-to-b from-[#0a0a0a] to-black">
        {/* Title with Gold Shimmer */}
        <h3 className="font-bold text-lg text-gold-shimmer mb-1">
          {template.name}
        </h3>
        <p className="text-xs text-white/50 line-clamp-2 mb-4">
          {template.description}
        </p>
        
        {/* Features - Gold Icons */}
        <div className="flex flex-wrap gap-2">
          {template.features.slice(0, 4).map((feature, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37]"
            >
              {FEATURE_ICONS[feature] || <Sparkles size={10} />}
              {feature}
            </span>
          ))}
          {template.features.length > 4 && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/40">
              +{template.features.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default LuxuryTemplateGallery;
