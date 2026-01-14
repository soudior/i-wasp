/**
 * Étape 3: Style et Design
 * Collecte: Style préféré, couleurs, logo, réseaux sociaux
 */

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Image, Link, Instagram, Globe, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { StudioFunnelStep } from "@/components/web-studio/StudioFunnelStep";
import { useWebStudio, WebStudioGuard } from "@/contexts/WebStudioContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

function StepDesignContent() {
  const { state, updateFormData, nextStep, prevStep } = useWebStudio();
  const { formData, sessionId } = state;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Utilisez JPG, PNG, WebP ou SVG",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximum est de 5 Mo",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${sessionId}-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      setUploadProgress(30);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("website-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      setUploadProgress(70);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("website-images")
        .getPublicUrl(filePath);

      setUploadProgress(100);

      // Update form data with the URL
      updateFormData({ logoUrl: urlData.publicUrl });

      toast({
        title: "Logo uploadé !",
        description: "Votre logo a été ajouté avec succès",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur d'upload",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = () => {
    updateFormData({ logoUrl: "" });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      handleFileSelect({ target: { files: dt.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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

          {/* Logo Upload Section */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Upload size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Votre logo
              </span>
            </Label>

            <AnimatePresence mode="wait">
              {formData.logoUrl ? (
                /* Logo Preview */
                <motion.div
                  key="preview"
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: `${STUDIO.ivoire}05`,
                    border: `1px solid ${STUDIO.or}30`,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: STUDIO.ivoire }}
                    >
                      <img
                        src={formData.logoUrl}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={14} style={{ color: STUDIO.or }} />
                        <span className="text-sm font-medium" style={{ color: STUDIO.ivoire }}>
                          Logo ajouté
                        </span>
                      </div>
                      <p
                        className="text-xs truncate"
                        style={{ color: STUDIO.gris }}
                      >
                        {formData.logoUrl.split("/").pop()}
                      </p>
                    </div>
                    <motion.button
                      onClick={handleRemoveLogo}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: `${STUDIO.ivoire}10` }}
                      whileHover={{ backgroundColor: `${STUDIO.ivoire}20` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={18} style={{ color: STUDIO.gris }} />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* Upload Zone */
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_TYPES.join(",")}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="logo-upload"
                  />
                  
                  <motion.label
                    htmlFor="logo-upload"
                    className="relative flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all"
                    style={{
                      backgroundColor: `${STUDIO.ivoire}05`,
                      border: `2px dashed ${STUDIO.ivoire}20`,
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    whileHover={{
                      borderColor: STUDIO.or,
                      backgroundColor: `${STUDIO.or}08`,
                    }}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2
                          size={32}
                          className="animate-spin"
                          style={{ color: STUDIO.or }}
                        />
                        <span className="text-sm" style={{ color: STUDIO.gris }}>
                          Upload en cours... {uploadProgress}%
                        </span>
                        <div
                          className="w-32 h-1 rounded-full overflow-hidden"
                          style={{ backgroundColor: `${STUDIO.ivoire}10` }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: STUDIO.or }}
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                          style={{
                            backgroundColor: `${STUDIO.or}15`,
                            border: `1px solid ${STUDIO.or}30`,
                          }}
                        >
                          <Upload size={20} style={{ color: STUDIO.or }} />
                        </div>
                        <span className="text-sm font-medium mb-1" style={{ color: STUDIO.ivoire }}>
                          Glissez votre logo ici
                        </span>
                        <span className="text-xs" style={{ color: STUDIO.gris }}>
                          ou cliquez pour parcourir
                        </span>
                        <span className="text-[10px] mt-2" style={{ color: STUDIO.gris }}>
                          JPG, PNG, WebP, SVG • Max 5 Mo
                        </span>
                      </>
                    )}
                  </motion.label>

                  {/* Alternative: URL input */}
                  <div className="mt-3">
                    {showUrlInput ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://... (lien vers votre logo)"
                          value={formData.logoUrl}
                          onChange={(e) => updateFormData({ logoUrl: e.target.value })}
                          className="h-10 rounded-lg text-sm flex-1"
                          style={{
                            backgroundColor: `${STUDIO.noirSoft}80`,
                            border: `1px solid ${STUDIO.ivoire}10`,
                            color: STUDIO.ivoire,
                          }}
                        />
                        <motion.button
                          onClick={() => setShowUrlInput(false)}
                          className="px-3 h-10 rounded-lg"
                          style={{ backgroundColor: `${STUDIO.ivoire}10` }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X size={16} style={{ color: STUDIO.gris }} />
                        </motion.button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowUrlInput(true)}
                        className="text-xs underline"
                        style={{ color: STUDIO.gris }}
                      >
                        Ou entrer une URL
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ backgroundColor: `${STUDIO.ivoire}10` }}
          />

          {/* Other optional assets */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Link size={14} style={{ color: STUDIO.gris }} />
              <span className="text-xs uppercase tracking-wider" style={{ color: STUDIO.gris }}>
                Autres ressources (optionnel)
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
