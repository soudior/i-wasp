/**
 * Étape 1: Informations de l'entreprise
 * Collecte: Nom, type d'activité, description, adresse
 */

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Building2, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { StudioFunnelStep } from "@/components/web-studio/StudioFunnelStep";
import { useWebStudio, WebStudioGuard } from "@/contexts/WebStudioContext";

const STUDIO = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

// Templates prédéfinis pour accélérer le remplissage
const TEMPLATES = [
  { id: "restaurant", label: "Restaurant", type: "Restaurant / Café" },
  { id: "boutique", label: "Boutique", type: "Commerce / Boutique en ligne" },
  { id: "services", label: "Services", type: "Prestataire de services" },
  { id: "artisan", label: "Artisan", type: "Artisan / Métiers manuels" },
  { id: "sante", label: "Santé", type: "Professionnel de santé" },
  { id: "immobilier", label: "Immobilier", type: "Agent immobilier" },
];

function StepEntrepriseContent() {
  const { state, updateFormData, nextStep, validateCurrentStep, setSelectedTemplate } = useWebStudio();
  const { formData, selectedTemplate } = state;

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setSelectedTemplate(template.id);
    updateFormData({ businessType: template.type });
  };

  const canContinue = validateCurrentStep();

  return (
    <StudioFunnelStep
      currentStep={0}
      title="Parlez-nous de votre entreprise"
      subtitle="Ces informations nous aident à créer un site parfaitement adapté"
      onContinue={nextStep}
      canContinue={canContinue}
      showBack={false}
    >
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: STUDIO.noirCard,
          border: `1px solid ${STUDIO.ivoire}10`,
        }}
      >
        <div className="space-y-6">
          {/* Quick templates */}
          <div>
            <Label className="mb-3 block">
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Type d'activité
              </span>
              <span
                className="ml-2 text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${STUDIO.or}20`, color: STUDIO.or }}
              >
                Requis
              </span>
            </Label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {TEMPLATES.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    backgroundColor:
                      selectedTemplate === template.id
                        ? `${STUDIO.or}20`
                        : `${STUDIO.ivoire}05`,
                    border: `1px solid ${
                      selectedTemplate === template.id ? STUDIO.or : `${STUDIO.ivoire}10`
                    }`,
                    color: selectedTemplate === template.id ? STUDIO.or : STUDIO.gris,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {template.label}
                </motion.button>
              ))}
            </div>
            <Input
              placeholder="Ou décrivez votre activité..."
              value={formData.businessType}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
              className="h-12 rounded-xl"
              style={{
                backgroundColor: `${STUDIO.noirSoft}80`,
                border: `1px solid ${STUDIO.ivoire}10`,
                color: STUDIO.ivoire,
              }}
            />
          </div>

          {/* Business name */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Building2 size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Nom de l'entreprise
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${STUDIO.or}20`, color: STUDIO.or }}
              >
                Requis
              </span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Ex: Boulangerie Martin"
                value={formData.businessName}
                onChange={(e) => updateFormData({ businessName: e.target.value })}
                className="h-12 rounded-xl pr-10"
                style={{
                  backgroundColor: `${STUDIO.noirSoft}80`,
                  border: `1px solid ${STUDIO.ivoire}10`,
                  color: STUDIO.ivoire,
                }}
              />
              {formData.businessName && (
                <CheckCircle2
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: STUDIO.or }}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <FileText size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Description de votre activité
              </span>
            </Label>
            <Textarea
              placeholder="Décrivez ce que vous faites, vos valeurs, ce qui vous différencie..."
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              className="min-h-[100px] rounded-xl resize-none"
              style={{
                backgroundColor: `${STUDIO.noirSoft}80`,
                border: `1px solid ${STUDIO.ivoire}10`,
                color: STUDIO.ivoire,
              }}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <MapPin size={14} style={{ color: STUDIO.or }} />
                <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                  Ville
                </span>
              </Label>
              <Input
                placeholder="Ex: Casablanca"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                className="h-12 rounded-xl"
                style={{
                  backgroundColor: `${STUDIO.noirSoft}80`,
                  border: `1px solid ${STUDIO.ivoire}10`,
                  color: STUDIO.ivoire,
                }}
              />
            </div>
            <div>
              <Label className="mb-2 block">
                <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                  Adresse
                </span>
              </Label>
              <Input
                placeholder="Optionnel"
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
                className="h-12 rounded-xl"
                style={{
                  backgroundColor: `${STUDIO.noirSoft}80`,
                  border: `1px solid ${STUDIO.ivoire}10`,
                  color: STUDIO.ivoire,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </StudioFunnelStep>
  );
}

export default function StepEntreprise() {
  return (
    <WebStudioGuard step={0}>
      <StepEntrepriseContent />
    </WebStudioGuard>
  );
}
