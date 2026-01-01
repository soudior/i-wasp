/**
 * StepPreview - Étape 4: Aperçu final + Liens
 * 
 * Résumé de validation avant sauvegarde
 */

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFormData } from "../CardWizard";
import { 
  Check, 
  X, 
  Globe, 
  Linkedin, 
  Instagram,
  MessageCircle
} from "lucide-react";

interface StepPreviewProps {
  data: CardFormData;
  onChange: (updates: Partial<CardFormData>) => void;
  validation: Record<string, boolean>;
}

export function StepPreview({ data, onChange, validation }: StepPreviewProps) {
  const checks = [
    { 
      label: "Informations complètes", 
      ok: Boolean(data.firstName && data.lastName),
      detail: data.firstName && data.lastName 
        ? `${data.firstName} ${data.lastName}` 
        : "Prénom et nom requis"
    },
    { 
      label: "Photo ou logo", 
      ok: Boolean(data.photoUrl || data.logoUrl),
      detail: data.photoUrl ? "Photo ajoutée" : data.logoUrl ? "Logo ajouté" : "Aucun visuel"
    },
    { 
      label: "Design validé", 
      ok: Boolean(data.template),
      detail: data.template ? `Template: ${data.template}` : "Aucun template"
    },
  ];

  const allValid = checks.every(c => c.ok);

  return (
    <div className="space-y-6">
      {/* Validation Checklist */}
      <Card className="border-border/50 shadow-xl">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Vérification finale</h3>
          
          <div className="space-y-3">
            {checks.map((check, index) => (
              <motion.div
                key={check.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  check.ok 
                    ? "bg-accent/10 border border-accent/20" 
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  check.ok ? "bg-accent" : "bg-destructive"
                }`}>
                  {check.ok ? (
                    <Check size={14} className="text-accent-foreground" />
                  ) : (
                    <X size={14} className="text-destructive-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{check.label}</p>
                  <p className="text-xs text-muted-foreground">{check.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {allValid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/10 text-center"
            >
              <p className="text-sm font-medium text-accent">
                ✓ Votre carte est prête à être sauvegardée
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Optional: Social Links */}
      <Card className="border-border/50 shadow-xl">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Liens (optionnel)</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Ajoutez vos réseaux pour une carte complète
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Globe size={14} className="text-muted-foreground" />
                Site web
              </Label>
              <Input
                placeholder="www.example.com"
                value={data.website}
                onChange={(e) => onChange({ website: e.target.value })}
                className="h-11 bg-muted/50 border-border/50 rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center p-6"
      >
        <p className="text-sm text-muted-foreground italic">
          "Vous ne créez pas une carte. Vous créez une impression."
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          — IWASP
        </p>
      </motion.div>
    </div>
  );
}

export default StepPreview;