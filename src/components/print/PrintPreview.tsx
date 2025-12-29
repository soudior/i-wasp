import { useState } from "react";
import { PrintCardTemplate } from "./PrintCardTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  CARD_DIMENSIONS, 
  CARD_PREVIEW_PX,
  PrintColor, 
  PrintTemplateType 
} from "@/lib/printTypes";
import { Eye, Ruler, ZoomIn, ZoomOut, Check, AlertTriangle } from "lucide-react";

interface PrintPreviewProps {
  printedName: string;
  printedTitle?: string;
  printedCompany?: string;
  logoUrl?: string;
  color: PrintColor;
  template: PrintTemplateType;
  onValidate?: () => void;
  isValidated?: boolean;
  isLocked?: boolean;
}

export function PrintPreview({
  printedName,
  printedTitle,
  printedCompany,
  logoUrl,
  color,
  template,
  onValidate,
  isValidated = false,
  isLocked = false,
}: PrintPreviewProps) {
  const [showGuides, setShowGuides] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2));
  const zoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.5));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Eye size={18} className="text-muted-foreground" />
            Aperçu à l'échelle 1:1
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {CARD_DIMENSIONS.WIDTH_MM} × {CARD_DIMENSIONS.HEIGHT_MM} mm — Ce que vous voyez sera imprimé
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Show guides toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="show-guides"
              checked={showGuides}
              onCheckedChange={setShowGuides}
              disabled={isLocked}
            />
            <Label htmlFor="show-guides" className="text-xs text-muted-foreground flex items-center gap-1">
              <Ruler size={12} />
              Zones
            </Label>
          </div>
          
          {/* Zoom controls */}
          <div className="flex items-center gap-1 border border-border/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut size={14} />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={zoomIn}
              disabled={zoomLevel >= 2}
            >
              <ZoomIn size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview container */}
      <div className="relative bg-surface-2 rounded-2xl p-8 overflow-hidden">
        {/* Background grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Card preview */}
        <div 
          className="relative mx-auto transition-transform duration-200"
          style={{ 
            transform: `scale(${zoomLevel})`,
            width: CARD_PREVIEW_PX.WIDTH,
            height: CARD_PREVIEW_PX.HEIGHT,
          }}
        >
          {/* Shadow under card */}
          <div 
            className="absolute -inset-4 bg-black/30 blur-xl rounded-3xl"
            style={{ transform: "translateY(8px)" }}
          />
          
          <PrintCardTemplate
            printedName={printedName}
            printedTitle={printedTitle}
            printedCompany={printedCompany}
            logoUrl={logoUrl}
            color={color}
            template={template}
            showGuides={showGuides}
            className="shadow-2xl"
          />
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Check size={48} className="mx-auto text-green-500 mb-3" />
              <p className="font-semibold text-foreground">Design validé et verrouillé</p>
              <p className="text-sm text-muted-foreground mt-1">
                Aucune modification possible
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Guides legend */}
      {showGuides && !isLocked && (
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t border-dashed border-blue-400" />
            <span>Zone de sécurité (5mm)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t border-dashed border-red-400" />
            <span>Zone NFC (ne pas imprimer)</span>
          </div>
        </div>
      )}

      {/* Validation section */}
      {!isLocked && (
        <div className="bg-surface-2 border border-border/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Vérifiez votre design avant validation
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Après validation, le design sera verrouillé et envoyé à l'impression. 
                Aucune modification ne sera possible.
              </p>
            </div>
          </div>
          
          {onValidate && (
            <Button
              onClick={onValidate}
              disabled={!printedName.trim() || isValidated}
              className="w-full mt-4"
              size="lg"
            >
              {isValidated ? (
                <>
                  <Check size={18} className="mr-2" />
                  Design validé
                </>
              ) : (
                "Valider le design final"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
