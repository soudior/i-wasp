/**
 * Style Customizer Component
 * 
 * Advanced style customization panel with:
 * - Color pickers (background, accent, text)
 * - Font selectors
 * - Border & radius controls
 * - Shadow presets
 * - Real-time preview
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette, Type, Square, Droplets, Sun, Moon,
  RotateCcw, Check, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

export interface CardStyle {
  // Colors
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  
  // Typography
  headingFont: string;
  bodyFont: string;
  
  // Borders
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  
  // Shadows
  shadowPreset: "none" | "subtle" | "medium" | "strong" | "glow";
  
  // Theme
  theme: "dark" | "light" | "auto";
}

interface StyleCustomizerProps {
  style: CardStyle;
  onChange: (style: CardStyle) => void;
  className?: string;
}

// ============================================================
// PRESETS
// ============================================================

const colorPresets = [
  { name: "Noir Mat", bg: "#0B0B0B", accent: "#D4AF37", text: "#FFFFFF" },
  { name: "Blanc Minimal", bg: "#FFFFFF", accent: "#1A1A1A", text: "#171717" },
  { name: "Bleu Nuit", bg: "#0F172A", accent: "#3B82F6", text: "#F1F5F9" },
  { name: "Émeraude", bg: "#064E3B", accent: "#10B981", text: "#ECFDF5" },
  { name: "Bordeaux", bg: "#450A0A", accent: "#DC2626", text: "#FEF2F2" },
  { name: "Violet Royal", bg: "#1E1B4B", accent: "#8B5CF6", text: "#EDE9FE" },
];

const fontOptions = [
  { value: "system", label: "Système", preview: "font-sans" },
  { value: "inter", label: "Inter", preview: "font-sans" },
  { value: "playfair", label: "Playfair Display", preview: "font-serif" },
  { value: "montserrat", label: "Montserrat", preview: "font-sans" },
  { value: "poppins", label: "Poppins", preview: "font-sans" },
  { value: "georgia", label: "Georgia", preview: "font-serif" },
];

const shadowPresets: { value: CardStyle["shadowPreset"]; label: string; css: string }[] = [
  { value: "none", label: "Aucune", css: "shadow-none" },
  { value: "subtle", label: "Subtile", css: "shadow-md" },
  { value: "medium", label: "Moyenne", css: "shadow-xl" },
  { value: "strong", label: "Forte", css: "shadow-2xl" },
  { value: "glow", label: "Lueur", css: "shadow-[0_0_30px_rgba(255,255,255,0.1)]" },
];

// ============================================================
// COLOR PICKER
// ============================================================

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  presets?: string[];
}

function ColorPicker({ value, onChange, label, presets }: ColorPickerProps) {
  const defaultPresets = [
    "#0B0B0B", "#1A1A1A", "#374151", "#FFFFFF", "#F3F4F6",
    "#D4AF37", "#F59E0B", "#EF4444", "#10B981", "#3B82F6",
    "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1",
  ];
  
  const colors = presets || defaultPresets;

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-9"
          >
            <div
              className="w-5 h-5 rounded border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="text-xs font-mono uppercase">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onChange(color)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 transition-all",
                    value === color
                      ? "border-primary scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 h-8 px-2 text-xs font-mono uppercase bg-muted border border-border rounded"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ icon: Icon, title, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-primary" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-muted-foreground" />
          </motion.div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-3 space-y-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function StyleCustomizer({
  style,
  onChange,
  className,
}: StyleCustomizerProps) {
  const updateStyle = <K extends keyof CardStyle>(key: K, value: CardStyle[K]) => {
    onChange({ ...style, [key]: value });
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    onChange({
      ...style,
      backgroundColor: preset.bg,
      accentColor: preset.accent,
      textColor: preset.text,
    });
  };

  const resetToDefaults = () => {
    onChange({
      backgroundColor: "#0B0B0B",
      accentColor: "#D4AF37",
      textColor: "#FFFFFF",
      secondaryTextColor: "#9CA3AF",
      headingFont: "system",
      bodyFont: "system",
      borderRadius: 24,
      borderWidth: 0,
      borderColor: "#374151",
      shadowPreset: "medium",
      theme: "dark",
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Palette size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Personnalisation
            </h3>
            <p className="text-xs text-muted-foreground">
              Couleurs, polices, effets
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="h-7 px-2 text-xs gap-1"
        >
          <RotateCcw size={12} />
          Reset
        </Button>
      </div>

      <Separator />

      <ScrollArea className="h-[420px] pr-2">
        <div className="space-y-3">
          {/* Color Presets */}
          <Section icon={Droplets} title="Palettes de couleurs">
            <div className="grid grid-cols-2 gap-2">
              {colorPresets.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyPreset(preset)}
                  className={cn(
                    "relative flex items-center gap-2 p-2 rounded-lg border transition-all",
                    style.backgroundColor === preset.bg
                      ? "border-primary ring-1 ring-primary/30"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="flex gap-0.5">
                    <div
                      className="w-4 h-6 rounded-l"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <div
                      className="w-4 h-6"
                      style={{ backgroundColor: preset.accent }}
                    />
                    <div
                      className="w-4 h-6 rounded-r"
                      style={{ backgroundColor: preset.text }}
                    />
                  </div>
                  <span className="text-xs font-medium truncate">
                    {preset.name}
                  </span>
                  {style.backgroundColor === preset.bg && (
                    <Check size={12} className="absolute top-1 right-1 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </Section>

          {/* Custom Colors */}
          <Section icon={Palette} title="Couleurs personnalisées" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker
                label="Arrière-plan"
                value={style.backgroundColor}
                onChange={(v) => updateStyle("backgroundColor", v)}
              />
              <ColorPicker
                label="Accent"
                value={style.accentColor}
                onChange={(v) => updateStyle("accentColor", v)}
              />
              <ColorPicker
                label="Texte principal"
                value={style.textColor}
                onChange={(v) => updateStyle("textColor", v)}
              />
              <ColorPicker
                label="Texte secondaire"
                value={style.secondaryTextColor}
                onChange={(v) => updateStyle("secondaryTextColor", v)}
              />
            </div>
          </Section>

          {/* Typography */}
          <Section icon={Type} title="Typographie" defaultOpen={false}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Police des titres
                </Label>
                <Select
                  value={style.headingFont}
                  onValueChange={(v) => updateStyle("headingFont", v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={font.preview}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Police du texte
                </Label>
                <Select
                  value={style.bodyFont}
                  onValueChange={(v) => updateStyle("bodyFont", v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={font.preview}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          {/* Borders */}
          <Section icon={Square} title="Bordures" defaultOpen={false}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Rayon des coins
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {style.borderRadius}px
                  </span>
                </div>
                <Slider
                  value={[style.borderRadius]}
                  onValueChange={([v]) => updateStyle("borderRadius", v)}
                  min={0}
                  max={48}
                  step={4}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Épaisseur de bordure
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {style.borderWidth}px
                  </span>
                </div>
                <Slider
                  value={[style.borderWidth]}
                  onValueChange={([v]) => updateStyle("borderWidth", v)}
                  min={0}
                  max={4}
                  step={1}
                  className="w-full"
                />
              </div>

              {style.borderWidth > 0 && (
                <ColorPicker
                  label="Couleur de bordure"
                  value={style.borderColor}
                  onChange={(v) => updateStyle("borderColor", v)}
                />
              )}
            </div>
          </Section>

          {/* Shadows */}
          <Section icon={Droplets} title="Ombres" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              {shadowPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => updateStyle("shadowPreset", preset.value)}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-lg border transition-all",
                    style.shadowPreset === preset.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="text-center">
                    <div
                      className={cn(
                        "w-10 h-6 mx-auto mb-1 rounded bg-muted-foreground/20",
                        preset.css
                      )}
                    />
                    <span className="text-xs">{preset.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Theme */}
          <Section icon={Sun} title="Thème" defaultOpen={false}>
            <div className="flex items-center gap-2">
              {(["dark", "light", "auto"] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateStyle("theme", theme)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                    style.theme === theme
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  {theme === "dark" && <Moon size={16} />}
                  {theme === "light" && <Sun size={16} />}
                  {theme === "auto" && (
                    <div className="flex">
                      <Sun size={12} />
                      <Moon size={12} />
                    </div>
                  )}
                  <span className="text-xs capitalize">{theme === "auto" ? "Auto" : theme === "dark" ? "Sombre" : "Clair"}</span>
                </button>
              ))}
            </div>
          </Section>
        </div>
      </ScrollArea>

      {/* Pro Badge */}
      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
        <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          PRO
        </Badge>
        <span className="text-xs text-muted-foreground">
          Styles premium illimités
        </span>
      </div>
    </div>
  );
}

export const defaultCardStyle: CardStyle = {
  backgroundColor: "#0B0B0B",
  accentColor: "#D4AF37",
  textColor: "#FFFFFF",
  secondaryTextColor: "#9CA3AF",
  headingFont: "system",
  bodyFont: "system",
  borderRadius: 24,
  borderWidth: 0,
  borderColor: "#374151",
  shadowPreset: "medium",
  theme: "dark",
};

export default StyleCustomizer;
