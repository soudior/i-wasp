/**
 * Étape 3: Style et Design
 * Collecte: Style préféré, couleurs, logo, réseaux sociaux
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Palette, Image, Link, Instagram, Globe, Upload } from "lucide-react";
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

const STYLES = [
  { id: "modern", label: "Moderne", desc: "Épuré et contemporain" },
  { id: "elegant", label: "Élégant", desc: "Raffiné et luxueux" },
  { id: "playful", label: "Dynamique", desc: "Coloré et énergique" },
  { id: "minimal", label: "Minimaliste", desc: "Simple et efficace" },
  { id: "classic", label: "Classique", desc: "Intemporel et sobre" },
  { id: "bold", label: "Audacieux", desc: "Fort et impactant" },
];

const COLOR_PALETTES = [
  { id: "noir-or", label: "Noir & Or", colors: ["#050505", "#D4A853"] },
  { id: "bleu-blanc", label: "Bleu & Blanc", colors: ["#1E3A5F", "#FFFFFF"] },
  { id: "vert-beige", label: "Vert & Beige", colors: ["#2D5A3D", "#F5F0E8"] },
  { id: "rose-gris", label: "Rose & Gris", colors: ["#D4A5A5", "#4A4A4A"] },
  { id: "orange-noir", label: "Orange & Noir", colors: ["#FF6B35", "#1A1A1A"] },
  { id: "custom", label: "Personnalisé", colors: ["#888888", "#CCCCCC"] },
];

function StepDesignContent() {
  const { state, updateFormData, nextStep, prevStep } = useWebStudio();
  const { formData } = state;

  return (
    <StudioFunnelStep
      currentStep={2}
      title="Quel style vous ressemble ?"
      subtitle="Optionnel - Laissez notre IA proposer si vous hésitez"
      onBack={prevStep}
      onContinue={nextStep}
      canContinue={true}
    >
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: STUDIO.noirCard,
          border: `1px solid ${STUDIO.ivoire}10`,
        }}
      >
        <div className="space-y-8">
          {/* Style selection */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Palette size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Style souhaité
              </span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {STYLES.map((style) => (
                <motion.button
                  key={style.id}
                  onClick={() => updateFormData({ style: style.id })}
                  className="px-3 py-4 rounded-xl text-left transition-all"
                  style={{
                    backgroundColor:
                      formData.style === style.id
                        ? `${STUDIO.or}15`
                        : `${STUDIO.ivoire}05`,
                    border: `1px solid ${
                      formData.style === style.id ? STUDIO.or : `${STUDIO.ivoire}10`
                    }`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span
                    className="block text-sm font-medium mb-1"
                    style={{
                      color: formData.style === style.id ? STUDIO.or : STUDIO.ivoire,
                    }}
                  >
                    {style.label}
                  </span>
                  <span className="text-[10px]" style={{ color: STUDIO.gris }}>
                    {style.desc}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color palette */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Image size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Palette de couleurs
              </span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PALETTES.map((palette) => (
                <motion.button
                  key={palette.id}
                  onClick={() => updateFormData({ colors: palette.id })}
                  className="px-3 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor:
                      formData.colors === palette.id
                        ? `${STUDIO.or}15`
                        : `${STUDIO.ivoire}05`,
                    border: `1px solid ${
                      formData.colors === palette.id ? STUDIO.or : `${STUDIO.ivoire}10`
                    }`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-center gap-1 mb-2">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[10px]"
                    style={{
                      color: formData.colors === palette.id ? STUDIO.or : STUDIO.gris,
                    }}
                  >
                    {palette.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ backgroundColor: `${STUDIO.ivoire}10` }}
          />

          {/* Optional assets */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Link size={14} style={{ color: STUDIO.gris }} />
              <span className="text-xs uppercase tracking-wider" style={{ color: STUDIO.gris }}>
                Ressources existantes (optionnel)
              </span>
            </Label>

            {/* Existing website */}
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <Globe size={14} style={{ color: STUDIO.gris }} />
                <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                  Site web actuel
                </span>
              </Label>
              <Input
                placeholder="https://votre-site-actuel.com"
                value={formData.websiteUrl}
                onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
                className="h-11 rounded-xl"
                style={{
                  backgroundColor: `${STUDIO.noirSoft}80`,
                  border: `1px solid ${STUDIO.ivoire}10`,
                  color: STUDIO.ivoire,
                }}
              />
            </div>

            {/* Social links */}
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <Instagram size={14} style={{ color: STUDIO.gris }} />
                <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                  Réseaux sociaux
                </span>
              </Label>
              <Input
                placeholder="@votre_compte ou liens"
                value={formData.socialLinks}
                onChange={(e) => updateFormData({ socialLinks: e.target.value })}
                className="h-11 rounded-xl"
                style={{
                  backgroundColor: `${STUDIO.noirSoft}80`,
                  border: `1px solid ${STUDIO.ivoire}10`,
                  color: STUDIO.ivoire,
                }}
              />
            </div>

            {/* Logo URL */}
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <Upload size={14} style={{ color: STUDIO.gris }} />
                <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                  URL de votre logo
                </span>
              </Label>
              <Input
                placeholder="https://... (lien vers votre logo)"
                value={formData.logoUrl}
                onChange={(e) => updateFormData({ logoUrl: e.target.value })}
                className="h-11 rounded-xl"
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

export default function StepDesign() {
  return (
    <WebStudioGuard step={2}>
      <StepDesignContent />
    </WebStudioGuard>
  );
}
