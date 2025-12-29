import { 
  PRINT_TEMPLATES, 
  PRINT_COLORS, 
  PrintColor, 
  PrintTemplateType,
  isColorAllowedForTemplate,
} from "@/lib/printTypes";
import { PrintCardTemplate } from "./PrintCardTemplate";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Palette, Layout } from "lucide-react";

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
  const currentTemplate = PRINT_TEMPLATES[selectedTemplate];
  
  // Get only the colors allowed for the current template
  const allowedColors = currentTemplate.allowedColors.map(colorKey => ({
    key: colorKey as PrintColor,
    config: PRINT_COLORS[colorKey as PrintColor],
  }));

  // Handle template change - also update color if current color is not allowed
  const handleTemplateChange = (templateId: PrintTemplateType) => {
    onTemplateChange(templateId);
    
    // If current color is not allowed for new template, switch to default
    if (!isColorAllowedForTemplate(selectedColor, templateId)) {
      const newTemplate = PRINT_TEMPLATES[templateId];
      onColorChange(newTemplate.defaultColor);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template selector */}
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Layout size={16} className="text-muted-foreground" />
          Template IWASP
        </Label>
        <div className="grid grid-cols-1 gap-4">
          {templates.map((templateConfig) => (
            <button
              key={templateConfig.id}
              onClick={() => handleTemplateChange(templateConfig.id)}
              disabled={disabled}
              className={`group relative p-4 rounded-xl border-2 transition-all text-left flex gap-4 items-center ${
                selectedTemplate === templateConfig.id
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/30"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {/* Mini preview */}
              <div className="flex-shrink-0">
                <div className="transform scale-[0.28] origin-top-left" style={{ width: 85, height: 54 }}>
                  <PrintCardTemplate
                    printedName={printedName || "Prénom Nom"}
                    printedTitle={printedTitle || "Titre"}
                    printedCompany={printedCompany || "Entreprise"}
                    logoUrl={logoUrl}
                    color={templateConfig.defaultColor}
                    template={templateConfig.id}
                    className="shadow-lg"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{templateConfig.name}</h4>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {templateConfig.tagline}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{templateConfig.description}</p>
              </div>

              {selectedTemplate === templateConfig.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={12} className="text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color selector - shows only allowed colors for selected template */}
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-muted-foreground" />
          Couleur ({currentTemplate.name})
        </Label>
        <div className="flex flex-wrap gap-3">
          {allowedColors.map(({ key: colorKey, config: colorConfig }) => {
            const isLight = colorKey === "white" || colorKey === "silver";
            return (
              <button
                key={colorKey}
                onClick={() => onColorChange(colorKey)}
                disabled={disabled}
                className={`relative group transition-all ${
                  selectedColor === colorKey
                    ? "scale-110"
                    : "hover:scale-105"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                title={`${colorConfig.name} (CMYK: ${colorConfig.cmyk})`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedColor === colorKey
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                  style={{ 
                    backgroundColor: colorConfig.hex,
                    boxShadow: isLight ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : undefined,
                  }}
                >
                  {selectedColor === colorKey && (
                    <Check size={18} style={{ color: colorConfig.textColor }} />
                  )}
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {colorConfig.name}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Couleurs calibrées CMYK pour impression fidèle
        </p>
      </div>
    </div>
  );
}
