/**
 * Template Picker Component
 * 
 * Premium template gallery with:
 * - Live preview thumbnails
 * - Category filtering
 * - Premium badge indicators
 * - Smooth selection animations
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getPublicTemplates, TemplateRegistryEntry } from "@/lib/templateRegistry";
import { templateInfo } from "@/components/templates/CardTemplates";

// ============================================================
// TYPES
// ============================================================

interface TemplatePickerProps {
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
  className?: string;
}

interface TemplateCategory {
  id: string;
  label: string;
  icon?: React.ElementType;
}

// ============================================================
// CATEGORY CONFIG
// ============================================================

const categories: TemplateCategory[] = [
  { id: "all", label: "Tous" },
  { id: "business", label: "Business" },
  { id: "vip", label: "VIP" },
  { id: "hotellerie", label: "Hôtellerie" },
  { id: "rental", label: "Location" },
  { id: "immobilier", label: "Immobilier" },
  { id: "sante", label: "Santé" },
  { id: "creatifs", label: "Créatifs" },
];

// Template color previews for visual thumbnails
const templateColors: Record<string, { bg: string; accent: string; text: string }> = {
  "ultra-luxe": { bg: "#0B0B0B", accent: "#D4AF37", text: "#FFFFFF" },
  "signature": { bg: "#0A0A0A", accent: "#B8860B", text: "#F5F5F5" },
  "executive": { bg: "#0F172A", accent: "#F59E0B", text: "#F1F5F9" },
  "luxe": { bg: "#1A1A1A", accent: "#C9A962", text: "#E5E5E5" },
  "hotel": { bg: "#F8F6F4", accent: "#8B7355", text: "#1C1917" },
  "minimal": { bg: "#FFFFFF", accent: "#404040", text: "#171717" },
  "tourism": { bg: "#F0FDF4", accent: "#16A34A", text: "#14532D" },
  "luxury": { bg: "#18181B", accent: "#E879F9", text: "#FAFAFA" },
  "palace": { bg: "#0C0A09", accent: "#CA8A04", text: "#FAFAF9" },
  "riad": { bg: "#FEF3C7", accent: "#92400E", text: "#451A03" },
  "rental-concierge": { bg: "#ECFEFF", accent: "#0891B2", text: "#164E63" },
  "vcard-airbnb-booking": { bg: "#FEFCE8", accent: "#CA8A04", text: "#422006" },
};

// ============================================================
// TEMPLATE THUMBNAIL
// ============================================================

interface TemplateThumbnailProps {
  template: TemplateRegistryEntry;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateThumbnail({ template, isSelected, onSelect }: TemplateThumbnailProps) {
  const colors = templateColors[template.id] || { bg: "#1A1A1A", accent: "#FFC700", text: "#FFFFFF" };
  const info = templateInfo[template.id];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative flex-shrink-0 w-32 rounded-xl overflow-hidden transition-all duration-300",
        "border-2",
        isSelected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border/50 hover:border-border"
      )}
    >
      {/* Template Preview */}
      <div
        className="aspect-[3/4] p-2 flex flex-col"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Mini card preview */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
          {/* Avatar circle */}
          <div
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: colors.accent + "40" }}
          />
          {/* Name lines */}
          <div
            className="w-14 h-1.5 rounded-full"
            style={{ backgroundColor: colors.text + "40" }}
          />
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: colors.accent + "60" }}
          />
          {/* Action buttons */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors.accent + "30" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Template Name */}
      <div className="p-2 bg-card border-t border-border/30">
        <p className="text-[10px] font-medium text-foreground truncate text-center">
          {template.name}
        </p>
      </div>

      {/* Selected Indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          >
            <Check size={12} className="text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Badge */}
      {template.category === "vip" && (
        <div className="absolute top-1.5 left-1.5">
          <Badge
            variant="secondary"
            className="px-1 py-0 text-[8px] bg-amber-500/20 text-amber-400 border-amber-500/30"
          >
            <Crown size={8} className="mr-0.5" />
            VIP
          </Badge>
        </div>
      )}
    </motion.button>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function TemplatePicker({
  selectedTemplate,
  onSelect,
  className,
}: TemplatePickerProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const publicTemplates = useMemo(() => getPublicTemplates(), []);
  
  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return publicTemplates;
    return publicTemplates.filter((t) => t.category === activeCategory);
  }, [publicTemplates, activeCategory]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Templates Premium
            </h3>
            <p className="text-xs text-muted-foreground">
              {publicTemplates.length} designs disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex-shrink-0 h-7 px-3 text-xs",
                activeCategory === category.id && "bg-primary/10 text-primary"
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Templates Grid */}
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TemplateThumbnail
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={() => onSelect(template.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Filter size={24} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Aucun template dans cette catégorie
          </p>
        </div>
      )}
    </div>
  );
}

export default TemplatePicker;
