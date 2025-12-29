import { PRINT_TEMPLATES, PRINT_COLORS, PrintColor, PrintTemplateType } from "@/lib/printTypes";
import { PrintCardTemplate } from "./PrintCardTemplate";
import { Label } from "@/components/ui/label";
import { Check, Palette } from "lucide-react";

interface PrintTemplateSelectorProps {
  selectedTemplate: PrintTemplateType;
  selectedColor: PrintColor;
  printedName: string;
  printedTitle?: string;
  printedCompany?: string;
  logoUrl?: string;
  onTemplateChange: (template: PrintTemplateType) => void;
  onColorChange: (color: PrintColor) => void;
  disabled?: boolean;
}

export function PrintTemplateSelector({
  selectedTemplate,
  selectedColor,
  printedName,
  printedTitle,
  printedCompany,
  logoUrl,
  onTemplateChange,
  onColorChange,
  disabled = false,
}: PrintTemplateSelectorProps) {
  const templates = Object.values(PRINT_TEMPLATES);
  const colors = Object.entries(PRINT_COLORS) as [PrintColor, typeof PRINT_COLORS[PrintColor]][];

  return (
    <div className="space-y-6">
      {/* Color selector */}
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-muted-foreground" />
          Couleur de la carte
        </Label>
        <div className="flex flex-wrap gap-3">
          {colors.map(([colorKey, colorConfig]) => {
            const isLight = colorKey === "white" || colorKey === "silver" || colorKey === "gold";
            return (
              <button
                key={colorKey}
                onClick={() => onColorChange(colorKey)}
                disabled={disabled}
                className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center ${
                  selectedColor === colorKey
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                    : "hover:scale-105"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: colorConfig.hex }}
                title={`${colorConfig.name} (CMYK: ${colorConfig.cmyk})`}
              >
                {selectedColor === colorKey && (
                  <Check size={18} style={{ color: isLight ? "#0a0a0a" : "#fafafa" }} />
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Couleurs calibrées CMYK pour une impression fidèle
        </p>
      </div>

      {/* Template selector */}
      <div>
        <Label className="mb-3 block">Template d'impression</Label>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((templateConfig) => (
            <button
              key={templateConfig.id}
              onClick={() => onTemplateChange(templateConfig.id as PrintTemplateType)}
              disabled={disabled}
              className={`group relative p-3 rounded-xl border-2 transition-all text-left ${
                selectedTemplate === templateConfig.id
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/30"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {/* Mini preview */}
              <div className="mb-3 flex justify-center">
                <div className="transform scale-[0.35] origin-center">
                  <PrintCardTemplate
                    printedName={printedName || "Prénom Nom"}
                    printedTitle={printedTitle || "Titre"}
                    printedCompany={printedCompany || "Entreprise"}
                    logoUrl={logoUrl}
                    color={selectedColor}
                    template={templateConfig.id as PrintTemplateType}
                    className="shadow-lg"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground text-sm">{templateConfig.name}</h4>
                <p className="text-xs text-muted-foreground">{templateConfig.description}</p>
              </div>

              {selectedTemplate === templateConfig.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={12} className="text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
