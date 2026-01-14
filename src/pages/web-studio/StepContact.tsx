/**
 * Étape 4: Informations de contact
 * Collecte: Nom, email, téléphone, méthode de contact préférée
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
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

const CONTACT_METHODS = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, desc: "Réponse rapide" },
  { id: "email", label: "Email", icon: Mail, desc: "Communication formelle" },
  { id: "phone", label: "Téléphone", icon: Phone, desc: "Appel direct" },
] as const;

function StepContactContent() {
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useWebStudio();
  const { formData } = state;

  const canContinue = validateCurrentStep();

  return (
    <StudioFunnelStep
      currentStep={3}
      title="Comment vous contacter ?"
      subtitle="Pour recevoir votre proposition et échanger sur le projet"
      onBack={prevStep}
      onContinue={nextStep}
      canContinue={canContinue}
      continueLabel="Voir le récapitulatif"
    >
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: STUDIO.noirCard,
          border: `1px solid ${STUDIO.ivoire}10`,
        }}
      >
        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <User size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Votre nom
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
                placeholder="Prénom et nom"
                value={formData.contactName}
                onChange={(e) => updateFormData({ contactName: e.target.value })}
                className="h-12 rounded-xl pr-10"
                style={{
                  backgroundColor: `${STUDIO.noirSoft}80`,
                  border: `1px solid ${STUDIO.ivoire}10`,
                  color: STUDIO.ivoire,
                }}
              />
              {formData.contactName && (
                <CheckCircle2
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: STUDIO.or }}
                />
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Mail size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Email
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
                type="email"
                placeholder="votre@email.com"
                value={formData.contactEmail}
                onChange={(e) => updateFormData({ contactEmail: e.target.value })}
                className="h-12 rounded-xl pr-10"
                style={{
                  backgroundColor: `${STUDIO.noirSoft}80`,
                  border: `1px solid ${STUDIO.ivoire}10`,
                  color: STUDIO.ivoire,
                }}
              />
              {formData.contactEmail && formData.contactEmail.includes("@") && (
                <CheckCircle2
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: STUDIO.or }}
                />
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <Phone size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Téléphone / WhatsApp
              </span>
            </Label>
            <Input
              type="tel"
              placeholder="+212 6XX XXX XXX"
              value={formData.contactPhone}
              onChange={(e) => updateFormData({ contactPhone: e.target.value })}
              className="h-12 rounded-xl"
              style={{
                backgroundColor: `${STUDIO.noirSoft}80`,
                border: `1px solid ${STUDIO.ivoire}10`,
                color: STUDIO.ivoire,
              }}
            />
          </div>

          {/* Preferred contact method */}
          <div>
            <Label className="mb-3 block">
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Comment préférez-vous être contacté ?
              </span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {CONTACT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = formData.preferredContact === method.id;
                return (
                  <motion.button
                    key={method.id}
                    onClick={() => updateFormData({ preferredContact: method.id })}
                    className="px-3 py-4 rounded-xl text-center transition-all"
                    style={{
                      backgroundColor: isSelected ? `${STUDIO.or}15` : `${STUDIO.ivoire}05`,
                      border: `1px solid ${isSelected ? STUDIO.or : `${STUDIO.ivoire}10`}`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      size={20}
                      className="mx-auto mb-2"
                      style={{ color: isSelected ? STUDIO.or : STUDIO.gris }}
                    />
                    <span
                      className="block text-xs font-medium mb-1"
                      style={{ color: isSelected ? STUDIO.or : STUDIO.ivoire }}
                    >
                      {method.label}
                    </span>
                    <span className="text-[10px]" style={{ color: STUDIO.gris }}>
                      {method.desc}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Trust message */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs" style={{ color: STUDIO.gris }}>
          🔒 Vos informations sont confidentielles et ne seront jamais partagées
        </p>
      </motion.div>
    </StudioFunnelStep>
  );
}

export default function StepContact() {
  return (
    <WebStudioGuard step={3}>
      <StepContactContent />
    </WebStudioGuard>
  );
}
