/**
 * Étape 2: Produits et Services
 * Collecte: Produits, services, gamme de prix, cible, photos
 */

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Users, Tag, Sparkles, Camera, X, Loader2, Plus } from "lucide-react";
import { StudioFunnelStep } from "@/components/web-studio/StudioFunnelStep";
import { useWebStudio, WebStudioGuard } from "@/contexts/WebStudioContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/utils/imageCompression";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PHOTOS = 6;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function StepProduitsContent() {
  const { state, updateFormData, nextStep, prevStep, validateCurrentStep } = useWebStudio();
  const { formData, sessionId } = state;
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const canContinue = validateCurrentStep();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check max photos limit
    const currentCount = formData.productPhotos?.length || 0;
    const remainingSlots = MAX_PHOTOS - currentCount;
    
    if (remainingSlots <= 0) {
      toast({
        title: "Limite atteinte",
        description: `Maximum ${MAX_PHOTOS} photos autorisées`,
        variant: "destructive",
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Format non supporté",
          description: `${file.name}: Utilisez JPG, PNG ou WebP`,
          variant: "destructive",
        });
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name}: Max 5 Mo`,
          variant: "destructive",
        });
        continue;
      }

      setUploadingIndex(currentCount + i);

      try {
        // Compress image before upload
        const compressedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8,
          maxSizeMB: 0.8,
        });

        // Generate unique filename
        const fileExt = compressedFile.name.split(".").pop() || "jpg";
        const fileName = `${sessionId}-product-${Date.now()}-${i}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from("website-images")
          .upload(filePath, compressedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("website-images")
          .getPublicUrl(filePath);

        // Add to photos array
        const currentPhotos = formData.productPhotos || [];
        updateFormData({ productPhotos: [...currentPhotos, urlData.publicUrl] });
      } catch (error: any) {
        console.error("Upload error:", error);
        toast({
          title: "Erreur d'upload",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    }

    setUploadingIndex(null);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (filesToUpload.length > 0) {
      toast({
        title: "Photos ajoutées !",
        description: `${filesToUpload.length} photo(s) uploadée(s)`,
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const currentPhotos = formData.productPhotos || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    updateFormData({ productPhotos: newPhotos });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && fileInputRef.current) {
      const dt = new DataTransfer();
      Array.from(files).forEach(f => dt.items.add(f));
      fileInputRef.current.files = dt.files;
      handleFileSelect({ target: { files: dt.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const photos = formData.productPhotos || [];
  const canAddMore = photos.length < MAX_PHOTOS;

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

          {/* Product Photos Upload */}
          <div>
            <Label className="mb-3 flex items-center gap-2">
              <Camera size={14} style={{ color: STUDIO.or }} />
              <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                Photos de vos produits/services
              </span>
              <span className="text-[10px]" style={{ color: STUDIO.gris }}>
                (optionnel)
              </span>
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileSelect}
              multiple
              className="hidden"
              id="product-photos-upload"
            />

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-2">
              {/* Existing photos */}
              <AnimatePresence mode="popLayout">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                    style={{ backgroundColor: `${STUDIO.ivoire}10` }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={12} style={{ color: STUDIO.ivoire }} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Upload placeholder / Loading state */}
              {uploadingIndex !== null && (
                <motion.div
                  className="aspect-square rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${STUDIO.ivoire}05`,
                    border: `2px dashed ${STUDIO.or}40`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 size={24} className="animate-spin" style={{ color: STUDIO.or }} />
                </motion.div>
              )}

              {/* Add more button */}
              {canAddMore && uploadingIndex === null && (
                <motion.label
                  htmlFor="product-photos-upload"
                  className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
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
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={24} style={{ color: STUDIO.gris }} />
                  <span className="text-[10px] mt-1" style={{ color: STUDIO.gris }}>
                    Ajouter
                  </span>
                </motion.label>
              )}
            </div>

            {/* Info text */}
            <p className="text-[10px] mt-2" style={{ color: STUDIO.gris }}>
              {photos.length}/{MAX_PHOTOS} photos • JPG, PNG, WebP • Max 5 Mo/photo
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full" style={{ backgroundColor: `${STUDIO.ivoire}10` }} />

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
