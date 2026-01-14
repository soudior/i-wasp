/**
 * Étape 2: Produits et Services
 * Collecte: Produits, services, gamme de prix, cible
 */

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Package, Users, Tag, Sparkles } from "lucide-react";
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

const PRICE_RANGES = [
  { id: "budget", label: "Économique", emoji: "💰" },
  { id: "mid", label: "Milieu de gamme", emoji: "⭐" },
  { id: "premium", label: "Premium", emoji: "💎" },
  { id: "luxury", label: "Luxe", emoji: "👑" },
];

const AUDIENCES = [
  { id: "b2c", label: "Particuliers (B2C)" },
  { id: "b2b", label: "Entreprises (B2B)" },
  { id: "both", label: "Les deux" },
];

function StepProduitsContent() {
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useWebStudio();
  const { formData } = state;

  const canContinue = validateCurrentStep();

  return (
    <StudioFunnelStep
      currentStep={1}
      title="Que proposez-vous ?"
      subtitle="Décrivez vos produits et services pour un site pertinent"
      onBack={prevStep}
      onContinue={nextStep}
      canContinue={canContinue}
    >
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: STUDIO.noirCard,
          border: `1px solid ${STUDIO.ivoire}10`,
        }}
      >
        <div className="space-y-6">
          {/* Services */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Sparkles size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Vos services
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${STUDIO.or}20`, color: STUDIO.or }}
              >
                Requis (ou produits)
              </span>
            </Label>
            <Textarea
              placeholder="Ex: Coiffure, coloration, extensions, soins capillaires..."
              value={formData.services}
              onChange={(e) => updateFormData({ services: e.target.value })}
              className="min-h-[100px] rounded-xl resize-none"
              style={{
                backgroundColor: `${STUDIO.noirSoft}80`,
                border: `1px solid ${STUDIO.ivoire}10`,
                color: STUDIO.ivoire,
              }}
            />
          </div>

          {/* Products */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Package size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Vos produits
              </span>
            </Label>
            <Textarea
              placeholder="Ex: Shampoings bio, huiles essentielles, accessoires..."
              value={formData.products}
              onChange={(e) => updateFormData({ products: e.target.value })}
              className="min-h-[80px] rounded-xl resize-none"
              style={{
                backgroundColor: `${STUDIO.noirSoft}80`,
                border: `1px solid ${STUDIO.ivoire}10`,
                color: STUDIO.ivoire,
              }}
            />
          </div>

          {/* Price range */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Tag size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Positionnement tarifaire
              </span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_RANGES.map((range) => (
                <motion.button
                  key={range.id}
                  onClick={() => updateFormData({ priceRange: range.id })}
                  className="px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor:
                      formData.priceRange === range.id
                        ? `${STUDIO.or}20`
                        : `${STUDIO.ivoire}05`,
                    border: `1px solid ${
                      formData.priceRange === range.id ? STUDIO.or : `${STUDIO.ivoire}10`
                    }`,
                    color: formData.priceRange === range.id ? STUDIO.or : STUDIO.gris,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{range.emoji}</span>
                  <span>{range.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Target audience */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Users size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Votre cible
              </span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {AUDIENCES.map((audience) => (
                <motion.button
                  key={audience.id}
                  onClick={() => updateFormData({ targetAudience: audience.id })}
                  className="px-3 py-3 rounded-xl text-xs transition-all"
                  style={{
                    backgroundColor:
                      formData.targetAudience === audience.id
                        ? `${STUDIO.or}20`
                        : `${STUDIO.ivoire}05`,
                    border: `1px solid ${
                      formData.targetAudience === audience.id ? STUDIO.or : `${STUDIO.ivoire}10`
                    }`,
                    color: formData.targetAudience === audience.id ? STUDIO.or : STUDIO.gris,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {audience.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudioFunnelStep>
  );
}

export default function StepProduits() {
  return (
    <WebStudioGuard step={1}>
      <StepProduitsContent />
    </WebStudioGuard>
  );
}
