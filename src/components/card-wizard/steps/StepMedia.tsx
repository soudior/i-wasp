/**
 * StepMedia - Étape 2: Photo & Logo
 * 
 * Upload obligatoire avec aperçu premium
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CardFormData } from "../CardWizard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Camera, 
  Image, 
  Upload, 
  X, 
  Loader2,
  Check,
  AlertCircle
} from "lucide-react";

interface StepMediaProps {
  data: CardFormData;
  onChange: (updates: Partial<CardFormData>) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function StepMedia({ data, onChange }: StepMediaProps) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const hasMedia = Boolean(data.photoUrl || data.logoUrl);

  const handleUpload = async (
    file: File, 
    type: "photo" | "logo",
    setUploading: (v: boolean) => void
  ) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("L'image ne doit pas dépasser 10 Mo");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${type}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error } = await supabase.storage
        .from("card-assets")
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("card-assets")
        .getPublicUrl(filePath);

      onChange({ 
        [type === "photo" ? "photoUrl" : "logoUrl"]: publicUrl 
      });
      
      toast.success(type === "photo" ? "Photo ajoutée" : "Logo ajouté");
    } catch (error) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file, "photo", setUploadingPhoto);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file, "logo", setUploadingLogo);
  };

  return (
    <div className="space-y-6">
      {/* Validation status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 p-4 rounded-2xl ${
          hasMedia 
            ? "bg-accent/10 border border-accent/20" 
            : "bg-muted/50 border border-border/50"
        }`}
      >
        {hasMedia ? (
          <>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Check size={16} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Parfait !</p>
              <p className="text-xs text-muted-foreground">
                Vous pouvez continuer ou ajouter d'autres médias
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertCircle size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Une image est requise</p>
              <p className="text-xs text-muted-foreground">
                Ajoutez une photo ou un logo pour continuer
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* Photo upload */}
      <Card className="border-border/50 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-4 border-b border-border/30">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Camera size={16} className="text-accent" />
                Photo de profil
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Format carré recommandé, 400×400px minimum
              </p>
            </div>

            {data.photoUrl ? (
              <div className="relative aspect-video bg-muted">
                <img 
                  src={data.photoUrl} 
                  alt="Photo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="flex-1 h-10 bg-white/90 text-black rounded-xl font-medium text-sm hover:bg-white transition-colors"
                  >
                    Changer
                  </button>
                  <button
                    onClick={() => onChange({ photoUrl: null })}
                    className="w-10 h-10 bg-red-500/90 text-white rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full p-8 flex flex-col items-center justify-center gap-3 hover:bg-muted/30 transition-colors"
              >
                {uploadingPhoto ? (
                  <Loader2 size={32} className="text-primary animate-spin" />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Upload size={24} className="text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Ajouter une photo</p>
                      <p className="text-xs text-muted-foreground">
                        Cliquez ou glissez-déposez
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Logo upload */}
      <Card className="border-border/50 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleLogoChange}
            className="hidden"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 border-b border-border/30">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Image size={16} className="text-accent" />
                Logo entreprise
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                PNG avec fond transparent pour un meilleur rendu
              </p>
            </div>

            {data.logoUrl ? (
              <div className="relative p-6 bg-muted/30 flex items-center justify-center min-h-[120px]">
                <img 
                  src={data.logoUrl} 
                  alt="Logo" 
                  className="max-w-[200px] max-h-[80px] object-contain"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="h-8 px-3 bg-white/90 text-black rounded-lg text-xs font-medium hover:bg-white transition-colors"
                  >
                    Changer
                  </button>
                  <button
                    onClick={() => onChange({ logoUrl: null })}
                    className="w-8 h-8 bg-red-500/90 text-white rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="w-full p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
              >
                {uploadingLogo ? (
                  <Loader2 size={24} className="text-primary animate-spin" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Image size={20} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Ajouter un logo</p>
                  </>
                )}
              </button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StepMedia;