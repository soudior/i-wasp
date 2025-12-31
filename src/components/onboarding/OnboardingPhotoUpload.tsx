/**
 * OnboardingPhotoUpload - Simplified photo upload for onboarding flow
 * Shows photo in a friendly, encouraging way
 */

import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Upload, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OnboardingPhotoUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  initials?: string;
  className?: string;
}

export function OnboardingPhotoUpload({ 
  value, 
  onChange, 
  initials = "?",
  className 
}: OnboardingPhotoUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image doit faire moins de 5 Mo");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `photo-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("card-assets")
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Photo ajoutée !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du téléchargement");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative group"
      >
        <div className={cn(
          "w-28 h-28 rounded-full border-4 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden",
          value 
            ? "border-primary/30 bg-secondary" 
            : "border-border hover:border-primary/50 bg-secondary/50"
        )}>
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : value ? (
            <img 
              src={value} 
              alt="Photo de profil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <User className="h-10 w-10 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Photo</span>
            </div>
          )}
        </div>

        {/* Overlay on hover */}
        {value && !uploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Upload indicator */}
        {!value && !uploading && (
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Upload size={14} className="text-primary-foreground" />
          </div>
        )}
      </button>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        {value ? "Cliquez pour changer" : "Ajoutez votre photo (optionnel)"}
      </p>
    </div>
  );
}
